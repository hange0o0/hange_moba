class MapShopUI extends game.BaseWindow {
    private static instance:MapShopUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapShopUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapShopUISkin";
    }

    private btnGroup: eui.Group;
    private okBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;
    private scoreText: eui.Label;
    private cdText: eui.Label;




    private indexIn


    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.okBtn,this.hide)

        this.list.itemRenderer = MapShopItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }

    public beforeHide(){
        this.clearList([this.list])
    }



    public show(rankType = 1){
        var self = this;
        RankManager.getInstance().getRank(rankType,function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
         this.cdText.text = '下次刷新:' + DateUtil.getStringBySecond(60);
    }
    private renewScore(){
        this.scoreText.text = '积分:' + 123456
    }

    public renew(){
         this.onTimer();
         this.renewScore();
        this.list.dataProvider = new eui.ArrayCollection([1,2,3,4,5,6,7,8])
    }
}