class DayLogUI extends game.BaseUI {
    private static instance:DayLogUI;

    public static getInstance() {
        if (!this.instance) this.instance = new DayLogUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private emptyText: eui.Label;


    private data;
    private title;

    public constructor() {
        super();
        this.skinName = "DayLogUISkin";
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

    public beforeHide(){
        this.clearList([this.list])
    }


    public show(v?,title?){
        this.data = v;
        this.title = title;
        super.show();
    }

    public onShow(){
        //var DM = DayGameManager.getInstance();
        var list = this.data;//DM.getLogList();
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.emptyText.visible = list.length == 0;


        this.topUI.setTitle(this.title || '挑战日志')
    }



}

