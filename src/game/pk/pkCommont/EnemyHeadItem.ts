class EnemyHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "EnemyHeadItemSkin";
    }

    private headMC: eui.Image;
    private closeBtn: eui.Button;


    public index;

    public childrenCreated() {

    }

    public dataChange() {
        var oo = PKManager.getInstance().indexAdd(this.itemIndex);
        var id = this.data;
    }
}