class PKItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItemSkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;


    public index;

    public childrenCreated() {
        this.headMC.mask = this.headMask;
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    private onClose() {

    }

    public dataChanged() {
        var vo = MonsterVO.getObject(this.data.mid)
        this.headMC.source = vo.thumb
    }
}
