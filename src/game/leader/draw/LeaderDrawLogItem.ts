class LeaderDrawLogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderDrawLogItemSkin";
    }

    private headMC: eui.Image;
    private desText: eui.Label;
    private timeText: eui.Label;


    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick);

    }

    private onClick(){

    }



    public dataChanged(){

    }



}