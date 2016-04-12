
class AwardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AwardItemSkin";
    }

    private collectItem: CollectItem;
    private group: eui.Group;
    private mc: eui.Image;
    private desText: eui.Label;



    public childrenCreated() {

    }

    public dataChanged() {

    }
}