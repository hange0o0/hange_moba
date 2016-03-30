class PKItemBig extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "EnemyHeadItemSkin";
    }

    private headMC: eui.Image;
    private liveBG: eui.Image;
    private nameText: eui.Label;


    public index;

    public childrenCreated() {
        this.addBtnEvent(this.closeBtn,this.onClose);
    }

    private onClose() {

    }

    public dataChange() {
        this.headMC.source = MyTool.getMonsterHead(this.data.id);
        if(this.data.type == 1) {
            this.closeBtn.visible = false;
        }
    }
}