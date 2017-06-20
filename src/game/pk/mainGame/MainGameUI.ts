class MainGameUI extends game.BaseUI {
    private static instance:MainGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MainGameUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private coinGroup: eui.Group;
    private moneyText: eui.Label;
    private enemyList: eui.List;
    private helpBtn: eui.Group;
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
        MainGameManager.getInstance().loadCache(UM.main_game.level,function(){
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
            this.setHtml(this.moneyText, '<font color="#ff0000">' + cost + '</font>/' + UM.coin);
        else
            this.moneyText.text = '' + cost + '/' + UM.coin;
    }

    public renewEnemy(){
        var MM = MainGameManager.getInstance();
        //更新敌人
        var specialData:any = {
            isNPC:true
        };
        var enemyList = this.enemyArray = [];
        var arr = MainGameVO.getObject(UM.main_game.level).list;
        var killNum = 0;
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
                specialData: specialData,

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
        this.topUI.setTitle('公会评定-第'+(UM.main_game.level)+'关');

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