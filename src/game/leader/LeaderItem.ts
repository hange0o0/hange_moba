class LeaderItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderItemSkin";
    }

    private barMC0: eui.Group;
    private maskMC0: eui.Rect;
    private bar0: eui.Rect;
    private barMC1: eui.Group;
    private maskMC1: eui.Rect;
    private bar1: eui.Rect;
    private headMC: eui.Image;
    private headBG: eui.Image;
    private expText: eui.Label;
    private leaderText: eui.Label;
    private typeMC: eui.Image;










    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.bar0.mask = this.maskMC0
        this.bar1.mask = this.maskMC1

        this.addBtnEvent(this,this.onClick);

    }

    private onClick(){

    }



    public dataChanged(){
        var vo =  MonsterVO.getObject(this.data.id)
        this.barMC0.rotation = 10;
        this.barMC1.rotation = 10;
        this.headMC.source = vo.thumbRound
        this.typeMC.source = vo.typeIcon
        this.headBG.source = 'leader_item_bg1_png'
        this.expText.text = '经验+1000'
        this.leaderText.text = '经验+1000'
    }

}