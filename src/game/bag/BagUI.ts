class BagUI extends game.BaseUI {
    private static instance:BagUI;
    public static getInstance() {
        if (!this.instance) this.instance = new BagUI();
        return this.instance;
    }
    
    private infoGroup: eui.Group;
    private itemMC: BagItem;
    private desText: eui.Label;
    private infoBtn: eui.Button;
    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;


    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    public onShow(){
        this.renew();
    }

    private onClick(){

    }

    private renew(){

    }
}