class MainGameUI extends game.BaseUI {
    private static instance:MainGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MainGameUI();
        return this.instance;
    }

    private topUI: TopUI;
    private helpBtn: eui.Group;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private forceGroup: eui.Group;
    private forceText: eui.Label;
    private awardGroup: eui.Group;
    private awardForceText: eui.Label;
    private forceRedMC: eui.Image;
    private coinGroup: eui.Group;
    private coinRect: eui.Rect;
    private moneyText: eui.Label;
    private enemyList: eui.List;
    private myCardGroup: MyCardGroupUI;
    private historyList: eui.List;
    private resetBtn: eui.Button;
    private chooseBtn0: eui.Button;










    public enemyArray;

    public constructor() {
        super();
        this.skinName = "MainGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('公会评定');
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.chooseBtn0, this.onChoose1);
        this.addBtnEvent(this.coinGroup, this.onCoin);
        this.addBtnEvent(this.forceGroup, this.onTips);


        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.historyList.itemRenderer =  DayLogItem;
        this.scroller.bounces = false;


        //this.enemyList.add
        this.addBtnEvent(this.helpBtn,this.onHelp);
        this.addBtnEvent(this.resetBtn, this.onReset);
        //this.addBtnEvent(this.logBtn, this.onLog);
    }


    private onReset(){
        PKManager.getInstance().reChooseMyCard()
    }

    private onTips(){
        this.forceRedMC.visible = false;
        SharedObjectManager.instance.setMyValue('main_force_red',true);
        var myForce = UM.getForce();
        var enemyForce = MainGameManager.getInstance().getMainForce()
        var awardForce = MainGameManager.getInstance().getAwardForce()
        Alert('通关时如果我方战力不高于关卡BOSS战力，则获得['+awardForce+'点]战力奖励！\n　我方战力：['+myForce+']\n　敌方战力：['+enemyForce+']\n(使用贿赂技能后不能获得战力奖励)',null,'知道了')
    }


    public scrollToEnd(){
      if(this.scroller.viewport.height < this.scroller.viewport.contentHeight)
            this.scroller.viewport.scrollV =  this.scroller.viewport.contentHeight -  this.scroller.viewport.height;
    }



    private onHelp(){
        HelpManager.getInstance().mainHelp();
    }

    public beforeHide(){
        this.clearList([this.enemyList])
    }

    private onCoin(){
        ShopUI.getInstance().show('coin');
    }

    public show(){
        var self = this
        MainGameManager.getInstance().loadCache(UM.main_game.level+1,function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();


        this.addPanelOpenEvent(GameEvent.client.main_kill,this.renewEnemy)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewSelf)
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewPrice)

        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.my_card_change,this.renewSelf);


    }

    public renewPrice(){
        var cost = MainGameManager.getInstance().getKillCost();
        if(cost > UM.coin)
            this.setHtml(this.moneyText, '<font color="#ff0000">' + cost + '</font>');
        else
            this.moneyText.text = '' + cost;
        this.coinRect.width = 130 * Math.min(1,cost/UM.coin);
    }

    public renewEnemy(){
        var MM = MainGameManager.getInstance();
        //更新敌人
        //var specialData:any = {
        //    isNPC:true
        //};
        var enemyList = this.enemyArray = [];
        var arr = MainGameVO.getObject(UM.main_game.level+1).list;
        var killNum = 0;
        var fight = MM.getMainForce();
        var lv = MM.getMainMonsterLevel();
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            if(MM.isKill(i))
            {
                killNum ++;
                continue;
            }
            enemyList.push({
                vo: MonsterVO.getObject(id),
                isMain:true,
                isTeam:true,

                id: id,
                specialData: {
                    isNPC:true,
                    fight:fight,
                    lv:lv,
                },

                index: i-killNum,

                list:enemyList
            });
        }
        if(enemyList.length == 1) {
            enemyList[0].noKill = true;
            this.moneyText.text = '该单位不能被贿赂'
        }
        else
            this.renewPrice();
        this.enemyList.dataProvider = new eui.ArrayCollection(enemyList);


        if(enemyList.length <4)
        {
            (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 0;
            (<eui.TileLayout>this.enemyList.layout).requestedRowCount = 1
        }
        else
        {
            (<eui.TileLayout>this.enemyList.layout).requestedRowCount = 2;
            if(enemyList.length ==4)
                (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 2
            else
                (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 3
        }


        return enemyList;
    }

    public onShow(){
        GuideManager.getInstance().enableScrollV(this.scroller);
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);
        this.topUI.setTitle('公会评定-第'+(UM.main_game.level+1)+'关');

        this.forceRedMC.visible = !SharedObjectManager.instance.getMyValue('main_force_red');

        this.renewEnemy();
        this.renewSelf();
        this.renewHistory();

        this.scroller.viewport.scrollV = 0;

        //if(GuideManager.getInstance().isGuiding)
        //{
        //    egret.callLater(function(){
        //        this.validateNow();
        //        this.once(egret.Event.ENTER_FRAME)
                GuideManager.getInstance().showGuide(this)
        //    },this)
        //
        //}

    }

    private renewSelf(){

        var enemyForce = MainGameManager.getInstance().getMainForce()
        var myForce = UM.getForce();
        var awardForce = MainGameManager.getInstance().getAwardForce()

        var str = '[关卡战力:]' + enemyForce;
        this.awardForceText.text = '+' + awardForce
        MyTool.changeGray(this.awardGroup,enemyForce<myForce);
        //if(enemyForce<myForce)
        //    str += this.createHtml(' 【+'+awardForce+'】',0x888888)
        //else
        //    str += this.createHtml(' 【+'+awardForce+'】',0xDDDD00)
        MyTool.setColorText(this.forceText,str)


        this.myCardGroup.renew();
    }
    private renewHistory(){
        var arr = MainGameManager.getInstance().logList;
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            var data = arr[i];
             if(data.sp.round == UM.main_game.level)
                list.push(data)
        }
        if(list.length > 5)
            list.length = 5;
        this.historyList.dataProvider = new eui.ArrayCollection(list);
    }

    private onChoose1(){
        //this.hide();
        PKDressUI.getInstance().show({pktype:'main_game',data:UM.pk_common.my_card,enemy: this.enemyArray})
    }

}