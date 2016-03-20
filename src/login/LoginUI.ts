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
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}