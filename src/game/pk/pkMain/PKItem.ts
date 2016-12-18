class PKItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKItemSkin";
    }

    private headMC: eui.Image;
    private headMask: eui.Rect;


    public index;
    public team;
    public timer

    public enemy

    public ox;   //原始的
    public oy;   //原始的
    public ar = -1; //攻击方向，-1为向上，1为向下

    public childrenCreated() {
        //this.headMC.mask = this.headMask;
    }


    public dataChanged() {
        var vo = this.data.vo;
        this.headMC.source = vo.thumb
        this.team = this.data.team
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
