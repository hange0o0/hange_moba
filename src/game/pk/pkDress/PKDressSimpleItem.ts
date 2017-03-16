class PKDressSimpleItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressSimpleItemSkin";
    }

    private headMC: eui.Image;
    public index;

    public childrenCreated() {
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.data)
        {
            var list = this.data.getChooseList();
            MonsterList.getInstance().show(list,list.indexOf(this.data))
        }

    }

    public dataChanged() {
        if(this.data)
        {
            this.headMC.source = this.data.vo.thumb;
            this.headMC.visible = true;
        }
        else
            this.headMC.visible = false;

    }
}