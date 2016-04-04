class PKResultItem2 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItem2kin";
    }

    private item1: PKResultItem3;
    private item2: PKResultItem3;



    public index;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    private onClose() {

    }

    public dataChange() {
    }
}


