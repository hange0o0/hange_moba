class PKDressSimpleItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressSimpleItemSkin";
    }

    private headMC: eui.Image;
    private chooseMC: eui.Image;


    public index;

    public childrenCreated() {
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.data)
        {
            var list = this.data.getChooseList();
            this.dispatchEventWith('selectIndex',true,list.indexOf(this.data));
        }

    }

    public setChoose(data){
        this.chooseMC.visible = (data && data == this.data);
    }

    public dataChanged() {
        this.chooseMC.visible = false;
        if(this.data)
        {
            this.headMC.source = this.data.vo.thumb;
            this.headMC.visible = true;
        }
        else
            this.headMC.visible = false;

    }
}