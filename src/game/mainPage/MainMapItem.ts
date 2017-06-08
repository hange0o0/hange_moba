class MainMapItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainMapItemSkin";
    }

    private bgGroup: eui.Group;
    private scoreText: eui.Label;
    private bg: eui.Image;
    private lockMC: eui.Image;
    private desText: eui.Label;
    private btnGroup: eui.Group;
    private startBtn: eui.Button;
    private awardBtn: eui.Group;







    public index;

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
        this.bg.source = 'main5_png'

        var currentLevel = MapManager.getInstance().level;
        this.setHtml(this.scoreText,  this.createHtml('当前进度：',0xE0A44A) + '据点 ' + currentLevel);

        this.lockMC.visible = UM.main_game.level < Config.serverLevel
        this.scoreText.visible = !this.lockMC.visible
        if(this.lockMC.visible)
        {
            this.setHtml(this.desText,this.createHtml( '' + MainGameManager.getInstance().getStepName(Config.serverLevel) + '',0xE0A44A)+' 才可进入');
            //this.desText.text = '公会评分达' + Config.serverLevel + '后开放'
            this.btnGroup.visible = false;
        }
        else
        {
            this.btnGroup.visible = true;
            this.setHtml(this.desText,'每次搜索敌人会消耗' + this.createHtml('1',0xFFFF00) + '体力');
        }

    }


}