class RankUI extends game.BaseUI {
    private static instance:RankUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RankUI();
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