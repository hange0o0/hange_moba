class MainPageUI extends game.BaseUI {
    private static instance:MainPageUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MainPageUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MainPageUISkin";
    }


    private starGroup: eui.Group;
    private headMC: eui.Image;
    private expBar: eui.Image;
    private nameText: eui.Label;
    private forceText: eui.Label;
    private levelText: eui.Label;
    private coinGroup: eui.Group;
    private coinText: eui.Label;
    private addCoinBtn: eui.Group;
    private energyGroup: eui.Group;
    private energyText: eui.Label;
    private addEnergyBtn: eui.Group;
    private diamondGroup: eui.Group;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Group;
    private cardGroup: eui.Group;
    private feeText: eui.Label;
    private addFreeBtn: eui.Group;
    private scrollGroup: eui.Group;
    private mainGame: MainMainItem;
    private dayGame: MainDayItem;
    private serverGame: MainServerItem;
    private serverGameEqual: MainServerEqualItem;
    private scroller: eui.Scroller;
    private scrollGroupCon: eui.Group;
    private p0: MainPageItem;
    private p1: MainPageItem;
    private p2: MainPageItem;
    private p3: MainPageItem;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;
    private taskGroup: eui.Group;
    private taskMask: eui.Rect;
    private taskText: eui.Label;
    private helpBtn: eui.Group;
    private setBtn: eui.Group;
    private videoBtn: eui.Group;
    private honorBtn: eui.Group;
    private honorRed: eui.Image;
    private rankBtn: eui.Group;
    private mapBtn: eui.Group;
    private collectBtn: eui.Group;
    private collectRed: eui.Image;
    private friendBtn: eui.Group;
    private friendRed: eui.Image;
    private friendLockMC: eui.Image;
    private mapLockMC: eui.Image;
    private bagBtn: eui.Group;













    private pageArray = [];
    private currentPage= 0;
    private startPos;
    private playHeadTime = 0;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.headMC, this.onHead);

        this.addBtnEvent(this.leftBtn, this.onLeft);
        this.addBtnEvent(this.rightBtn, this.onRight);
        this.addBtnEvent(this.coinGroup,this.onAddCoin);
        this.addBtnEvent(this.diamondGroup,this.onAddDiamond);
        this.addBtnEvent(this.energyGroup,this.onAddEnergy);
        this.addBtnEvent(this.cardGroup,this.onAddCard);


        this.addBtnEvent(this.videoBtn,this.onVideo);
        this.addBtnEvent(this.setBtn,this.onSet);
        this.addBtnEvent(this.helpBtn,this.onHelp);


        this.addBtnEvent(this.friendBtn, this.onFriend);
        this.addBtnEvent(this.collectBtn, this.onCollect);
        //this.addBtnEvent(this.bagBtn, this.onBag);
        this.addBtnEvent(this.honorBtn, this.onHonor);
        this.addBtnEvent(this.rankBtn, this.onRank);
        this.addBtnEvent(this.mapBtn, this.onMap);


        //this.addBtnEvent(this.img, this.onMain);
        //this.addBtnEvent(this.img, this.onServer);
        //this.addBtnEvent(this.img, this.onServerEqual);
        //this.addBtnEvent(this.img, this.onDay);

        EM.addEvent(GameEvent.client.card_change,this.renewCard,this);
        EM.addEvent(GameEvent.client.coin_change,this.renewCoin,this);
        EM.addEvent(GameEvent.client.diamond_change,this.renewDiamond,this);
        EM.addEvent(GameEvent.client.force_change,this.renewForce,this);
        EM.addEvent(GameEvent.client.exp_change,this.renewExp,this);
        EM.addEvent(GameEvent.client.level_change,this.onLevelChange,this);
        EM.addEvent(GameEvent.client.energy_change,this.renewEnergy,this);
        EM.addEvent(GameEvent.client.task_change,this.renewTask,this);
        EM.addEvent(GameEvent.client.change_head,this.renewTop,this);
        EM.addEvent(GameEvent.client.pk_start,this.scrollToCurrentPage,this);
        EM.addEvent(GameEvent.client.get_card,this.scrollToCurrentPage,this);
        EM.addEvent(GameEvent.client.energy_change,this.scrollToCurrentPage,this);


        EM.addEvent(GameEvent.client.monster_level_change,this.renewCollectRed,this);
        EM.addEvent(GameEvent.client.card_change,this.renewCollectRed,this);
        EM.addEvent(GameEvent.client.coin_change,this.renewCollectRed,this);


        EM.addEvent(GameEvent.client.honor_change,this.renewHonorRed,this);

        EM.addEvent(GameEvent.client.friend_red_change,this.renewFriendRed,this);




        this.taskText.mask = this.taskMask;

        for(var i=0;i<=3;i++)
        {
            var mc = this['p'+i];
            this.pageArray.push(mc);
            this.addBtnEvent(mc,this.onPageClick)
        }


        //this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this)
        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this,true)

    }


    private renewCollectRed(){
        var mdata = CM.table[MonsterVO.dataKey];
        for(var s in mdata)
        {
            var vo = mdata[s];
            if(vo.level<= UM.level && vo.canLevelUp())
            {
                this.collectRed.visible = true;
                 return
            }
        }
        this.collectRed.visible = false;
    }

    private renewHonorRed(){
        if(UM.honor.monster)
        {
            for(var s in UM.honor.monster)
            {
                var oo = UM.honor.monster[s]
                var awardLevel = oo.a || 0; //已领奖的等级
                if(awardLevel == 5)
                    continue;
                var num = HonorManager.getInstance().awardBase[awardLevel + 1].num
                if(oo.w >= num)
                {
                    this.honorRed.visible =  true;
                    return
                }
            }
            this.honorRed.visible =  false;
        }
        else
            this.honorRed.visible =  UM.honor.isred;
    }
    private renewFriendRed(){
        var FM = FriendManager.getInstance();
        this.friendRed.visible = FM.friendRed();
    }

    private onTimer(){
        this.renewEnergy();

        if(this.parent.getChildIndex(this) == this.parent.numChildren - 1)
        {
            this.addStar();
            egret.setTimeout(this.addStar,this,500);

            if(egret.getTimer() > this.playHeadTime){
                this.playHeadTime = egret.getTimer() + 20*1000
                this.playRankHead();
            }
        }
        else if(egret.getTimer() > this.playHeadTime-5*1000)
        {
            this.playHeadTime = egret.getTimer() + 5*1000;
        }
    }

    private addStar(){
        if(Math.random()<0.1) {
            var p = {
                x:Math.random()*320 + 20,
                y:Math.random()*120 + 60
            };
            AniManager.getInstance().showStar2(this.starGroup, p)
        }
        else
        {
            var p = {
                x:Math.random()*600 + 20,
                y:Math.random()*160 + 20
            };
            AniManager.getInstance().showStar1(this.starGroup,p)
        }


    }
    
    private onVideo(){
        var PM = PKManager.getInstance()
        switch(this.currentPage)
        {
            case 0:
                PM.playBack(PKManager.PKType.MAIN,function(){
                    DayLogUI.getInstance().show(MainGameManager.getInstance().logList,'进阶挑战日志');
                });

                break;
            case 1:

                PM.playBack(PKManager.PKType.DAY,function(){
                    DayLogUI.getInstance().show(DayGameManager.getInstance().logList,'研究院挑战日志');
                });
                break;
            case 2:

                PM.playBack(PKManager.PKType.SERVER,function(){
                    DayLogUI.getInstance().show(ServerGameManager.getInstance().logList,'竞技场挑战日志');
                });
                break;
            case 3:

                PM.playBack(PKManager.PKType.SERVER_EQUAL,function(){
                    DayLogUI.getInstance().show(ServerGameEqualManager.getInstance().logList,'修正场挑战日志');
                });
                break;
        }
    }

    private onHelp(){
        //GuideUI.getInstance().show(null,'friend')
        //return;
        var HM = HelpManager.getInstance()
        switch(this.currentPage)
        {
            case 0:
                HM.mainHelp();
                break;
            case 1:
                HM.dayHelp();
                break;
            case 2:
                HM.serverHelp();
                break;
            case 3:
                HM.serverEqualHelp();
                break;
        }
    }

    private onSet(){
        SettingUI.getInstance().show();
    }
    private onAddCoin(){
        ShopUI.getInstance().show('coin');
    }

    private onAddDiamond() {
        ShopUI.getInstance().show('diamond');
    }
    
    private onAddEnergy() {
        ShopUI.getInstance().show('energy');
    }
    private onAddCard() {
        ShopUI.getInstance().show('card');
    }


    private onPageClick(e){
        for(var i=0;i<=this.pageArray.length;i++)
        {
            var mc = this.pageArray[i];
            if(mc == e.currentTarget)
            {
                if(i != this.currentPage)
                {
                    //var noMV = Math.abs(i - this.currentPage)>1
                    this.currentPage = i;
                    this.scrollToCurrentPage();
                    this.renewPage();
                }
                break;
            }
        }
    }

    private onBegin(e:egret.TouchEvent){
        if(GuideManager.getInstance().isGuiding)
            return;
        //if(this.scroller.viewport.contentHeight > this.scroller.viewport.height)//有垂直滚动
        //{
        //    return;
        //}

        this.scrollGroup.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
        this.scrollGroup.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)

        this.startPos = {x:e.stageX,tx:this.scrollGroup.x};

    }

    private onMove(e:egret.TouchEvent){
        if(!this.startPos.drag)
        {
            if(Math.abs(e.stageX - this.startPos.x) > 10)
            {
                this.startPos.drag = true;
            }
        }
        if(this.startPos.drag)
        {
            this.scrollGroup.x = this.startPos.tx + e.stageX-this.startPos.x;
        }
    }

    private onEnd(e:egret.TouchEvent){
        this.scrollGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
        this.scrollGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)
        if(Math.abs(this.scrollGroup.x - this.startPos.tx) > 150)//可翻页
        {
            if(this.scrollGroup.x > this.startPos.tx)//右移
            {
                this.onLeft();
            }
            else
            {
                this.onRight();
            }

        }
        else
        {
            this.scrollToCurrentPage();
        }

    }

    //滚动后防止按钮事件被触发
    private onTouchTap(e:egret.TouchEvent){
        if(this.startPos && this.startPos.drag)
        {
            e.stopPropagation();
        }
    }



    private onHead(){
         MyInfoUI.getInstance().show();
    }
    private onLeft(){
        if(this.currentPage > 0)
            this.currentPage --;
        this.scrollToCurrentPage();
        this.renewPage();
    }
    private onRight(){
        if(this.currentPage < this.pageArray.length - 1)
            this.currentPage ++;
        this.scrollToCurrentPage();
        this.renewPage();
    }


    private onFriend(){
        FriendListUI.getInstance().show();
    }
    private onCollect(){
        CollectUI.getInstance().show();
    }
    //private onBag(){
    //    BagUI.getInstance().show();
    //
    //}
    private onMap(){
        if(UM.main_game.level < Config.mapLevel)
        {
            Alert('你现在还实力还不适宜进入野外，赶快把实力提升到' + this.createHtml('卡士一阶',0xE0A44A)+'再来吧~')
            return;
        }
        MapUI.getInstance().show();
    }

    private onHonor(){
        HonorUI.getInstance().show();

    }
    private onRank(){
        RankUI.getInstance().show();

    }
    //private onTec(){
    //    TecUI.getInstance().show();
    //
    //}


    //private onMain(){
    //    SoundManager.getInstance().playEffect(SoundConfig.effect_join);
    //    MainGameUI.getInstance().show();
    //
    //}
    //private onServer(){
    //    SoundManager.getInstance().playEffect(SoundConfig.effect_join);
    //    ServerGameUI.getInstance().show();
    //
    //}
    //private onServerEqual(){
    //    SoundManager.getInstance().playEffect(SoundConfig.effect_join);
    //    ServerGameEqualUI.getInstance().show();
    //
    //}
    //private onDay(){
    //    SoundManager.getInstance().playEffect(SoundConfig.effect_join);
    //    DayGameUI.getInstance().show();
    //
    //}

    public onShow(){
        GuideManager.getInstance().isGuiding = UM.exp == 0 && UM.level == 1;
        FriendManager.getInstance().initFriend();
        MonsterManager.getInstance().initData();
        MainGameManager.getInstance().initData();
        DayGameManager.getInstance().initData();
        ServerGameManager.getInstance().initData();
        ServerGameEqualManager.getInstance().initData();
        MapManager.getInstance().initData();

        this.renewTop();

        this.renewTask();
        this.renewPage();
        this.onLevelChange();//内含this.scrollToCurrentPage();

        this.renewMiddle();

        this.renewFriendRed();
        this.renewCollectRed();
        this.renewHonorRed();

        egret.setTimeout(function() {
            this.currentPage = 0;
            this.scrollToCurrentPage(true);
            MainPageUI.getInstance().renewPage();
            GuideManager.getInstance().guideStep = 0;
            GuideManager.getInstance().showGuide(MainPageUI.getInstance())
            if(!GuideManager.getInstance().isGuiding){
                if(!LoginManager.getInstance().logText.cb && LoginManager.getInstance().logText.text)
                    GameLogUI.getInstance().show(true);
                else
                {
                     MyCardTaskUI.getInstance().testShow();
                }
            }

        },this,300);

        //GuideManager.getInstance().guideStep = 13;
        //MyTool.removeMC(PopUpManager.shape);
        //GuideManager.getInstance().showGuide(MainPageUI.getInstance())
        //MainPageUI.getInstance()['currentPage'] = 1;
        //MainPageUI.getInstance().scrollToCurrentPage();


        SoundManager.getInstance().playSound(SoundConfig.bg);
        egret.setTimeout(function(){
            RES.loadGroup("preload2_png",-10);//预加载第一阶段
            RES.loadGroup("preload2_jpg",-10);//预加载第一阶段
            RES.loadGroup("preload2_png32",-10);//预加载第一阶段
        },this,500)
        setTimeout(function(){
            SoundManager.getInstance().loadEffectSound();
        },1000)

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer);
    }

    public onGuide0(){
        //if(this.scroller.viewport.contentHeight > this.scroller.viewport.height)//有垂直滚动
        //{
        //    this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;
        //    this.scroller.validateNow();
        //}
    }

    public renewMiddle(){
        //this.scrollGroup.removeChildren();
        //this.scrollGroup.addChild(this.img);
        //if(true)
        //{
        //    this.scrollGroup.addChild(this.img);
        //}
    }


    public renewTop(){
        this.renewDiamond();
        this.renewForce();
        this.renewCoin();
        this.renewExp();
        this.renewEnergy();
        this.renewCard();

        this.nameText.text = UM.nick;
        this.headMC.source = MyTool.getHeadUrl(UM.head);
    }
    public renewDiamond(){
        this.diamondText.text = UM.getDiamond() + '';
    }
    public renewCard(){
        this.feeText.text = UM.card + '';
    }
    public renewForce(){
        this.forceText.text = UM.getForce() + '';
    }
    public renewCoin(){
        this.coinText.text = NumberUtil.addNumSeparator(UM.coin);
    }
    public renewExp(){
        this.expBar.scrollRect = new egret.Rectangle(0,0,Math.min(UM.exp/UM.next_exp,1)*640,6)
        this.levelText.text = UM.level + '';
    }

    public onLevelChange(){
        this.friendLockMC.visible = UM.level < Config.friendLevel;
        this.scrollToCurrentPage();
    }

    public renewEnergy(){
        var energy = UM.getEnergy();
        if(energy)
            this.energyText.text = energy + '/' + UM.maxEnergy;
        else
            this.setHtml(this.energyText,this.createHtml(DateUtil.getStringBySecond(UM.getNextEnergyCD()).substr(-5),0xFF0000));
        //if(UM.energy.v >= UM.maxEnergy) //full
        //    this.energyText.textColor = 0xF9D36C
        //else if(UM.energy.v == 0) //empty
        //    this.energyText.textColor = 0xFC8C8C
        //else
        //    this.energyText.textColor = 0xCCCCCC

    }

    public renewTask(){
        this.taskText.x = 560;
        this.setHtml(this.taskText,HelpManager.getInstance().getInfoText());
        egret.Tween.removeTweens(this.taskText);
        var tw:egret.Tween = egret.Tween.get(this.taskText);
        tw.to({x:-this.taskText.textWidth-100}, (this.taskText.textWidth + 560+100)*20).call(this.renewTask,this);
    }

    public renewPage(){
        if(this.currentPage == 0)
            this.leftBtn.visible = false;
        else
            this.leftBtn.visible = true;

        if(this.currentPage == this.pageArray.length - 1)
            this.rightBtn.visible = false;
        else
            this.rightBtn.visible = true;

        for(var i=0;i<this.pageArray.length;i++)
        {
            this.pageArray[i].data = this.currentPage == i;
        }
    }

    public scrollToCurrentPage(nomovie=false){
        this.mapLockMC.visible = UM.main_game.level < Config.mapLevel;
        egret.Tween.removeTweens(this.scrollGroup)
        var pageSize = 640
        var targetX = -this.currentPage * pageSize;
        //this.scroller.viewport.scrollV = 0;
        if(nomovie)
        {
            this.scrollGroup.x = targetX;
        }
        else if(this.scrollGroup.x != targetX)
        {
            var tw:egret.Tween = egret.Tween.get(this.scrollGroup);
            var lastPage =  Math.floor(Math.max(0,-this.scrollGroup.x)/pageSize);
            var des = lastPage - this.currentPage
            if(Math.abs(des) > 1)
            {
                des > 0?des--:des++;
                this.scrollGroup.swapChildrenAt(this.currentPage,this.currentPage +des);
                targetX = -(this.currentPage+des) * pageSize;
                tw.to({x: targetX}, Math.min(200,200*Math.abs(targetX-this.scrollGroup.x)/pageSize)).call(function(){
                    //this.scrollGroup.swapChildrenAt(this.currentPage,this.currentPage +des);
                    //重新排序，保证一至
                    this.scrollGroup.addChild(this.mainGame)
                    this.scrollGroup.addChild(this.dayGame)
                    this.scrollGroup.addChild(this.serverGame)
                    this.scrollGroup.addChild(this.serverGameEqual)
                    this.scrollToCurrentPage(true);
                },this);
            }
            else {
                tw.to({x: targetX}, Math.min(200, 200 * Math.abs(targetX - this.scrollGroup.x) / pageSize));
            }
        }
        var currentView;
        switch(this.currentPage)
        {
            case 0:
                currentView = this.mainGame;
                this.videoBtn.visible = MainGameManager.getInstance().logList.length > 0 || (UM.main_game.pkdata && UM.main_game.pkdata.version == Config.pk_version);
                break;
            case 1:
                currentView = this.dayGame;
                this.videoBtn.visible = DayGameManager.getInstance().logList.length > 0 || (UM.day_game.pkdata && UM.day_game.pkdata.version == Config.pk_version);
                break;
            case 2:
                currentView = this.serverGame;
                this.videoBtn.visible = ServerGameManager.getInstance().logList.length > 0 || (UM.server_game.pkdata && UM.server_game.pkdata.version == Config.pk_version);
                break;
            case 3:
                currentView = this.serverGameEqual;
                this.videoBtn.visible = ServerGameEqualManager.getInstance().logList.length > 0 || (UM.server_game_equal.pkdata && UM.server_game_equal.pkdata.version == Config.pk_version);
                break;

        }
        if(currentView)
        {
            currentView.renew();
            this.playHeadTime = Math.max(this.playHeadTime,egret.getTimer() + 5*1000);
        }
    }

    private playRankHead(){
        var currentView;
        switch(this.currentPage)
        {
            case 0:
                currentView = this.mainGame;
                break;
            case 1:
                currentView = this.dayGame;
                break;
            case 2:
                currentView = this.serverGame;
                break;
            case 3:
                currentView = this.serverGameEqual;
                break;
        }
        if(currentView)
        {
            RankManager.getInstance().renewPageHead(currentView.bgGroup,currentView.headMC,this.currentPage + 3);
        }
    }


}