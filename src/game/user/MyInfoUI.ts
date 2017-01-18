class MyInfoUI extends game.BaseUI {
    private static instance:MyInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MyInfoUI();
        return this.instance;
    }

    private topUI: TopUI;
    private headGroup: eui.Group;
    private headMC: eui.Image;
    private nameText: eui.Label;
    private setBtn: eui.Button;
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
    private mainLevelText: eui.Label;
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










    public constructor() {
        super();
        this.skinName = "MyInfoUISkin";
    }



    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('个人信息')
        this.topUI.addEventListener('hide',this.hide,this);



        this.addBtnEvent(this.setBtn, this.onSet);
        this.addBtnEvent(this.addForceBtn, this.onAddForce);
        this.addBtnEvent(this.addCoinBtn, this.onAddCoin);
        this.addBtnEvent(this.addDiamondBtn, this.onAddDiamon);
        this.addBtnEvent(this.addEnergyBtn, this.onAddEnergy);
        this.addBtnEvent(this.addCardBtn, this.onAddCard);

        this.addBtnEvent(this.headGroup, this.onHead);

        this.list.itemRenderer = EnemyHeadItem;


    }

    public beforeHide(){
        this.clearList([this.list])
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
    private onSet(){

    }
    private onAddForce(){
        TecUI.getInstance().show();
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
        if(cd == 0)
        {
            this.energyText.text = '体力：' + UM.energy.v + '/' + 60;
            this.reEnergyText.text = '';
        }
        else
        {
            this.energyText.text = '体力：' + UM.energy.v + '/' + 60;
            this.reEnergyText.text = '' + DateUtil.getStringBySecond(cd) + ' 后回复'+1+'点体力';
        }


        this.thisLoginText.text = '本次游戏时间：' + DateUtil.getStringBySecond(Math.floor(egret.getTimer()/1000));
    }




    public hide(){
        super.hide();
    }

    public onShow(){
        this.renew();
        this.onTimer();

        this.addPanelOpenEvent(egret.TimerEvent.TIMER,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.energy_change,this.renew);
        this.addPanelOpenEvent(GameEvent.client.change_head,this.renew);
    }

    public renew(){

        this.headMC.source = MyTool.getHeadUrl(UM.head);

        this.nameText.text = UM.nick;
        this.levelText.text = '等级：LV.' + UM.level;
        this.expText.text = '经验：' + UM.exp + '/' + UM.next_exp;

        this.forceText.text = '战力：' + (UM.award_force + UM.tec_force)
        this.forceText1.text = '科技战力：' + UM.getTecForce();
        this.forceText2.text = '等级战力：' + UM.getLevelForce();
        this.forceText3.text = '奖励战力：' + UM.award_force;



        //this.energyText2.text = '购买体力：' + UM.energy.rmb;
        this.onTimer();


        this.coinText.text = '金币：' + UM.coin;
        this.diamondText.text = '钻石：' + UM.getDiamond();
        this.diamondFreeText.text = '卡券：' + UM.card;

        this.lastLoginText.text = '最近一次登陆：' + DateUtil.formatDate('yy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(UM.last_land));


        var mainData = UM.main_game;
        var level:any = mainData.level;
        this.mainLevelText.text = '当前等级：' + level
        var award = MainGameManager.getInstance().getLocalAward(level);
        this.mainAward1.text = '' + award.coin;
        this.mainAward2.text = '' + award.card;
        var award = MainGameManager.getInstance().getLocalAward(level + 1);
        this.mainAward3.text = '' + award.coin;
        this.mainAward4.text = '' +  award.card;


        var myData = UM.day_game;
        this.dailyText1.text = '当前进度：' + myData.level + '/10'
        this.dailyText2.text = '累计通关次数：' +  myData.times
        this.dailyText3.text = '获得任务积分：' +  myData.score

        var serverData = UM.server_game;
        level = ServerGameManager.getInstance().getPKTableLevel(serverData.exp)
        this.serverText1.text = '积分：' + serverData.exp + '（历史最高：' + serverData.top + '）'
        this.serverText2.text = '当前等级：'+level+'（下一级积分：'+ServerGameManager.getInstance().getPKTableExp(level + 1)+'）'
        this.serverText3.text = '胜利次数：' + serverData.win
        this.serverText4.text = '失败次数：' + (serverData.total - serverData.win);


        var serverData = UM.server_game_equal;
        level = ServerGameEqualManager.getInstance().getPKTableLevel(serverData.exp)
        this.serverEqualText1.text =  '积分：' + serverData.exp + '（历史最高：' + serverData.top + '）'
        this.serverEqualText2.text = '当前等级：'+level+'（下一级积分：'+ServerGameManager.getInstance().getPKTableExp(level + 1)+'）'
        this.serverEqualText3.text =  '胜利次数：' + serverData.win
        this.serverEqualText4.text = '失败次数：' + (serverData.total - serverData.win);
        this.serverEqualText5.text = '当前连胜：' + serverData.last
        this.serverEqualText6.text = '最高连胜：' + serverData.max


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
}