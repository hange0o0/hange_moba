class PKResultUI extends game.BaseUI {
    private static instance:PKResultUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKResultUI();
        return this.instance;
    }
    
    private scrollGroup: eui.Group;
    private list: eui.List;


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