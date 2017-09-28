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
    private hardText: eui.Label;
    private mainGroup: eui.Group;
    private forceGroup: eui.Group;
    private forceText: eui.Label;
    private coinGroup: eui.Group;
    private coinRect: eui.Rect;
    private moneyText: eui.Label;
    private enemyList: eui.List;
    private leaderText: eui.Label;
    private myCardGroup: MyCardGroupUI;
    private historyList: eui.List;
    private resetBtn: eui.Button;
    private chooseBtn0: eui.Button;














    public enemyArray;
    public isHard = false;

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
        //this.addBtnEvent(this.forceGroup, this.onTips);


        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.historyList.itemRenderer =  DayLogItem2;
        this.scroller.bounces = false;


        //this.enemyList.add
        this.addBtnEvent(this.helpBtn,this.onHelp);
        this.addBtnEvent(this.resetBtn, this.onReset);
        //this.addBtnEvent(this.logBtn, this.onLog);
        this.historyList.addEventListener('use_card',this.onUseHistory,this)
    }

    private onUseHistory(e){
        var list = e.data
        this.onChoose1();
        PKDressUI.getInstance().changeChooseList(list)
    }


    private onReset(){
        PKManager.getInstance().reChooseMyCard()
    }

    //private onTips(){
    //    //this.forceRedMC.visible = false;
    //    SharedObjectManager.instance.setMyValue('main_force_red',MainGameManager.getInstance().getAwardForce());
    //    var myForce = UM.getForce();
    //    var enemyForce = MainGameManager.getInstance().getMainForce()
    //    var awardForce = MainGameManager.getInstance().getAwardForce()
    //    if(myForce > enemyForce)
    //        var myForceStr = this.createHtml(myForce,0xFF0000)
    //    else
    //        var myForceStr = myForce + ''
    //    Alert('通关时若我方战力[不高于]关卡战力\n则获得 ['+awardForce+'点] 战力奖励！\n　　[当前我方战力：]'+myForceStr+']\n　　[本关敌方战力：]'+enemyForce+'\n\n注：使用贿赂技能后[不能]获得奖励',null,'知道了')
    //}


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

    public show(isHard?){
        var self = this
        this.isHard = isHard;
        var level = isHard?UM.main_game.hlevel+1:UM.main_game.level+1
        MainGameManager.getInstance().loadCache(level,function(){
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
            this.setHtml(this.moneyText, '<font color="#ff0000">' + cost + ' </font>');
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
        var level = this.isHard?UM.main_game.hlevel+1:UM.main_game.level+1
        var arr = MainGameVO.getObject(level).list;
        var killNum = 0;
        var fight = MM.getMainForce(level);
        var lv = MM.getMainMonsterLevel(level);
        var leader = MonsterManager.getInstance().getEnemyMonsterLeader(fight);
        if(leader)
            MyTool.setColorText(this.leaderText,'[统\n帅\n▼]\n'+ leader);
        else
            this.leaderText.text = '';
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            if(!this.isHard && MM.isKill(i))
            {
                killNum ++;
                continue;
            }
            enemyList.push({
                vo: MonsterVO.getObject(id),
                isMain:!this.isHard,
                isTeam:true,

                id: id,
                specialData: {
                    isNPC:true,
                    fight:fight,
                    leader:leader,
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

        if(this.isHard)
        {
            this.hardText.visible = true;
            this.mainGroup.visible = false;

            var hardData = MM.getHardValue(level)
            var temp = []
            temp.push('[战力:]' + hardData.force)
            temp.push('[卡兵:]LV.' + hardData.level)
            if(UM.main_game.level >= Config.leaderLevel)
                temp.push('[统帅:]LV.' + hardData.leader)
            if(UM.main_game.level >= Config.leaderSkillLevel && level < Config.leaderSkillLevel)
                temp.push('[禁队技]')
            MyTool.setColorText(this.hardText,'限制=> ' + temp.join('　'));
        }
        else
        {
            this.hardText.visible = false;
            this.mainGroup.visible = true;
        }


        return enemyList;
    }

    public onShow(){
        GuideManager.getInstance().enableScrollV(this.scroller);
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);
        if(this.isHard)
            this.topUI.setTitle('精英挑战-第'+(UM.main_game.hlevel+1)+'关');
        else
            this.topUI.setTitle('公会评定-第'+(UM.main_game.level+1)+'关');



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
        //this.awardForceText.text = '+' + awardForce
        //MyTool.changeGray(this.awardMC,enemyForce<myForce);
        if(enemyForce < myForce)
            str += this.createHtml('(+'+(myForce - enemyForce)+')',0x00cc00)
        else if(enemyForce > myForce)
            str += this.createHtml('(-'+(enemyForce-myForce)+')',0xCC0000)

        MyTool.setColorText(this.forceText,str)

        //this.forceRedMC.visible = enemyForce >= myForce && (SharedObjectManager.instance.getMyValue('main_force_red') || 0) <awardForce

        if(this.isHard)
        {
            var hardData = MainGameManager.getInstance().getHardValue();
            this.myCardGroup.renew({hardData:hardData});
        }
        else
            this.myCardGroup.renew();
    }
    private renewHistory(){
        var arr = MainGameManager.getInstance().logList;
        var list = [];
        var level = this.isHard?UM.main_game.hlevel:UM.main_game.level
        for(var i=0;i<arr.length;i++)
        {
            var data = arr[i];
             if(data.sp.round == level && data.sp.hard == this.isHard)
                list.push(data)
        }
        if(list.length > 5)
            list.length = 5;
        this.historyList.dataProvider = new eui.ArrayCollection(list);
    }

    private onChoose1(){
        //this.hide();
        var oo:any = {pktype:PKManager.PKType.MAIN,data:UM.pk_common.my_card,enemy: this.enemyArray,hard:this.isHard,hardData:null}
        if(this.isHard)
        {
            oo.hardData = MainGameManager.getInstance().getHardValue(UM.main_game.hlevel+1);
            oo.noSkill = UM.main_game.hlevel < Config.leaderSkillLevel;
        }
        PKDressUI.getInstance().show(oo)

    }

}