class MyHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MyHeadItemSkin";
    }

    private headMC: eui.Image;
    private levelText: eui.Label;


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
        this.levelText.text = 'LV.' + UM.getMonsterLevel(vo.id);
        this.headMC.source = vo.url;
    }
}
