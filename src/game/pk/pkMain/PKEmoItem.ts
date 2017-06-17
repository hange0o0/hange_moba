class PKEmoItem extends game.BaseContainer {
    public constructor() {
        super();

        this.mc =  new eui.Image()
        this.addChild(this.mc)
        this.width = this.w
        this.height = this.h
        this.mc.verticalCenter = 0
        this.mc.horizontalCenter = 0
        this.anchorOffsetY = this.h

        this.touchChildren = this.touchEnabled = false;
    }
    private mc: eui.Image;

    public active = false
    private h = 60;
    private w = 60;
    public childrenCreated() {
        super.childrenCreated();

    }


    public setData(data) {
        this.active = true;
        var item = data.item;
        if(!data.disActive)
            item.talking = true;


        this.mc.source = 'pk_e_'+data.id+'_png'
        var p = item.parent.localToGlobal(item.x,item.y);
        var to = {x:0,y:0}

        var fx;
        if(p.x < 320)
        {
            this.mc.scaleX = -1
            this.anchorOffsetX = 5;
            this.x = p.x;
            to.x = this.x + 30 + Math.random()*30;
            fx = to.x + 5
        }
        else
        {
            this.mc.scaleX = 1
            this.anchorOffsetX = 55;
            this.x = p.x;
            to.x = this.x - 30 - Math.random()*30
            fx = to.x - 5
        }
        this.y = p.y;
        to.y = this.y  - Math.random()*30;



        egret.Tween.removeTweens(this);
        this.scaleX = 0;
        this.scaleY = 0;
        this.alpha = 1;
        var tw = egret.Tween.get(this);
        tw.to({scaleX:1,scaleY:1,x:to.x},200).to({x:fx},500).to({alpha:0},200).call(function(){
            this.active = false;
            MyTool.removeMC(this);
            if(!data.disActive)
                item.talking = false;
        },this)

        var tw = egret.Tween.get(this);
        if(to.y < p.y)
            tw.to({y:to.y},200,egret.Ease.circIn)
        else
            tw.to({y:to.y},200,egret.Ease.circOut)
        tw.to({y:to.y - 10},500).to({y:to.y - 14},200)

    }



}