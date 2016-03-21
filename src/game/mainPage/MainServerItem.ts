class MainServerItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private retryBtn: eui.Button;
    private startBtn: eui.Button;
    private totalText: eui.Label;
    private scoreText: eui.Label;
    private winText: eui.Label;


    public index;

    public childrenCreated() {

    }

    public dataChange() {
        var oo = PKManager.getInstance().indexAdd(this.itemIndex);
        var id = this.data;
    }
}