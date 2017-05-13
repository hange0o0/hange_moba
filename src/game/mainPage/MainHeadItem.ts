class MainHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainHeadSkin";
    }

    private lightMC: eui.Image;
    private headMC: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;




    public time = 0;
    public childrenCreated() {
        super.childrenCreated();
         this.addBtnEvent(this,this.onClick)
        this.anchorOffsetX = 50
        this.anchorOffsetY = 50
        this.touchChildren = false;
    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data.gameid)
    }


    public dataChanged() {
        if(this.data.gameid == UM.gameid)
        {
            this.headMC.source = MyTool.getHeadUrl(UM.head);
            this.nameText.text = UM.nick
            this.desText.text = (UM.word || '我无话可说..')
        }
        else
        {
            this.headMC.source = MyTool.getHeadUrl(this.data.head);
            this.nameText.text = this.data.nick
            this.desText.text = (this.data.word || '我无话可说..')
        }
    }

    public showLight() {
        this.lightMC.visible = true;
        egret.Tween.removeTweens(this.lightMC)
        this.lightMC.rotation = 0;
        var tw = egret.Tween.get(this.lightMC,{loop:true})
        tw.to({rotation:360},4000).call(function(){
            this.lightMC.rotation = 0;
        },this)

        this.lightMC.scaleX =  this.lightMC.scaleY = 0.3;
        var tw = egret.Tween.get(this.lightMC)
        tw.to({scaleX:1,scaleY:1},300)
    }
    public hideLight() {
        this.lightMC.visible = false;
        egret.Tween.removeTweens(this.lightMC)
    }
}