class DayGameUI extends game.BaseUI {
    private static instance:DayGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new DayGameUI();
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