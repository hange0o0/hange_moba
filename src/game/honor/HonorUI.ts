class HonorUI extends game.BaseUI {
    private static instance:HonorUI;
    public static getInstance() {
        if (!this.instance) this.instance = new HonorUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private upBtn: eui.Group;
    private upText: eui.Label;
    private downBtn: eui.Group;
    private downText: eui.Label;
    private infoText: eui.Label;
    private sortBtn: eui.Image;
    private sortText: eui.Label;
    private sortGroup: eui.Group;
    private sortList: eui.List;





    private listArray;
    private upArray;
    private downArray;

    private itemHeight = 110 + 6;

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
        this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.onScrollEnd,this)
        this.scroller.bounces = false;

        //this.tab.selectedIndex = 0;
        //this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);

        this.addBtnEvent(this.upBtn,this.onUp);
        this.addBtnEvent(this.downBtn,this.onDown);
        this.addBtnEvent(this.sortBtn,this.onSort);
        this.addBtnEvent(this.sortText,this.onSort);

        this.sortList.selectedIndex = 0;
        this.sortList.addEventListener(egret.Event.CHANGE,this.onSelect,this)
    }

    private onSelect(){
        this.resort()
    }

    private onSort(){
        GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.onHideSort,this);
        this.sortGroup.visible = true;
    }

    private onHideSort(){
        this.sortGroup.visible = false;
    }

    private onUp(){
        var oo = this.upArray.pop();
        var tw:egret.Tween = egret.Tween.get(this.scroller.viewport);
        var sv = oo.index*this.itemHeight;
        tw.to({scrollV:sv},Math.min(sv/2,300)).call(this.renewBtn,this)
        //this.scroller.viewport.scrollV = oo.index*this.itemHeight;
    }

    private onDown(){
        var oo = this.downArray.shift();
        var sv = oo.index*this.itemHeight + this.scroller.height - this.itemHeight - 50;
        if(sv > this.scroller.viewport.contentHeight - this.scroller.height)//到底了
            sv = this.scroller.viewport.contentHeight - this.scroller.height;

        var tw:egret.Tween = egret.Tween.get(this.scroller.viewport);
        tw.to({scrollV:sv},Math.min(sv/2,300)).call(this.renewBtn,this)
    }

    private onScrollEnd(){
        this.renewBtn();
    }

    //private typeBarClick(){
    //    if(this.tab.selectedIndex == 0)
    //        this.infoText.text = '使用指定卡牌获得指定场数胜利，即可获得点券奖励';
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
        this.onHideSort();
        this.renew();
        this.scroller.viewport.scrollV = 0;
        this.addPanelOpenEvent(GameEvent.client.honor_change,this.renew)
    }


    private renew(){
        var arr;
        var HM = HonorManager.getInstance();
        //if(this.tab.selectedIndex == 0)
            arr = this.listArray = HM.getList1();
        //else
        //    arr = this.listArray = HM.getList2();

        var lastV = this.scroller.viewport.scrollV;

        var count = 0;
        for(var i=0;i<arr.length;i++)
        {
            count += arr[i].level;
        }
        this.infoText.text = '领奖进度：' + count + '/' + arr.length*5;
        this.sortListFun(arr,true);
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.list.validateNow();
        //egret.callLater(function(){
            this.scroller.viewport.scrollV = lastV;
            this.renewBtn();
        //},this)


    }

    public resort(){
        this.sortListFun(this.listArray);
        this.list.dataProvider = new eui.ArrayCollection(this.listArray);
        this.scroller.viewport.scrollV = 0;
        this.renewBtn();
    }

    private sortListFun(arr,noDefault = false)
    {
        this.sortText.text = this.sortList.selectedItem.label;
         switch(this.sortList.selectedIndex)
         {
             case 0:     //默认
                 if(!noDefault)
                    arr.sort(this.sortByDefault)
                 break;
             case 1://使用次数
                 arr.sort(this.sortByUse)
                 break;
             case 2://胜利次数
                 arr.sort(this.sortByWin)
                 break;
             case 3://胜率
                 arr.sort(this.sortByRate)
                 break;
             case 4://领奖状态
                 arr.sort(this.sortByState)
                 break;
         }
    }
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

    public renewBtn(){
        var v = this.scroller.viewport.scrollV;
        var start = Math.ceil(v/this.itemHeight);
        var end = Math.floor((v+this.scroller.height)/this.itemHeight)-1;
        this.upArray = [];
        this.downArray = [];
        for(var i=0;i<this.listArray.length;i++)
        {
            var oo = this.listArray[i];
            if(oo.award) //可领
            {
                if(i<start)
                    this.upArray.push(oo);
                else if(i>end)
                    this.downArray.push(oo);
            }
        }
        if(this.upArray.length > 0)
        {
            this.upBtn.visible = true;
            this.upText.text = '' + this.upArray.length;
        }
        else
            this.upBtn.visible = false;

        if(this.downArray.length > 0)
        {
            this.downBtn.visible = true;
            this.downText.text = '' + this.upArray.length;
        }
        else
            this.downBtn.visible = false;
    }
}