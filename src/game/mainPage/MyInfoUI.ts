class MyInfoUI extends game.BaseUI {
    private static instance:MyInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MyInfoUI();
        return this.instance;
    }

    private expBar: eui.Image;
    private nameText: eui.Label;


    private timer:egret.Timer;

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }



    public childrenCreated() {
        super.childrenCreated();
        this.timer = new egret.Timer(1000);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
        //this.addBtnEvent(this, this.onClick);
    }

    private onTimer(){
        var cd = GameManager.getInstance().getZeroCD();
        if(cd == 0)
        {
              this.renew();
        }

        this.nameText.text = '下次体力回复:' + DateUtil.getStringBySecond(cd);
        this.nameText.text = '本次游戏时间:' + DateUtil.getStringBySecond(Math.floor(egret.getTimer()/1000));
    }

    private onClick(){

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

        this.expBar.source = MyTool.getHeadUrl(UM.head);

        this.nameText.text = UM.nick;
        this.nameText.text = 'LV.' + UM.level;
        this.nameText.text = '战力:' + (UM.award_force + UM.tec_force) + '(科技+'+UM.tec_force+'，奖励+'+UM.award_force+')';
        this.nameText.text = UM.exp + '/' + UM.next_exp;
        this.expBar.width = 200 * UM.exp / UM.next_exp;

        this.nameText.text = '体力:' + UM.getEnergy();
        this.nameText.text = '金币:' + UM.coin;
        this.nameText.text = '钻石:' + UM.diamond.rmb;
        this.nameText.text = '点券:' + UM.diamond.free;


        this.nameText.text = '上次登陆:' + DateUtil.formatDate('yyyy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(UM.last_land));

    //    头像，呢称，等级，战力：X（科技+A，奖励+B）
    //经验：123/456
    //    体力：
    //金币：
    //元宝：
    //点券：
    //下次体力刷新：01:25:44
    //    上次登录:2015-4-4 22:33:06
    //    本次登录:2015-4-4 22:33:06

    //    主线进度
    //    竞技场等级，胜利次数，总次数
    //    无科技场等级，胜利次数，总次数，最高
    }
}