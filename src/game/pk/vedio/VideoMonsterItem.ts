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
        //this.addBtnEvent(this,this.onDetail);
    }



    public dataChanged() {
        this.headMC.filters = [];
        if(this.data.headVO)
            this.headMC.source = this.data.headVO.thumb;
        else
            this.headMC.source = this.data.mvo.thumb;
        if(this.data.teamID == 1)
        {
            this.bg.strokeColor = 0x1C30AE
        }
        else
        {
            this.bg.strokeColor = 0x820107
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
            this.posText.text = (this.data.index+1)
        }

    }

    public changeGray(){
        MyTool.changeGray(this.headMC);
    }
}