class VideoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItemSkin";
    }

    private headMC: eui.Image;
    private hpBar: eui.Image;
    private atkText: eui.Label;
    private hpText: eui.Label;
    private speedText: eui.Label;
    private mpBar: eui.Image;



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
