class VideoItem3 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoItem3Skin";
    }

    private headMC: eui.Image;
    private closeBtn: eui.Button;


    private con:eui.Group

    public index;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {
        var skillI
    }
}