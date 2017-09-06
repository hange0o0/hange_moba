class LeaderDrawLogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderDrawLogItemSkin";
    }

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