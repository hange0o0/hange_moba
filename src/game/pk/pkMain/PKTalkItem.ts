class PKTalkItem extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "PKTalkItemSkin";
    }

    private text: eui.Label;
    private bg: eui.Image;

    public active = false
    private h = 110;
    private w = 161;
    public childrenCreated() {
        super.childrenCreated();

        this.touchChildren = this.touchEnabled = false;
    }


    public setData(data) {
        this.active = true;


        this.text.text = data.txt;
        var item = data.item;
        item.talking = true;


        var p = item.parent.localToGlobal(item.x,item.y);
        this.x = p.x;
        if(p.x < 320)
        {
            this.bg.scaleX = -1
            this.anchorOffsetX = 0.4*this.w;
        }
        else
        {
            this.bg.scaleX = 1
            this.anchorOffsetX = 0.6*this.w;
        }
        if(p.y < this.h)
        {
             this.currentState = 'up';
            this.anchorOffsetY = 0;
            this.y = p.y + 30;
        }
        else
        {
            this.currentState = 'normal';
            this.anchorOffsetY = this.h;
            this.y = p.y - 30;
        }

        egret.Tween.removeTweens(this);
        this.scaleX = 0;
        this.scaleY = 0;
        this.alpha = 1;
        var tw = egret.Tween.get(this);
        tw.to({scaleX:1,scaleY:1},200).to({scaleX:0.9,scaleY:0.9},200).wait(2500).to({alpha:0},100).call(function(){
            this.active = false;
            MyTool.removeMC(this);
            item.talking = false;
        },this);

    }



}