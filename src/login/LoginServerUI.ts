class LoginServerUI extends game.BaseUI {
    private static instance:LoginServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginServerUI();
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