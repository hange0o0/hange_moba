class MainServerItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainServerItemSkin";
    }

    private bgGroup: eui.Group;
    private bg: eui.Image;
    private titleText: eui.Label;
    private scoreText: eui.Label;
    private desText: eui.Label;
    private barGroup: eui.Group;
    private barMC: eui.Rect;
    private nextText: eui.Label;
    private lockMC: eui.Image;
    private btnGroup: eui.Group;
    private retryBtn: eui.Button;
    private startBtn: eui.Button;
    private rateText: eui.Label;




    public index;
    public haveRenew = false

    public childrenCreated() {
        this.addBtnEvent(this.retryBtn, this.onRetry);
        this.addBtnEvent(this.startBtn, this.onStart);
        addBtnTips(this.scoreText,this.onScore);
        this.scoreText['thisObj'] = this;
    }

    public onShow(){
        if(TaskManager.getInstance().nowAction == 'server_game')
        {
            TaskManager.getInstance().showGuideMC(this.startBtn)
        }
    }

    private onScore(){
        var level = ServerGameManager.getInstance().getPKTableLevel(UM.server_game.exp)
        var nextExp = ServerGameManager.getInstance().getPKTableExp(level + 1)
        return this.createHtml('下一称号：',0xE0A44A) + ServerGameManager.getInstance().getStepName(nextExp)  + this.createHtml('\n需要评分：',0xE0A44A)+nextExp+'';

    }

    private onRetry(){
        ServerGameManager.getInstance().openPKView(true);
    }
    private onStart(){
        ServerGameUI.getInstance().show();
    }

    public renew() {
        this.haveRenew = true;
        this.bg.source = 'main3_png'
        //{"choose":null,"exp":0,"win":0,"total":0,"last":0,"time":0,"pkdata":null,"pk":0}
        var serverData = UM.server_game;
        this.titleText.text = '天梯竞技场'
        this.setHtml(this.scoreText,this.createHtml('评分：',0xE0A44A) + serverData.exp + this.createHtml('  ['+ServerGameManager.getInstance().getStepName(serverData.exp)+']',0xE0A44A,22));
        //this.totalText.text = '局数：' + serverData.total;
        //this.scoreText.text = '积分：' + serverData.exp;
        //this.winText.text = '胜利：' + serverData.win;
        this.lockMC.visible = UM.main_game.level < Config.serverLevel
        this.scoreText.visible = !this.lockMC.visible
        if(this.lockMC.visible)
        {
            this.setHtml(this.desText,this.createHtml( '' + MainGameManager.getInstance().getStepName(Config.serverLevel) + '',0xE0A44A)+' 才可进入');
            //this.desText.text = '公会评分达' + Config.serverLevel + '后开放'
            this.btnGroup.visible = false;
            this.barGroup.visible = false;
        }
        else
        {
            this.btnGroup.visible = true;
            MyTool.removeMC(this.retryBtn);
            this.startBtn.label = '进入'
            //if(serverData.pk)//已PK过
            //{
            //    this.btnGroup.addChildAt(this.retryBtn,0);
            //    this.startBtn.label = '重新匹配'
            //}
            //else if(serverData.choose)//已有卡版数据
            //{
            //    this.startBtn.label = '开始挑战';
            //}
            //else
            //{
            //    this.startBtn.label = '开始匹配'
            //}

            this.barGroup.visible = true;
            this.desText.text = ''

            var level = ServerGameManager.getInstance().getPKTableLevel(UM.server_game.exp)
            var nowExp = ServerGameManager.getInstance().getPKTableExp(level)
            var nextExp = ServerGameManager.getInstance().getPKTableExp(level + 1)
            this.barMC.width = 200 * Math.max(0,serverData.exp - nowExp) / (nextExp - nowExp)
            this.rateText.text = Math.max(0,serverData.exp - nowExp) + '/' + (nextExp - nowExp)
            this.nextText.text = ServerGameManager.getInstance().getStepName(nextExp)

            //if(UM.getEnergy() >= 1)
            //    this.setHtml(this.desText,'挑战需消耗体力：' + this.createHtml('1',0xFFFF00));
            //else
            //    this.setHtml(this.desText,'挑战需消耗体力：' + this.createHtml('1',0xFF0000));
        }


    }
}