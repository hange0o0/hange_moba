class ServerGameUI extends game.BaseUI {
    private static instance:DebugUI;
    public static getInstance() {
        if (!this.instance) this.instance = new DebugUI();
        return this.instance;
    }
    
    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private winText: eui.Label;
    private rankText: eui.Label;
    private forceText: eui.Label;
    private headMC: eui.Image;
    private enemyList: eui.List;
    private myGroup0: eui.Group;
    private myTitleText0: eui.Label;
    private chooseBtn0: eui.Button;
    private myList0: eui.List;
    private myGroup1: eui.Group;
    private myTitleText1: eui.Label;
    private chooseBtn1: eui.Button;
    private myList1: eui.List;


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