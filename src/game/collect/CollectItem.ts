class CollectItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CollectItemSkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;
    private headBG: eui.Image;
    private numGroup: eui.Group;
    private arrowMC: eui.Image;
    private numText: eui.Label;

    private lockMC: eui.Image;

    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        this.headMC.mask = this.headMask;
    }

    private onClick(){
        CollectItemInfo.getInstance().show(this.data);
    }

    public dataChanged(){
        var CM = CollectManager.getInstance();
        var vo = this.data;
        var level = UM.getMonsterCollect(vo.id);
        this.headBG.source = 'head_border' + (level + 1) + '_png';
        this.headMC.source = vo.thumb

        var need = CM.getLevelUpNeed(level + 1);
        var now = CM.getCollectNum(vo.id);
        MyTool.removeMC(this.arrowMC);
        if(level >= 4){  //已满级了
            this.numText.text = '' + now;
        }
        else
        {
            if(now >= need)
                this.numGroup.addChildAt(this.arrowMC,0);
            this.numText.text = now + '/' + need;
        }

        this.lockMC.visible = CM.isLock(this.data);
    }


}