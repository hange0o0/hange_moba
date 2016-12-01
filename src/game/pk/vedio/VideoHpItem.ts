class VideoHpItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoHpItemSkin";
    }

    private headMC: eui.Image;
    private closeBtn: eui.Button;


    public index;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {

    }
}