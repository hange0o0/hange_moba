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
    public haveGetServerList = false

    public lastUser;  //上次的登录的用户
    public quickPassword; //上次的登录的密码//（只有在游客模式下有）
    public lastServer; //最近登陆的服务器

    public logText;

    public isAuto = false

    public guestData

    public constructor() {
        var oo =  SharedObjectManager.instance.getValue('user') || {};
        this.lastUser = oo.user;
        this.quickPassword = oo.password;
        //this.lastServer = oo.lastServer;
        this.myServer = oo.myServer || {};

        if(this.lastUser)
        {
            this.lastServer = SharedObjectManager.instance.getValue('user_server_' + this.lastUser);
        }

        this.logText = SharedObjectManager.instance.getValue('logText') || {}

        this.guestData = SharedObjectManager.instance.getValue('guest') || null
    }

    public isGuest(name){
        return (this.guestData && this.guestData.name == name);
    }

    public showLoginUI(){
        PopUpManager.hideAll()
        LoginUI.getInstance().show();
    }

    public saveLogText(){
        SharedObjectManager.instance.setValue('logText',this.logText)
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
            if(this.serverList[s].hide)
                continue;
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
        //oo.lastServer = this.lastServer;
        oo.myServer = this.myServer;
        SharedObjectManager.instance.setValue('user',oo)
        SharedObjectManager.instance.setValue('user_server_' + this.lastUser,this.lastServer);
    }

    //----------------------------------以下是没有接入平台时的，要自己管理用户----------------------------------
    public login(name,password,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        var isGuest = this.isGuest(name)

        //if(isGuest && (Date.now() - this.guestData.time) > 48*3600*1000)//超过48小时要变正式
        //{
        //    self.quickPassword = null;
        //    self.isAuto = false;
        //    LoginUI.getInstance().onChangeUser();
        //    RegisterUI.getInstance().show(true);
        //    return;
        //}

        if(password)
        {
            if(isGuest)
                oo.password = this.guestData.password;
            else
                oo.password = md5.incode(password);
        }
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
                    if(!self.isAuto)
                        Alert('用户登录状态已失效');
                    self.quickPassword = null;
                    self.isAuto = false;
                    LoginUI.getInstance().onChangeUser();

                    self.writeDB();
                }
                return;
            }

            if(msg.fail == 2)
            {
                Alert('登陆失败');
                if(self.isAuto)
                {
                    self.isAuto = false;
                    LoginUI.getInstance().show();
                }
                return;
            }

            self.gameid = msg.userdata.id;
            self.openKey = msg.userdata.cdkey;
            self.lastLand = msg.userdata.last_land;
            self.fillServer(msg.userdata.server);



            self.lastUser = name;
            self.quickPassword = msg.quick_password;
            self.lastServer = SharedObjectManager.instance.getValue('user_server_' + self.lastUser);
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
            self.lastServer = SharedObjectManager.instance.getValue('user_server_' + self.lastUser);
            self.writeDB();

            self.onUserLogin();
            if(fun)
                fun();
        },true,2);
    }

    //创建一个游客账号
    public quickRegister(fun?){
        var self = this;
        var oo:any = {};
        Net.send(GameEvent.sys.quick_register,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                self.quickRegister(fun);
                return;
            }

            self.gameid = msg.data.id;
            self.openKey = msg.data.cdkey;
            self.lastLand = msg.data.last_land;
            self.myServer = {};
            self.lastUser = msg.data.name;
            self.quickPassword = msg.quick_password
            self.lastServer = SharedObjectManager.instance.getValue('user_server_' + self.lastUser);


            self.guestData = {};
            self.guestData.name = msg.data.name
            self.guestData.password = msg.data.password
            self.guestData.time = Date.now();
            SharedObjectManager.instance.setValue('guest',self.guestData)


            self.writeDB();
            self.onUserLogin();
            if(fun)
                fun();
        },true,2);
    }

    //把游客帐号变成注册账号
    public reRegister(name,password,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        oo.password = md5.incode(password);

        oo.last_name = self.guestData.name;
        oo.last_password = self.guestData.password;
        Net.send(GameEvent.sys.re_register,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('该用户名已被使用');
                return;
            }

            //if(msg.fail == 2)
            //{
            //    Alert('该用户名已被使用');
            //    return;
            //}


            self.gameid = msg.userdata.id;
            self.openKey = msg.userdata.cdkey;
            self.lastLand = msg.userdata.last_land;
            self.fillServer(msg.userdata.server);


            self.guestData = null
            SharedObjectManager.instance.setValue('guest',null)

            self.lastUser = name;
            self.writeDB();


            self.onUserLogin();
            if(fun)
                fun();
        },true,2);
    }

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
        var self = this;
        var isAuto = self.isAuto;
        this.getServerList(function(){
            RegisterUI.getInstance().hide();
            LoginServerUI.getInstance().show();
            if(!isAuto)
                PopUpManager.movieChange(LoginUI.getInstance(),LoginServerUI.getInstance(),1)
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
        if(this.haveGetServerList){
            if(fun)
                fun();
            return;
        }
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
            self.haveGetServerList = true;
            if(fun)
                fun();
        },true,2);
    }

    //----------------------------------以下是进入时已有了用户后的处理（已有gameid 和 landid)----------------------------------
    public loginServer(serverid,fun?){
        var self = this;
        var oo:any = {};
        if(FromManager.getInstance().h5Form)
        {
            oo = FromManager.getInstance().getLoginBase();
        }
        //oo.serverid = serverid;
        oo.id = this.gameid;
        oo.cdkey = this.openKey;
        oo.logtime = this.logText.time || 0;
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
            if(msg.logtext)
            {
                self.logText = msg.logtext;
                if(self.logText.time < UM.opentime)
                    self.logText.cb = true
                self.saveLogText();
            }


            MainPageUI.getInstance().show();
            if(!self.isAuto && !FromManager.getInstance().h5Form)
                PopUpManager.movieChange(LoginServerUI.getInstance(),MainPageUI.getInstance(),1)
            self.isAuto = false;
            MainLoadingUI.getInstance().hide();
            FromManager.getInstance().loginRole()
            //LoginServerUI.getInstance().hide();
            if(fun)
                fun();
        });
    }

    public debugLoginServer(gameid,serverid,cdkey,fun?){
        var self = this;
        var oo:any = {};
        oo.id = gameid;
        oo.cdkey = cdkey;
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
                Alert('没这个玩家');
                return;
            }

            UM.fill(msg.data);
            MainPageUI.getInstance().show();
            MainLoadingUI.getInstance().hide();
            if(fun)
                fun();
        });
    }

    public relogin(){
        var self = LoginManager.getInstance();
        var oo:any = {};
        //oo.serverid = serverid;
        oo.id = self.gameid;
        oo.cdkey = self.openKey;
        oo.logtime = self.logText.time || 0;
        var serverid = self.lastServer;
        Net.getInstance().serverID = serverid;
        Net.getInstance().serverHost = self.serverList[serverid].host;
        Net.send(GameEvent.sys.login_server,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('用户状态已过期!',MyTool.refresh);
                return;
            }

            if(msg.fail == 2)
            {
                return;
            }

            UM.fill(msg.data);
            if(msg.logtext)
            {
                self.logText = msg.logtext;
                if(self.logText.time < UM.opentime)
                    self.logText.cb = true
                self.saveLogText();
            }


            PopUpManager.showToMain()
        });
    }

    public registerServer(nick,head,serverid,fun?){
        var self = this;
        var oo:any = {};
        if(FromManager.getInstance().h5Form)
        {
            oo = FromManager.getInstance().getLoginBase();
        }
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
            if(FromManager.getInstance().h5Form)
            {
                FromManager.getInstance().newRole()
                UM.nick = nick;
                self.myServer[serverid] = nick;
                self.lastServer = serverid;
                self.loginServer(serverid)
            }
            else
            {
                self.addUserServer(serverid,nick);
                self.myServer[serverid] = nick;
                self.lastServer = serverid;
                LoginServerUI.getInstance().onShow();
            }



            RegisterServerUI.getInstance().hide();
            //self.lastServer = serverid;
            //self.writeDB();
            if(fun)
                fun();
        });
    }
}
