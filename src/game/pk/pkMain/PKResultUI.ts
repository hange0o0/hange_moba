class PKResultUI extends game.BaseUI {
    private static instance:PKResultUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKResultUI();
        return this.instance;
    }

    private bg: eui.Rect;
    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private moreGroup: eui.Group;
    private titleBG: eui.Group;
    private rateText: eui.Label;
    private selfList: eui.List;
    private selfText: eui.Label;
    private enemyList: eui.List;
    private enemyText: eui.Label;
    private list: eui.List;








    public constructor() {
        super();
        this.skinName = "PKResultUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);

        this.list.itemRenderer = PKResultItem2;
        this.enemyList.itemRenderer = PKResultItem3
        this.selfList.itemRenderer = PKResultItem3
    }


    public beforeHide(){
        this.clearList([this.list,this.enemyList,this.selfList])
    }

    private onClick(){

    }


    public show(){
        super.show();
    }

    public onShow() {
        PopUpManager.removeShape();
        this.scroller.visible = false;
        this.scroller.viewport.scrollV = 0;

        this.bg.visible = false;
        this.height = Math.min(GameManager.stage.stageHeight,960)
        this.y =  (GameManager.stage.stageHeight - this.height)/2


        MyTool.removeMC(PKWinUI.getInstance());
        MyTool.removeMC(PKFailUI.getInstance());
        var PKM = PKManager.getInstance();

        if(PKM.isWin)
        {
            this.addChild(PKWinUI.getInstance());
            PKWinUI.getInstance().renew();
            SoundManager.getInstance().playEffect(SoundConfig.pk_win);
        }
        else
        {
            this.addChild(PKFailUI.getInstance());
            PKFailUI.getInstance().renew();
            SoundManager.getInstance().playEffect(SoundConfig.pk_loss);
        }

        SoundManager.getInstance().playSound(SoundConfig.bg_pk_view);
    }

    public showBG(){
        this.bg.visible = true;
        this.bg.alpha = 0;
        var tw:egret.Tween = egret.Tween.get(this.bg);
        tw.to({alpha:0.8},300);
    }

    public hide(){
        super.hide();
        MainPageUI.getInstance().renewTask();
        SoundManager.getInstance().playSound(SoundConfig.bg);
        PKMainUI.getInstance().hide();
    }

    public showMore(item){
        var PKM = PKManager.getInstance();
        this.scrollGroup.addChildAt(item,0);
        this.scroller.visible = true;
        this.list.dataProvider = new eui.ArrayCollection(PKManager.getInstance().pkList);

        if(PKM.teamChange)
        {
            var team1Base = PKM.team2Base
            var team2Base = PKM.team1Base
            var team1ID = 30
            var team2ID = 10
        }
        else
        {
            var team1Base = PKM.team1Base
            var team2Base = PKM.team2Base
            var team1ID = 10
            var team2ID = 30
        }

        var arr = [];
        this.selfText.text = '我方战力：' +  team1Base.f;
        for(var i=0;i<team1Base.list.length;i++)
        {
            var mid = team1Base.list[i]
            var specialData = team1Base.mb[mid];
            arr.push({
                id:mid,
                list:arr,
                specialData:specialData,
                index:i,

                level:team1Base.mb[mid].lv,
                win: PKM.winCount[i+team1ID],
                die: PKM.die[i+team1ID],
                action: PKM.action[i+team1ID]
            })
        }
        this.selfList.dataProvider = new eui.ArrayCollection(arr)

        arr = [];
        this.enemyText.text = '敌方战力：' +  (team2Base.f || 0);
        for(var i=0;i<team2Base.list.length;i++)
        {
            var mid = team2Base.list[i]
            var specialData = team2Base.mb[mid];
            arr.push({
                id:mid,
                list:arr,
                specialData:specialData,
                index:i,

                level:team2Base.mb[mid].lv,
                win: PKM.winCount[i+team2ID],
                die: PKM.die[i+team2ID],
                action: PKM.action[i+team2ID]
            })
        }
        this.enemyList.dataProvider = new eui.ArrayCollection(arr)

        this.selfText.textColor = 0xFFFFFF
        this.enemyText.textColor = 0xFFFFFF
        if(team1Base.f > team2Base.f)
            this.selfText.textColor = 0xffff00
        else if(team1Base.f < team2Base.f)
            this.enemyText.textColor = 0xffff00

        this.rateText.text = Math.max(1,Math.min(100,Math.round(PKM.winnerRate*100))) + '';
        if(PKM.isWin)
            this.rateText.textColor = 0x00FF00
        else
            this.rateText.textColor = 0xFF0000


        GuideManager.getInstance().showGuide(this);
        this.moreGroup.alpha = 0;

        this.titleBG.y = 5;
        this.rateText.visible = false;
        this.rateText.alpha = 0;
        var tw:egret.Tween = egret.Tween.get(this.moreGroup);
        tw.to({alpha:1},300).call(function(){
            var tw:egret.Tween = egret.Tween.get(this.titleBG);
            tw.wait(300).to({y:55},200)
            var tw:egret.Tween = egret.Tween.get(this.rateText);
            tw.wait(450).call(function(){
                this.rateText.visible = true;
            },this).to({alpha:1},200)
        },this)






    }
}