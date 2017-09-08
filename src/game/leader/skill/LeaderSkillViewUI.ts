class LeaderSkillViewUI extends game.BaseUI {
    private static instance:LeaderSkillViewUI;

    public static getInstance() {
        if (!this.instance) this.instance = new LeaderSkillViewUI();
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
    private topUI: TopUI;


    private data;
    private title;
    private type;

    public constructor() {
        super();
        this.skinName = "LeaderSkillViewUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('挑战日志')
        this.topUI.addEventListener('hide', this.hide, this);

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


        this.topUI.setTitle(this.title || '挑战日志')
    }



}

