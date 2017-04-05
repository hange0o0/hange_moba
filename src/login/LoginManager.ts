class LoginManager{

    private static _instance:LoginManager;

    public static getInstance():LoginManager {
        if (!this._instance)
            this._instance = new LoginManager();
        return this._instance;
    }

    public gameid;
    public openKey;
    public myServer; //我的服务器列表   {key:name}
    public lastLand;
    public serverList = {}; //所有服务器的集合

    public lastUser;  //上次的登录的用户
    public quickPassword; //上次的登录的密码//（只有在游客模式下有）
    public lastServer; //最近登陆的服务器

    public constructor() {
        var oo =  SharedObjectManager.instance.getValue('user') || {};
        this.lastUser = oo.user;
        this.quickPassword = oo.password;
        this.lastServer = oo.lastServer;
        this.myServer = oo.myServer;
    }

    //测试名字是否合法
    public testName(mail){
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(mail)) return true;
        else {
            Alert('用户名请输入您的电子邮件');
            return false;
        }
    }
    //测试密码是否合法
    public testPassword(password){
        var reg = /^[\w]{6,12}$/;
        if(password.match(reg)){
            return true;
        }
        else {
            Alert('密码的格式为6-12位，只能是字母、数字和下划线');
            return false;
        }
    }

    //取我不在的服务器列表(分有号，无号，按time排序)
    public getAllServer(){
        var oo = {my:[],other:[]};
        for(var s in this.serverList)
        {
            if(this.serverList[s].timeNum > TM.now())
                continue;
            if(this.myServer[s])//有号
                oo.my.push(this.serverList[s]);
            else
                oo.other.push(this.serverList[s]);
        }
        ArrayUtil.sortByField(oo.my,['serverid'],[1]);
        ArrayUtil.sortByField(oo.other,['serverid'],[1]);
        return oo;
    }

    private writeDB(){
        var oo:any = {user:this.lastUser,password:this.quickPassword}
        oo.lastServer = this.lastServer;
        oo.myServer = this.myServer;
        SharedObjectManager.instance.setValue('user',oo)
    }

    //----------------------------------以下是没有接入平台时的，要自己管理用户----------------------------------
    public login(name,password,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        if(password)
            oo.password = md5.incode(password);
        else
            oo.quick_password = this.quickPassword;
        Net.send(GameEvent.sys.login,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                if(password == '@password')
                {
                    self.register(name,password);
                    return;
                }
                if(password)
                {
                    Alert('用户或密码错误');
                }
                else
                {
                    Alert('用户登录状态已失效');
                    LoginUI.getInstance().onChangeUser();
                    self.quickPassword = null;
                    self.writeDB();
                }
                return;
            }

            if(msg.fail == 2)
            {
                Alert('登陆失败');
                return;
            }

            self.gameid = msg.userdata.id;
            self.openKey = msg.userdata.cdkey;
            self.lastLand = msg.userdata.last_land;
            self.fillServer(msg.userdata.server);



            self.lastUser = name;
            self.quickPassword = msg.quick_password;
            self.writeDB();

            self.onUserLogin();
            if(fun)
                fun();
        },true,2);
    }

    public register(name,password,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        oo.password = md5.incode(password);
        Net.send(GameEvent.sys.register,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('注册失败');
                return;
            }

            if(msg.fail == 2)
            {
                Alert('该用户名已被使用');
                return;
            }

            self.gameid = msg.data.id;
            self.openKey = msg.data.cdkey;
            self.lastLand = msg.data.last_land;
            self.myServer = {};

            self.lastUser = name;
            self.quickPassword = msg.quick_password
            self.writeDB();

            self.onUserLogin();
            if(fun)
                fun();
        },true,2);
    }

    ////创建一个游客账号
    //public quickRegister(fun?){
    //    var self = this;
    //    var oo:any = {};
    //    Net.send(GameEvent.sys.quick_register,oo,function(data){
    //        var msg = data.msg;
    //        if(msg.fail == 1)
    //        {
    //            Alert('注册失败');
    //            return;
    //        }
    //
    //        if(msg.fail == 2)
    //        {
    //            Alert('该用户名已被使用');
    //            return;
    //        }
    //
    //        self.gameid = msg.data.id;
    //        self.openKey = msg.data.cdkey;
    //        self.lastLand = msg.data.last_land;
    //        self.myServer = {};
    //
    //        self.lastUser = msg.data.name;
    //        self.lastPassword = msg.data.password;
    //        self.writeDB();
    //
    //        self.onUserLogin();
    //        if(fun)
    //            fun();
    //    },true,2);
    //}
    //
    ////把游客帐号变成注册账号
    //public reRegister(name,password,fun?){
    //    var self = this;
    //    var oo:any = {};
    //    oo.name = name;
    //    oo.password = password;
    //
    //    oo.last_name = self.lastUser;
    //    oo.last_password = self.lastPassword;
    //    Net.send(GameEvent.sys.re_register,oo,function(data){
    //        var msg = data.msg;
    //        if(msg.fail == 1)
    //        {
    //            Alert('注册失败');
    //            return;
    //        }
    //
    //        if(msg.fail == 2)
    //        {
    //            Alert('该用户名已被使用');
    //            return;
    //        }
    //
    //
    //        self.gameid = msg.userdata.id;
    //        self.openKey = msg.userdata.cdkey;
    //        self.lastLand = msg.userdata.last_land;
    //        self.fillServer(msg.userdata.server);
    //
    //
    //
    //        self.lastUser = name;
    //        self.lastPassword = null
    //        self.writeDB();
    //
    //
    //        self.onUserLogin();
    //        if(fun)
    //            fun();
    //    },true,2);
    //}

    private fillServer(server){
        this.myServer = {};
        var serverArr = server.split(',');
        for(var i=0;i<serverArr.length;i++)
        {
            var arr = serverArr[i].split('|');
            this.myServer[arr[0]] = arr[1];
            if(!this.lastServer && i == serverArr.length-1)
            {
                this.lastServer = arr[0];
            }
        }
    }
    private onUserLogin(){
        PopUpManager.movieChange(function(){
            RegisterUI.getInstance().hide();
            LoginUI.getInstance().hide();
            LoginServerUI.getInstance().show();
        })

    }

    //----------------------------------以下是整个平台的用户管理------------------
    //记录玩家注册过的服务器
    public addUserServer(serverid,nick,fun?){
        var self = this;
        var oo:any = {};
        oo.id = self.gameid;
        oo.cdkey = self.openKey;
        oo.serverid = serverid;
        oo.nick = nick;
        Net.send(GameEvent.sys.add_user_server,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
               // Alert('登陆失效');
                return;
            }
            if(fun)
                fun();
        },false,2);
    }

    public getServerList(fun?){
        var self = this;
        Net.send(GameEvent.sys.get_server_list,{},function(data){
            var msg = data.msg;
            var list = {};
            for(var s in msg.list)
            {
                var oo = msg.list[s];
                var now = DateUtil.StringToDate(oo.time);
                oo.timeNum = Math.floor(now.getTime()/1000);
                oo.serverid = s;
                list[s] = oo;
            }
            self.serverList = list;
            if(fun)
                fun();
        },true,2);
    }

    //----------------------------------以下是进入时已有了用户后的处理（已有gameid 和 landid)----------------------------------
    public loginServer(serverid,fun?){
        var self = this;
        var oo:any = {};
        //oo.serverid = serverid;
        oo.id = this.gameid;
        oo.cdkey = this.openKey;
        Net.getInstance().serverID = serverid;
        Net.getInstance().serverHost = this.serverList[serverid].host;
        Net.send(GameEvent.sys.login_server,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('用户状态已过期!');
                return;
            }

            if(msg.fail == 2)
            {
                //没这个玩家，要新增
               //弹出填写玩家昵称的UI
                self.myServer[serverid] = null;
                RegisterServerUI.getInstance().show(serverid);
                //if(Config.isDebug)
                //{
                //    self.registerServer(oo.id,1,serverid,function(){
                //        self.loginServer(serverid,fun);
                //    });
                //}
                return;
            }

            UM.fill(msg.data);

            self.lastServer = serverid;
            self.writeDB();


            MainPageUI.getInstance().show();
            LoginServerUI.getInstance().hide();
            if(fun)
                fun();
        });
    }

    public registerServer(nick,head,serverid,fun?){
        var self = this;
        var oo:any = {};
        oo.nick = nick;
        oo.head = head;
        oo.id = this.gameid;
        oo.cdkey = this.openKey;

        Net.getInstance().serverID = serverid;
        Net.getInstance().serverHost = this.serverList[serverid].host;
        Net.send(GameEvent.sys.register_server,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('用户状态已过期');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('该用户名已被使用');
                return;
            }
            if(msg.fail == 4)
            {
                Alert('注册失败');
                return;
            }

            if(msg.fail == 2)//已注册过了，可以直接登陆
            {
                Alert('已在该服务器上成功注册过了');
                nick = msg.nick;
            }

            //UM.fill(msg.data);

            self.addUserServer(serverid,nick);
            self.myServer[serverid] = nick;
            self.lastServer = serverid;
            LoginServerUI.getInstance().onShow();
            RegisterServerUI.getInstance().hide();
            //self.lastServer = serverid;
            //self.writeDB();
            if(fun)
                fun();
        });
    }
}
