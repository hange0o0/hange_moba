class MainGameTipsHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseItemSkin";
    }

    private stateMC: eui.Image;
    private monsterGroup: eui.Group;
    private addMC: eui.Label;
    private headMC: eui.Image;
    private headBG: eui.Image;
    private leaderText: eui.Label;
    private lvText: eui.Label;
    private levelGroup: eui.Group;
    private levelText: eui.Label;











    public index;

    public childrenCreated() {;
        this.addBtnEvent(this,this.onClick);

        this.stateMC.visible = false;
        this.levelGroup.visible = false;
        addBtnTips(this,this.onTips);



        //MyTool.addTestBlock(this);
    }

    private onTips(){
        if(this.data.vo)
        {
            return this.data.vo.getTipsWord()
        }
        return null;
    }


    protected onClick(){
        if(this['stopClickTimer'] &&  egret.getTimer() - this['stopClickTimer'] < 200)
            return
        if(!this.data.vo)
            return;
        MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    public dataChanged() {
        this.addMC.text = (this.data.index + 1) + ''
        if(!this.data.vo)
            this.data.vo = MonsterVO.getObject(this.data.id);
        if(!this.data.vo)
        {
            this.headMC.source = null;
            this.lvText.text = '';
            return;
        }

        this.headMC.source = this.data.vo.thumbRound
        this.lvText.text = '';

        if(this.data.specialData.lv)
            this.lvText.text = 'LV.' + this.data.specialData.lv;

        if(this.data.compare)
        {
            var mlevel = UM.getMonsterLevel(this.data.id);
            MyTool.changeGray(this.headMC,this.data.disable)
            MyTool.changeGray(this.headBG,this.data.disable)
            var textColor = 0xCCB48E;
            if(!this.lvText.text)
                this.lvText.text = 'LV.0';
            if(this.data.specialData.lv < mlevel)
                this.setHtml(this.lvText,this.lvText.text+ ' ('+this.createHtml('+'+( mlevel-this.data.specialData.lv),0xFF0000)+')');
            else if(this.data.specialData.lv > mlevel)
                this.setHtml(this.lvText,this.lvText.text+ ' ('+this.createHtml(mlevel-this.data.specialData.lv,0x00FF00)+')');
        }


    }
}