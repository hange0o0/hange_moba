class MainServerItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainServerItemSkin";
    }

    private titleText: eui.Label;
    private scoreText: eui.Label;
    private desText: eui.Label;
    private lockMC: eui.Image;
    private btnGroup: eui.Group;
    private retryBtn: eui.Button;
    private startBtn: eui.Button;
    private bg: eui.Image;



    public index;

    public childrenCreated() {
        this.addBtnEvent(this.retryBtn, this.onRetry);
        this.addBtnEvent(this.startBtn, this.onStart,true);
    }

    private onRetry(){
        ServerGameManager.getInstance().openPKView(true);
    }
    private onStart(){
        ServerGameManager.getInstance().openPKView();
    }

    public renew() {
        this.bg.source = 'main3_png'
        //{"choose":null,"exp":0,"win":0,"total":0,"last":0,"time":0,"pkdata":null,"pk":0}
        var serverData = UM.server_game;
        this.titleText.text = '竞技场 [' + ServerGameManager.getInstance().getPKTableLevel(serverData.exp) + '阶]'
        this.scoreText.text = '积分：' + serverData.exp;
        //this.totalText.text = '局数：' + serverData.total;
        //this.scoreText.text = '积分：' + serverData.exp;
        //this.winText.text = '胜利：' + serverData.win;
        this.lockMC.visible = UM.level < Config.serverLevel
        this.scoreText.visible = !this.lockMC.visible
        if(this.lockMC.visible)
        {

            this.desText.text = Config.serverLevel + '级开放'
            this.btnGroup.visible = false;
        }
        else
        {
            this.btnGroup.visible = true;
            MyTool.removeMC(this.retryBtn);
            if(serverData.pk)//已PK过
            {
                this.btnGroup.addChildAt(this.retryBtn,0);
                this.startBtn.label = '重新匹配'
                this.desText.text = '匹配或重试需消耗体力：' + 2;
            }
            else if(serverData.choose)//已有卡版数据
            {
                this.startBtn.label = '开始挑战';
                this.desText.text = '卡组已获得，点击开始挑战'
            }
            else
            {
                this.startBtn.label = '开始匹配'
                this.desText.text = '匹配需消耗体力：' + 2;
            }
        }


    }
}