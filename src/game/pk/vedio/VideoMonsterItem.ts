class VideoMonsterItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoMonsterItemSkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;
    private headBG: eui.Image;


    public mcWidth = 60

    public index;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {

    }
}