class MyInfoUI extends game.BaseUI {
    private static instance:MyInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MyInfoUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private headGroup: eui.Group;
    private headMC: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private editWordBtn: eui.Label;
    private levelText: eui.Label;
    private expText: eui.Label;
    private forceText: eui.Label;
    private forceText1: eui.Label;
    private addForceBtn: eui.Group;
    private forceText2: eui.Label;
    private forceText3: eui.Label;
    private energyText: eui.Label;
    private addEnergyBtn: eui.Group;
    private reEnergyText: eui.Label;
    private coinText: eui.Label;
    private addCoinBtn: eui.Group;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Group;
    private diamondFreeText: eui.Label;
    private addCardBtn: eui.Group;
    private thisLoginText: eui.Label;
    private lastLoginText: eui.Label;
    private tabGroup: eui.Group;
    private tab: eui.TabBar;
    private honorUI: HonorUI;
    private fightGroup: eui.Group;
    private mainLevelText: eui.Label;
    private mainLevelText2: eui.Label;
    private mainLevelText3: eui.Label;
    private mainAward1: eui.Label;
    private mainAward2: eui.Label;
    private mainAward3: eui.Label;
    private mainAward4: eui.Label;
    private dailyText1: eui.Label;
    private dailyText2: eui.Label;
    private dailyText3: eui.Label;
    private serverText1: eui.Label;
    private serverText2: eui.Label;
    private serverText3: eui.Label;
    private serverText4: eui.Label;
    private serverEqualText1: eui.Label;
    private serverEqualText2: eui.Label;
    private serverEqualText3: eui.Label;
    private serverEqualText5: eui.Label;
    private serverEqualText6: eui.Label;
    private serverEqualText4: eui.Label;
    private list: eui.List;
    private honorRed: eui.Image;








    private dataIn;





    public constructor() {
        super();
        this.skinName = "MyInfoUISkin";
    }



    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('个人信息')
        this.topUI.addEventListener('hide',this.hide,this);



        this.addBtnEvent(this.addForceBtn, this.onAddForce);
        this.addBtnEvent(this.addCoinBtn, this.onAddCoin);
        this.addBtnEvent(this.addDiamondBtn, this.onAddDiamon);
        this.addBtnEvent(this.addEnergyBtn, this.onAddEnergy);
        this.addBtnEvent(this.addCardBtn, this.onAddCard);
        this.addBtnEvent(this.desText, this.onChangeWord);

        this.addBtnEvent(this.headGroup, this.onHead);


        this.list.itemRenderer = EnemyHeadItem;


