class MainServerItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainServerItemSkin";
    }

    private btnGroup: eui.Group;
    private retryBtn: eui.Button;
    private startBtn: eui.Button;
    private scoreText: eui.Label;
    private desText: eui.Label;
    private titleText: eui.Label;



    public index;

    public childrenCreated() {
        this.addBtnEvent(this.retryBtn, this.onRetry);
        this.addBtnEvent(this.startBtn, this.onStart);
    }

    private onRetry(){
        var SM = ServerGameManager.getInstance();
        SM.getCard(true,function(){
            ServerGameUI.getInstance().show();
        });
    }
    private onStart(){
        ServerGameManager.getInstance().openPKView();
    }

    public renew() {
        //{"choose":null,"exp":0,"win":0,"total":0,"last":0,"time":0,"pkdata":null,"pk":0}
        var serverData = UM.server_game;
        this.titleText.text = '竞技场 [' + ServerGameManager.getInstance().getPKTableLevel(serverData.exp) + ']'
        this.scoreText.text = '积分：' + serverData.exp;
        //this.totalText.text = '局数：' + serverData.total;
        //this.scoreText.text = '积分：' + serverData.exp;
        //this.winText.text = '胜利：' + serverData.win;

        MyTool.removeMC(this.retryBtn);
        if(serverData.pk)//已PK过，不能再打
        {
            this.btnGroup.addChildAt(this.retryBtn,0);
            this.startBtn.label = '重新匹配'
            this.desText.text = '重新匹配需消耗体力：' + 2 + '\n重试需消耗体力：' + 3
        }
        else if(serverData.choose)//已有卡版数据
        {
            this.startBtn.label = '开始挑战';
            this.desText.text = '卡组已获得'
        }
        else
        {
            this.startBtn.label = '开始匹配'
            this.desText.text = '匹配需消耗体力：' + 2;
        }
    }
}