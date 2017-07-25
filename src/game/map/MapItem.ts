class MapItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MapItemSkin";
    }

    private headMC: eui.Image;
    private headBG: eui.Image;
    private beHitMC: eui.Rect;







    public id
    public index;
    public team;
    public timer
    public line//所处的行
    public action//行动过
    public talking//正在发表情
    public die
    public win3
    public moving

    public enemy //对方出战单位
    public self  //已方出战单位
    public isPKing
    public out = false;
    public isAtking = 0;
    public isBeAtking = 0;

    public ox;   //原始的
    public oy;   //原始的
    public boxX;   //原始的
    public boxY;   //原始的
    public ar = -1; //攻击方向，-1为向上，1为向下

    public atkDis = 70

    public childrenCreated() {
        this.headMC.mask = null;
        //this.addBtnEvent(this,this.onClick)
    }
    public dataChanged() {
        this.stopMV();
        var vo = this.data.vo;

        this.headMC.source = vo.thumbRound
        this.team = this.data.team
        this.index = this.data.index
        this.id = this.team * 100 + this.index;

        this.beHitMC.visible = false
    }

    public stopMV(){
        this.rotation = 0;
        egret.clearTimeout(this.timer)
        egret.Tween.removeTweens(this)
        egret.Tween.removeTweens(this.beHitMC)
    }

    public showBehit(){
        this.beHitMC.visible = true
        this.beHitMC.alpha = 0
        egret.Tween.removeTweens(this.beHitMC)
        var tw = egret.Tween.get(this.beHitMC)
        tw.wait(100).to({alpha:1},100).to({alpha:0},100).call(function(){
            this.beHitMC.visible = false
        },this)
    }

}
