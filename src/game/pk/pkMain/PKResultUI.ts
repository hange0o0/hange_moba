class PKResultUI extends game.BaseUI {
    private static instance:PKResultUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKResultUI();
        return this.instance;
    }

    private bg: eui.Rect;
    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private titleBG: eui.Image;
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

        this.selfText.stroke = 0
        this.enemyText.stroke = 0
        if(team1Base.f > team2Base.f)
            this.selfText.stroke = 1;
        else if(team1Base.f < team2Base.f)
            this.enemyText.stroke = 1;

        this.rateText.text = Math.max(1,Math.min(100,Math.round(PKM.winnerRate*100))) + '';
        if(PKM.isWin)
            this.rateText.textColor = 0x00FF00
        else
            this.rateText.textColor = 0xFF0000

        GuideManager.getInstance().showGuide(this);


        this.titleBG.y = 5;
        this.rateText.visible = false;
        this.rateText.y = -50;
        var tw:egret.Tween = egret.Tween.get(this.titleBG);
        tw.wait(300).to({y:55},200)
        var tw:egret.Tween = egret.Tween.get(this.rateText);
        tw.wait(450).call(function(){
            this.rateText.visible = true;
        },this).to({y:18},200)

    }
}