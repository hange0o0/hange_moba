class MainDayItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainDayItemSkin";
    }

    private btnGroup: eui.Group;
    private startBtn: eui.Button;
    private scoreText: eui.Label;
    private desText: eui.Label;
    private lockMC: eui.Image;
    private bg: eui.Image;





    public index;

    public childrenCreated() {
        this.addBtnEvent(this.startBtn, this.onStart,true);
    }

    private onStart(){
        DayGameUI.getInstance().show();
    }

    public renew() {
        //'{"choose":null,"level":1,"kill":[],"awardtime":0,"time":0,"pkdata":null}'
        this.bg.source = 'main2_png'

        DayGameManager.getInstance().resetDay();
        var myData = UM.day_game;
        this.scoreText.text =  '当前进度：' + myData.level + '/10'

        this.lockMC.visible = UM.level < Config.dayLevel
        this.scoreText.visible = !this.lockMC.visible
        if(this.lockMC.visible)
        {

            this.desText.text = Config.dayLevel + '级开放'
            this.btnGroup.visible = false;
        }
        else
        {
            this.btnGroup.visible = true;
            if(myData.level == 10)
                this.desText.text = '今日已通关';
            else
            {
                if(UM.getEnergy() >= 1)
                    this.setHtml(this.desText,'每次PK消耗体力：' + this.createHtml('1',0xFFFF00));
                else
                    this.setHtml(this.desText,'每次PK消耗体力：' + this.createHtml('1',0xFF0000));
            }
        }



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