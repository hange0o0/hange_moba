class RegisterServerUI extends game.BaseUI {
    private static instance:RegisterServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RegisterServerUI();
        return this.instance;
    }

    private backBtn: eui.Button;
    private registerBtn: eui.Button;
    private nameText: eui.TextInput;
    private random_btn: eui.Group;
    private headGroup: eui.Group;
    private headMC: eui.Image;

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}