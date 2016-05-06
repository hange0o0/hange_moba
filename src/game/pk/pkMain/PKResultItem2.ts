class PKResultItem2 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItem2Skin";
    }

    private item1: PKResultItem3;
    private item2: PKResultItem3;
    private viewBtn: eui.Image;
    private titleText: eui.Label;




    public index;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.viewBtn,this.onView);
        this.item1.index = 1;
        this.item2.index = 2;
    }

    private onView() {

    }

    public dataChanged() {
        this.item1.data = this.data.player1
        this.item2.data = this.data.player2
        this.titleText.text = '第'+this.data.index+'轮';
    }
}


