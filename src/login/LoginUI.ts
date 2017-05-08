class LoginUI extends game.BaseUI {
    private static instance:LoginUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginUI();
        return this.instance;
    }

    private topMC: eui.Image;
    private bgGroup: eui.Group;
    private bottomMC: eui.Image;
    private logGroup: eui.Group;
    private nameText: eui.TextInput;
    private passwordText: eui.TextInput;
    private registerBtn: eui.Button;
    private loginBtn: eui.Button;
    private reloginGroup: eui.Group;
    private reloginNameText: eui.Label;
    private changeBtn: eui.Button;
    private loginBtn2: eui.Button;





    public constructor() {
        super();
        this.skinName = "LoginUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.loginBtn, this.onLogin);
        this.addBtnEvent(this.loginBtn2, this.onLogin);
        //this.addBtnEvent(this.tryBtn, this.onTry);
        this.addBtnEvent(this.registerBtn, this.onRegister);
        this.addBtnEvent(this.changeBtn, this.onChangeUser);

        //var LM = LoginManager.getInstance();
        //if(LM.lastUser && !LM.lastPassword)
        //{
        //    MyTool.removeMC(this.tryBtn);
        //}
        
        //this.passwordText.text = '111111'
        this.nameText.text = ''
    }

    public show(){
        var LM = LoginManager.getInstance();
        if(LM.lastUser && LM.quickPassword) {
            if(LoginManager.getInstance().isAuto)
            {
                LM.login(LM.lastUser,null);
                return;
            }
            else
                LoginManager.getInstance().isAuto = false
        }
        MainLoadingUI.getInstance().hide();
        super.show();
    }


    public onChangeUser(){
        var LM = LoginManager.getInstance();
        if(!this.stage)
        {
            this.show();
            return;
        }
        LoginManager.getInstance().quickPassword = null;
        this.reloginGroup.visible = false
        this.logGroup.visible = true
    }

    public onShow(){
        var LM = LoginManager.getInstance();
        this.passwordText.text = '';
        if(LM.lastUser) {
            this.nameText.text = LM.lastUser;
            this.reloginNameText.text = LM.lastUser;
            if (LM.quickPassword) {
               this.reloginGroup.visible = true
               this.logGroup.visible = false
            }
            else
            {
                this.reloginGroup.visible = false
                this.logGroup.visible = true
            }
        }
        else
        {
            this.reloginGroup.visible = false
            this.logGroup.visible = true
        }
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

    private onLogin(){
        var LM = LoginManager.getInstance();
        if(this.logGroup.visible)
        {
            var psw = this.passwordText.text;
            if(!LM.testName(this.nameText.text))
            {
                return;
            }
            if(!LM.testPassword(psw))
            {
                return;
            }
            LM.login(this.nameText.text,psw);
        }
        else
        {
            LM.login(this.reloginNameText.text,null);
        }

        //if(LM.lastPassword && LM.lastPassword == psw) {
        //    var self = this;
        //    Confirm('检测到您已正使游客账号进行登录，转正式账号可防止游戏数据丢失，是否转正？', function (type) {
        //        if (type == 1) {
        //            RegisterUI.getInstance().show(1);
        //        }
        //        else if (type == 2) {
        //            LM.login(self.nameText.text,psw);
        //        }
        //    }, ['继续使用', '转正']);
        //    return;
        //}
        //
    }
    //private onTry(){
    //    var LM = LoginManager.getInstance();
    //    if(LM.lastPassword)
    //    {
    //        Confirm('检测到您已注册了一个游客账号，是否使用该账号继续登录？',function(type){
    //            if(type == 1)
    //            {
    //                LM.login(LM.lastUser,LM.lastPassword);
    //            }
    //            else if(type == 2)
    //            {
    //                LM.quickRegister();
    //            }
    //        },['重新注册','好的']);
    //    }
    //    else
    //    {
    //        LM.quickRegister();
    //    }
    //
    //}
    private onRegister(){
        var LM = LoginManager.getInstance();
        //if(LM.lastPassword) {
        //    Confirm('检测到您已正使游客账号，可转正该账号继续使用，是否转正？', function (type) {
        //        if (type == 1) {
        //            RegisterUI.getInstance().show(1);
        //        }
        //        else if (type == 2) {
        //            RegisterUI.getInstance().show();
        //        }
        //    }, ['重新注册', '转正']);
        //    return;
        //}
        RegisterUI.getInstance().show();
    }
}