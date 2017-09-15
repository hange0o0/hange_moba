class LeaderListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderListItemSkin";
    }

    private chooseMC: eui.Rect;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private upMC: eui.Image;
    private barMC2: eui.Rect;
    private barMC: eui.Rect;
    private rateText: eui.Label;
    private typeMC: eui.Image;






    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick);
    }

    private onClick(){
        MonsterList.getInstance().showID(this.data.id);
    }



    public dataChanged(){
        var vo = this.data.vo;
        //var str = ''
        this.typeMC.source = vo.typeIcon;
        //switch(vo.mtype)
        //{
        //    case 1:
        //        str +=this.createHtml('攻',UM.getLeaderWorldColor(1))
        //        break;
        //    case 2:
        //        str +=this.createHtml('血',UM.getLeaderWorldColor(2))
        //        break;
        //    case 3:
        //        str +=this.createHtml('速',UM.getLeaderWorldColor(3))
        //        break;
        //}
        //str +=  ' ' + vo.name;
        this.setHtml(this.nameText,vo.name);

        var level = UM.getLeaderLevel(vo.id)
        var currentExp = UM.getLeaderExp(vo.id);
        var levelExp = UM.getLeaderExpByLevel(level);
        var nextExp = UM.getLeaderExpByLevel(level + 1);

        this.levelText.text = '+' + level;
        this.upMC.visible = false
        this.barMC2.visible = false

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
            var add = LeaderStudyUI.getInstance().addExp[vo.id] || 0;
            this.barMC2.width = w * Math.min(1,(t0 + add)/t1)

            this.barMC2.visible = true
            this.upMC.visible = (t0 + add) >= t1
        }
        this.renewSelect();
    }

    public renewSelect(){
        var b = LeaderStudyUI.getInstance().selectArr.indexOf(this.data.id) != -1;
        this.chooseMC.visible = b;
    }
}