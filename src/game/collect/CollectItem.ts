class CollectItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CollectItemSkin";
    }

    private chooseBG: eui.Image;
    private headMC: eui.Image;
    private arrowMC: eui.Image;
    private levelText: eui.Label;
    private nameText: eui.Label;
    private desBG: eui.Image;
    private desText: eui.Label;






    //public index;
    //public showInProp;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        //CollectItemInfo.getInstance().show(this.data,this);
        //MonsterList.getInstance().show(this.data.list,this.data.list.indexOf(this.data));
    }

    public dataChanged(){

        //var CM = CollectManager.getInstance();
        var level = UM.getMonsterLevel(this.data.id);
        //this.headBG.source = 'head_border' + (UM.getMonsterCollect(vo.id) + 1) + '_png';
        var mvo = MonsterVO.getObject(this.data.id);
        this.headMC.source = mvo.url
        this.nameText.text = mvo.name

        this.arrowMC.visible = false;
        if(level >=  TecManager.getInstance().maxLevel){  //已满级了
            this.levelText.text = 'MAX';
        }
        else if(mvo.level > UM.level)
        {
            this.levelText.text = '即将解锁';
        }
        else
        {
            if(mvo.getLevelUpCard() <= UM.card && mvo.getLevelUpCoin() <= UM.coin)
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
        this.setChoose(CollectUI.getInstance().chooseMonster);
        this.renewDes();
    }

    public renewDes(){
        if(this.data.toLast)
        {
            this.desBG.visible = false
            this.desText.text = '';
            return;
        }

        switch(CollectUI.getInstance()['sortList'].selectedIndex)
        {
            case 0://默认
            case 1://等级升序
            case 2://等级降序
                this.desText.text = ''
                break;
            case 3://使用次数
                MyTool.setColorText(this.desText, '[使用：]'+(this.data.t || 0));
                break;
            case 4://胜利次数
                MyTool.setColorText(this.desText, '[胜利：]'+(this.data.w || 0))
                break;
            case 5://胜率
                MyTool.setColorText(this.desText, '[胜率：]'+MyTool.toFixed(((this.data.r || 0)*100),1) + '%')
                break;
            case 6://胜率
                MyTool.setColorText(this.desText, '[评分：]'+Math.round(this.data.w * this.data.r));
                break;

        }
        this.desBG.visible = this.desText.text && true;

    }

    public setChoose(mid)
    {
        var b = this.data.id == mid
        this.chooseBG.visible = b;
        return b
    }


}