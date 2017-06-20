class VideoGuide extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "VideoGuideSkin";
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private closeBtn: eui.Image;
    private videoBtn: eui.Button;




    public chooseData
    public childrenCreated() {
        this.list.itemRenderer = VideoGuideItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

        this.addBtnEvent(this.closeBtn,this.onClose)
        this.addBtnEvent(this.videoBtn,this.onVideo)
    }

    private onVideo(){
        PKMainUI.getInstance().show(VideoManager.getInstance().index+1);
    }
    private onClose(){
        this.visible = false;
        this.clearList([this.list])
    }

    public renew(lastChooseData,listArray) {
        listArray = listArray.concat();
        listArray.pop();
        this.chooseData = lastChooseData;
        var index = -1
        for(var i=0;i<listArray.length;i++)//去掉没行动的
        {
            var base = listArray[i][0];
            var skillID = base.skillID;
             if(skillID == -1)
             {
                 listArray.splice(i,1);
                 i--;
                 continue;
             }
            if(index == -1 && base.index >= lastChooseData[0].index)
            {
                index = base.index;
            }
        }

        this.list.dataProvider = new eui.ArrayCollection(listArray)

        if(index != -1)
        {
            this.scroller.validateNow()
            //egret.callLater(function(){
                var toY = Math.max(0,Math.floor(index/6 - 1)*135);

                if(toY + this.scroller.height > this.scroller.viewport.contentHeight)
                    this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
                else
                    this.scroller.viewport.scrollV = toY
            //},this)
        }

    }
}