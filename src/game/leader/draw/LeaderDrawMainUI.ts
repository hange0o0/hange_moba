class LeaderDrawMainUI extends game.BaseContainer {
    private static instance:LeaderDrawMainUI;

    public static getInstance() {
        if (!this.instance) this.instance = new LeaderDrawMainUI();
        return this.instance;
    }

    private bg: eui.Rect;
    private chooseList: eui.List;
    private scroller: eui.Scroller;
    private list: eui.List;
    private btn1: eui.Button;
    private btn2: eui.Button;
    private doorGroup: eui.Group;
    private doorNpc: eui.Image;
    private desGroup: eui.Group;
    private desText: eui.Label;
    private awardList: eui.List;




    public constructor() {
        super();
        this.skinName = "LeaderDrawMainUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.list.itemRenderer = LeaderDrawLogItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

        this.addBtnEvent(this.btn1,this.onClick1)
        this.addBtnEvent(this.btn2,this.onClick2)
    }

    private onClick1(){

    }
    private onClick2(){

    }

    public beforeHide(){
        this.clearList([this.list])
    }




    public onShow(){

    }



}

