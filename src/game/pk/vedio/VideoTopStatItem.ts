
class VideoTopStatItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoTopStatItemSkin";
    }

    private mc: eui.Image;


    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {
        if(this.data.id > 100)
            this.mc.source = 'buff_XX_png'
        else
            this.mc.source = 'buff_'+this.data.id+'_png'
    }
}