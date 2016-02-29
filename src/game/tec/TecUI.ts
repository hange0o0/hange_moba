class TecUI extends game.BaseUI {
    private static instance:TecUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TecUI();
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