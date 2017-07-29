class LoginServerUI extends game.BaseUI {
    private static instance:LoginServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginServerUI();
        return this.instance;
    }

    private topMC0: eui.Image;
    private bgGroup: eui.Group;
    private bottomMC0: eui.Image;
    private loginBtn: eui.Button;
    private nameText: eui.Label;
    private serverGroup: eui.Group;
    private serverName: eui.Label;
    private backBtn: eui.Group;






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
        LoginManager.getInstance().quickPassword = null;
        LoginUI.getInstance().show();
        PopUpManager.movieChange(LoginServerUI.getInstance(),LoginUI.getInstance(),-1)
    }

    public show(){
        var LM = LoginManager.getInstance();
        if(LM.isAuto)
        {
            var serverid = LM.lastServer
            if(serverid && LM.myServer[serverid])
            {
                this.autoServer(serverid);
                return;
            }

        }
        LM.isAuto = false;
        var self = this;
        //LM.getServerList(function(){
            self.superShow();
        //})

        MainLoadingUI.getInstance().hide();
    }

    public superShow(){
        if(_get['serverid'] && _get['openid'])
        {
            this.autoServer();
            return;
        }
        super.show();
    }

    private autoServer(serverid?){
        serverid = serverid || _get['serverid']
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

        if(LM.myServer[LM.lastServer]) //这个服上有号
        {
            this.serverid = LM.lastServer
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
        this.addPanelOpenEvent('timer',this.onTimer)
        this.onTimer();
        this.onTimer();
    }

    private onTimer(){
        if(Math.random()<0.2) {
            var p = {
                x: Math.random() * 100 + 300,
                y: Math.random() * 100 + 80
            };
            AniManager.getInstance().showStar2(this.bgGroup, p)
        }
        else
        {
            var p = {
                x:Math.random()*320 + 300,
                y:Math.random()*190
            };
            AniManager.getInstance().showStar1(this.bgGroup,p)
        }

    }

    public renewServer(id){
        this.serverid = id;
        var LM = LoginManager.getInstance();
        this.serverName.text = LM.serverList[this.serverid].name;
        if(LM.myServer[this.serverid])
        {
            this.nameText.text = LM.myServer[this.serverid];
            this.loginBtn.label = '开始游戏';
            this.nameText.textColor = 0xFFDD00
            this.nameText.size = 30
        }
        else
        {
            this.nameText.text = '请先建立角色';
            this.nameText.textColor = 0x999999
            this.nameText.size = 22
            this.loginBtn.label = '建立角色';
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