class MainMainItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainMainItemSkin";
    }

    private scoreText: eui.Label;
    private desText: eui.Label;
    private btnGroup: eui.Group;
    private startBtn: eui.Button;
    private awardBtn: eui.Group;







    public index;

    public childrenCreated() {
        this.addBtnEvent(this.awardBtn, this.onAward);
        this.addBtnEvent(this.startBtn, this.onStart,true);
        EM.addEvent(GameEvent.client.pass_day,this.renew,this)
    }

    private onAward(){
        var self = this;
        var MM = MainGameManager.getInstance();
        var cd = DateUtil.getNextDateTimeByHours(0) - TM.now()
        Confirm('离下一次奖励刷新还剩：\n<font size="36">' + DateUtil.getStringBySecond(cd) + '</font>\n确定现在就领取该奖励吗？',function(v){
            if(v == 1)
            {
                MM.getAward(function(){
                    self.renew();
                });
            }
        },['取消','领取'],{middle:true})


    }
    private onStart(){
        MainGameManager.getInstance().openPKView();
    }

    public renew() {
        //'{"choose":null,"level":1,"kill":[],"awardtime":0,"time":0,"pkdata":null}'
        var mainData = UM.main_game;
        var level = mainData.level;
        this.scoreText.text = '当前等级：' + level;

        MyTool.removeMC(this.awardBtn);
        if(mainData.awardtime && DateUtil.isSameDay(mainData.awardtime))//已领过奖
        {
           //do nothing
        }
        else
        {
            this.btnGroup.addChildAt(this.awardBtn,0);
        }

        if(UM.main_game.choose)
        {
            this.startBtn.label = '开始挑战'
            this.desText.text = '卡组已获得，点击开始挑战'
        }
        else
        {
            this.startBtn.label = '抽取卡牌'
            this.desText.text = '抽取卡牌需消耗体力：1'
        }

        if(level >= MainGameManager.getInstance().maxLevel)
        {
            MyTool.removeMC(this.startBtn)
            this.desText.text = '更高层的试练场即将开放！'
        }


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