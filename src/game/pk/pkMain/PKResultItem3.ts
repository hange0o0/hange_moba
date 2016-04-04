class PKResultItem3 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItem3kin";
    }

    private headMC: eui.Image;
    private barMC: eui.Image;
    private iconText: eui.BitmapLabel;
    private hpText: eui.Label;


    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    private onClose() {

    }

    public dataChange() {
    }
}
