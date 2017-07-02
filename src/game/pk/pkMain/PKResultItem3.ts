class PKResultItem3 extends game.BaseItem {
    public static VIEW_EVENT = 'monster_info'
    public constructor() {
        super();
        this.skinName = "PKResultItem3Skin";
    }

    private chooseMC: eui.Rect;
    private headMC: eui.Image;
    private s3: eui.Image;
    private s2: eui.Image;
    private s1: eui.Image;
    private levelText: eui.Label;

    //private dieText: eui.Label;




    public index = 0;
    public chooseType = 0;

    public childrenCreated() {
        this.addBtnEvent(this,this.onClose);
    }

    private onClose() {
        //if(this.chooseType == 1)
        //{
            MonsterList.getInstance().show(this.data.list,this.data.index)
        //    this.chooseMC.visible = false;
        //    this.chooseType = 0;
        //    this.dispatchEventWith(PKResultItem3.VIEW_EVENT,true,{});
        //}
        //else
        //    this.dispatchEventWith(PKResultItem3.VIEW_EVENT,true,this.data);
    }

    public dataChanged() {

        //mid:mid,
        //    level:team1Base.mb[mid].lv,
        //    win: PKM.winCount[i+team1ID]


        this.chooseMC.visible = false;
        this.chooseType = 0;


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

    public setChoose(type){
        this.chooseType = type;
        this.chooseMC.visible = type > 0;
        //if(type == 1)
        //    this.chooseMC.fillColor = 0xFFFF00
        //else if(type == 2)
        //    this.chooseMC.fillColor = 0xFF0000
        //else if(type == 3)
        //    this.chooseMC.fillColor = 0x00FFFF

    }
}
