class Net extends egret.EventDispatcher{
    private static instance: Net;
    public static getInstance() {
        if(!this.instance) this.instance = new Net();
        return this.instance;
    }

    //发送消息
    public static send(head,msg,fun?,isMode = true,serverType=1){
        Net.getInstance().send(head,msg,fun,isMode,serverType);
    }
    //添加用户信息
    public static addUser(msg){
        msg.landid = UM.landid;
        msg.gameid = UM.gameid;
    }



    public modeNum = 0;
    public serverID = 1;
    public serverHost = ''
    public outPut = true;
    public constructor() {
        super();
    }

    private getVariables(head,msg,serverType)
    {
        var variables = new egret.URLVariables('a=1');
        var oo:any = {};
        oo.head = head;
        oo.msg = JSON.stringify(msg);
        oo.debug_client =  Config.isDebug;
        if(serverType == 1)
            oo.version = Config.version;
        else
            oo.version = Config.user_version;
        if(_get['debug_server'])
            oo.debug_server = 1;
        if(_get['new_version'])
            oo.new_version = _get['new_version'];

        variables.variables = oo;
        //(<any>variables.variables).msg = JSON.stringify(msg);
        //(<any>variables.variables).debug_client = Config.isDebug;
        //(<any>variables.variables).version = Config.version;
        return variables;
    }

    public send(head,msg,fun?,isMode = true,serverType=1){
        var loader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        if(serverType == 1)
        {
            if(!this.serverHost)
            {
                Alert('找不到服务器');
                return;
            }
            var request = new egret.URLRequest(this.serverHost);
        }
        else
            var request = new egret.URLRequest('http://'+Config.host+'/userindex.php');
        //var request = new egret.URLRequest('http://qxu1606510485.my3w.com/new_index.php');
        request.method = egret.URLRequestMethod.POST;
        request.data = this.getVariables(head,msg,serverType);
        if(Config.isDebug && this.outPut)
        {
            console.log('send===>      '+head)
            console.log(JSON.stringify(msg) +'   '+TM.now());
        }

        if(isMode)
        {
            this.modeNum ++;
            GameManager.container.touchChildren = GameManager.container.touchEnabled = false;
            this.addLoading();
        }

        loader.load(request);


        function onComplete(e){
            if(isMode)
                this.modeNum --;
            if(this.modeNum <= 0)
            {
                GameManager.container.touchChildren = GameManager.container.touchEnabled = true;
                this.removeLoading();
            }


            loader.removeEventListener(egret.Event.COMPLETE, onComplete, this);
            loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
            if(Config.isDebug && this.outPut)
            {
                console.log('====receive>        '+head)
                console.log(e.target.data +'   ' +TM.now());
            }
            try {
                var data = JSON.parse(e.target.data)
            }catch(e){
                if(Config.isDebug)
                    Alert('通信数据异常');
                else
                    Alert('通信数据异常',refresh,'重新登陆');
                return;
            }
            if(data.error)
            {
                GameManager.container.touchChildren = GameManager.container.touchEnabled = true;
                this.removeLoading();
                switch (data.error)
                {
                    case 1:
                        if(_get['app'])
                            Alert('游戏已更新，请重新下载');
                        else
                            Alert('游戏已更新，请登陆重进',refresh,'重新登陆');
                        GameManager.getInstance().stopTimer();
                        break;
                    case 2:
                        Alert('该用户已在其它地方登录',refresh,'重新登陆');
                        GameManager.getInstance().stopTimer();
                        break;
                    case 3:
                        Alert('通信出错',refresh,'重新登陆');
                        break;
                    case 4:
                        Alert('用户数据写入失败',refresh,'重新登陆');
                        GameManager.getInstance().stopTimer();
                        break;
                    case 5:
                        Alert('服务器正在维护中，请稍后再试',refresh);
                        GameManager.getInstance().stopTimer();
                        break;
                    case 99:
                        Alert(data.error_str,refresh);
                        GameManager.getInstance().stopTimer();
                        break;
                }
                return;
            }
            TM.init(data.server_time);
            SyncManager.getInstance().snyc(data.msg);
            var oo:any = {};
            oo.sendData = msg;
            oo.msg = data.msg;
            if(fun)
                fun(oo);
            this.dispatchEventWith(head,false,oo);
        }

        function onError(e){
            loader.removeEventListener(egret.Event.COMPLETE, onComplete, this);
            loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
            Alert('与服务器失去连接！',refresh);
            GameManager.getInstance().stopTimer();
            GameManager.container.touchChildren = GameManager.container.touchEnabled = true;
            this.removeLoading();

        }
        function refresh(){
            location.reload();
        }


        loader.addEventListener(egret.Event.COMPLETE, onComplete, this);
        loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);

    }

    private addLoading(){
        MsgingUI.getInstance().show();
    }

    private removeLoading(){
        MsgingUI.getInstance().hide();
    }
}