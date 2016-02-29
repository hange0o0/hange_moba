class RegisterServerUI extends game.BaseUI {
    private static instance:RegisterServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RegisterServerUI();
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