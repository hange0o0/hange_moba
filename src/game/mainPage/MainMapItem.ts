class MainMapItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainMapItemSkin";
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
    private redMC: eui.Image;
    private nextText: eui.Label;









    public index;
    public haveRenew = false

    public childrenCreated() {
        this.addBtnEvent(this.startBtn, this.onStart,true);
        //this.addBtnEvent(this.scoreText, this.onScore);
        EM.addEvent(GameEvent.client.pass_day,this.renew,this)

        //addBtnTips(this.scoreText,this.onScore,this);
    }


    private onStart(){
        MapMainUI.getInstance().show();
    }


    public renew() {
        this.haveRenew = true;
        this.bg.source = 'main5_png'

        var MD = MapData.getInstance();
        var currentLevel = MD.level;

        if(MD.lastTime)
            this.setHtml(this.scoreText, '正在扫荡第 ' +  this.createHtml(currentLevel,0xE0A44A) + ' 据点 ');
        else
            this.setHtml(this.scoreText, '扫荡尚未开始');

        this.lockMC.visible = UM.main_game.level < Config.mapLevel
        this.scoreText.visible = !this.lockMC.visible
        this.redMC.visible = false;
        if(this.lockMC.visible)
        {
            this.setHtml(this.desText,this.createHtml( '' + MainGameManager.getInstance().getStepName(Config.mapLevel) + '',0xE0A44A)+' 才可进入');
            //this.desText.text = '公会评分达' + Config.serverLevel + '后开放'
            this.btnGroup.visible = false;
            this.barGroup.visible = false;
        }
        else
        {
            this.btnGroup.visible = true;

            if(MD.lastTime)
            {
                MD.reInit();
                var awardMax = MD.getAwardMax();
                if(MD.bag >= awardMax)
                {
                    this.redMC.visible = true;
                    //this.setHtml(this.desText,'能量背包：' + this.createHtml(awardMax + '/' + awardMax,0xFFFF00));
                }
                //else
                //    this.desText.text = '能量背包：' + MD.bag + '/' + awardMax

                this.desText.text = '';
                this.barGroup.visible = true;
                this.barMC.width = 200 * MD.bag/awardMax
                this.nextText.text = MD.bag + '/' + awardMax
            }
            else
            {
                this.desText.text = '点击下方按钮开始扫荡吧！'
                this.barGroup.visible = false;
            }
        }

    }


}