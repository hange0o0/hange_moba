class LoginUI extends game.BaseUI {
    private static instance:LoginUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginUI();
        return this.instance;
    }

    private bgGroup: eui.Group;
    private topMC: eui.Image;
    private mc1: eui.Image;
    private mc2: eui.Image;
    private bottomMC: eui.Image;
    private logGroup: eui.Group;
    private btnGroup: eui.Group;
    private nameText: eui.TextInput;
    private passwordText: eui.TextInput;
    private quickRegisterBtn: eui.Button;
    private registerBtn: eui.Button;
    private loginBtn: eui.Button;
    private reloginGroup: eui.Group;
    private reloginNameText: eui.Label;
    private changeBtn: eui.Button;
    private loginBtn2: eui.Button;




     private showQuickKey = 0;

    public constructor() {
        super();
        this.skinName = "LoginUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.loginBtn, this.onLogin);
        this.addBtnEvent(this.loginBtn2, this.onLogin);
        this.addBtnEvent(this.quickRegisterBtn, this.onGuest);
        this.addBtnEvent(this.registerBtn, this.onRegister);
        this.addBtnEvent(this.changeBtn, this.onChangeUser);

        this.addBtnEvent(this.mc1, this.onMC1);

        //MyTool.addLongTouch(this.mc1, this.onMC1,this);
        //MyTool.addLongTouch(this.mc2, this.onMC2,this);

        //var LM = LoginManager.getInstance();
        //if(LM.lastUser && !LM.lastPassword)
        //{
        //    MyTool.removeMC(this.tryBtn);
        //}
        
        //this.passwordText.text = '111111'
        this.nameText.text = ''
        this.nameText.addEventListener(egret.FocusEvent.FOCUS_OUT,this.onFocusOut,this)

        if(!Config.isDebug)
            MyTool.removeMC(this.quickRegisterBtn)
    }

    private onMC1(){
        if(this.nameText.text == 'debug')
        {
            this.btnGroup.addChildAt(this.quickRegisterBtn,0)
        }
        //if(this.showQuickKey == 0)
        //    this.showQuickKey = 1;
        //else if(this.showQuickKey == 2)
        //    this.btnGroup.addChildAt(this.quickRegisterBtn,0)
        //else
        //    this.showQuickKey = 0;
    }
    //private onMC2(){
    //    if(this.showQuickKey == 1)
    //        this.showQuickKey = 2;
    //    else
    //        this.showQuickKey = 0;
    //}

    private onFocusOut(){
         if(this.nameText.text != '游客账号' && this.passwordText.text == '游客账号免密码')
         {
             this.passwordText.text = '';
         }
    }

    public show(){
        var LM = LoginManager.getInstance();
        if(LM.lastUser && LM.quickPassword) {
            if(LM.isAuto)
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
            if(LM.isGuest(LM.lastUser))
            {
                this.nameText.text = '游客账号';
                this.reloginNameText.text = '游客账号';
                this.passwordText.text = '游客账号免密码';
            }

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
        var name = this.nameText.text;

        var isGuest = false
        if(this.nameText.text == '游客账号')
        {
            if(!LM.guestData)
            {
                Alert('没有在本机上找到游客账号');
                return;
            }
            name = LM.guestData.name;
            isGuest = true;
        }


        if(this.logGroup.visible)
        {
            var psw = this.passwordText.text;
            if(!isGuest)
            {
                if(!LM.testName(name))
                {
                    return;
                }
                if(!LM.testPassword(psw))
                {
                    return;
                }
            }
            LM.login(name,psw || '666');
        }
        else
        {
            LM.login(name,null);
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

    private onGuest(){
        var LM = LoginManager.getInstance();
        if(LM.guestData)
        {
            Confirm('检测到您已注册了一个游客账号，是否使用该账号继续登录？',function(type){
                if(type == 1)
                {
                    LM.login(LM.guestData.name,LM.guestData.password);
                }
                else if(type == 2)
                {
                    LM.quickRegister();
                }
            },['重新注册','好的']);
        }
        else
        {
            LM.quickRegister();
        }

    }
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