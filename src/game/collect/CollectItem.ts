class CollectItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CollectItemSkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;
    private headBG: eui.Image;
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private numGroup: eui.Group;
    private arrowMC: eui.Image;
    private numText: eui.Label;


    private lockMC: eui.Image;

    public index;
    public showInProp;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        this.headMC.mask = this.headMask;
    }

    private onClick(){
        //CollectItemInfo.getInstance().show(this.data,this);
        MonsterList.getInstance().showLevelUp(this.data);
    }

    public dataChanged(){
        //var CM = CollectManager.getInstance();
        var vo = this.data;
        var level = UM.getMonsterLevel(vo.id);
        this.headBG.source = 'head_border' + (UM.getMonsterCollect(vo.id) + 1) + '_png';
        this.headMC.source = MonsterVO.getObject(vo.id).thumb

        var arr = TecManager.getInstance().collectRate(vo.id);
        var need = arr[1];
        var now = arr[0];
        MyTool.removeMC(this.arrowMC);
        if(need == 0){  //已满级了
            this.numText.text = '' + now;
        }
        else
        {
            if(now >= need)
                this.numGroup.addChildAt(this.arrowMC,0);
            this.numText.text = now + '/' + need;
        }

        //this.lockMC.visible = CM.isLock(vo.id);
        if(this.showInProp)
        {
            this.lockMC.visible = false;
        }

        if(level == 0)
            this.levelGroup.visible = false;
        else
        {
            this.levelGroup.visible = true;
            this.levelText.text = level;
        }
    }


}