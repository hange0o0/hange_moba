class MainPageItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {

    }

    public dataChange() {
        var oo = PKManager.getInstance().indexAdd(this.itemIndex);
        var id = this.data;
    }
}