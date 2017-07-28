class MainDayItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainDayItemSkin";
    }

    private bgGroup: eui.Group;
    private bg: eui.Image;
    private scoreText: eui.Label;
    private lockMC: eui.Image;
    private desText: eui.Label;
    private barGroup: eui.Group;
    private barMC: eui.Rect;
    private btnGroup: eui.Group;
    private startBtn: eui.Button;
    private nextText: eui.Label;







    public index;
    public haveRenew = false

    public childrenCreated() {
        this.addBtnEvent(this.startBtn, this.onStart,true);
    }

    private onStart(){
        DayGameUI.getInstance().show();
    }

    public onShow(){
        if(TaskManager.getInstance().nowAction == 'day_game')
        {
            TaskManager.getInstance().showGuideMC(this.startBtn)
        }
    }

    public renew() {
        this.haveRenew = true;
        //'{"choose":null,"level":1,"kill":[],"awardtime":0,"time":0,"pkdata":null}'
        this.bg.source = 'main2_png'

        DayGameManager.getInstance().resetDay();
        var myData = UM.day_game;
        this.setHtml(this.scoreText,  this.createHtml('累计战力奖励：',0xE0A44A) + Math.floor(myData.score/2));

        this.lockMC.visible = UM.level < Config.dayLevel
        this.scoreText.visible = !this.lockMC.visible
        if(this.lockMC.visible)
        {

            this.desText.text = '玩家 ' + Config.dayLevel + ' 级开放'
            this.btnGroup.visible = false;
            this.barGroup.visible = false;
        }
        else
        {
            this.btnGroup.visible = true;
            if(myData.level == 10)
            {
                this.desText.text = '今日已通关';
                this.barGroup.visible = false
            }
            else
            {
                this.barGroup.visible = true
                this.desText.text = ''
                this.nextText.text = myData.level + '/10';
                this.barMC.width = 200 * myData.level / 10;
            }
        }


        //RankManager.getInstance().renewPageHead(this.bgGroup,this.headMC,4);
        //var level = myData.level + 1;
        //this.coinText.text = '×' + level*100;
        //
        //var num = Math.ceil((level-3)/2);
        //if(num > 0)
        //{
        //    this.awardGroup.addChild(this.propGroup1)
        //    this.propText1.text = '×' +num;
        //}
        //else
        //{
        //    MyTool.removeMC(this.propGroup1)
        //}
        //
        //
        //var num = Math.floor(level-8);
        //if(num > 0)
        //{
        //    this.awardGroup.addChild(this.propGroup2)
        //    this.propText2.text = '×' +num;
        //}
        //else
        //{
        //    MyTool.removeMC(this.propGroup2)
        //}

    }
}