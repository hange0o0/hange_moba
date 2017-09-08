class LeaderSkillMainUI extends game.BaseUI {
    private static instance:LeaderSkillMainUI;

    public static getInstance() {
        if (!this.instance) this.instance = new LeaderSkillMainUI();
        return this.instance;
    }

    private bg: eui.Rect;
    private scroller: eui.Scroller;
    private list: eui.List;
    private selectGroup: eui.Group;
    private img: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private btn: eui.Button;
    private getBtn: eui.Button;
    private viewBtn: eui.Button;
    private emptyGroup: eui.Group;
    private getBtn2: eui.Button;



    private data;
    private title;
    private type;

    public constructor() {
        super();
        this.skinName = "LeaderSkillMainUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();


        this.list.itemRenderer = DayLogItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

    }

    public hide(){
        super.hide();
        //if(this.type == 'map')
        //    MapMainUI.getInstance().show();
    }

    public beforeHide(){
        this.clearList([this.list])
    }


    public show(v?,title?,type?){
        this.data = v;
        this.title = title;
        this.type = type;
        super.show();
    }


    public onShow(){
        //var DM = DayGameManager.getInstance();
        var list = this.data;//DM.getLogList();
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.emptyGroup.visible = list.length == 0;
    }



}

