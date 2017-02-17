class PKResultItem3 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItem3Skin";
    }

    private headMC: eui.Image;
    private s3: eui.Image;
    private s2: eui.Image;
    private s1: eui.Image;
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private dieText: eui.Label;



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
        this.headMC.source = MonsterVO.getObject(this.data.id).thumb;
        if(this.data.level)
        {
            this.levelGroup.visible = true
            this.levelText.text = this.data.level
        }
        else
        {
            this.levelGroup.visible = false
        }

        var win = this.data.win || 0;
        for(var i=0;i<3;i++)
        {
            this['s' + (i+1)].visible = win > i;
        }

        //if(this.data.die)
            this.dieText.visible = this.data.die;

    }
}
