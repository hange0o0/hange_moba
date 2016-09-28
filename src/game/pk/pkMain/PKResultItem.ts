 class PKResultItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItemSkin";
    }

     private group: eui.Group;
     private awardItem: AwardItem;




    public index;

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }

    private onRender() {
        this.visible = true;
        this.group.scaleX = 1
        this.group.scaleY = 1
        //this.x = (640 - 640*0.1)/2;
        var tw:egret.Tween = egret.Tween.get(this.group);
        tw.to({scaleX:1.2,scaleY:1.2}, 100).to({scaleX:1,scaleY:1}, 200);
        console.log('render');
    }

    public dataChanged(){
        if(this.data.cd)
        {
            egret.setTimeout(this.onRender,this,this.data.cd)
            this.data.cd = 0;
        }
        this.awardItem.data = this.data;
        this.visible = false;
        //this.desText.text = 'X100'
    }
}
