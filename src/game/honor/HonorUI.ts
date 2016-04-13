class HonorUI extends game.BaseUI {
    private static instance:HonorUI;
    public static getInstance() {
        if (!this.instance) this.instance = new HonorUI();
        return this.instance;
    }
    
    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private upBtn: eui.Group;
    private downBtn: eui.Group;



    public constructor() {
        super();
        this.skinName = "HonorUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}