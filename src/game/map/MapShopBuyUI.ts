class MapShopBuyUI extends game.BaseWindow {
    private static instance:MapShopBuyUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapShopBuyUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapShopBuyUISkin";
    }

    private btnGroup: eui.Group;
    private cencelBtn: eui.Button;
    private okBtn: eui.Button;
    private scoreText: eui.Label;
    private item: MapShopItem;





    private dataIn


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cencelBtn,this.hide)
        this.addBtnEvent(this.okBtn,this.onClick)
    }

    private onClick(){

    }


    public show(dataIn?){
        this.dataIn = dataIn;
        var self = this;
        self.superShow();
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renew();
    }

    public renew(){
        this.scoreText.text = '你当前拥有积分:123456，确定要兑换以下道具吗？'
        this.item.data = this.dataIn;
    }


}