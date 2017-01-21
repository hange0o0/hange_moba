class LoginServerUI extends game.BaseUI {
    private static instance:LoginServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginServerUI();
        return this.instance;
    }
    
    private loginBtn: eui.Button;
    private nameText: eui.Label;
    private serverGroup: eui.Group;
    private serverName: eui.Label;
    private backBtn: eui.Label;




    private serverid

    public constructor() {
        super();
        this.skinName = "LoginServerUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.loginBtn, this.onClick);
        this.addBtnEvent(this.backBtn, this.onBack);
        this.addBtnEvent(this.serverGroup, this.onServerChoose);
    }

    private onBack(){
        this.hide();
        LoginUI.getInstance().show();
    }

    public show(){
        var LM = LoginManager.getInstance();
        var self = this;
        LM.getServerList(function(){
            self.superShow();
        })
    }

    public superShow(){
        if(_get['serverid'] && _get['openid'])
        {
            this.autoServer();
            return;
        }
        super.show();
    }

    private autoServer(){
        var serverid = _get['serverid']
        var LM = LoginManager.getInstance();

        if(LM.myServer[serverid]) //这个服上有号
        {
            LM.loginServer(serverid)
        }
        else
        {
            //var self = this;
            LM.registerServer(_get['openid'],Math.floor(Math.random()*40),serverid,function(){
                LM.loginServer(serverid)
            });
        }
    }

    public onShow(){
        var LM = LoginManager.getInstance();

        if(LM.myServer[LM.lastSever]) //这个服上有号
        {
            this.serverid = LM.lastSever
        }
        else
        {
            var oo = LM.getAllServer();
            if(oo.my.length > 0)
            {
                this.serverid = oo.my[0].serverid;
            }
            else
            {
                this.serverid = oo.other[0].serverid;
            }
        }
        this.renewServer(this.serverid);
    }

    public renewServer(id){
        this.serverid = id;
        var LM = LoginManager.getInstance();
        this.serverName.text = LM.serverList[this.serverid].name;
        if(LM.myServer[this.serverid])
        {
            this.nameText.text = LM.myServer[this.serverid];
            this.loginBtn.label = '开始游戏';
        }
        else
        {
            this.nameText.text = '';
            this.loginBtn.label = '注册用户';
        }
    }

    private onClick(){
        var LM = LoginManager.getInstance();
        if(LM.myServer[this.serverid])  //有号
        {
            LM.loginServer(this.serverid)
        }
        else
        {
            RegisterServerUI.getInstance().show(this.serverid);
        }

    }

    private onServerChoose(){
         ChooseServerUI.getInstance().show(this.serverid);
    }
}