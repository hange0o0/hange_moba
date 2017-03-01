class RankUI extends game.BaseUI {
    private static instance:RankUI;
    public static getInstance() {
        if (!this.instance) this.instance = new RankUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "RankUISkin";
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private emptyText: eui.Label;



    private indexIn


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('排行榜')
        this.topUI.addEventListener('hide',this.hide,this);

        this.list.itemRenderer = RankItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.emptyText.visible = false;

        this.tab.addEventListener(eui.ItemTapEvent.CHANGE, this.typeBarClick, this);
        //this.addBtnEvent(this, this.onClick);
    }

    public beforeHide(){
        this.clearList([this.list])
    }


    public typeBarClick(){
        var self = this;
        this.list.dataProvider = new eui.ArrayCollection([]);
        RankManager.getInstance().getRank(this.tab.selectedIndex + 1,function(){
            self.renewRank();
        })
    }

    public show(rankType = 1){
        this.indexIn = rankType - 1;
        var self = this;
        RankManager.getInstance().getRank(rankType,function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.tab.selectedIndex = this.indexIn;
        this.renewRank();
    }

    public renewRank(){
        this.topUI.setTitle(this.tab.selectedItem.label);
        var arr = RankManager.getInstance().getRankList(this.tab.selectedIndex+1);
        this.emptyText.visible = arr.length == 0;
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }

    private onClick(){

    }
}