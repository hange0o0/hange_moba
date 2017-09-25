class MainMainItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainMainItemSkin";
    }

    private bgGroup: eui.Group;
    private scoreText: eui.Label;
    private desText: eui.Label;
    private barGroup: eui.Group;
    private nextText: eui.Label;
    private barMC: eui.Rect;
    private rateText: eui.Label;
    private btnGroup: eui.Group;
    private startBtn: eui.Button;
    private hardBtn: eui.Button;
    private awardBtn: eui.Group;








    public index;
    public haveRenew = false

    public childrenCreated() {
        this.addBtnEvent(this.awardBtn, this.onAward);
        this.addBtnEvent(this.startBtn, this.onStart,true);
        this.addBtnEvent(this.hardBtn, this.onHard,true);
        //this.addBtnEvent(this.scoreText, this.onScore);
        EM.addEvent(GameEvent.client.pass_day,this.renew,this)

        addBtnTips(this.scoreText,this.onScore);
        this.scoreText['thisObj'] = this;
    }

    public onShow(){
        if(TaskManager.getInstance().nowAction == 'main_game')
        {
            TaskManager.getInstance().showGuideMC(this.startBtn)
        }
        else if(TaskManager.getInstance().nowAction == 'main_award')
        {
            TaskManager.getInstance().showGuideMC(this.awardBtn)
        }
    }

    private onAward(){
        MainAwardBeforeUI.getInstance().show();

    }
    private onStart(){
        MainGameManager.getInstance().openPKView();
    }
    private onHard(){
        MainGameManager.getInstance().openPKView(true);
    }

    private onScore(){
        var nextLevel = MainGameManager.getInstance().getNextStep();
        return this.createHtml('下一称号：',0xE0A44A) + MainGameManager.getInstance().getStepName(nextLevel)  + this.createHtml('\n需要评分：',0xE0A44A)+nextLevel+''
    }

    public renew() {
        var MM = MainGameManager.getInstance();
        this.haveRenew = true;
        //'{"choose":null,"level":1,"kill":[],"awardtime":0,"time":0,"pkdata":null}'
        var mainData = UM.main_game;
        var level = mainData.level;
        this.setHtml(this.scoreText, this.createHtml('称号：', 0xE0A44A) + MainGameManager.getInstance().getStepName(level) + this.createHtml('  [评分：' + level + ']', 0xE0A44A, 22));


        if (level >= MainGameManager.getInstance().maxLevel) {
            MyTool.removeMC(this.startBtn)
            this.barGroup.visible = false;
            this.desText.text = '更高阶的职业评定即将开放！'
        }
        else
        {
            this.barGroup.visible = true;
            this.desText.text = ''

            var lastLevel = MM.getStepLevel(MM.getMainStep());
            var nextLevel = MM.getStepLevel(MM.getMainStep() + 1);
            this.nextText.text = MainGameManager.getInstance().getStepName(nextLevel) + '：';
            this.rateText.text = (level - lastLevel) + '/' +(nextLevel - lastLevel);
            this.barMC.width = 200 *(level - lastLevel)/(nextLevel - lastLevel);
        }





        MyTool.removeMC(this.awardBtn);
        if(mainData.awardtime && DateUtil.isSameDay(mainData.awardtime))//已领过奖
        {
           //do nothing
        }
        else
        {
            this.btnGroup.addChildAt(this.awardBtn,0);
        }

        if(UM.main_game.hlevel < UM.main_game.level)
            this.btnGroup.addChild(this.hardBtn);
        else
            MyTool.removeMC(this.hardBtn);

        //if(UM.main_game.choose)
        //{
        this.startBtn.label = '开始挑战'
        //if(UM.getEnergy() >= 1)
        //    this.setHtml(this.desText,'每次挑战需要消耗 ' + this.createHtml('1',0xFFFF00) + ' 点体力');
        //else
        //    this.setHtml(this.desText,'每次挑战需要消耗 ' + this.createHtml('1',0xFF0000) + ' 点体力');
        //}
        //else
        //{
        //    this.startBtn.label = '抽取卡兵'
        //    if(UM.getEnergy() >= 1)
        //        this.setHtml(this.desText,'抽取卡兵需消耗体力：' + this.createHtml('1',0xFFFF00));
        //    else
        //        this.setHtml(this.desText,'抽取卡兵需消耗体力：' + this.createHtml('1',0xFF0000));
        //}




        //RankManager.getInstance().renewPageHead(this.bgGroup,this.headMC,3);

        //this.coinText.text = '×' + level*100
        ////每过30小关奖一个普通道具
        //var num = Math.floor(level/30);
        //if(num > 0)
        //{
        //    this.awardGroup.addChild(this.propGroup1)
        //    this.propText1.text = '×' +num
        //}
        //else
        //{
        //    MyTool.removeMC(this.propGroup1)
        //}
        //
        ////每过100小关奖一个高级道具
        //var num = Math.floor(level/100);
        //if(num > 0)
        //{
        //    this.awardGroup.addChild(this.propGroup2)
        //    this.propText2.text = '×' +num
        //}
        //else
        //{
        //    MyTool.removeMC(this.propGroup2)
        //}

    }


}