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
        //this.addBtnEvent(this.headMC0,this.onHead0);
        //this.addBtnEvent(this.headMC1,this.onHead1);
    }

    private onHead0(e){
        e.stopImmediatePropagation();

        var PKM = PKManager.getInstance();
        if(PKM.teamChange)
        {
            var teamBase = PKM.team2Base
        }
        else
        {
            var teamBase = PKM.team1Base
        }
        var mid = this.data.player1.mid;
        var specialData = teamBase.mb[mid];
        var oo = {
            id:mid,
            specialData:specialData,
        }
        MonsterList.getInstance().show([oo])
    }

    private onHead1(e){
        e.stopImmediatePropagation();

        var PKM = PKManager.getInstance();
        if(PKM.teamChange)
        {
            var teamBase = PKM.team1Base
        }
        else
        {
            var teamBase = PKM.team2Base
        }
        var mid = this.data.player2.mid;
        var specialData = teamBase.mb[mid];
        var oo = {
            id:mid,
            specialData:specialData,
        }
        MonsterList.getInstance().show([oo])
    }

    private onView() {
        //VideoPlayUI.getInstance().show();
        VideoManager.getInstance().playVideo(PKManager.getInstance().pkType,this.data.index - 1,true);
        //egret.setTimeout(function(){
        //    VideoUI.getInstance().visible = true;
        //},this,300)

    }

    public dataChanged() {
        var decColor = 0xFF0000
        var addColor = 0x00FF00
        var defColor = 0x860819
        var barWidth = 295;

        this.f0.fillColor = defColor;
        this.f1.fillColor = defColor;


        this.setHtml(this.titleText,'第 '+this.createHtml(this.data.index,0xFFFFFF)+' 轮');


        var player = this.data.player1
        var mvo = MonsterVO.getObject(player.mid)
        this.headMC0.source = mvo.thumb;
        var before = player.before/Math.max(player.beforeMax,player.afterMax);
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
        if(player.after == 0)
            this.hpText0.textColor = 0xAAAAAA
        else
            this.hpText0.textColor = 0xEA4E4E

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
        var dec0 = dec;


        var player = this.data.player2
        var mvo = MonsterVO.getObject(player.mid)
        this.headMC1.source = mvo.thumb;
        var before = player.before/Math.max(player.beforeMax,player.afterMax);
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
        if(player.after == 0)
            this.hpText1.textColor = 0xCCCCCC
        else
            this.hpText1.textColor = 0xEA4E4E

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



        this.decText1.textColor = dec<0?0xC54040:0x46C646
        this.decText0.textColor = dec0<0?0xC54040:0x46C646
        if(dec < 0 && dec0 < 0)
        {
             var v0 = Math.abs(dec0)
             var v1 = Math.abs(dec)
                if(v0 > v1)
                    this.decText0.textColor = 0xFF0000;
                else if(v0 < v1)
                    this.decText1.textColor = 0xFF0000;
        }
        else if(dec > 0 && dec0 > 0)
        {
            if(dec0 > dec)
                this.decText0.textColor = 0x00FF00;
            else if(dec0 < dec)
                this.decText1.textColor = 0x00FF00;
        }

        this.winIcon.visible = true;
        if(this.data.player1.isWin)
            this.winIcon.x = 140;
        else if(this.data.player2.isWin)
            this.winIcon.x = 640-130-50;
        else
            this.winIcon.visible = false;

    }
}


