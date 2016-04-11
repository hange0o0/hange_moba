class MyInfoUI extends game.BaseUI {
    private static instance:MyInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MyInfoUI();
        return this.instance;
    }
    
    private topUI: TopUI;
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
    private reEnergyText: eui.Label;
    private energyText2: eui.Label;
    private addEnergyBtn: eui.Group;
    private coinText: eui.Label;
    private addCoinBtn: eui.Group;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Group;
    private diamondFreeText: eui.Label;
    private thisLoginText: eui.Label;
    private lastLoginText: eui.Label;
    private list: eui.List;



    private timer:egret.Timer;

    public constructor() {
        super();
        this.skinName = "MyInfoUISkin";
    }



    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('个人信息')
        this.topUI.addEventListener('hide',this.hide,this);


        this.timer = new egret.Timer(1000);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);

        this.addBtnEvent(this.setBtn, this.onSet);
        this.addBtnEvent(this.addForceBtn, this.onAddForce);
        this.addBtnEvent(this.addCoinBtn, this.onAddCoin);
        this.addBtnEvent(this.addDiamondBtn, this.onAddDiamon);
        this.addBtnEvent(this.addEnergyBtn, this.onAddEnergy);

        this.list.itemRenderer = EnemyHeadItem;
    }

    private onSet(){

    }
    private onAddForce(){

    }
    private onAddCoin(){

    }
    private onAddDiamon(){

    }
    private onAddEnergy(){

    }

    private onTimer(){
        var cd = GameManager.getInstance().getZeroCD();
        if(cd == 0)
        {
              this.renew();
        }

        this.reEnergyText.text = '下次体力回复：' + DateUtil.getStringBySecond(cd);
        this.thisLoginText.text = '本次游戏时间：' + DateUtil.getStringBySecond(Math.floor(egret.getTimer()/1000));
    }




    public hide(){
        this.timer.stop();
        super.hide();
    }

    public onShow(){
        this.timer.start();
        this.renew();
        this.onTimer();
    }

    public renew(){

        this.headMC.source = MyTool.getHeadUrl(UM.head);

        this.nameText.text = UM.nick;
        this.nameText.text = '等级：LV.' + UM.level;
        this.levelText.text = '经验：' + UM.exp + '/' + UM.next_exp;

        this.nameText.text = '战力：' + (UM.award_force + UM.tec_force)
        this.forceText1.text = '科技战力：' + UM.getTecForce();
        this.forceText2.text = '等级战力：' + UM.getLevelForce();
        this.forceText3.text = '奖励战力：' + UM.award_force;



        this.energyText.text = '体力：' + UM.energy.v + '/' + 50;
        this.energyText2.text = '元体力：' + UM.energy.rmb;


        this.coinText.text = '金币最近登陆：' + UM.coin;
        this.diamondText.text = '钻石最近登陆：' + UM.diamond.rmb;
        this.diamondFreeText.text = '点券最近登陆：' + UM.diamond.free;


        this.lastLoginText.text = '最近登陆：' + DateUtil.formatDate('yy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(UM.last_land));

        var specialData = {

        };
        var arr =  MyTool.getCommonUse(UM.pk_common.history);
        for(var i=0;i<arr.length;i++){
            arr[i] = {
                vo: MonsterVO.getObject(arr[i]),
                type: 1,

                id: arr[i],
                specialData: specialData,

                index: i,
                list:arr
            }
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)

    }
}