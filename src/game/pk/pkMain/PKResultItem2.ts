class PKResultItem2 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKResultItem2Skin";
    }

    private b0: eui.Rect;
    private f0: eui.Rect;
    private b1: eui.Rect;
    private titleText: eui.Label;
    private headMC0: eui.Image;
    private headMC1: eui.Image;
    private winIcon: eui.Image;
    private hpText0: eui.Label;
    private hpText1: eui.Label;





    public index;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onView);
    }

    private onView() {
        VideoManager.getInstance().playVideo(PKManager.getInstance().pkType,this.data.index - 1);
        egret.setTimeout(function(){
            VideoUI.getInstance().visible = true;
        },this,300)

    }

    public dataChanged() {
        this.titleText.text = '第'+this.data.index+'轮';
    }
}


