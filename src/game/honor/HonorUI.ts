class HonorUI extends game.BaseUI {
    private static instance:HonorUI;
    public static getInstance() {
        if (!this.instance) this.instance = new HonorUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private infoText: eui.Label;






    private listArray;
    private upArray;
    private downArray;

    private itemHeight = 120 + 6;
    private timer;

    public constructor() {
        super();
        this.skinName = "HonorUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('成就')
        this.topUI.addEventListener('hide',this.hide,this);

        this.list.itemRenderer = HonorItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

    }

    public beforeHide(){
        this.clearList([this.list])
    }



    //private typeBarClick(){
    //    if(this.tab.selectedIndex == 0)
    //        this.infoText.text = '使用指定卡兵获得指定场数胜利，即可获得点券奖励';
    //    else
    //        this.infoText.text = '使用指定技能获得指定场数胜利，即可获得点券奖励';
    //    this.renew();
    //}

    public show(){
        var self = this;
        HonorManager.getInstance().getHonorMore(function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renew();
        this.scroller.viewport.scrollV = 0;
        this.addPanelOpenEvent(GameEvent.client.honor_change,this.renew)
    }


    private renew(){
        var arr;
        var HM = HonorManager.getInstance();

        arr = this.listArray = HM.getList1();
        var lastV = this.scroller.viewport.scrollV;

        var count = 0;
        for(var i=0;i<arr.length;i++)
        {
            count += arr[i].level;
        }

        this.setHtml(this.infoText,'<font color="#E0A44A">领奖进度：</font>' + count + '/' + arr.length*5);
        arr.sort(this.sortByState)
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.scroller.validateNow();
        this.scroller.viewport.scrollV = lastV;


    }


    private sortByState(a,b){
        if(a.awardV > b.awardV)
            return -1;
        if(a.awardV < b.awardV)
            return 1;
        if(a.openLevel < b.openLevel)
            return -1;
        if(a.openLevel > b.openLevel)
            return 1;
        if(a.id < b.id)
            return -1;
        return 1;
    }

}