class PKDressSimpleItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressSimpleItemSkin";
    }

    private headMC: eui.Image;
    public index;

    public childrenCreated() {

    }

    public dataChanged() {
        var vo:MonsterVO = MonsterVO.getObject(this.data);
        if(vo)
        {
            this.headMC.source = vo.thumb;
            this.headMC.visible = true;
        }
        else
            this.headMC.visible = false;

    }
}