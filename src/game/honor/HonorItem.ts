class HonorItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HonorItemSkin";
    }

    private headMC: eui.Image;
    private useText: eui.Label;
    private winText: eui.Label;
    private rateText: eui.Label;
    private awardBtn: eui.Button;
    private barMC: eui.Image;
    private awardText: eui.Label;
    private finishText: eui.Label;


    public index;

    public childrenCreated(){

    }

    public dataChanged(){

    }
}