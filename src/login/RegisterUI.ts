class RegisterUI extends game.BaseWindow {
    private static instance:RegisterUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RegisterUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "RegisterUISkin";
    }

    private nameText: eui.TextInput;
    private passwordText1: eui.TextInput;
    private passwordText2: eui.TextInput;
    private backBtn: eui.Button;
    private loginBtn: eui.Button;
    private titleText: eui.Label;

    private openType

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.loginBtn, this.onClick);
        this.addBtnEvent(this.backBtn, this.hide);

        this.nameText.restrict = "^\\\\\"\'"

    }

    public show(v?){
        this.openType = v;
         super.show();
    }

    public onShow(){
        if(this.openType)//转正
        {
             this.titleText.text = '游客账号转正'
            this.currentState = 'guest'
        }
        else
        {
             this.titleText.text = '注册账号'
            this.currentState = 'normal'
        }
        this.nameText.text = ''
        this.passwordText1.text = ''
        this.passwordText2.text = ''
    }

    private onClick(){
        var LM = LoginManager.getInstance();
        if(!LM.testName(this.nameText.text))
        {
            return;
        }
        if(!LM.testPassword(this.passwordText1.text))
        {
            return;
        }
        if(this.passwordText1.text != this.passwordText2.text)
        {
            Alert('两次输入密码不一致');
            return;
        }
        if(this.openType)
            LM.reRegister(this.nameText.text,this.passwordText1.text);
        else
            LM.register(this.nameText.text,this.passwordText1.text);
    }
}