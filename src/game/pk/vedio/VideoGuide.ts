class VideoGuide extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "VideoGuideSkin";
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private closeBtn: eui.Button;



    public chooseData
    public childrenCreated() {
        this.list.itemRenderer = VideoGuideItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

        this.addBtnEvent(this.closeBtn,this.onClose)
    }

    private onClose(){
        this.visible = false;
        this.clearList([this.list])
    }

    public renew(lastChooseData,listArray) {
        listArray = listArray.concat();
        listArray.pop();
        this.chooseData = lastChooseData;
        this.list.dataProvider = new eui.ArrayCollection(listArray)
        var index = listArray.indexOf(lastChooseData)
        if(index != -1)
        {
            egret.callLater(function(){
                var toY = Math.max(0,Math.floor(index/6 - 1)*135);

                if(toY + this.scroller.height > this.scroller.viewport.contentHeight)
                    this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
                else
                    this.scroller.viewport.scrollV = toY
            },this)
        }

    }
}