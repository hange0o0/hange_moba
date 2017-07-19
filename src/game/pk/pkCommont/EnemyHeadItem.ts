class EnemyHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "EnemyHeadItemSkin";
    }

    private chooseGroup: eui.Group;
    private chooseGroupBG: eui.Image;
    private headMC: eui.Image;
    private teamGroup: eui.Group;
    private teamGroupBG: eui.Image;
    private headMC2: eui.Image;
    private headBG: eui.Image;
    private lvText: eui.Label;
    private closeBtn: eui.Image;
    private nameGroup: eui.Group;
    private nameText: eui.Label;










    public index;

    public childrenCreated() {
          this.addBtnEvent(this.closeBtn,this.onKill);
          this.addBtnEvent(this,this.onClick);

        this.teamGroupBG.visible = false;
        this.chooseGroupBG.visible = false;

        addBtnTips(this,this.onTips,this);

        //MyTool.addTestBlock(this);
    }

    private onTips(){
        if(this.data.vo)
        {
            return this.data.vo.getTipsWord()
        }
        return null;
    }

    private onKill(e:egret.TouchEvent){
        e.stopImmediatePropagation();
        var self = this;
        var cost = MainGameManager.getInstance().getKillCost();
        Confirm('确定花费'+ cost +'金币对该单位进行贿赂吗？',function(value){
             if(value == 1)
             {
                 if(!UM.testCoin(cost))
                 {
                     return;
                 }
                 MainGameManager.getInstance().kill(self.data.index,function(){
                     MainGameUI.getInstance().renewPrice();
                     self.data.isKill = true;
                     self.dataChanged();
                 })
             }
        })

    }
    protected onClick(){
        if(this['stopClickTimer'] &&  egret.getTimer() - this['stopClickTimer'] < 200)
            return
        MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    //type == 1,显示基础
    //type == 2,在主线PK中，会杀
    public dataChanged() {
        if(!this.data.vo)
            this.data.vo = MonsterVO.getObject(this.data.id);
        if(!this.data.vo)
            return;

        this.nameText.text = this.data.vo.name
        this.nameGroup.horizontalCenter= 0
        if(this.data.isTeam)
        {
            MyTool.removeMC(this.chooseGroup);
            this.addChildAt(this.teamGroup,0);
            this.headMC2.source = this.data.vo.thumbRound
            //this.indexText.text = (this.data.index + 1) + ''
            this.lvText.text = '';
            if(this.data.isMain)
            {
                this.closeBtn.visible = !this.data.noKill;
            }
            else
            {
                this.closeBtn.visible = false;
                if(this.data.specialData.lv)
                    this.lvText.text = 'LV.' + this.data.specialData.lv;
            }


            if(this.data.index > 2 && this.data.list.length == 5)
            {
                this.teamGroup.horizontalCenter= 80
                this.nameGroup.horizontalCenter= 80
            }
            else
                this.teamGroup.horizontalCenter= 0
        }
        else
        {
            MyTool.removeMC(this.teamGroup);
            this.addChildAt(this.chooseGroup,0);
            this.headMC.source = this.data.vo.thumb
        }
    }
}