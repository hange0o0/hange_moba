class FrinedPKAskUI extends game.BaseUI {
    private static instance:FrinedPKAskUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FrinedPKAskUI();
        return this.instance;
    }
    
    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private ringRadio0: eui.RadioButton;
    private ringRadio1: eui.RadioButton;
    private enemyGroup0: eui.Group;
    private pkTypeText: eui.Label;
    private myGroup0: eui.Group;
    private myList0: eui.List;
    private ringText0: eui.Label;
    private ringText1: eui.Label;
    private chooseBtn0: eui.Button;
    private myGroup1: eui.Group;
    private myList1: eui.List;
    private ringText2: eui.Label;
    private ringText3: eui.Label;
    private chooseBtn1: eui.Button;


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