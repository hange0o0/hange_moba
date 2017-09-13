class VideoLeaderSkillItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoLeaderSkillItemSkin";
    }

    private headMC: eui.Image;
    private bg: eui.Rect;





    public mcWidth = 60

    public index;

    public childrenCreated() {
        //this.addBtnEvent(this,this.onDetail);
    }



    public dataChanged() {
        this.headMC.source = this.data.svo.thumb;
        if(this.data.teamID == 1)
        {
            this.bg.strokeColor = 0x1C30AE
        }
        else
        {
            this.bg.strokeColor = 0x820107
        }
    }

}