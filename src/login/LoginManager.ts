class LoginManager{

    private static _instance:LoginManager;

    public static getInstance():LoginManager {
        if (!this._instance)
            this._instance = new LoginManager();
        return this._instance;
    }

    public openid;
    public openKey;
    public myServer; //我的服务器列表
    public lastLand;
    public serverList = {}; //所有服务器的集合

    public lastUser;  //上次的登录的用户
    public lastPassword; //上次的登录的密码（只有在游客模式下有）
    public lastSever; //最近登陆的服务器

    public constructor() {
        var oo =  SharedObjectManager.instance.getValue('user') || {};
        this.lastUser = oo.user;
        this.lastPassword = oo.password;
        this.lastSever = oo.lastSever;
        this.myServer = oo.myServer;
    }

    //取我不在的服务器列表
    public getAllServer(){
        var arr = [];
        for(var s in this.serverList)
        {
             if(this.myServer && this.myServer.indexOf(s) != -1)
                 continue;
            arr.push(s);
        }
        ArrayUtil.sortByField(arr,['serverid'],[0]);
        return arr;

    }

    private writeDB(){
        var oo:any = {user:this.lastUser,password:this.lastPassword}
        oo.lastSever = this.lastSever;
        oo.myServer = this.myServer;
        SharedObjectManager.instance.setValue('user',oo)
    }

    //----------------------------------以下是没有接入平台时的，要自己管理用户----------------------------------
    public login(name,password,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        oo.password = password;
        Net.send(GameEvent.sys.login,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('用户或密码错误');
                if(Config.isDebug)
                {
                    self.register(name,password,function(){
                        egret.setTimeout(function(){
                            self.login(name,password,fun);
                        },self,1000);
                    });
                }
                return;
            }

            if(msg.fail == 2)
            {
                Alert('登陆失败');
                return;
            }

            self.openid = msg.userdata.id;
            self.openKey = msg.userdata.cdkey;
            self.lastLand = msg.userdata.last_land;
            self.myServer = msg.userdata.server.split(',');


            self.lastUser = name;
            self.lastPassword = null
            self.writeDB();
            if(fun)
                fun();
        },true,2);
    }

    public register(name,password,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        oo.password = password;
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

            self.openid = msg.id;
            self.openKey = msg.cdkey;
            self.lastLand = msg.last_land;
            self.myServer = [];

            self.lastUser = name;
            self.lastPassword = null
            self.writeDB();
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
                Alert('注册失败');
                return;
            }

            if(msg.fail == 2)
            {
                Alert('该用户名已被使用');
                return;
            }

            self.openid = msg.id;
            self.openKey = msg.cdkey;
            self.lastLand = msg.last_land;
            self.myServer = [];

            self.lastUser = msg.name;
            self.lastPassword = msg.password;
            self.writeDB();
            if(fun)
                fun();
        },true,2);
    }

    //把游客帐号变成注册账号
    public reRegister(name,password,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        oo.password = password;

        oo.last_id = self.openid;
        oo.last_password = self.lastPassword;
        Net.send(GameEvent.sys.re_register,oo,function(data){
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

            self.openKey = msg.cdkey;
            self.lastLand = msg.last_land;

            self.lastUser = name;
            self.lastPassword = null
            self.writeDB();
            if(fun)
                fun();
        },true,2);
    }

    //----------------------------------以下是整个平台的用户管理------------------
    //记录玩家注册过的服务器
    public addUserServer(serverid,nick,fun?){
        var self = this;
        var oo:any = {};
        oo.id = self.openid;
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
                var time = oo.time.split("-");
                var now = new Date(Date.UTC(time[0],time[1]-1,time[2]));
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
        oo.id = this.openid;
        oo.cdkey = this.openKey;
        Net.getInstance().serverID = serverid;
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
                if(Config.isDebug)
                {
                    self.registerServer(oo.id,1,serverid,function(){
                        self.loginServer(serverid,fun);
                    });
                }
                return;
            }

            UM.fill(msg.data);

            self.lastSever = serverid;
            self.writeDB();
            if(fun)
                fun();
        });
    }

    public registerServer(nick,head,serverid,fun?){
        var self = this;
        var oo:any = {};
        oo.nick = nick;
        oo.head = head;
        oo.id = this.openid;
        oo.cdkey = this.openKey;

        Net.getInstance().serverID = serverid;
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
                self.addUserServer(serverid,nick);
                //todo:更新页面
                return;
            }

            //UM.fill(msg.data);

            self.addUserServer(serverid,nick);
            //self.lastSever = serverid;
            //self.writeDB();
            if(fun)
                fun();
        });
    }
}
