class PKResultMVPItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultMVPItemSkin";
    }

    private rateMC: eui.Rect;
    private headBG: eui.Rect;
    private headMC: eui.Image;
    private topMC: eui.Image;
    private scoreText: eui.Label;



    public isSelect
    public childrenCreated() {
        //this.addBtnEvent(this.rateMC,this.onClick);
    }

    //private onClick(){
    //
    //}

    public dataChanged(){
        egret.Tween.removeTweens(this.topMC);
        this.topMC.visible = this.data.isTop;
        this.scoreText.text = this.data.value;
        this.rateMC.height = Math.max(5,this.data.value/this.data.maxValue * 300);
        this.headMC.source = MonsterVO.getObject(this.data.mid).thumb
        this.scoreText.y = 400 - this.rateMC.height - 90;
        this.topMC.y = this.scoreText.y  + 30;

        switch(this.data.type){
            case 0:
                this.topMC.source = 'mvp_png'
                break;
            case 1:
                this.topMC.source = 'monster_type2_png'
                break;
            case 2:
                this.topMC.source = 'monster_type1_png'
                break;
            case 3:
                this.topMC.source = 'monster_type3_png'
                break;
        }

        if(this.data.team == 1)
        {
            this.rateMC.fillColor = 0x325891
        }
        else
        {
            this.rateMC.fillColor = 0xA73321
        }
        this.setChoose(false);
        this.addTopMV();
    }

    private addTopMV(){
        if(!this.topMC.visible)
            return;
        this.once(egret.Event.REMOVED_FROM_STAGE,function(){
            egret.Tween.removeTweens(this.topMC);
        },this)

        var tw = egret.Tween.get(this.topMC,{loop:true});
        tw.to({scaleX:1.1,scaleY:0.8},200).to({scaleX:1,scaleY:1.1,y:this.topMC.y-10},200).
            to({scaleX:1.1,scaleY:0.8,y:this.topMC.y},200).to({scaleX:1,scaleY:1},300).wait(2000);

    }

    public setChoose(b){
        this.isSelect = b;
        if(b)
        {
            if(this.parent)
                this.parent.addChild(this);
            this.scoreText.visible = true
            this.rateMC.strokeColor = 0xFFFF00
            this.rateMC.strokeWeight = 2
            this.topMC.visible = false;
        }
        else
        {
            this.topMC.visible = this.data.isTop;
            this.scoreText.visible = false
            this.rateMC.strokeColor = 0x000000
            this.rateMC.strokeWeight = 1
        }
    }
}
