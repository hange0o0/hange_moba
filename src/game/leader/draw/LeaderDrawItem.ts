class LeaderDrawItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderDrawItemSkin";
    }

    private lightMC: eui.Image;
    private itemMC: AwardItem;












    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick);

    }

    private onClick(){

    }



    public dataChanged(){

    }



}