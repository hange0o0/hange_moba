class PKResultItem2 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItem2Skin";
    }

    private b0: eui.Rect;
    private f0: eui.Rect;
    private b1: eui.Rect;
    private f1: eui.Rect;
    private titleText: eui.Label;
    private headMC0: eui.Image;
    private headMC1: eui.Image;
    private winIcon: eui.Image;
    private hpText0: eui.Label;
    private decText0: eui.Label;
    private decText1: eui.Label;
    private hpText1: eui.Label;







    public index;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onView);
    }

    private onView() {
        VideoManager.getInstance().playVideo(PKManager.getInstance().pkType,this.data.index - 1);
        egret.setTimeout(function(){
            VideoUI.getInstance().visible = true;
        },this,300)

    }

    public dataChanged() {
        var decColor = 0xFF0000
        var addColor = 0x00FF00
        var defColor = 0x740714
        var barWidth = 295;

        this.f0.fillColor = defColor;
        this.f1.fillColor = defColor;


        this.titleText.text = '第'+this.data.index+'轮';


        var player = this.data.player1
        var mvo = MonsterVO.getObject(player.mid)
        this.headMC0.source = mvo.thumb;
        var before = player.before/player.beforeMax;
        var after = player.after/player.afterMax;
        if(before > after) //-
        {
            this.b0.fillColor = decColor;
            this.b0.width = barWidth * before
            this.f0.width = barWidth * after
        }
        else
        {
            this.b0.fillColor = addColor;
            this.b0.width = barWidth * after
            this.f0.width = barWidth * before
        }
        this.hpText0.text =  player.after + '/' + player.afterMax;

        var dec = player.after - player.before
        if(dec > 0)
        {
            this.decText0.text = '+' + dec
            this.decText0.textColor = addColor;
        }
        else if(dec < 0)
        {
            this.decText0.text = '' + dec
            this.decText0.textColor = decColor;
        }
        else
            this.decText0.text = '';


        var player = this.data.player2
        var mvo = MonsterVO.getObject(player.mid)
        this.headMC1.source = mvo.thumb;
        var before = player.before/player.beforeMax;
        var after = player.after/player.afterMax;
        if(before > after) //-
        {
            this.b1.fillColor = decColor;
            this.b1.width = barWidth * before
            this.f1.width = barWidth * after
        }
        else
        {
            this.b1.fillColor = addColor;
            this.b1.width = barWidth * after
            this.f1.width = barWidth * before
        }
        this.hpText1.text =  player.after + '/' + player.afterMax;

        var dec = player.after - player.before
        if(dec > 0)
        {
            this.decText1.text = '+' + dec
            this.decText1.textColor = addColor;
        }
        else if(dec < 0)
        {
            this.decText1.text = '' + dec
            this.decText1.textColor = decColor;
        }
        else
            this.decText1.text = '';



        if(this.data.player1.isWin)
            this.winIcon.x = 130;
        else
            this.winIcon.x = 640-130-50;

    }
}


