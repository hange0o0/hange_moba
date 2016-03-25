class MyHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MyHeadItemSkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;
    private headBG: eui.Image;
    private levelGroup: eui.Group;
    private levelText: eui.Label;


    public index;

    public childrenCreated() {
           this.headMC.mask = this.headMask;
    }

    public dataChange() {
        this.headMC.source = MyTool.getMonsterHead(this.data.id);
        this.headBG.source = 'head_border'+(UM.getMonsterCollect(this.data.id) + 1)+'_png'
        this.levelText.text = UM.getMonsterLevel(this.data.id);
    }
}
