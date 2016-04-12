class MainServerEqualItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainServerEqualItemSkin";
    }

    private btnGroup: eui.Group;
    private retryBtn: eui.Button;
    private startBtn: eui.Button;
    private totalText: eui.Label;
    private scoreText: eui.Label;
    private winText: eui.Label;
    private maxText: eui.Label;



    public index;

    public childrenCreated() {
        this.addBtnEvent(this.retryBtn, this.onRetry);
        this.addBtnEvent(this.startBtn, this.onStart);
    }

    private onRetry(){
        var SM = ServerGameEqualManager.getInstance();
        SM.getCard(true,function(){
            ServerGameEqualUI.getInstance().show();
        });
    }
    private onStart(){
        ServerGameEqualManager.getInstance().openPKView();

    }

    public renew() {
        //{"choose":null,"exp":0,"win":0,"total":0,"last":0,"time":0,"pkdata":null,"pk":0}
        var serverData = UM.server_game_equal;
        this.totalText.text = '局数：' + serverData.total;
        this.scoreText.text = '积分：' + serverData.exp;
        this.winText.text = '胜利：' + serverData.win;
        this.maxText.text = '连胜：：' + serverData.max;

        MyTool.removeMC(this.retryBtn);
        if(serverData.pk)//已PK过，不能再打
        {
            this.btnGroup.addChildAt(this.retryBtn,0);
            this.startBtn.label = '重新匹配'
        }
        else if(serverData.choose)//已有卡版数据
        {
            this.startBtn.label = '开始挑战'
        }
        else
        {
            this.startBtn.label = '开始匹配'
        }
    }
}