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


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}