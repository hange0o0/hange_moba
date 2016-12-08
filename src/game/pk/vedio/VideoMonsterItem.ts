class VideoMonsterItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoMonsterItemSkin";
    }

    private bg: eui.Rect;
    private headMC: eui.Image;
    private icon: eui.Image;
    private posText: eui.Label;




    public mcWidth = 60

    public index;

    public childrenCreated() {
        //this.headMask.visible = false;
        //this.headMC.mask = this.headMask
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {

        this.headMC.source = 'head_png'
        if(this.data.teamID == 1)
        {
            this.bg.fillColor = 0x011282
        }
        else
        {
            this.bg.fillColor = 0x820107
        }

        this.icon.visible = true
        this.posText.visible = false
        if(this.data.index == -1)
        {
            this.icon.visible = false
        }
        else if(this.data.index == 0)
        {
            this.icon.source = 'icon_atk_png'
        }
        else
        {
            this.icon.source = 'icon_empty_png'
            this.posText.visible = true
            this.posText.text = this.data.index
        }

    }
}