        this.tab.addEventListener(eui.ItemTapEvent.CHANGE, this.typeBarClick, this);
        //this.addBtnEvent(this, this.onClick);
    }


    public typeBarClick(){
        if(this.tab.selectedIndex == 1)
        {
            MyTool.removeMC(this.fightGroup)
            this.tabGroup.addChild(this.honorUI)
            this.renewHonor()

        }
        else
        {
            MyTool.removeMC(this.honorUI)
            this.tabGroup.addChild(this.fightGroup)
            this.renewFight();
        }
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

    public beforeHide(){
        this.clearList([this.list])
        this.honorUI.beforeHide();
    }



    private renewHonor(){
        this.renewHonorRed();
        var self = this;
        HonorManager.getInstance().getHonorMore(function(){
            self.honorUI.renew();

        })

    }
    private renewFight(){
        var mainData = UM.main_game;
        var level:any = mainData.level;
        this.setText(this.mainLevelText,'[当前称号：]' + MainGameManager.getInstance().getStepName(level))
        this.setText(this.mainLevelText2,'[评分：]' + level)
        var nextLevel = MainGameManager.getInstance().getNextStep();
        this.setText(this.mainLevelText3,'[下一称号：]' + MainGameManager.getInstance().getStepName(nextLevel)  + '（[评分：]'+nextLevel+'）')
        var award = MainGameManager.getInstance().getLocalAward(level);
        this.mainAward1.text = '' + award.coin;
        this.mainAward2.text = '' + award.card;
        var award = MainGameManager.getInstance().getLocalAward(level + 1);
        this.mainAward3.text = '' + award.coin;
        this.mainAward4.text = '' +  award.card;


        var myData = UM.day_game;
        this.setText(this.dailyText1,'[当前进度：]' + myData.level + '/10')
        this.setText(this.dailyText2,'[累计通关次数：]' +  myData.times)
        this.setText(this.dailyText3,'[获得研究积分：]' +  myData.score)

        var serverData = UM.server_game;
        level = ServerGameManager.getInstance().getPKTableLevel(serverData.exp)
        this.setText(this.serverText1,'[积分：]' + serverData.exp + '（[历史最高：]' + serverData.top + '）')
        this.setText(this.serverText2,'[当前段位：]'+ServerGameManager.getInstance().getStepName(serverData.exp)+'（[下一段积分：]'+ServerGameManager.getInstance().getPKTableExp(level + 1)+'）')
        this.setText(this.serverText3,'[胜利次数：]' + serverData.win)
        this.setText(this.serverText4,'[失败次数：]' + (serverData.total - serverData.win));


        var serverData = UM.server_game_equal;
        level = ServerGameEqualManager.getInstance().getPKTableLevel(serverData.exp)
        this.setText(this.serverEqualText1, '[评分]：' + serverData.exp + '（[历史最高：]' + serverData.top + '）')
        this.setText(this.serverEqualText2,'[天赋等级：]'+ServerGameEqualManager.getInstance().getStepName(serverData.exp)+'（[下一级评分：]'+ServerGameEqualManager.getInstance().getPKTableExp(level + 1)+'）')
        this.setText(this.serverEqualText3, '[胜利次数：]' + serverData.win)
        this.setText(this.serverEqualText4,'[失败次数：]' + (serverData.total - serverData.win));
        this.setText(this.serverEqualText5,'[当前连胜：]' + serverData.last)
        this.setText(this.serverEqualText6,'[最高连胜：]' + serverData.max)


        var specialData = {

        };
        var arr =  UM.getCommonUse(UM.pk_common.history);
        for(var i=0;i<arr.length;i++){
            arr[i] = {
                vo: MonsterVO.getObject(arr[i].id),
                type: 1,

                id: arr[i].id,
                specialData: specialData,

                index: i,
                list:arr
            }
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }

    private onChangeWord(){
        UserChangeWordUI.getInstance().show();
    }


    private onHead(){
        var self = this;
        ChangeHeadUI.getInstance().show(UM.head,false,function(id){
            if(id != UM.head)
            {
                Confirm('确定花费100钻石改变头像吗？',function(v){
                     if(v == 1)
                     {
                         if(!UM.testDiamond(100))
                         {
                             return;
                         }
                         FriendManager.getInstance().changeHead(id,function(){
                             ChangeHeadUI.getInstance().hide();
                         })
                     }
                })
            }
            else
                ChangeHeadUI.getInstance().hide();
        });
    }

    private onAddForce(){
        CollectUI.getInstance().show();
    }
    private onAddCoin(){
        ShopUI.getInstance().show('coin');
    }
    private onAddDiamon(){
        ShopUI.getInstance().show('diamond');
    }
    private onAddEnergy(){
        ShopUI.getInstance().show('energy');
    }
    private onAddCard(){
        ShopUI.getInstance().show('card');
    }

    private onTimer(){
        if(!this.stage)
            return;
        var cd = UM.getNextEnergyCD();
        this.setText(this.energyText,'[体力：]' + UM.energy.v + '/' + UM.maxEnergy);
        if(UM.energy.v  >= UM.maxEnergy)
        {
            this.reEnergyText.text = '';
        }
        else
        {
            cd +=    (UM.maxEnergy -UM.energy.v - 1) * UM.getEnergyStep()
            this.reEnergyText.text = '' + DateUtil.getStringBySecond(cd) + ' 后满体力';
        }


        this.setText(this.thisLoginText,'[本次游戏时间：]' + DateUtil.getStringBySecond(Math.floor(egret.getTimer()/1000)));
    }




    public hide(){
        super.hide();
    }
    public show(v?){
        this.dataIn = v
        super.show();
    }

    public onShow(){
        if(this.dataIn)
        {
            this.tab.selectedIndex = this.dataIn;
            this.scroller.viewport.scrollV = 750
        }
        this.renew();
        this.onTimer();
        this.renewHonorRed();
        this.typeBarClick();

        this.addPanelOpenEvent(egret.TimerEvent.TIMER,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.energy_change,this.renew);
        this.addPanelOpenEvent(GameEvent.client.change_head,this.renew);
        this.addPanelOpenEvent(GameEvent.client.word_change,this.renew);
        this.addPanelOpenEvent(GameEvent.client.honor_change,this.renewHonor);

        if(TaskManager.getInstance().nowAction == 'honor')
        {
            this.tab.validateNow()
            TaskManager.getInstance().showGuideMC(this.tab.getChildAt(1))
        }
    }

    public renew(){

        this.headMC.source = MyTool.getHeadUrl(UM.head);

        if(UM.word)
            this.desText.text =  '　　' + UM.word;
            //this.setHtml(this.desText,'　　' + UM.word  + this.createHtml(' 【点击修改】',0xAAAAAA,20));
        else
            this.setHtml(this.desText,this.createHtml('　　你还没编辑过宣言呢~',0xAAAAAA))

        this.setText(this.nameText,'['+UM.nick+'] ' + this.createHtml('　(ID：' + UM.gameid + ')',undefined,24));

        this.setText(this.levelText,'[等级：]LV.' + UM.level);
        this.setText(this.expText,'[经验：]' + UM.exp + ' / ' + UM.next_exp);

        this.setText(this.forceText,'[战力：]' + (UM.award_force + UM.tec_force))
        this.setText(this.forceText1,'[科技战力：]' + UM.getTecForce());
        this.setText(this.forceText2,'[等级战力：]' + UM.getLevelForce());
        this.setText(this.forceText3,'[奖励战力：]' + UM.award_force);



        //this.energyText2.text = '购买体力：' + UM.energy.rmb;
        this.onTimer();


        this.setText(this.coinText,'[金币：]' + UM.coin);
        this.setText(this.diamondText,'[钻石：]' + UM.getDiamond());
        this.setText(this.diamondFreeText,'[卡券：]' + UM.card);

        this.setText(this.lastLoginText,'[最近一次登陆：]' + DateUtil.formatDate('yy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(UM.last_land)));




    }

    private setText(text,str){
        str = this.changeValue(str);
        this.setHtml(text,str);
    }

    private changeValue(str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        return str;
    }
}