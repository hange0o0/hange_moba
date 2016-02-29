class OtherInfoUI extends game.BaseUI {
    private static instance:OtherInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new OtherInfoUI();
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