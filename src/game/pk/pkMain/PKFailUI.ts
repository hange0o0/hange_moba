class PKFailUI extends game.BaseUI {
    private static instance:PKFailUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKFailUI();
        return this.instance;
    }
    
    private desText: eui.Label;
    private list: eui.List;
    private btnGroup: eui.Group;
    private backBtn: eui.Button;
    private okBtn: eui.Button;


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