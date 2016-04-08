class CollectItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private img:eui.Image;

    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){
    }
}