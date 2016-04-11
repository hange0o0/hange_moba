class MainMainItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainMainItemSkin";
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
        var MM = MainGameManager.getInstance();
        var mainData = UM.main_game;
        if(!mainData.choose)//无卡牌数据
        {
            MM.getCard(onGetCard);
        }
        else//已有卡版数据
        {
            onGetCard();
        }


        function onGetCard(){
            MainGameUI.getInstance().show();
        }
    }

    public renew() {
        //'{"choose":null,"level":1,"kill":[],"awardtime":0,"time":0,"pkdata":null}'
        var mainData = UM.main_game;
        this.scoreText.text = '当前等级：' + mainData.level;

        MyTool.removeMC(this.awardBtn);
        if(mainData.awardtime && DateUtil.isSameDay(mainData.awardtime))//已领过奖
        {
           //do nothing
        }
        else
        {
            this.btnGroup.addChildAt(this.awardBtn,0);
        }

    }
}