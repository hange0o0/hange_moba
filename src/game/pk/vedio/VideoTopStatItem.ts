
class VideoTopStatItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoTopStatItemSkin";
    }

    private hpText: eui.Label;
    private backBar: eui.Image;
    private frontBar: eui.Image;



    private barWidth = 150;
    public mcWidth = 160;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {

    }
}