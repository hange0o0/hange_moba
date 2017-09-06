class LeaderItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderItemSkin";
    }

    private headMC: eui.Image;
    private headBG: eui.Image;
    private leaderText: eui.Label;
    private typeMC: eui.Image;
    private starGroup: eui.Group;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private expText: eui.Label;
    private upMC: eui.Image;











    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick);

    }

    private onClick(){
         LeaderStudyUI.getInstance().onSelect(this.data.id)
    }



    public dataChanged(){
        var vo =  MonsterVO.getObject(this.data.id)

        this.headMC.source = vo.thumbRound
        this.typeMC.source = vo.typeIcon


        var addExp = 0
        this.starGroup.removeChildren();
        if(this.data.type == 1)
        {
            addExp = 50;
            this.starGroup.addChild(this.s0)
        }
        else if(this.data.type == 2)
        {
            addExp = 150;
            this.starGroup.addChild(this.s0)
            this.starGroup.addChild(this.s1)
        }
        else
        {
            addExp = 200;
            this.starGroup.addChild(this.s0)
            this.starGroup.addChild(this.s1)
            this.starGroup.addChild(this.s2)
        }

        this.expText.text = '经验 +' + addExp

        var level = UM.getLeaderLevel(vo.id)
        var level2 = UM.getLeaderLevel(vo.id,addExp)

        this.leaderText.text = '+' + level;
        this.leaderText.textColor = UM.getLeaderWorldColor(vo.mtype)

        if(level >= TecManager.getInstance().maxLevel)
        {
            this.upMC.visible = false
        }
        else
        {
            if(level == level2)
            {
                this.upMC.visible = false
            }
            else
            {
                this.upMC.visible = true
            }
        }

        egret.Tween.removeTweens(this.upMC);
        if(this.upMC.visible)
        {
            this.once(egret.Event.REMOVED_FROM_STAGE,function(){
                egret.Tween.removeTweens(this.upMC);
                console.log('remove')
            },this)

            var tw = egret.Tween.get(this.upMC,{loop:true});
            tw.to({y:this.upMC.y-10},300).to({y:this.upMC.y},300).wait(400);

        }
    }

    public renewChoose(){
        var b = LeaderStudyUI.getInstance().selectArr.indexOf(this.data.id) != -1;
        this.currentState = b?'selected':'normal';
    }
    public movieOut(){
        var b = LeaderStudyUI.getInstance().selectArr.indexOf(this.data.id) != -1;
        if(!b)
        {
             var tw = egret.Tween.get(this);
            tw.to({alpha:0},500);
        }
    }

}