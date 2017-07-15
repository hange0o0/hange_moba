class HonorUI extends game.BaseContainer {
    //private static instance:HonorUI;
    //public static getInstance() {
    //    if (!this.instance) this.instance = new HonorUI();
    //    return this.instance;
    //}

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
        //this.topUI.setTitle('成就')
        //this.topUI.addEventListener('hide',this.hide,this);

        this.list.itemRenderer = HonorItem;
        //this.scroller.viewport = this.list;
        //this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        //this.scroller.addEventListener(eui.UIEvent.CHANGE,this.onScrollChange,this)
        //this.scroller.bounces = false;

        //this.tab.selectedIndex = 0;
        //this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);

        //this.addBtnEvent(this.upBtn,this.onUp);
        //this.addBtnEvent(this.downBtn,this.onDown);
        //this.addBtnEvent(this.sortBtn,this.onSort);
        //this.addBtnEvent(this.sortText,this.onSort);
        //
        //this.sortList.selectedIndex = SharedObjectManager.instance.getValue('honor_sort') || 0;
        //this.sortList.addEventListener(egret.Event.CHANGE,this.onSelect,this)

        //this.onHideSort();
    }

    public beforeHide(){
        this.clearList([this.list])
    }

    //private onSelect(){
    //    SharedObjectManager.instance.setValue('honor_sort',this.sortList.selectedIndex)
    //    this.resort()
    //}

    //private onSort(){
    //    GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.onHideSort,this);
    //    this.sortGroup.visible = true;
    //}
    //
    //private onHideSort(){
    //    this.sortGroup.visible = false;
    //}

    //private onUp(){
    //    this.scroller.stopAnimation();
    //    var oo = this.upArray.pop();
    //    var tw:egret.Tween = egret.Tween.get(this.scroller.viewport);
    //    var sv = Math.max(0,oo.index*this.itemHeight);
    //    tw.to({scrollV:sv},Math.min(Math.abs(sv - this.scroller.viewport.scrollV)/2,300)).call(this.renewBtn,this)
    //    //this.scroller.viewport.scrollV = oo.index*this.itemHeight;
    //}
    //
    //private onDown(){
    //    this.scroller.stopAnimation();
    //    var oo = this.downArray.shift();
    //    var sv = oo.index*this.itemHeight - this.scroller.height + this.itemHeight + 20;
    //    if(sv > this.scroller.viewport.contentHeight - this.scroller.height)//到底了
    //        sv = this.scroller.viewport.contentHeight - this.scroller.height;
    //
    //    var tw:egret.Tween = egret.Tween.get(this.scroller.viewport);
    //    tw.to({scrollV:sv},Math.min(Math.abs(sv - this.scroller.viewport.scrollV)/2,300)).call(this.renewBtn,this)
    //}

    //private onScrollChange(){
    //    egret.clearTimeout(this.timer);
    //    this.timer = egret.setTimeout(this.renewBtn,this,100)
    //}

    //private typeBarClick(){
    //    if(this.tab.selectedIndex == 0)
    //        this.infoText.text = '使用指定卡兵获得指定场数胜利，即可获得点券奖励';
    //    else
    //        this.infoText.text = '使用指定技能获得指定场数胜利，即可获得点券奖励';
    //    this.renew();
    //}

    //public show(){
    //    var self = this;
    //    HonorManager.getInstance().getHonorMore(function(){
    //        self.superShow();
    //    })
    //}

    //private superShow(){
    //    super.show();
    //}


    public renew(){
        //this.onHideSort();
        var arr;
        var HM = HonorManager.getInstance();
        //if(this.tab.selectedIndex == 0)
            arr = this.listArray = HM.getList1();
        //else
        //    arr = this.listArray = HM.getList2();

        //var lastV = this.scroller.viewport.scrollV;

        var count = 0;
        for(var i=0;i<arr.length;i++)
        {
            count += arr[i].level;
        }
        this.setHtml(this.infoText,'使用卡兵取得指定数量胜场，即可获得钻石奖励\n<font color="#E0A44A">领奖进度：</font>' + count + '/' + arr.length*5);
        arr.sort(this.sortByState)
        //this.sortListFun(arr);
        this.list.dataProvider = new eui.ArrayCollection(arr);
        //this.list.validateNow();
        //egret.callLater(function(){
        //    this.scroller.viewport.scrollV = lastV;
        //    this.renewBtn();
        //},this)

        if(TaskManager.getInstance().nowAction == 'honor')
        {
            this.list.validateNow();
            TaskManager.getInstance().showGuideMC(this.list.getChildAt(0)['awardBtn'])
        }
    }

    //public resort(){
    //    this.sortListFun(this.listArray);
    //    this.list.dataProvider = new eui.ArrayCollection(this.listArray);
    //    //this.scroller.viewport.scrollV = 0;
    //    //this.renewBtn();
    //}

    //private sortListFun(arr)
    //{
    //    this.sortText.text = this.sortList.selectedItem.label;
    //     switch(this.sortList.selectedIndex)
    //     {
    //         case 0://领奖状态
    //             arr.sort(this.sortByState)
    //             break;
    //         case 1://使用次数
    //             arr.sort(this.sortByUse)
    //             break;
    //         case 2://胜利次数
    //             arr.sort(this.sortByWin)
    //             break;
    //         case 3://胜率
    //             arr.sort(this.sortByRate)
    //             break;
    //         case 4://默认
    //             arr.sort(this.sortByDefault)
    //             break;
    //     }
    //    for(var i=0;i<arr.length;i++)
    //    {
    //        arr[i].index = i;
    //    }
    //}
    private sortByDefault(a,b){
        if(a.openLevel < b.openLevel)
            return -1;
        if(a.openLevel > b.openLevel)
            return 1;
        if(a.id < b.id)
            return -1;
        return 1;
    }
    private sortByUse(a,b){
        if(a.t > b.t)
            return -1;
        if(a.t < b.t)
            return 1;
        if(a.openLevel < b.openLevel)
            return -1;
        if(a.openLevel > b.openLevel)
            return 1;
        if(a.id < b.id)
            return -1;
        return 1;

    }
    private sortByWin(a,b){
        if(a.w > b.w)
            return -1;
        if(a.w < b.w)
            return 1;
        if(a.openLevel < b.openLevel)
            return -1;
        if(a.openLevel > b.openLevel)
            return 1;
        if(a.id < b.id)
            return -1;
        return 1;
    }
    private sortByRate(a,b){
        if(a.r > b.r)
            return -1;
        if(a.r < b.r)
            return 1;
        if(a.openLevel < b.openLevel)
            return -1;
        if(a.openLevel > b.openLevel)
            return 1;
        if(a.id < b.id)
            return -1;
        return 1;
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

    //public renewBtn(){
    //    var v = this.scroller.viewport.scrollV;
    //    var start = Math.ceil(v/this.itemHeight);
    //    var end = Math.floor((v+this.scroller.height)/this.itemHeight)-1;
    //    this.upArray = [];
    //    this.downArray = [];
    //    for(var i=0;i<this.listArray.length;i++)
    //    {
    //        var oo = this.listArray[i];
    //        if(oo.award) //可领
    //        {
    //            if(i<start)
    //                this.upArray.push(oo);
    //            else if(i>end)
    //                this.downArray.push(oo);
    //        }
    //    }
    //    if(this.upArray.length > 0)
    //    {
    //        this.upBtn.visible = true;
    //        this.upText.text = '' + this.upArray.length;
    //    }
    //    else
    //        this.upBtn.visible = false;
    //
    //    if(this.downArray.length > 0)
    //    {
    //        this.downBtn.visible = true;
    //        this.downText.text = '' + this.downArray.length;
    //    }
    //    else
    //        this.downBtn.visible = false;
    //}
}