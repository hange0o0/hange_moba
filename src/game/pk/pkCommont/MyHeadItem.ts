class MyHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;
    private headBG: eui.Image;
    private levelGroup: eui.Group;
    private levelText: eui.Label;


    public index;

    public childrenCreated() {

    }

    public dataChange() {
        var oo = PKManager.getInstance().indexAdd(this.itemIndex);
        var id = this.data;
    }
}
