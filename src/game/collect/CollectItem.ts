class CollectItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;
    private headBG: eui.Image;
    private numGroup: eui.Group;
    private arrowMC: eui.Image;
    private numText: eui.Label;


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