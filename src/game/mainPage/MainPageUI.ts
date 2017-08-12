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


    private bg: eui.Image;
    private bottomMV: eui.Image;
    private starGroup: eui.Group;
    private scrollGroup: eui.Group;
    private mainGame: MainMainItem;
    private dayGame: MainDayItem;
    private mapGame: MainMapItem;
    private serverGame: MainServerItem;
    private serverGameEqual: MainServerEqualItem;
    private helpGroup: eui.Group;
    private helpMask: eui.Rect;
    private helpText: eui.Label;
    private setBtn: eui.Group;
    private helpBtn: eui.Group;
    private videoBtn: eui.Group;
    private team: eui.Group;
    private teamLockMC: eui.Image;
    private leaderBtn: eui.Group;
    private leaderRed: eui.Image;
    private leaderLockMC: eui.Image;
    private rankBtn: eui.Group;
    private rankRed: eui.Image;
    private collectBtn: eui.Group;
    private collectRed: eui.Image;
    private friendBtn: eui.Group;
    private friendRed: eui.Image;
    private friendLockMC: eui.Image;
    private bagBtn: eui.Group;
    private headMC: eui.Image;
    private honorRed: eui.Image;
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
    private diamonDrawBtn: eui.Group;
    private diamondDrawLight: eui.Image;
    private diamonDrawText: eui.Label;
    private mainTask: MainTaskUI;
    private page0: MainPageItem;
    private page1: MainPageItem;
    private page2: MainPageItem;
    private page3: MainPageItem;
    private page4: MainPageItem;





















    private bgTW

    private itemX = 320
    private itemY = 300

    private gameItems = [];
    private pageArray = [];
    private startPos;
    public currentPage= 0;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.headMC, this.onHead);

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
        this.addBtnEvent(this.leaderBtn, this.onLeader);
        this.addBtnEvent(this.rankBtn, this.onRank);
        this.addBtnEvent(this.team, this.onTeam);
        this.addBtnEvent(this.diamonDrawBtn, this.onDraw);


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
        EM.addEvent(GameEvent.client.change_head,this.renewTop,this);
        EM.addEvent(GameEvent.client.pk_end,this.scrollToCurrentPage,this);
        EM.addEvent(GameEvent.client.get_card,this.scrollToCurrentPage,this);
        EM.addEvent(GameEvent.client.energy_change,this.scrollToCurrentPage,this);
        EM.addEvent(GameEvent.client.main_level_change,this.onMainLevelChange,this);


        EM.addEvent(GameEvent.client.monster_level_change,this.renewCollectRed,this);
        EM.addEvent(GameEvent.client.card_change,this.renewCollectRed,this);
        EM.addEvent(GameEvent.client.coin_change,this.renewCollectRed,this);


        //任务相关
        EM.addEvent(GameEvent.client.task_change,this.renewTask,this);
        EM.addEvent(GameEvent.client.force_change,this.renewTask,this);
        EM.addEvent(GameEvent.client.pk_end,this.renewTask,this);
        EM.addEvent(GameEvent.client.monster_level_change,this.renewTask,this);


        EM.addEvent(GameEvent.client.honor_change,this.renewHonorRed,this);
        EM.addEvent(GameEvent.client.word_change,this.renewHonorRed,this);

        EM.addEvent(GameEvent.client.friend_red_change,this.renewFriendRed,this);




        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this)
        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this,true)

        //this.guideText.addEventListener(egret.TextEvent.LINK,this.onTextLink,this)
        //this.guideText.touchEnabled =  true


        this.helpText.mask = this.helpMask;

        for(var i=0;i<=4;i++)
        {
            var mc = this['page'+i]
            mc.index = i;
            this.pageArray.push(mc);
        }

        this.leaderRed.visible = false


        this.gameItems.push(this.mainGame);
        this.gameItems.push(this.dayGame);
        this.gameItems.push(this.mapGame);
        this.gameItems.push(this.serverGame);
        this.gameItems.push(this.serverGameEqual);
        for(var i=0;i<this.gameItems.length;i++)
        {
            var item = this.gameItems[i];
            item.visible = false;
            item.index = i;
            item.anchorOffsetX = 320;
            item.anchorOffsetY = 300;
            item.x = this.itemX
            item.y = this.itemY
        }

        this.bg.width = 1280+640
        this.bg.x = 0;
        var tw = this.bgTW = egret.Tween.get(this.bg,{loop:true});
        tw.to({x:-1280},1000*300).to({x:0})
    }

    public onVisibleChange(){
        this.bgTW.setPaused(!this.visible)
    }

    //private onTextLink(e){
    //    console.log(e.text);
    //}
    //
    //private renewGuideText(){
    //    if(GuideManager.getInstance().isGuiding)
    //    {
    //        this.guideText.text = ''
    //        return
    //    }
    //    this.guideText.textFlow = <Array<egret.ITextElement>>TaskManager.getInstance().getTaskText();
    //
    //    //    [
    //    //    {text: "任务12345\n", style: {"underline": true,href:'event:123'}},
    //    //    {text: "任务12345", style: {"underline": true,href:'event:456'}}
    //    //];
    //}


    private onDraw(){
        if(UM.getNextDrawCD())
        {
            return;
        }
        DrawUI.getInstance().show();
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
        if(!UM.word)
        {
            this.honorRed.visible =  true;
            return
        }
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

    private onPassDay(){
        this.rankRed.visible = true;
    }

    private onTimer(){
        var cd = UM.getNextDrawCD()
        var b = cd <= 0;
        if(b != this.diamondDrawLight.visible)
        {
            this.diamondDrawLight.visible = b;
            egret.Tween.removeTweens(this.diamondDrawLight)
            if(b)
            {
                var tw = egret.Tween.get(this.diamondDrawLight,{loop:true})
                this.diamondDrawLight.alpha = 0;
                tw.to({alpha:0.6},1000).to({alpha:0},1000).wait(1000);
            }

        }
        if(cd)
            this.diamonDrawText.text = DateUtil.getStringBySecond(cd);
        else
            this.diamonDrawText.text = '可翻牌'

        this.renewEnergy();

        if(this.parent.getChildIndex(this) == this.parent.numChildren - 1)
        {
            this.addStar();
            egret.setTimeout(this.addStar,this,500);

            //if(!this.bottomMV.visible && Math.random() < 0.2 && (egret.getTimer() - this.bottomMV['playTimer']) > 5*1000)
            //    this.playerBottomMV();
        }
    }

    //private playerBottomMV(){
    //    this.bottomMV['playTimer'] = egret.getTimer();
    //    this.bottomMV.visible = true
    //    egret.Tween.removeTweens(this.bottomMV);
    //    this.bottomMV.alpha = 0;
    //    this.bottomMV.x = Math.random()*640 - 320;
    //    var tw = egret.Tween.get(this.bottomMV)
    //    tw.to({alpha:Math.random() * 0.3 + 0.2},1000 + Math.random() * 500).to({alpha:0},1000 + Math.random() * 500).call(function(){
    //        this.bottomMV.visible = false
    //    },this);
    //}

    private addStar(){
        if(Math.random()<0.2) { //流星
            var p = {
                x:Math.random()*320 + 20,
                y:Math.random()*120 + 60
            };
            AniManager.getInstance().showStar2(this.starGroup, p)
        }
        //else if(Math.random()<0.1) { //闪电
        //    var p = {
        //        x:Math.random()*(640) - 60,
        //        y:0
        //    };
        //    AniManager.getInstance().showFlash(this.starGroup, p)
        //}
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
            case 2:
                DayLogUI.getInstance().show(MapManager.getInstance().logList,'挑战日志');
                break;
            case 1:

                PM.playBack(PKManager.PKType.DAY,function(){
                    DayLogUI.getInstance().show(DayGameManager.getInstance().logList,'研究院挑战日志');
                });
                break;
            case 3:

                PM.playBack(PKManager.PKType.SERVER,function(){
                    DayLogUI.getInstance().show(ServerGameManager.getInstance().logList,'竞技场挑战日志');
                });
                break;
            case 4:

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
            case 2:
                HM.mapHelp();
                break;
            case 1:
                HM.dayHelp();
                break;
            case 3:
                HM.serverHelp();
                break;
            case 4:
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



    private onHead(){
         MyInfoUI.getInstance().show();
    }


    private onFriend(){
        FriendListUI.getInstance().show();
    }
    private onCollect(){
        CollectUI.getInstance().show();
    }

    private onTeam(){
        TeamDungeonMain.getInstance().show();
    }
    private onRank(){
        this.rankRed.visible = false
        SharedObjectManager.instance.setMyValue('rank_red',TM.now())
        RankUI.getInstance().show();

    }
    private onLeader(){
        Alert('领队系统尚未开放')
    }


    public onShow(){
        this.currentPage = SharedObjectManager.instance.getMyValue('main_page') || 0;
        GuideManager.getInstance().isGuiding = UM.exp == 0 && UM.level == 1;
        FriendManager.getInstance().initFriend();
        MonsterManager.getInstance().initData();
        MainGameManager.getInstance().initData();
        DayGameManager.getInstance().initData();
        ServerGameManager.getInstance().initData();
        ServerGameEqualManager.getInstance().initData();
        MapManager.getInstance().initData();
        TeamPVEManager.getInstance().initData();
        TaskManager.getInstance().initData();
        PKManager.getInstance().initData();
        this.diamondDrawLight.visible = false;

        this.renewTop();

        this.renewHelp();
        this.renewPage();
        this.onLevelChange();//内含this.scrollToCurrentPage();

        this.renewMiddle();

        this.renewFriendRed();
        this.renewCollectRed();
        this.renewHonorRed();
        this.renewTask();

        this.rankRed.visible = !DateUtil.isSameDay(SharedObjectManager.instance.getMyValue('rank_red') || 0) && RankManager.getInstance().isRankOpen()

        this.mainTask.visible = !GuideManager.getInstance().isGuiding;
        this.helpGroup.visible = !GuideManager.getInstance().isGuiding;
        if(!GuideManager.getInstance().isGuiding && (!UM.active.task[1] || TaskVO.getObject(UM.active.task[1]).index < 2))
        {
            this.mainTask.showMV()//打开
        }


        egret.setTimeout(function() {
            MainPageUI.getInstance().renewPage();
            GuideManager.getInstance().guideStep = 0;
            GuideManager.getInstance().reInit();
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

        this.bottomMV.visible = false
        this.bottomMV['playTimer'] = 0;
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer);
        this.addPanelOpenEvent(GameEvent.client.pass_day,this.onPassDay);
        this.onTimer();
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
        this.teamLockMC.visible = UM.level < Config.friendLevel;
        this.renewPage();
        this.scrollToCurrentPage(true);
    }
    public onMainLevelChange(){
        this.renewPage();
        this.scrollToCurrentPage(true);
    }

    public renewEnergy(){
        var energy = UM.getEnergy();
        if(energy)
            this.energyText.text = energy + '/' + UM.maxEnergy;
        else
            this.setHtml(this.energyText,this.createHtml(DateUtil.getStringBySecond(UM.getNextEnergyCD()).substr(-5),0xFF0000));

    }

    public renewTask(){
        if(PKManager.getInstance().pkStartTime && egret.getTimer() - PKManager.getInstance().pkStartTime < 5*1000)
            return;
        this.mainTask.renew();
    }

    public renewHelp(){
        this.helpText.x = 360;
        this.setHtml(this.helpText,HelpManager.getInstance().getInfoText());
        egret.Tween.removeTweens(this.helpText);
        var tw:egret.Tween = egret.Tween.get(this.helpText);
        tw.to({x:-this.helpText.textWidth-100}, (this.helpText.textWidth + 360+100)*20).call(this.renewHelp,this);
    }

    public clickPage(page){
         if(this.currentPage == page)
            return;

        this.currentPage = page
        this.renewPage();
        this.scrollToCurrentPage();
    }

    public renewPage(){
        for(var i=0;i<this.pageArray.length;i++)
        {
            this.pageArray[i].dataChanged();
        }
    }

    //移出动画
    private movieOut(item){
        if(!item.visible)
            return
        egret.Tween.removeTweens(item);
        //item.scaleX =  item.scaleY = 1;
        //item.alpha = 1;
        //item.x = this.itemX;
        //item.y = this.itemY;
        //
        //var tw = egret.Tween.get(item);
        //tw.to({y:-600},300).call(function(){
        //    item.visible = false;
        //})

        item.scaleX =  item.scaleY = 1;
        item.alpha = 1;
        item.x = this.itemX;
        item.y = this.itemY;

        var pageItem = this.pageArray[item.index];
        var p = pageItem.localToGlobal(pageItem.width/2,pageItem.height/2)
        var p = item.parent.globalToLocal(p.x,p.y,p);
        var tw = egret.Tween.get(item);
        tw.to({x:p.x,y:p.y,alpha:0.8,scaleX:0.1,scaleY:0.1},300).call(function(){
            item.visible = false;
        })

    }
    //移入动画
    private movieIn(item){

        item.visible = false;
        egret.Tween.removeTweens(item);
        item.scaleX =  item.scaleY = 0.1;
        item.alpha = 0.8;
        item.parent.addChild(item);

        var pageItem = this.pageArray[item.index];
        var p = pageItem.localToGlobal(pageItem.width/2,pageItem.height/2)
        var p = item.parent.globalToLocal(p.x,p.y,p);

        item.x = p.x;
        item.y = p.y;

        var tw = egret.Tween.get(item);
        tw.call(function(){
            item.visible = true;
        }).to({x:this.itemX,y:this.itemY,alpha:1,scaleX:1,scaleY:1},300).call(function(){
            item.onShow()
        })
    }

    private changeAtOnce(){
        for(var i=0;i<this.gameItems.length;i++)
        {
            var item = this.gameItems[i];
            item.visible = this.currentPage == i
            egret.Tween.removeTweens(item);
            if(item.visible)
            {
                item.scaleX =  item.scaleY = 1;
                item.alpha = 1;
                item.x = this.itemX;
                item.y = this.itemY;
            }
        }
    }

    public scrollToCurrentPage(nomovie=false){
        egret.Tween.removeTweens(this.scrollGroup)
        this.scrollGroup.x = 0;
        SharedObjectManager.instance.setMyValue('main_page',this.currentPage);
        var pageSize = 320
        var targetX = -this.currentPage * pageSize;
        //this.scroller.viewport.scrollV = 0;


        if(nomovie)
        {
            this.changeAtOnce();
        }
        else
        {
            for(var i=0;i<this.gameItems.length;i++)
            {
                var item = this.gameItems[i];
                if(this.currentPage == i)
                    this.movieIn(item)
                else
                    this.movieOut(item)
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
                currentView = this.mapGame;
                this.videoBtn.visible = MapManager.getInstance().logList.length > 0;
                break;

            case 3:
                currentView = this.serverGame;
                this.videoBtn.visible = ServerGameManager.getInstance().logList.length > 0 || (UM.server_game.pkdata && UM.server_game.pkdata.version == Config.pk_version);
                break;
            case 4:
                currentView = this.serverGameEqual;
                this.videoBtn.visible = ServerGameEqualManager.getInstance().logList.length > 0 || (UM.server_game_equal.pkdata && UM.server_game_equal.pkdata.version == Config.pk_version);
                break;

        }
        if(currentView)
        {
            currentView.renew();
        }
    }

    //private playRankHead(){
    //    RankManager.getInstance().renewPageHead(this.topPlayerTips);
    //}

    private onBegin(e:egret.TouchEvent){
        if(GuideManager.getInstance().isGuiding)
            return;
        //if(this.scrollGroup.x>=0)
        //    return;
        //if(this.scrollGroup.x <= (-4 * 360))
        //    return;
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
            //if(this.scrollGroup.x>=0 && e.stageX-this.startPos.x > 0)
            //    return;
            //if(this.scrollGroup.x <= (-(this.gameItems.length - 1) * 640)  && e.stageX-this.startPos.x < 0)
            //    return;
            this.scrollGroup.x = this.startPos.tx + e.stageX-this.startPos.x;
            this.renewGameItemShow();
        }
    }

    private onEnd(e:egret.TouchEvent){
        this.scrollGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this)
        this.scrollGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this)
        if(Math.abs(this.scrollGroup.x - this.startPos.tx) > 150)//可翻页
        {
            if(this.scrollGroup.x > this.startPos.tx)//手指左移
            {
                if(this.currentPage > 0)
                {
                    this.scrollToCurrentPage2(this.currentPage - 1);
                    return;
                }
            }
            else
            {
                if(this.currentPage < this.pageArray.length - 1)
                {
                    this.scrollToCurrentPage2(this.currentPage + 1);
                    return;
                }
            }
        }

        this.scrollToCurrentPage2(this.currentPage);
    }

    //滚动后防止按钮事件被触发
    private onTouchTap(e:egret.TouchEvent){
        if(this.startPos && this.startPos.drag)
        {
            e.stopPropagation();
        }
    }

    public scrollToCurrentPage2(newPage) {

        egret.Tween.removeTweens(this.scrollGroup)
        var pageSize = 640
        var targetX = 0;
        if(newPage > this.currentPage)
        {
            targetX = - pageSize
        }
        else  if(newPage < this.currentPage)
        {
            targetX = pageSize
        }

        var tw:egret.Tween = egret.Tween.get(this.scrollGroup, {
            onChange: this.renewGameItemShow,
            onChangeObj: this
        });
        tw.to({x: targetX}, Math.abs(targetX - this.scrollGroup.x)/2).call(function(){
            this.currentPage = newPage;
            this.resetCurrentPage2();
            this.renewPage();
            SharedObjectManager.instance.setMyValue('main_page', this.currentPage);
        },this);
    }

    private resetCurrentPage2(){
        for(var i=0;i<this.gameItems.length;i++)
        {
            var item = this.gameItems[i]
            //item.visible = i==this.currentPage;
            item.x = this.itemX
            item.alpha=1;
            item.scaleX = item.scaleY = 1
        }

        egret.Tween.removeTweens(this.scrollGroup)
        this.scrollGroup.x = 0;
    }

    private renewGameItemShow(){
        //var start = Math.round(-this.scrollGroup.x/320);
        var item1 = this.gameItems[this.currentPage];
        var item2;
        var targetPos// = -start*320
        if(this.scrollGroup.x > 10)
        {
            item2 = this.gameItems[this.currentPage - 1];
            if(item2) {
                item2.x = this.itemX -640;
                item2.y = this.itemY;
                targetPos = 640
            }
        }
        else if(this.scrollGroup.x < -10)
        {
            item2 = this.gameItems[this.currentPage + 1];
            if(item2)
            {
                item2.x = this.itemX + 640;
                item2.y = this.itemY;
                targetPos = -640
            }

        }


        var rate = Math.abs(targetPos - this.scrollGroup.x)/640
        if(item1)
        {
            item1.visible = true
            //item1.scaleX = item1.scaleY = rate/2 + 0.5
            //item1.alpha = rate;
            if(!item1.haveRenew)
                item1.renew()
        }

        if(item2)
        {
            item2.visible = true
            //item2.scaleX = item2.scaleY = (1-rate)/2 + 0.5
            //item2.alpha = (1-rate);
            if(!item2.haveRenew)
                item2.renew()
        }
        for(var i=0;i<this.gameItems.length;i++)
        {
            if(this.gameItems[i] == item1)
                continue
            if(this.gameItems[i] == item2)
                continue
            this.gameItems[i].visible = false
        }

    }
}