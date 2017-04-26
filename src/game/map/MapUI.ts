class MapUI extends game.BaseUI {
    private static instance:MapUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapUISkin";
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private shopBtn: eui.Button;
    private valueText: eui.Label;





    private indexIn


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('野外')
        this.topUI.addEventListener('hide',this.hide,this);

        this.list.itemRenderer = MapItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.addBtnEvent(this.shopBtn, this.onShop);
    }

    public beforeHide(){
        this.clearList([this.list])
    }

    public onShop(){
        MapShopUI.getInstance().show();
    }

    public show(rankType = 1){
        var self = this;
        self.superShow();
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renewList();
    }

    public renewList(){
        var arr = [];
        arr.unshift(null);
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }

    private onClick(){

    }
}