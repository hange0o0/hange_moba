class PKResultItem3 extends game.BaseItem {
    public static VIEW_EVENT = 'monster_info'
    public constructor() {
        super();
        this.skinName = "PKResultItem3Skin";
    }

    private headMC: eui.Image;
    private chooseMC: eui.Rect;
    private killMC: eui.Rect;
    private s3: eui.Image;
    private s2: eui.Image;
    private s1: eui.Image;
    private levelText: eui.Label;
    private emptyMC: eui.Image;
    private dieTogether: eui.Image;



    //private dieText: eui.Label;




    public index = 0;
    public chooseType = 0;

    private downTimer = 0;

    public childrenCreated() {
        this.touchChildren = false;
        this.addBtnEvent(this,this.onClick);

        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDown, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onMouseUp, this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onMouseUp, this);
    }

    private onMouseDown(){
        this.downTimer = egret.getTimer();
        this.dispatchEventWith(PKResultItem3.VIEW_EVENT,true,this.data);
    }
    private onMouseUp(){
        //egret.callLater(function(){
            this.dispatchEventWith(PKResultItem3.VIEW_EVENT,true,{});
        //},this)

    }

    private onClick() {
        if(egret.getTimer() - this.downTimer > 400)
            return;
        MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    public dataChanged() {
        this.dieTogether.visible = false;
        if(!this.data)
        {
            this.levelText.text = ''
            this.chooseMC.visible = false;
            this.killMC.visible = false;
            this.headMC.visible = false;
            this.emptyMC.visible = true;
            this.touchChildren = this.touchEnabled = false;
            for(var i=0;i<3;i++)
            {
                this['s' + (i+1)].visible = false;
            }
            return;
        }

        //mid:mid,
        //    level:team1Base.mb[mid].lv,
        //    win: PKM.winCount[i+team1ID]

        this.touchChildren = this.touchEnabled = true;
        this.headMC.visible = true;
        this.emptyMC.visible = false;
        this.chooseMC.visible = false;
        this.killMC.visible = false;
        this.chooseType = 0;

        this.dieTogether.visible = this.data.totalDie
        if(this.data.level)
        {
            this.levelText.text = 'Lv' + this.data.level
        }
        else
        {
            if(this.data.showIndex)
            {
                this.levelText.text = '' + this.data.showIndex
            }
            else
            {
                this.levelText.text = ''
            }
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

    public setKillType(type){
        if(!type)
        {
            this.killMC.visible = false
            return;
        }
        this.killMC.visible = true
        if(type == 1)
            this.killMC.fillColor = 0xFFFF00
        else if(type == 2)
            this.killMC.fillColor = 0xFF0000
        else if(type == 3)
            this.killMC.fillColor = 0x00FFFF

    }
}
