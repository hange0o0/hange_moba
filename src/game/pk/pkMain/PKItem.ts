class PKItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItemSkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;


    public index;
    public playerData;

    public childrenCreated() {
        this.headMC.mask = this.headMask;
    }


    public dataChanged() {
        var vo = this.data.vo;
        this.headMC.source = vo.thumb
    }
}
