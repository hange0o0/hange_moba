class ServerGameEqualUI extends game.BaseUI {
    private static instance:ServerGameEqualUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ServerGameEqualUI();
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