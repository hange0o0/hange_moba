class FriendPKAnswerUI extends game.BaseUI {
    private static instance:FriendPKAnswerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendPKAnswerUI();
        return this.instance;
    }
    
    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup0: eui.Group;
    private pkTypeText: eui.Label;
    private myGroup0: eui.Group;
    private myList0: eui.List;
    private ringText0: eui.Label;
    private ringText1: eui.Label;
    private myGroup1: eui.Group;
    private myList1: eui.List;
    private ringText2: eui.Label;
    private ringText3: eui.Label;
    private myChooseGroup: eui.Group;
    private myList2: eui.List;
    private chooseText: eui.Label;
    private ringText4: eui.Label;


    public constructor() {
        super();
        this.skinName = "FriendPKAnswerUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}