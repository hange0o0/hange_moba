class MapShopItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MapShopItemSkin";
    }

    private group: eui.Group;
    private mc: eui.Image;
    private infoGroup: eui.Group;
    private infoText: eui.Label;
    private costText: eui.Label;





    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        MapShopBuyUI.getInstance().show(this.data);
    }

    public dataChanged(){
         //this.mc.source = ''
        this.infoText.text = '金币x123456'
        this.costText.text = '123'
    }
}