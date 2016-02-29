class LoginMainPageUI extends game.BaseUI {
    private static instance:LoginMainPageUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginMainPageUI();
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