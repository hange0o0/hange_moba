class MainServerEqualItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainServerEqualItemSkin";
    }

    private btnGroup: eui.Group;
    private retryBtn: eui.Button;
    private startBtn: eui.Button;
    private scoreText: eui.Label;
    private desText: eui.Label;
    private titleText: eui.Label;
    private lockMC: eui.Image;
    private bg: eui.Image;





    public index;

    public childrenCreated() {
        this.addBtnEvent(this.retryBtn, this.onRetry);
        this.addBtnEvent(this.startBtn, this.onStart,true);
        EM.addEvent(GameEvent.client.prop_change,this.renew,this)
    }

    private onRetry(){
        ServerGameEqualManager.getInstance().openPKView(true);
    }
    private onStart(){
        ServerGameEqualManager.getInstance().openPKView();

    }

    public renew() {
        this.bg.source = 'main4_png'
        //{"choose":null,"exp":0,"win":0,"total":0,"last":0,"time":0,"pkdata":null,"pk":0}
        var serverData = UM.server_game_equal;
        //this.totalText.text = '局数：' + serverData.total;
        this.titleText.text = '修正场 [' + ServerGameEqualManager.getInstance().getPKTableLevel(serverData.exp)+'阶]';
        this.scoreText.text = '积分：' + serverData.exp;
        //this.winText.text = '胜利：' + serverData.win;
        //this.maxText.text = '连胜：' + serverData.max;
        //this.propNumText.text = '拥有入场券：' + UM.getPropNum(21);
        this.lockMC.visible = UM.level < Config.serverEqualLevel
        this.scoreText.visible = !this.lockMC.visible
        if(this.lockMC.visible)
        {

            this.desText.text = Config.serverEqualLevel + '级开放'
            this.btnGroup.visible = false;
        }
        else
        {
            this.btnGroup.visible = true;
            MyTool.removeMC(this.retryBtn);
            var num = UM.getPropNum(21);
            if(serverData.pk)//已PK过
            {
                this.btnGroup.addChildAt(this.retryBtn,0);
                this.startBtn.label = '重新匹配'
                if(num >= 1)
                    this.setHtml(this.desText,'匹配或重试需消耗修正币：' + this.createHtml('1',0xFFFF00)+ '\n当前拥有数量：' + num);
                else
                    this.setHtml(this.desText,'匹配或重试需消耗修正币：' + this.createHtml('1',0xFF0000)+ '\n当前拥有数量：' + num);
            }
            else if(serverData.choose)//已有卡版数据
            {
                this.startBtn.label = '开始挑战'
                this.desText.text = '卡组已获得，点击开始挑战' + '\n剩余修正币数量：' + num;
            }
            else
            {
                this.startBtn.label = '开始匹配'
                if(num >= 1)
                    this.setHtml(this.desText,'匹配需消耗修正币：' + this.createHtml('1',0xFFFF00)+ '\n当前拥有数量：' + num);
                else
                    this.setHtml(this.desText,'匹配需消耗修正币：' + this.createHtml('1',0xFF0000)+ '\n当前拥有数量：' + num);

            }
        }
    }
}