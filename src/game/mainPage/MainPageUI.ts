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


    private headMC: eui.Image;
    private expBar: eui.Image;
    private nameText: eui.Label;
    private forceText: eui.BitmapLabel;
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
    private scroller: eui.Scroller;
    private scrollGroupCon: eui.Group;
    private scrollGroup: eui.Group;
    private mainGame: MainMainItem;
    private dayGame: MainDayItem;
    private serverGame: MainServerItem;
    private serverGameEqual: MainServerEqualItem;
    private p0: MainPageItem;
    private p1: MainPageItem;
    private p2: MainPageItem;
    private p3: MainPageItem;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;
    private taskGroup: eui.Group;
    private taskText: eui.Label;
    private helpBtn: eui.Group;
    private videoBtn: eui.Group;
    private setBtn: eui.Group;
    private honorBtn: eui.Group;
    private honorRed: eui.Image;
    private rankBtn: eui.Group;
    private collectBtn: eui.Group;
    private collectRed: eui.Image;
    private friendBtn: eui.Group;
    private friendRed: eui.Image;
    private bagBtn: eui.Group;








    private pageArray = [];
    private currentPage= 0;
    private startPos;

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
        this.addBtnEvent(this.helpBtn,this.onHelp);


        this.addBtnEvent(this.friendBtn, this.onFriend);
        this.addBtnEvent(this.collectBtn, this.onCollect);
        this.addBtnEvent(this.bagBtn, this.onBag);
        this.addBtnEvent(this.honorBtn, this.onHonor);
        this.addBtnEvent(this.rankBtn, this.onRank);
        this.addBtnEvent(this.setBtn, this.onSetting);


        //this.addBtnEvent(this.img, this.onMain);
        //this.addBtnEvent(this.img, this.onServer);
        //this.addBtnEvent(this.img, this.onServerEqual);
        //this.addBtnEvent(this.img, this.onDay);

        EM.addEvent(GameEvent.client.card_change,this.renewCard,this);
        EM.addEvent(GameEvent.client.coin_change,this.renewCoin,this);
        EM.addEvent(GameEvent.client.diamond_change,this.renewDiamond,this);
        EM.addEvent(GameEvent.client.force_change,this.renewForce,this);
        EM.addEvent(GameEvent.client.exp_change,this.renewExp,this);
        EM.addEvent(GameEvent.client.level_change,this.renewExp,this);
        EM.addEvent(GameEvent.client.energy_change,this.renewEnergy,this);
        EM.addEvent(GameEvent.client.task_change,this.renewTask,this);
        EM.addEvent(GameEvent.client.change_head,this.renewTop,this);
        EM.addEvent(GameEvent.client.pk_start,this.scrollToCurrentPage,this);
        EM.addEvent(GameEvent.client.get_card,this.scrollToCurrentPage,this);


        EM.addEvent(GameEvent.client.monster_level_change,this.renewCollectRed,this);
        EM.addEvent(GameEvent.client.card_change,this.renewCollectRed,this);
        EM.addEvent(GameEvent.client.coin_change,this.renewCollectRed,this);


        EM.addEvent(GameEvent.client.honor_change,this.renewHonorRed,this);

        EM.addEvent(GameEvent.client.friend_red_change,this.renewFriendRed,this);

        EM.addEvent(GameEvent.client.timer,this.onTimer,this);



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
    }
    
    private onVideo(){
        var PM = PKManager.getInstance()
        switch(this.currentPage)
        {
            case 0:
                PM.playBack(PKManager.PKType.MAIN);
                break;
            case 1:
                PM.playBack(PKManager.PKType.DAY);
                break;
            case 2:
                PM.playBack(PKManager.PKType.SERVER);
                break;
            case 3:
                PM.playBack(PKManager.PKType.SERVER_EQUAL);
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
        if(this.scroller.viewport.contentHeight > this.scroller.viewport.height)//有垂直滚动
        {
            return;
        }

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
    private onBag(){
        BagUI.getInstance().show();

    }
    private onSetting(){
        SettingUI.getInstance().show();
    }

    private onHonor(){
        HonorUI.getInstance().show();

    }
    private onRank(){
        RankUI.getInstance().show();

    }
    private onTec(){
        TecUI.getInstance().show();

    }


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
        this.renewTop();

        this.renewTask();
        this.renewPage();
        this.scrollToCurrentPage();

        this.renewMiddle();

        this.renewFriendRed();
        this.renewCollectRed();
        this.renewHonorRed();

        GuideManager.getInstance().isGuiding = UM.exp == 0 && UM.level == 1;
        GuideManager.getInstance().showGuide(MainPageUI.getInstance())

        //GuideManager.getInstance().guideStep = 13;
        //MyTool.removeMC(PopUpManager.shape);
        //GuideManager.getInstance().showGuide(MainPageUI.getInstance())
        //MainPageUI.getInstance()['currentPage'] = 1;
        //MainPageUI.getInstance().scrollToCurrentPage();


        SoundManager.getInstance().playSound(SoundConfig.bg);
        egret.setTimeout(function(){
            RES.loadGroup("gamepreload2");//预加载第一阶段
        },this,500)
        setTimeout(function(){
            SoundManager.getInstance().loadEffectSound();
        },1000)

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
    public renewEnergy(){
        this.energyText.text = UM.getEnergy() + '/' + UM.maxEnergy;
        //if(UM.energy.v >= UM.maxEnergy) //full
        //    this.energyText.textColor = 0xF9D36C
        //else if(UM.energy.v == 0) //empty
        //    this.energyText.textColor = 0xFC8C8C
        //else
        //    this.energyText.textColor = 0xCCCCCC

    }

    public renewTask(){
        var task = UM.active.task;
        if(task.doing)
        {
            this.taskGroup.visible = true;
            var type = '修正场PK'
            if(task.type == 'server_game')
                type = '竞技场PK';
            this.taskText.text = '任务：在'+task.targettotal+'场'+type+'中取得'+task.targetwin+'场胜利【战力+'+task.award+'】（'+task.win+'/'+task.total+'）';
        }
        else
        {
            this.taskGroup.visible = false;
        }
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
        egret.Tween.removeTweens(this.scrollGroup)
        var pageSize = 640
        var targetX = -this.currentPage * pageSize;
        this.scroller.viewport.scrollV = 0;
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
                    this.scrollGroup.swapChildrenAt(this.currentPage,this.currentPage +des);
                    this.scrollToCurrentPage(true);
                },this);
            }
            else {
                tw.to({x: targetX}, Math.min(200, 200 * Math.abs(targetX - this.scrollGroup.x) / pageSize));
            }
        }

        switch(this.currentPage)
        {
            case 0:
                this.mainGame.renew();
                this.videoBtn.visible = UM.main_game.pkdata;
                break;
            case 1:
                this.dayGame.renew();
                this.videoBtn.visible = UM.day_game.pkdata;
                break;
            case 2:
                this.serverGame.renew();
                this.videoBtn.visible = UM.server_game.pkdata;
                break;
            case 3:
                this.serverGameEqual.renew();
                this.videoBtn.visible = UM.server_game_equal.pkdata;
                break;

        }
    }


}