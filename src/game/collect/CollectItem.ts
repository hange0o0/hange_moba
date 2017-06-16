class CollectItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CollectItemSkin";
    }

    private headMC: eui.Image;
    private arrowMC: eui.Image;
    private levelText: eui.Label;
    private nameText: eui.Label;



    //public index;
    //public showInProp;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        //CollectItemInfo.getInstance().show(this.data,this);
        MonsterList.getInstance().show(this.data.list,this.data.list.indexOf(this.data));
    }

    public dataChanged(){
        //var CM = CollectManager.getInstance();
        var level = UM.getMonsterLevel(this.data.id);
        //this.headBG.source = 'head_border' + (UM.getMonsterCollect(vo.id) + 1) + '_png';
        var mvo = MonsterVO.getObject(this.data.id);
        this.headMC.source = mvo.url
        this.nameText.text = mvo.name



        var arr = TecManager.getInstance().collectRate(this.data.id);
        var need = arr[1];
        var now = arr[0];
        this.arrowMC.visible = false;
        if(need == 0){  //已满级了
            this.levelText.text = 'MAX';
        }
        else if(mvo.level > UM.level)
        {
            this.levelText.text = '即将解锁';
        }
        else
        {
            var cost = TecManager.getInstance().needCoin(level + 1)
            if(now >= need && cost <= UM.coin)
            {
                this.arrowMC.visible = true;

                //if(cost <= UM.coin)
                //{
                //    this.arrowMC.source = 'arrow5_png'
                //    this.arrowMC.scaleY = 1;
                //}
                //else
                //{
                //    this.arrowMC.source = 'arrow4_png'
                //    this.arrowMC.scaleY = -1;
                //}
            }

            this.levelText.text = 'LV.' + level;
        }

        //this.lockMC.visible = CM.isLock(vo.id);
        //if(this.showInProp)
        //{
        //    this.lockMC.visible = false;
        //}
        //
        //if(level == 0)
        //    this.levelGroup.visible = false;
        //else
        //{
        //    this.levelGroup.visible = true;
        //    this.levelText.text = level;
        //}
    }


}