class MyHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MyHeadItemSkin";
    }

    private headMC: eui.Image;
    private levelText: eui.Label;
    private redMC: eui.Image;
    private levelGroup: eui.Group;



    public index;

    public childrenCreated() {
        //MyTool.addTestBlock(this);
        this.addBtnEvent(this,this.onClick);
    }

    private onClick(){
        if(this.data && this.data.list)
            MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    public dataChanged() {
        if(!this.data.vo)
            this.data.vo = MonsterVO.getObject(this.data.id);
        var vo:MonsterVO = this.data.vo;

        this.headMC.source = vo.url;
        if(this.data.specialData.isEqual)
        {
            this.levelGroup.visible = false
            this.redMC.visible = false;
        }
        else
        {
            this.levelGroup.visible = true
            this.levelText.text = 'LV.' + UM.getMonsterLevel(vo.id);

            if(this.data.stopRed)
                this.redMC.visible = false;
            else
                this.redMC.visible = vo.canLevelUp(this.data.specialData.hard);
        }



    }
}
