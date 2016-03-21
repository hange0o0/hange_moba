class RegisterUI extends game.BaseUI {
    private static instance:RegisterUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RegisterUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private nameText: eui.TextInput;
    private passwordText1: eui.TextInput;
    private passwordText2: eui.TextInput;
    private backBtn: eui.Button;
    private loginBtn: eui.Button;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}