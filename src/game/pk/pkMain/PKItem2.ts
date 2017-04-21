class PKItem2 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItem2Skin";
    }

    private lightMC: eui.Image;
    private headMC: eui.Image;
    private headBG: eui.Image;
    private hpGroup: eui.Group;
    private b0: eui.Rect;
    private b1: eui.Rect;
    private starGroup: eui.Group;
    private s3: eui.Image;
    private s2: eui.Image;
    private s1: eui.Image;
    private hpText: eui.Label;







    public id
    public index;
    public team;
    public timer
    public line//所处的行
    public action//行动过

    public enemy //对方出战单位
    public self  //已方出战单位
    public isPKing
    public out = false;

    public ox;   //原始的
    public oy;   //原始的
    public ar = -1; //攻击方向，-1为向上，1为向下

    //public set x(v){
    //    console.log('====' + v);
    //    egret.superSetter(PKItem2, this, "x", v);
    //}


    public childrenCreated() {
        this.headMC.mask = null;
    }


    public dataChanged() {
        this.stopMV();
        var vo = this.data.vo;
        MyTool.changeGray(this.headMC,false)
        this.headMC.source = vo.thumbRound
        this.team = this.data.team
        this.index = this.data.index
        this.id = this.team * 100 + this.index;

        this.hpGroup.visible = false;
        this.lightMC.visible = false
        this.starGroup.visible = false
        this.hpText.text = ''


        //if(this.data.isEnemy)
        //{
        //    this.headMC.scaleY = -1;
        //}
        //else
        //{
        //    this.headMC.scaleY = 1;
        //}
    }

    public setGray(){
        MyTool.changeGray(this.headMC)
    }

    public stopMV(){
        egret.clearTimeout(this.timer)
        egret.Tween.removeTweens(this)
        egret.Tween.removeTweens(this.lightMC)
    }


    public showLight(){
        if(this.lightMC.visible)
            return;

        this.lightMC.visible = true
        if(this.team == 1)
            this.lightMC.source = 'head_border_light1_png'
        else
            this.lightMC.source = 'head_border_light3_png'
        this.lightMC.scaleX = this.lightMC.scaleY = 0.7;
        egret.Tween.removeTweens(this.lightMC)
        var tw =  egret.Tween.get(this.lightMC,{loop:true})
        tw.to({scaleX:0.9,scaleY:0.9},1000).to({scaleX:0.7,scaleY:0.7},1000)
    }
    public hideLight(){
        this.lightMC.visible = false
    }

    public showHpChange(data){
        this.hpGroup.visible = true
        this.hpGroup.alpha = 1
        var decColor = 0xFF0000
        var addColor = 0x00FF00
        var barWidth = 110;

        var rate1 = data.rate1
        var rate2 = data.rate2
        if(rate1 > rate2)//-
        {
            this.b0.fillColor = decColor;
            this.b0.width = rate1*barWidth
            this.b1.width = rate1*barWidth
            var tw = egret.Tween.get(this.b1);
        }
        else
        {
            this.b0.fillColor = addColor;
            this.b0.width = rate1*barWidth
            this.b1.width = rate1*barWidth
            var tw = egret.Tween.get(this.b0);
        }
        tw.to({width:barWidth*rate2},500);

        var tw = egret.Tween.get(this.hpGroup);
        tw.wait(1000).to({alpha:0},200).call(function(){
            this.hpGroup.visible = false
        },this)

        if(data.hp == 0)
            return;

        if(data.hp > 0)
        {
            this.hpText.text = '+' + data.hp
            this.hpText.textColor = addColor
            this.hpText.strokeColor = 0x003300
        }
        else
        {
            this.hpText.text = '' + data.hp
            this.hpText.textColor = decColor
            this.hpText.strokeColor = 0x330000
        }
        this.hpText.y = -40
        this.hpText.alpha = 0;
        var tw = egret.Tween.get(this.hpText);
        tw.to({y:-60,alpha:1},200).wait(1000).call(function(){
            this.hpText.text = ''
        },this)

    }

    public showStar(win){
        this.starGroup.visible = true;
        win = win || 0;
        for(var i=0;i<3;i++)
        {
            this['s' + (i+1)].visible = win > i;
        }
    }


}
