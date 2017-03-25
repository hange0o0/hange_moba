class MainHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainHeadSkin";
    }
    
    private nameText: eui.Label;
    private headMC: eui.Image;

    public childrenCreated() {
        super.childrenCreated();

    }


    public dataChanged() {
        
    }

    public flash() {
//        var tw: egret.Tween = egret.Tween.get(this.titleText);
//        tw.to({ stroke: 3 },200)
//        tw.to({ stroke: 0 },200)
//        tw.to({ stroke: 3 },200)
//        tw.to({ stroke: 0 },200)
    }
}