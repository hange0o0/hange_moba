class MainHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainHeadSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;



    public time = 0;
    public childrenCreated() {
        super.childrenCreated();
         this.addBtnEvent(this,this.onClick)
        this.anchorOffsetX = 50
        this.anchorOffsetY = 50
    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data.gameid)
    }


    public dataChanged() {
        if(this.data.gameid == UM.gameid)
        {
            this.headMC.source = MyTool.getHeadUrl(UM.head);
            this.nameText.text = UM.nick
            this.desText.text = '　　' + (UM.word || '我无话可说..')
        }
        else
        {
            this.headMC.source = MyTool.getHeadUrl(this.data.head);
            this.nameText.text = this.data.nick
            this.desText.text = '　　' + (this.data.word || '我无话可说..')
        }



    }

    public flash() {
//        var tw: egret.Tween = egret.Tween.get(this.titleText);
//        tw.to({ stroke: 3 },200)
//        tw.to({ stroke: 0 },200)
//        tw.to({ stroke: 3 },200)
//        tw.to({ stroke: 0 },200)
    }
}