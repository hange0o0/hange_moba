class LeaderDrawItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderDrawItemSkin";
    }

    private lightMC: eui.Image;
    private itemMC: AwardItem;

    public childrenCreated(){
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick);
        this.lightMC.visible = false;
        this.anchorOffsetX = 60
        this.anchorOffsetY = 60

    }

    //private onClick(){
    //
    //}



    public dataChanged(){
        this.data.des = '×' + (this.data.value || 1)
         this.itemMC.data = this.data
        if(this.data.type == 'skill')
        {
            this.lightMC.visible = true;
            this.once(egret.Event.REMOVED_FROM_STAGE,function(){
                egret.Tween.removeTweens(this.lightMC);
            },this)
            var tw = egret.Tween.get(this.lightMC,{loop:true});
            tw.to({rotation:360},2000).to({rotation:0});
        }
    }



}