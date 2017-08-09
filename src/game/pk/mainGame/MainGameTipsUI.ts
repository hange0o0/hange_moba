class MainGameTipsUI extends game.BaseUI {
    private static instance:MainGameTipsUI;

    public static getInstance() {
        if (!this.instance) this.instance = new MainGameTipsUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;

    public constructor() {
        super();
        this.skinName = "MainGameTipsUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('过关提示')
        this.topUI.addEventListener('hide', this.hide, this);

        this.list.itemRenderer = MainGameTipsItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

    }

    public hide(){
        super.hide();
    }

    public beforeHide(){
        this.clearList([this.list])
    }


    public show(){
        var self = this;
        MainGameManager.getInstance().getMainPass(function(){
             self.superShow();
        })
    }

    private superShow(){
        super.show();
    }


    public onShow(){
        //var DM = DayGameManager.getInstance();
        var list = MainGameManager.getInstance().mainPass.list;//DM.getLogList();
        this.list.dataProvider = new eui.ArrayCollection(list);
    }



}

