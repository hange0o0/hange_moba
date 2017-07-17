class MainAwardBeforeUI extends game.BaseWindow {
    private static instance:MainAwardBeforeUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MainAwardBeforeUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MainAwardBeforeSkin";
    }

    private closeBtn: eui.Button;
    private okBtn: eui.Button;
    private timeText: eui.Label;
    private mainAward0: eui.Label;
    private mainAward1: eui.Label;
    private mainAward2: eui.Label;
    private mainAward3: eui.Label;


    public childrenCreated() {
        super.childrenCreated();

        this.setTitle('领取补助',220)
        this.addBtnEvent(this.closeBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onAward);

    }

    private onAward(){
        var self = this;
        var MM = MainGameManager.getInstance();
        MM.getAward(function(){
            self.hide();
        });
    }



    public hide(){
        TaskManager.getInstance().cleanNowAcrion('main_award');
        super.hide();
    }

    public show(){
        super.show();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer);
    }

    public onShow(){
        this.onTimer();

        var mainData = UM.main_game;
        var level:any = mainData.level;
        var award = MainGameManager.getInstance().getLocalAward(level);
        this.mainAward0.text = '' + award.coin;
        this.mainAward1.text = '' + award.card;
        var award = MainGameManager.getInstance().getLocalAward(level + 1);
        this.mainAward2.text = '' + award.coin;
        this.mainAward3.text = '' +  award.card;

        if(TaskManager.getInstance().nowAction == 'main_award')
        {
            TaskManager.getInstance().showGuideMC(this.okBtn)
        }

    }
    public onTimer(){
        var cd = DateUtil.getNextDateTimeByHours(0) - TM.now()
        this.setHtml(this.timeText,'现在离本轮补助发放结束还有：' + this.createHtml(DateUtil.getStringBySecond(cd),0xCCB48E,30) + '\n你确定现在就领取吗？')
    }
}