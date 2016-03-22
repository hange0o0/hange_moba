class LoginServerUI extends game.BaseUI {
    private static instance:LoginServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginServerUI();
        return this.instance;
    }
    
    private loginBtn: eui.Button;
    private backBtn: eui.Button;
    private nameText: eui.Label;
    private serverName: eui.Label;

    private serverid

    public constructor() {
        super();
        this.skinName = "LoginServerUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.loginBtn, this.onClick);
        this.addBtnEvent(this.backBtn, this.onBack);
        this.addBtnEvent(this.serverName, this.onServerChoose);
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
        super.show();
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

    }
}