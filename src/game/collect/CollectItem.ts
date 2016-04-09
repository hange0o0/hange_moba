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
        this.headMC.mask = this.headMask;
    }

    private onClick(){
        CollectItemInfo.getInstance().show(this.data);
    }

    public dataChanged(){
        var vo = MonsterVO.getObject(this.data);
        var level = UM.getMonsterCollect(vo.id);
        this.headBG.source = 'head_border' + (level + 1) + '_png';

        var need = CollectManager.getInstance().getLevelUpNeed(level + 1);
        var now = CollectManager.getInstance().getCollectNum(vo.id);
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
    }


}