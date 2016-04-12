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
    
    
    private headMC: eui.Image;
    
    
    private titleText: eui.Label;
    private scroller: eui.Scroller;
    private list: eui.List;
    private okBtn: eui.Button;




    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}