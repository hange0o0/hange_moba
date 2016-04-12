class BagItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;


    public index;

    public childrenCreated(){

    }

    public dataChanged(){
    }
}