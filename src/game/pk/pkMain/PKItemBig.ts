class PKItemBig extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItemBigSkin";
    }

    private headMC: eui.Image;
    private liveBG: eui.Image;
    private nameText: eui.Label;


    public index;

    public childrenCreated() {
    }

    private onClose() {

    }

    public dataChange() {
        this.headMC.source = MyTool.getMonsterHead(this.data.id);

    }
}