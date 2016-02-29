class PKBeforeUI extends game.BaseUI {
    private static instance:PKBeforeUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKBeforeUI();
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