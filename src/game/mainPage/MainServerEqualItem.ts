class MainServerEqualItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainServerEqualItemSkin";
    }

    private bgGroup: eui.Group;
    private bg: eui.Image;
    private titleText: eui.Label;
    private rightMC: eui.Image;
    private scoreText: eui.Label;
    private desText: eui.Label;
    private barGroup: eui.Group;
    private barMC: eui.Rect;
    private nextText: eui.Label;
    private rateText: eui.Label;
    private lockMC: eui.Image;
    private btnGroup: eui.Group;
    private retryBtn: eui.Button;
    private startBtn: eui.Button;
    private ticketGroup: eui.Group;
    private numText: eui.Label;







    public index;
    public haveRenew = false

    public childrenCreated() {
        this.addBtnEvent(this.retryBtn, this.onRetry);
        this.addBtnEvent(this.ticketGroup, this.onTicket);
        this.addBtnEvent(this.startBtn, this.onStart,true);
        addBtnTips(this.scoreText,this.onScore);
        this.scoreText['thisObj'] = this;
        EM.addEvent(GameEvent.client.prop_change,this.renew,this)
    }

    public onShow(){
        if(TaskManager.getInstance().nowAction == 'server_equal_game')
        {
            TaskManager.getInstance().showGuideMC(this.startBtn)
        }
        else if(TaskManager.getInstance().nowAction == 'buy_ticket')
        {
            TaskManager.getInstance().showGuideMC(this.ticketGroup)
        }
    }

    private onTicket(){
        ShopUI.getInstance().show('ticket');
    }

    private onScore(){
        var level = ServerGameEqualManager.getInstance().getPKTableLevel(UM.server_game_equal.exp)
        var nextExp = ServerGameEqualManager.getInstance().getPKTableExp(level + 1)
        return this.createHtml('下一称号：',0xE0A44A) + ServerGameEqualManager.getInstance().getStepName(nextExp)  + this.createHtml('\n需要评分：',0xE0A44A)+nextExp+''
    }

    private onRetry(){
        ServerGameEqualManager.getInstance().openPKView(true);
    }
    private onStart(){
        var data = UM.server_game_equal;
        var haveData = data.pk || data.choose
        if(!haveData)//未PK过
        {
            ServerGameEqualManager.getInstance().openPKView();
            return;
        }
        ServerGameEqualUI.getInstance().show();
    }

    public renew() {
        this.haveRenew = true;
        this.bg.source = 'main4_png'
        //{"choose":null,"exp":0,"win":0,"total":0,"last":0,"time":0,"pkdata":null,"pk":0}
        var serverData = UM.server_game_equal;
        //this.totalText.text = '局数：' + serverData.total;
        this.titleText.text = '虚空修正场';
        this.setHtml(this.scoreText,this.createHtml('评分：',0xE0A44A) + serverData.exp + this.createHtml('  ['+ServerGameEqualManager.getInstance().getStepName(serverData.exp)+']',0xE0A44A,22));
        //this.winText.text = '胜利：' + serverData.win;
        //this.maxText.text = '连胜：' + serverData.max;
        //this.propNumText.text = '拥有入场券：' + UM.getPropNum(21);
        this.lockMC.visible = UM.main_game.level < Config.serverEqualLevel
        this.scoreText.visible = !this.lockMC.visible
        if(this.lockMC.visible)
        {

            this.ticketGroup.visible = false
            this.rightMC.visible = true
            this.setHtml(this.desText,this.createHtml( '' + MainGameManager.getInstance().getStepName(Config.serverEqualLevel) + '',0xE0A44A)+' 才可进入');
            this.btnGroup.visible = false;
            this.barGroup.visible = false;
        }
        else
        {
            this.ticketGroup.visible = true
            this.rightMC.visible = false
            this.btnGroup.visible = true;
            MyTool.removeMC(this.retryBtn);
            var num = UM.getPropNum(21);
            if(num >= 1)
                this.setHtml(this.numText, '' + num);
            else
                this.setHtml(this.numText,this.createHtml('0',0xFF0000));

            this.barGroup.visible = true;
            this.desText.text = ''

            var level = ServerGameEqualManager.getInstance().getPKTableLevel(UM.server_game_equal.exp)
            var nowExp = ServerGameEqualManager.getInstance().getPKTableExp(level)
            var nextExp = ServerGameEqualManager.getInstance().getPKTableExp(level + 1)
            this.barMC.width = 200 * Math.max(0,serverData.exp - nowExp) / (nextExp - nowExp)
            this.rateText.text = Math.max(0,serverData.exp - nowExp) + '/' + (nextExp - nowExp)
            this.nextText.text = ServerGameEqualManager.getInstance().getStepName(nextExp)

            MyTool.removeMC(this.retryBtn);
            this.startBtn.label = '进入'

           //if(serverData.pk)//已PK过
           // {
           //     this.btnGroup.addChildAt(this.retryBtn,0);
           //     this.startBtn.label = '重新匹配'
           //     //if(num >= 1)
           //     //    this.setHtml(this.desText,'匹配或重试需消耗修正币：' + this.createHtml('1',0xFFFF00)+ '\n当前拥有数量：' + num);
           //     //else
           //     //    this.setHtml(this.desText,'匹配或重试需消耗修正币：' + this.createHtml('1',0xFF0000)+ '\n当前拥有数量：' + num);
           // }
           // else if(serverData.choose)//已有卡版数据
           // {
           //     this.startBtn.label = '开始挑战';
           //     //if(UM.getEnergy() >= 1)
           //     //    this.setHtml(this.desText,'每次挑战需消耗体力：' + this.createHtml('1',0xFFFF00) + '\n连胜次数：' + this.createHtml(serverData.last,0xFFFF00)+ '　　修正币数量：' + this.createHtml(num,0xFFFF00));
           //     //else
           //     //    this.setHtml(this.desText,'每次挑战需消耗体力：' + this.createHtml('1',0xFF0000) + '\n连胜次数：' + this.createHtml(serverData.last,0xFFFF00)+ '　　修正币数量：' + this.createHtml(num,0xFFFF00));
           // }
           // else
           // {
           //     if(!serverData.open)
           //     {
           //         //if(num >= 1)
           //         //    this.setHtml(this.desText,'进入修正场需消耗修正币：' + this.createHtml('1',0xFFFF00)+ '\n当前拥有数量：' + num);
           //         //else
           //         //    this.setHtml(this.desText,'进入修正场需消耗修正币：' + this.createHtml('1',0xFF0000)+ '\n当前拥有数量：' + num);
           //         //this.startBtn.label = '进入'
           //     }
           //     else
           //     {
           //         //if(UM.getEnergy() >= 1)
           //         //    this.setHtml(this.desText,'每次挑战需消耗体力：' + this.createHtml('1',0xFFFF00) + '\n连胜次数：' + this.createHtml(serverData.last,0xFFFF00) + '　　修正币数量：' + this.createHtml(num,0xFFFF00));
           //         //else
           //         //    this.setHtml(this.desText,'每次挑战需消耗体力：' + this.createHtml('1',0xFF0000) + '\n连胜次数：' + this.createHtml(serverData.last,0xFFFF00) + '　　修正币数量：' + this.createHtml(num,0xFFFF00));
           //         this.startBtn.label = '开始匹配'
           //     }
           // }
        }

        //RankManager.getInstance().renewPageHead(this.bgGroup,this.headMC,6);
    }
}