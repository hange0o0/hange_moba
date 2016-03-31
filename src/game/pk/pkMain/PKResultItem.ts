 class PKResultItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItemSkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;


    public index;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    private onClose() {

    }

    public dataChange() {
        this.headMC.source = MyTool.getMonsterHead(this.data.id);
    }
}
