class FrinedPKAskUI extends game.BaseUI {
    private static instance:FrinedPKAskUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FrinedPKAskUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "FrinedPKAskUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}