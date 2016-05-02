class MainDayItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainDayItemSkin";
    }

    private btnGroup: eui.Group;
    private startBtn: eui.Button;
    private scoreText: eui.Label;
    private awardGroup: eui.Group;
    private coinText: eui.Label;
    private propGroup1: eui.Group;
    private propText1: eui.Label;
    private propGroup2: eui.Group;
    private propText2: eui.Label;




    public index;

    public childrenCreated() {
        this.addBtnEvent(this.startBtn, this.onStart);
    }

    private onStart(){
        DayGameUI.getInstance().show();
    }

    public renew() {
        //'{"choose":null,"level":1,"kill":[],"awardtime":0,"time":0,"pkdata":null}'
        var myData = UM.day_game;
        this.scoreText.text =  '当前进度：' + myData.level + '/10'


    }
}