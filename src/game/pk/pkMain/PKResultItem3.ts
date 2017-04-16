class PKResultItem3 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItem3Skin";
    }

    private headMC: eui.Image;
    private s3: eui.Image;
    private s2: eui.Image;
    private s1: eui.Image;
    private levelText: eui.Label;
    //private dieText: eui.Label;




    public index = 0;

    public childrenCreated() {
        this.addBtnEvent(this,this.onClose);
    }

    private onClose() {
        MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    public dataChanged() {

        //mid:mid,
        //    level:team1Base.mb[mid].lv,
        //    win: PKM.winCount[i+team1ID]

        if(this.data.level)
        {
            this.levelText.text = 'Lv' + this.data.level
        }
        else
        {
            this.levelText.text = ''
        }

        var win = this.data.win || 0;
        for(var i=0;i<3;i++)
        {
            this['s' + (i+1)].visible = win > i;
        }

        //if(this.data.die)
        //    this.dieText.visible = this.data.die;
        if(this.data.die)
        {
            //MyTool.changeGray(this.headMC);
            this.headMC.source = MonsterVO.getObject(this.data.id).thumbGray;
        }
        else
        {
            this.headMC.source = MonsterVO.getObject(this.data.id).thumb;
        }



    }
}
