class LoginUI extends game.BaseUI {
    private static instance:LoginUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginUI();
        return this.instance;
    }

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