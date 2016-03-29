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
        MyTool.addTestBlock(this);
    }

    public dataChange() {
        var vo:MonsterVO = this.data.vo;

        this.headMC.source = vo.thumb;
        if(this.data.borderValue)
        this.headBG.source = 'head_border'+(UM.getMonsterCollect(vo.id) + 1)+'_png'

        if(this.data.type == 1) //一般情况下显示头像
        {
            this.levelGroup.visible = true;
            this.levelText.text = UM.getMonsterLevel(vo.id);
        }
        else if(this.data.type == 2) //PK选服中
        {
            this.levelGroup.visible = true;
            this.levelText.text = this.data.index;//UM.getMonsterLevel(vo.id);
        }


    }
}
