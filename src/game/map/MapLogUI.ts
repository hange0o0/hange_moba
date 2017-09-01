class MapLogUI extends game.BaseWindow {
    private static instance:MapLogUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapLogUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapLogUISkin";
    }

    private okBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;





    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);
        this.setTitle('掠夺日志');

        this.list.itemRenderer = MapLogItem;
        this.list.useVirtualLayout = false;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }

    public beforeHide(){
        this.clearList([this.list])
    }

    public show(data?){
        MapManager.getInstance().fightLog(()=>{
            if( MapManager.getInstance().fightLogList.length == 0)
            {
                Alert('暂无掠夺日志')
                return;
            }
            super.show();
        })
    }

    public onShow(){
        var arr = MapManager.getInstance().fightLogList;
        for(var i=0;i<arr;i++)
        {
            arr[i].index = i;
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}