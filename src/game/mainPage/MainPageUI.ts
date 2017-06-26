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


    private bottomMV: eui.Image;
    private starGroup: eui.Group;
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
    private scrollGroup: eui.Group;
    private mainGame: MainMainItem;
    private dayGame: MainDayItem;
    private mapGame: MainMapItem;
    private serverGame: MainServerItem;
    private serverGameEqual: MainServerEqualItem;
    private scroller: eui.Scroller;
    private scrollGroupCon: eui.Group;
    private p0: MainPageItem;
    private p1: MainPageItem;
    private p2: MainPageItem;
    private p3: MainPageItem;
    private p4: MainPageItem;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;
    private taskGroup: eui.Group;
    private taskMask: eui.Rect;
    private taskText: eui.Label;
    private setBtn: eui.Group;
    private helpBtn: eui.Group;
    private videoBtn: eui.Group;
    private team: eui.Group;
    private teamLockMC: eui.Image;
    private leaderBtn: eui.Group;
    private leaderRed: eui.Image;
    private leaderLockMC: eui.Image;
    private rankBtn: eui.Group;
    private collectBtn: eui.Group;
    private collectRed: eui.Image;
    private friendBtn: eui.Group;
    private friendRed: eui.Image;
    private friendLockMC: eui.Image;
    private bagBtn: eui.Group;
    private diamonDrawBtn: eui.Group;
    private diamondDrawLight: eui.Image;
    private diamonDrawText: eui.Label;
    private topPlayerTips: TopPlayerTips;



















    private gameItems = [];
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

        for(var i=0;i<=4;i++)
        {
            var mc = this['p'+i];
            this.pageArray.push(mc);
            this.addBtnEvent(mc,this.onPageClick)
        }


        //this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this)
        this.scrollGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this,true)

        this.topPlayerTips.hide();
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
            item.anchorOffsetX = 320;
            item.x = 320 + 320*i
        }
    }


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

            if(!this.bottomMV.visible && Math.random() < 0.2 && (egret.getTimer() - this.bottomMV['playTimer']) > 5*1000)
                this.playerBottomMV();

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

    private playerBottomMV(){
        this.bottomMV['playTimer'] = egret.getTimer();
        this.bottomMV.visible = true
        egret.Tween.removeTweens(this.bottomMV);
        this.bottomMV.alpha = 0;
        this.bottomMV.x = Math.random()*640 - 320;
        var tw = egret.Tween.get(this.bottomMV)
        tw.to({alpha:Math.random() * 0.3 + 0.2},1000 + Math.random() * 500).to({alpha:0},1000 + Math.random() * 500).call(function(){
            this.bottomMV.visible = false
        },this);
    }

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
            if(this.scrollGroup.x>=0 && e.stageX-this.startPos.x > 0)
                return;
            if(this.scrollGroup.x <= (-(this.gameItems.length - 1) * 320)  && e.stageX-this.startPos.x < 0)
                return;
            this.scrollGroup.x = this.startPos.tx + e.stageX-this.startPos.x;
            this.renewGameItemShow();
        }
    }

    private renewGameItemShow(){
        var start = Math.round(-this.scrollGroup.x/320);
        var item1 = this.gameItems[start];
        var item2;
        var targetPos = -start*320
        if(targetPos > this.scrollGroup.x + 10)
            item2 = this.gameItems[start + 1];
        else if(targetPos < this.scrollGroup.x - 10)
            item2 = this.gameItems[start - 1];


        var rate = 1 - Math.abs(targetPos - this.scrollGroup.x)/320
        if(item1)
        {
            item1.visible = true
            item1.scaleX = item1.scaleY = rate/2 + 0.5
            item1.alpha = rate;
        }

        if(item2)
        {
            item2.visible = true
            item2.scaleX = item2.scaleY = (1-rate)/2 + 0.5
            item2.alpha = (1-rate);
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
    //private onMap(){
    //    if(UM.main_game.level < Config.mapLevel)
    //    {
    //        Alert('你现在还实力还不适宜进入野外，赶快把实力提升到' + this.createHtml('卡士一阶',0xE0A44A)+'再来吧~')
    //        return;
    //    }
    //    MapUI.getInstance().show();
    //}

    private onTeam(){
        TeamDungeonMain.getInstance().show();
    }
    private onRank(){
        RankUI.getInstance().show();

    }
    private onLeader(){
        Alert('领队系统尚未开放')
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
        this.diamondDrawLight.visible = false;

        this.renewTop();

        this.renewTask();
        this.renewPage();
        this.onLevelChange();//内含this.scrollToCurrentPage();

        this.renewMiddle();

        this.renewFriendRed();
        this.renewCollectRed();
        this.renewHonorRed();

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
        this.scrollToCurrentPage(true);
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
            if(this.currentPage == i)
            {
                this.pageArray[i].data = true;
            }
            else
            {
                if(i==0 && !(UM.main_game.awardtime && DateUtil.isSameDay(UM.main_game.awardtime)))
                    this.pageArray[i].data = 'red';
                else if(i==2)
                {
                    var MD = MapData.getInstance();
                    if(MD.lastTime) {
                        MD.reInit();
                        var awardMax = MD.getAwardMax();
                        if (MD.bag >= awardMax)
                            this.pageArray[i].data = 'red';
                        else
                            this.pageArray[i].data = false;
                    } else
                        this.pageArray[i].data = false;
                }
                else
                    this.pageArray[i].data = false;
            }
        }
    }

    public scrollToCurrentPage(nomovie=false){
        SharedObjectManager.instance.setMyValue('main_page',this.currentPage);
        egret.Tween.removeTweens(this.scrollGroup)
        var pageSize = 320
        var targetX = -this.currentPage * pageSize;
        //this.scroller.viewport.scrollV = 0;
        if(nomovie)
        {
            this.scrollGroup.x = targetX;
            this.renewGameItemShow()
        }
        else if(this.scrollGroup.x != targetX)
        {
            var tw:egret.Tween = egret.Tween.get(this.scrollGroup,{onChange:this.renewGameItemShow,onChangeObj:this});
            //var lastPage =  Math.floor(Math.max(0,-this.scrollGroup.x)/pageSize);
            //var des = lastPage - this.currentPage
            //if(Math.abs(des) > 1)
            //{
            //    des > 0?des--:des++;
            //    this.scrollGroup.swapChildrenAt(this.currentPage,this.currentPage +des);
            //    targetX = -(this.currentPage+des) * pageSize;
            //    tw.to({x: targetX}, Math.min(200,200*Math.abs(targetX-this.scrollGroup.x)/pageSize)).call(function(){
            //        //this.scrollGroup.swapChildrenAt(this.currentPage,this.currentPage +des);
            //        //重新排序，保证一至
            //        this.scrollGroup.addChild(this.mainGame)
            //        this.scrollGroup.addChild(this.dayGame)
            //        this.scrollGroup.addChild(this.mapGame)
            //        this.scrollGroup.addChild(this.serverGame)
            //        this.scrollGroup.addChild(this.serverGameEqual)
            //        this.scrollToCurrentPage(true);
            //    },this);
            //}
            //else {
                tw.to({x: targetX}, Math.min(200 * Math.abs(targetX - this.scrollGroup.x) / pageSize));
            //}
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
            this.playHeadTime = Math.max(this.playHeadTime,egret.getTimer() + 5*1000);
        }
    }

    private playRankHead(){
        RankManager.getInstance().renewPageHead(this.topPlayerTips);
    }


}