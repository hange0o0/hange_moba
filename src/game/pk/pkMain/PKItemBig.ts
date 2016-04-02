class PKItemBig extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItemBigSkin";
    }

    private headMC: eui.Image;
    private liveBG: eui.Image;
    private nameText: eui.Label;


    public index;

    public childrenCreated() {
    }

    private onClose() {

    }

    public dataChanged() {
        //this.headMC.source = MyTool.getMonsterHead(this.data.id);
        this.liveBG.width = this.data.before/this.data.beforeMax*175
    }

    //扣血动画,如果死，会播放死后动画,并回调
    public decHp(fun?,thisObj?){
        var w = 175;
        var end = this.data.after/this.data.afterMax*175
        var tw:egret.Tween = egret.Tween.get(this.liveBG);
        tw.to({width:end}, 300).wait(400).call(function(){
            if(this.data.after == 0) //死亡
            {
                this.playDie(fun,thisObj);
            }
            else
            {
                fun.apply(thisObj);
            }
        },this)
    }

    public playDie(fun,thisObj?){
        var x = this.x;
        var v = 2
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300).call(fun,thisObj);
    }

    //连胜3场的表现
    public showWin3(){

    }
}