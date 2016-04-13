class HeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HeadItemSkin";
    }

    private headMC: eui.Image;


    public childrenCreated(){
        super.childrenCreated();
    }

    public dataChanged(){
        this.headMC.source = MyTool.getHeadUrl(this.data);
    }
}