class PKResultMVPItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultMVPItemSkin";
    }

    private rateMC: eui.Rect;
    private headBG: eui.Rect;
    private headMC: eui.Image;
    private topMC: eui.Image;
    private scoreText: eui.Label;



    public isSelect
    public childrenCreated() {
        //this.addBtnEvent(this.rateMC,this.onClick);
    }

    //private onClick(){
    //
    //}

    public dataChanged(){
        this.topMC.visible = this.data.value == this.data.maxValue;
        this.scoreText.text = this.data.value;
        this.rateMC.height = Math.max(5,this.data.value/this.data.maxValue * 300);
        this.headMC.source = MonsterVO.getObject(this.data.mid).thumb
        this.scoreText.y = 400 - this.rateMC.height - 90;
        this.topMC.y = this.scoreText.y - 5;

        if(this.data.mvp)
            this.topMC.source = 'mvp_png'
        else
            this.topMC.source = 'king_icon_png'


        if(this.data.team == 1)
        {
            this.rateMC.fillColor = 0x8E6709
        }
        else
        {
            this.rateMC.fillColor = 0x8E3A09
        }
        this.setChoose(false);
    }

    public setChoose(b){
        this.isSelect = b;
        if(b)
        {
            if(this.parent)
                this.parent.addChild(this);
            this.scoreText.visible = true
            this.rateMC.strokeColor = 0xFFFF00
            this.rateMC.strokeWeight = 2
            this.topMC.visible = false;
        }
        else
        {
            this.topMC.visible = this.data.value == this.data.maxValue;
            this.scoreText.visible = false
            this.rateMC.strokeColor = 0x000000
            this.rateMC.strokeWeight = 1
        }
    }
}
