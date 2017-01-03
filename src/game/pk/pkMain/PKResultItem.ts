 class PKResultItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItemSkin";
    }

     private group: eui.Group;
     private awardItem: AwardItem;




    public index;
     private timer;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    //private onRender() {
    //    this.visible = true;
    //    this.awardItem.scaleX = 0.3
    //    this.awardItem.scaleY = 0.3
    //    this.awardItem.alpha = 0.3
    //    //this.x = (640 - 640*0.1)/2;
    //    var tw:egret.Tween = egret.Tween.get(this.awardItem);
    //    tw.to({alpha:1,scaleX:1.2,scaleY:1.2}, 100).to({scaleX:1,scaleY:1}, 50);
    //    //console.log('render');
    //}

    public dataChanged(){
        egret.clearTimeout(this.timer);
        egret.Tween.removeTweens(this.awardItem)
        this.awardItem.data = this.data;
        this.visible = false;
        if(this.data.cd)
        {
            var tw:egret.Tween = egret.Tween.get(this.awardItem);
            tw.wait(this.data.cd).call(function(){
                this.visible = true;
                this.awardItem.scaleX = 0.3
                this.awardItem.scaleY = 0.3
                this.awardItem.alpha = 0.3
            },this).to({alpha:1,scaleX:1.2,scaleY:1.2}, 100).to({scaleX:1,scaleY:1}, 50);
        }

        //this.desText.text = 'X100'
    }
}
