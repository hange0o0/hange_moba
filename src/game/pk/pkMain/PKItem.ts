class PKItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItemSkin";
    }

    private lightMC: eui.Image;
    private headMC: eui.Image;
    private headBG: eui.Image;



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


    public childrenCreated() {
        this.headMC.mask = null;
    }


    public dataChanged() {
        this.stopMV();
        var vo = this.data.vo;
        this.headMC.source = vo.thumbRound
        this.team = this.data.team
        this.index = this.data.index
        this.id = this.team * 100 + this.index;

        //if(this.data.isEnemy)
        //{
        //    this.headMC.scaleY = -1;
        //}
        //else
        //{
        //    this.headMC.scaleY = 1;
        //}
    }

    public stopMV(){
        egret.clearTimeout(this.timer)
        egret.Tween.removeTweens(this)
    }

    //模拟行走(delay后开始，一共time MS（算上delay）)
    public stepMove(time,delay,des){
        this.stopMV();
        //time -= delay;
        var count = Math.round(time/500)
        time = time/count - 100;//单次CD
        des = des/count;


        if(delay == 0)
        {
            stepAction.apply(this)
        }
        else
        {
            this.timer = egret.setTimeout(stepAction,this,delay);
        }

        function stepAction(){
            if(count <= 0)
                return;
            count -- ;
            var Y1 = this.y - des/2;
            var Y2 = this.y - des;
            var tw:egret.Tween = egret.Tween.get(this);
            tw.to({scaleX:1.2,scaleY:1.2,y:Y1}, time/2).to({scaleX:1,scaleY:1,y:Y2}, time/2).wait(100).call(stepAction,this);
        }
    }


}
