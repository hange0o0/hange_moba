class LoginUI extends game.BaseUI {
    private static instance:LoginUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginUI();
        return this.instance;
    }
    
    private nameText: eui.TextInput;
    private passwordText: eui.TextInput;
    private loginBtn: eui.Button;
    private tryBtn: eui.Button;
    private registerBtn: eui.Button;


    public constructor() {
        super();
        this.skinName = "LoginUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.loginBtn, this.onLogin);
        this.addBtnEvent(this.tryBtn, this.onTry);
        this.addBtnEvent(this.registerBtn, this.onRegister);
    }

    public onShow(){
        var LM = LoginManager.getInstance();
        if(LM.lastUser) {
            this.nameText.text = LM.lastUser;
            if (LM.lastPassword) {
                this.passwordText.text = LM.lastPassword;
            }
        }
    }

    private onLogin(){
        var LM = LoginManager.getInstance();
        var psw = this.passwordText.text;
        if(!LM.testName(this.nameText.text))
        {
             return;
        }
        if(!LM.testPassword(psw))
        {
            return;
        }
        if(LM.lastPassword && LM.lastPassword == psw) {
            var self = this;
            Confirm('检测到您已正使游客账号进行登录，转正式账号可防止游戏数据丢失，是否转正？', function (type) {
                if (type == 1) {
                    RegisterUI.getInstance().show(1);
                }
                else if (type == 2) {
                    LM.login(self.nameText.text,psw);
                }
            }, ['继续使用', '转正']);
            return;
        }


        LM.login(this.nameText.text,psw);
    }
    private onTry(){
        var LM = LoginManager.getInstance();
        if(LM.lastPassword)
        {
            Confirm('检测到您已注册了一个游客账号，是否使用该账号继续登录？',function(type){
                if(type == 1)
                {
                    LM.login(LM.lastUser,LM.lastPassword);
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
        if(LM.lastPassword) {
            Confirm('检测到您已正使游客账号，可转正该账号继续使用，是否转正？', function (type) {
                if (type == 1) {
                    RegisterUI.getInstance().show(1);
                }
                else if (type == 2) {
                    RegisterUI.getInstance().show();
                }
            }, ['重新注册', '转正']);
            return;
        }
        RegisterUI.getInstance().show();
    }
}