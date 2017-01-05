class ShopItem2 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ShopItem2Skin";
    }

    private titleText: eui.Label;
    private bg: eui.Group;
    private list: eui.List;







    public index;

    public childrenCreated() {
        super.childrenCreated();

        this.list.itemRenderer = ShopItem;
        this.titleText.strokeColor = 0xFFFFFF
    }


    public dataChanged() {
        this.titleText.text = this.data.txt;
        this.titleText.stroke = 0;
        this.list.dataProvider = new eui.ArrayCollection(this.data.list);
        this.bg.height = this.data.list.length * 115 + 35
    }

    public flash(){
        var tw:egret.Tween = egret.Tween.get(this.titleText);
        tw.to({stroke:3},200)
        tw.to({stroke:0},200)
        tw.to({stroke:3},200)
        tw.to({stroke:0},200)
    }
}