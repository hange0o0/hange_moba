 class PKResultItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItemSkin";
    }

    private mc: eui.Image;
    private desText: eui.Label;



    public index;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    private onClose() {

    }

    public dataChange() {
    }
}
