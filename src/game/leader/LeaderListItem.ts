class LeaderListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderListItemSkin";
    }

    private chooseMC: eui.Rect;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private barMC: eui.Rect;
    private rateText: eui.Label;



    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick);
    }

    private onClick(){
        MonsterList.getInstance().showID(this.data.id);
    }



    public dataChanged(){
        var vo = this.data.vo;
        var str = ''
        switch(vo.mtype)
        {
            case 1:
                str +=this.createHtml('攻',UM.getLeaderWorldColor(1))
                break;
            case 2:
                str +=this.createHtml('血',UM.getLeaderWorldColor(2))
                break;
            case 3:
                str +=this.createHtml('速',UM.getLeaderWorldColor(3))
                break;
        }
        str +=  ' ' + vo.name;
        this.setHtml(this.nameText,str);

        var level = UM.getLeaderLevel(vo.id)
        var currentExp = UM.getLeaderExp(vo.id);
        var levelExp = UM.getLeaderExpByLevel(level);
        var nextExp = UM.getLeaderExpByLevel(level + 1);

        this.levelText.text = '+' + level;

        var w = 300;
        if(level >= TecManager.getInstance().maxLevel)
        {
            this.rateText.text = '已达上限';
            this.barMC.width = w
        }
        else
        {
            var t0 = (currentExp-levelExp);
            var t1 = nextExp - levelExp;
            this.barMC.width = w * t0/t1
            this.rateText.text = t0 + '/' +  t1
        }
        this.renewSelect();
    }

    public renewSelect(){
        this.chooseMC.visible = LeaderMainUI.getInstance().selectArr.indexOf(this.data.id) != -1;
    }
}