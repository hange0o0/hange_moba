class LeaderItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderItemSkin";
    }

    private barMC0: eui.Group;
    private maskMC0: eui.Rect;
    private bar0: eui.Rect;
    private barMC1: eui.Group;
    private maskMC1: eui.Rect;
    private bar1: eui.Rect;
    private headMC: eui.Image;
    private headBG: eui.Image;
    private expText: eui.Label;
    private leaderText: eui.Label;
    private typeMC: eui.Image;










    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.bar0.mask = this.maskMC0;
        this.bar1.mask = this.maskMC1;

        this.addBtnEvent(this,this.onClick);

    }

    private onClick(){
         LeaderMainUI.getInstance().onSelect(this.data.id)
    }



    public dataChanged(){
        var vo =  MonsterVO.getObject(this.data.id)

        this.headMC.source = vo.thumbRound
        this.typeMC.source = vo.typeIcon


        var addExp = 0
        if(this.data.type == 1)
        {
            this.headBG.source = 'leader_item_bg1_png'
            addExp = 50;
        }
        else if(this.data.type == 2)
        {
            this.headBG.source = 'leader_item_bg2_png'
            addExp = 150;
        }
        else
        {
            this.headBG.source = 'leader_item_bg3_png'
            addExp = 300;

        }

        this.expText.text = '经验 +' + addExp

        var level = UM.getLeaderLevel(vo.id)
        var level2 = UM.getLeaderLevel(vo.id,addExp)

        this.leaderText.text = '+' + level;
        this.leaderText.textColor = UM.getLeaderWorldColor(vo.mtype)

        var currentExp = UM.getLeaderExp(vo.id);
        var levelExp = UM.getLeaderExpByLevel(level);
        var nextExp = UM.getLeaderExp(level + 1);

        if(level >= TecManager.getInstance().maxLevel)
        {
            this.barMC1.rotation = 0;
        }
        else
        {
            this.barMC1.rotation = 180 + (currentExp-nextExp)/(nextExp - nextExp)*180;
            this.barMC1.rotation = 180 + 0.5*180;
            if(level == level2)
            {
                this.barMC0.rotation = 180 + (currentExp-nextExp + addExp)/(nextExp - nextExp)*180;
            }
            else
            {
                this.barMC0.rotation = 0
            }
        }
    }

    public renewChoose(){
        var b = LeaderMainUI.getInstance().selectArr.indexOf(this.data.id) != -1;
        this.currentState = b?'selected':'normal';
    }

}