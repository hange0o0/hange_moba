class CollectUI extends game.BaseUI {
    private static instance:CollectUI;
    public static getInstance() {
        if (!this.instance) this.instance = new CollectUI();
        return this.instance;
    }

    private topUI: TopUI;
    private coinGroup: eui.Group;
    private coinText: eui.Label;
    private cardGroup: eui.Group;
    private cardText: eui.Label;
    private scroller: eui.Scroller;
    private list: eui.List;
    private sortBtn: eui.Image;
    private sortText: eui.Label;
    private sortGroup: eui.Group;
    private sortList: eui.List;
    private openGroup: eui.Group;
    private openScroller: eui.Scroller;
    private monsterBase: MonsterInfoBase;
    private closeBtn: eui.Button;
    private scrollH: eui.Scroller;
    private listH: eui.List;







    public chooseMonster = 0
    private open = false
    private fillMonster = 0;
    private listArr;
    public constructor() {
        super();
        this.skinName = "CollectUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('卡兵列表')
        this.topUI.addEventListener('hide',this.hide,this);



        this.list.itemRenderer = CollectItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onListChoose,this);

        this.listH.itemRenderer = CollectDownItem;
        this.scrollH.viewport = this.listH;
        this.listH.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onListChoose2,this);

        this.addBtnEvent(this.sortBtn,this.onSort);
        this.addBtnEvent(this.sortText,this.onSort);
        this.addBtnEvent(this.coinGroup,this.onCoin);
        this.addBtnEvent(this.cardGroup,this.onCard);
        this.addBtnEvent(this.closeBtn,this.onClose);

        this.sortList.selectedIndex = SharedObjectManager.instance.getValue('collect_list_sort') || 0;
        this.sortList.addEventListener(egret.Event.CHANGE,this.onSelect,this)
        this.sortGroup.visible = false;
    }

    private onListChoose(){
        this.open = true;
        this.chooseMonster = this.list.selectedItem.id;
        this.listH.selectedIndex = -1;
        this.renewList();
        this.openScroller.stopAnimation();
        this.openScroller.viewport.scrollV = 0;

        GuideManager.getInstance().showGuide(this);
    }

    private onListChoose2(){
        this.chooseMonster = this.listH.selectedItem.id;
        this.renewMonster();
        for(var i=0;i<this.listH.numChildren;i++)
        {
            var item:any = this.listH.getChildAt(i);
            item.setChoose(CollectUI.getInstance().chooseMonster);
        }
        this.openScroller.stopAnimation();
        this.openScroller.viewport.scrollV = 0;
    }

    private onClose(){
        this.open = false;
        this.chooseMonster = 0;
        var scrollV = this.scroller.viewport.scrollV
        this.renewList();
        this.scroller.validateNow();
        this.scroller.viewport.scrollV = scrollV
    }

    private renewMonster(){
        this.monsterBase.renew(this.chooseMonster);
    }


    private onCard(){
        ShopUI.getInstance().show('card')
    }
    private onCoin(){
        ShopUI.getInstance().show('coin')
    }
    private onSelect(){
        SharedObjectManager.instance.setValue('collect_list_sort',this.sortList.selectedIndex);
        this.resort()
    }

    private onSort(){
        GameManager.stage.once(egret.TouchEvent.TOUCH_TAP,this.onHideSort,this,true);
        this.sortGroup.visible = true;
    }

    private onHideSort(e?){
        if(e)
            e.stopImmediatePropagation()
        this.sortGroup.visible = false;
    }

    //private onSelectFill(){
    //    this.fillMonster = this.fillList.selectedItem.id
    //    this.renewList();
    //}
    //
    //
    //private onFill(){
    //    GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.onHideFill,this);
    //    this.fillGroup.visible = true;
    //    var arr = [{id:0,label:'全部属性'}];
    //    //var mdata = CM.table[MonsterKindVO.dataKey];
    //    //for(var s in mdata)
    //    //{
    //    //    var vo = mdata[s];
    //    //    if(vo.level<= UM.level)
    //    //        arr.push({
    //    //            id:vo.id,
    //    //            label:'【'+vo.word+'】属性'
    //    //        });
    //    //}
    //    this.fillList.dataProvider = new eui.ArrayCollection(arr)
    //}
    //
    //private onHideFill(){
    //    this.fillGroup.visible = false;
    //}

    //private onSplit(){
    //    var CM = CollectManager.getInstance();
    //    var obj = {};
    //    var count = 0;
    //    for(var i=0;i<this.listArr.length;i++)
    //    {
    //        var id = this.listArr[i].id;
    //        var num = CM.getCollectNum(id)
    //        //if(num && !CM.isLock(id))
    //        //{
    //        //    obj[id] = num;
    //        //    count += num;
    //        //}
    //    }
    //
    //    if(count == 0)
    //    {
    //        Alert('没有可被拆解的元素');
    //        return;
    //    }
    //
    //
    //    var self = this;
    //    Confirm('拆解所有的非锁定元素，\n可获得元素：'+count*CM.splitNum + '\n是否继续？',function(t){
    //        if(t == 1)
    //        {
    //            CM.split(obj,function(num){
    //                Alert('拆解成功，获得元素：'+ num);
    //                self.renew();
    //            })
    //        }
    //    })
    //}
    //
    //private onDraw1(){
    //    var self = this;
    //    var need = CollectManager.getInstance().drawNeed * 1;
    //    var now = UM.getPropNum(22);
    //    if(need > now)
    //    {
    //        Alert('所需元素数量不足！\n本次抽碎片需要元素数量为：' +need);
    //        return;
    //    }
    //    CollectManager.getInstance().draw(1,function(){
    //
    //    })
    //}
    //
    //private onDraw10(){
    //    var self = this;
    //    var need = CollectManager.getInstance().drawNeed * 10;
    //    var now = UM.getPropNum(22);
    //    if(need > now)
    //    {
    //        Alert('所需元素数量不足！\n本次抽碎片需要元素数量为：' +need);
    //        return;
    //    }
    //    CollectManager.getInstance().draw(10,function(){
    //
    //    })
    //}

    public beforeHide(){
        this.clearList([this.list])
    }

    public hide(){
        super.hide();
        if(GuideManager.getInstance().isGuiding)
        {
            GuideManager.getInstance().showGuide(MainPageUI.getInstance());
            MainPageUI.getInstance()['currentPage'] = 1;
            MainPageUI.getInstance().scrollToCurrentPage();
            MainPageUI.getInstance().renewPage();
        }
    }
    public show(){
        var self = this;
        this.open = false;
        this.chooseMonster = 0;
        self.superShow();
        //CollectManager.getInstance().getCollectMore(function(){
        //    self.superShow();
        //})
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        GuideManager.getInstance().enableScrollV(this.scroller);
        if(GuideManager.getInstance().isGuiding)
            this.sortList.selectedIndex = 0;
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.collect_change,this.renew);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renew);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renew);

        GuideManager.getInstance().showGuide(CollectUI.getInstance());
    }

    public renew(){
        this.renewList();
        this.renewCoin();
    }

    public renewCoin(){
        this.coinText.text = NumberUtil.formatStrNum(UM.coin)// + '';
        this.cardText.text = NumberUtil.formatStrNum(UM.card)// + '';
    }

    public renewList(){
        this.listArr = TecManager.getInstance().getList3(this.fillMonster);

        this.resort();


        //this.list.dataProvider = new eui.ArrayCollection(this.listArr)
    }

    private justRenewList(){
        var len = this.list.numChildren;
        for(var i=0;i<len;i++)
        {
            (<CollectItem>this.list.getChildAt(i)).dataChanged();
        }
    }

    public resort(){
        this.sortListFun(this.listArr);
        if(this.open)
        {
            this.openGroup.visible = true;
            this.scroller.visible = false;
            this.renewMonster();
            var itemWidth = 120 + 10

            var des = 0;
            if(this.listH.selectedIndex == -1)
            {
                des = (610-itemWidth)/2;
            }
            else
                des = itemWidth*this.listH.selectedIndex - this.scrollH.viewport.scrollH;
            this.listH.dataProvider = new eui.ArrayCollection(this.listArr);
            this.scrollH.stopAnimation();
            this.scrollH.validateNow();
            for(var i=0;i<this.listArr.length;i++)
            {
                 if(this.listArr[i].id == this.chooseMonster)
                 {
                     this.scrollH.viewport.scrollH = Math.min(Math.max(0,i*itemWidth - des),this.scrollH.viewport.contentWidth-610)
                     this.listH.selectedIndex = i;
                     break;
                 }
            }
        }
        else
        {
            this.openGroup.visible = false;
            this.scroller.visible = true;
            this.list.dataProvider = new eui.ArrayCollection(this.listArr);
            this.scroller.viewport.scrollV = 0;
        }

        //this.renewBtn();
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
            case 1://等级升序
                arr.sort(this.sortByUp)
                break;
            case 2://等级降序
                arr.sort(this.sortByDown)
                break;
            case 3://使用次数
                arr.sort(this.sortByUse)
                break;
            case 4://胜利次数
                arr.sort(this.sortByWin)
                break;
            case 5://胜率
                arr.sort(this.sortByRate)
                break;
            case 6://综合
                arr.sort(this.sortByScore)
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
    //private sortByLevelUp(a,b){
    //    if(a.need < b.need)
    //        return -1;
    //    if(a.need > b.need)
    //        return 1;
    //    return this.sortByDefault(a,b)
    //}
    private sortByUp(a,b){
        if(!a.toLast && b.toLast)
            return -1;
        if(a.toLast && !b.toLast)
            return 1;
        if(a.lv < b.lv)
            return -1;
        if(a.lv > b.lv)
            return 1;
        if(a.openLevel < b.openLevel)
            return -1;
        if(a.openLevel > b.openLevel)
            return 1;
        if(a.id < b.id)
            return -1;
        return 1;
    }
    private sortByDown(a,b){
        if(!a.toLast && b.toLast)
            return -1;
        if(a.toLast && !b.toLast)
            return 1;
        if(a.lv < b.lv)
            return 1;
        if(a.lv > b.lv)
            return -1;
        if(a.openLevel < b.openLevel)
            return -1;
        if(a.openLevel > b.openLevel)
            return 1;
        if(a.id < b.id)
            return -1;
        return 1;
    }

    private sortByUse(a,b){
        if(!a.toLast && b.toLast)
            return -1;
        if(a.toLast && !b.toLast)
            return 1;
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
        if(!a.toLast && b.toLast)
            return -1;
        if(a.toLast && !b.toLast)
            return 1;
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
        if(!a.toLast && b.toLast)
            return -1;
        if(a.toLast && !b.toLast)
            return 1;
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

    private sortByScore(a,b){
        if(!a.toLast && b.toLast)
            return -1;
        if(a.toLast && !b.toLast)
            return 1;
        if(a.s > b.s)
            return -1;
        if(a.s < b.s)
            return 1;
        if(a.openLevel < b.openLevel)
            return -1;
        if(a.openLevel > b.openLevel)
            return 1;
        if(a.id < b.id)
            return -1;
        return 1;
    }




    //public renewDraw(){
    //    if(!this.stage)
    //        return;
    //    this.numText.text = '' + UM.getPropNum(22);
    //}
}