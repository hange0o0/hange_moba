class MainDayItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainDayItemSkin";
    }

    private btnGroup: eui.Group;
    private startBtn: eui.Button;
    private awardBtn: eui.Button;
    private scoreText: eui.Label;



    public index;

    public childrenCreated() {
        this.addBtnEvent(this.awardBtn, this.onAward);
        this.addBtnEvent(this.startBtn, this.onStart);
    }

    private onAward(){
        var self = this;
        var MM = MainGameManager.getInstance();
        MM.getAward(function(){
            self.renew();
        });
    }
    private onStart(){
        DayGameUI.getInstance().show();
    }

    public renew() {
        //'{"choose":null,"level":1,"kill":[],"awardtime":0,"time":0,"pkdata":null}'
        var myData = UM.day_game;
        this.scoreText.text =  '当前进度：' + myData.level + '/10'

        MyTool.removeMC(this.awardBtn);

    }
}