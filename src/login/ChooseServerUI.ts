class ChooseServerUI extends game.BaseUI {
    private static instance:ChooseServerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ChooseServerUI();
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