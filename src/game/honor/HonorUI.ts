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

    private itemHeight = 110;

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

        this.tab.selectedIndex = 0;
        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);

        this.addBtnEvent(this.upBtn,this.onUp);
        this.addBtnEvent(this.downBtn,this.onDown);
    }

    private onUp(){
        var oo = this.upArray.pop();
        this.scroller.viewport.scrollV = oo.index*this.itemHeight;
        this.renewBtn();
    }

    private onDown(){
        var oo = this.downArray.shift();
        var sv = oo.index*this.itemHeight + this.scroller.height - this.itemHeight - 50;
        if(sv > this.scroller.viewport.contentHeight - this.scroller.height)//到底了
            sv = this.scroller.viewport.contentHeight - this.scroller.height;
        this.scroller.viewport.scrollV = sv;
        this.renewBtn();
    }

    private onScrollEnd(){
        this.renewBtn();
    }

    private typeBarClick(){
        if(this.tab.selectedIndex == 0)
            this.infoText.text = '使用指定卡牌获得指定场数胜利，即可获得点券奖励';
        else
            this.infoText.text = '使用指定技能获得指定场数胜利，即可获得点券奖励';
        this.renew();
    }

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
    }

    private renew(){
        var arr;
        var HM = HonorManager.getInstance();
        if(this.tab.selectedIndex == 0)
            arr = this.listArray = HM.getList1();
        else
            arr = this.listArray = HM.getList2();

        //this.sortListFun(arr,true);
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.scroller.viewport.scrollV = 0;
        this.renewBtn();
    }

    public resort(){
        this.sortListFun(this.listArray);
        this.list.dataProvider = new eui.ArrayCollection(this.listArray);
        this.scroller.viewport.scrollV = 0;
        this.renewBtn();
    }

    private sortListFun(arr,noDefault = false)
    {
         switch(this.sortList.selectedIndex)
         {
             case 0:     //默认
                 if(!noDefault)
                    arr.sort(this.sortByDefault)
                 break;
             case 1://使用次数
                 arr.sort(this.sortByUse)
             case 2://胜利次数
                 arr.sort(this.sortByWin)
             case 3://胜率
                 arr.sort(this.sortByRate)
             case 4://领奖状态
                 arr.sort(this.sortByState)
         }
    }
    private sortByDefault(a,b){
        if(a.id < b.id)
            return -1;
        return 1;
    }
    private sortByUse(a,b){
        if(a.t > b.t)
            return -1;
        if(a.t < b.t)
            return 1;
        return this.sortByDefault(a,b);

    }
    private sortByWin(a,b){
        if(a.w > b.w)
            return -1;
        if(a.w < b.w)
            return 1;
        return this.sortByDefault(a,b);
    }
    private sortByRate(a,b){
        if(a.r > b.r)
            return -1;
        if(a.r < b.r)
            return 1;
        return this.sortByDefault(a,b);
    }
    private sortByState(a,b){
        if(a.awardV > b.awardV)
            return -1;
        if(a.awardV < b.awardV)
            return 1;
        return this.sortByDefault(a,b);
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