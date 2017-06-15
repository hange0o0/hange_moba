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



        this.addBtnEvent(this.sortBtn,this.onSort);
        this.addBtnEvent(this.sortText,this.onSort);
        this.addBtnEvent(this.coinGroup,this.onCoin);
        this.addBtnEvent(this.cardGroup,this.onCard);

        this.sortList.selectedIndex = SharedObjectManager.instance.getValue('collect_list_sort') || 0;
        this.sortList.addEventListener(egret.Event.CHANGE,this.onSelect,this)
        this.sortGroup.visible = false;
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
        GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.onHideSort,this);
        this.sortGroup.visible = true;
    }

    private onHideSort(){
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
        this.coinText.text = UM.coin + '';
        this.cardText.text = UM.card + '';
    }

    public renewList(){
        this.listArr = TecManager.getInstance().getList3(this.fillMonster);

        this.resort();
        this.list.dataProvider = new eui.ArrayCollection(this.listArr)
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
        this.list.dataProvider = new eui.ArrayCollection(this.listArr);
        this.scroller.viewport.scrollV = 0;
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
            //case 1://可升级
            //    for(var i=0;i<arr.length;i++)
            //    {
            //        var lv = UM.getMonsterLevel(arr[i].id);
            //        if(lv >= TecManager.getInstance().maxLevel)
            //            arr[i].need = Number.MAX_VALUE;
            //        else
            //            arr[i].need = TecManager.getInstance().collectNeed(lv + 1);
            //    }
            //    arr.sort(this.sortByLevelUp)
            //    break;
            case 1://等级升序
                for(var i=0;i<arr.length;i++)
                {
                    arr[i].lv = UM.getMonsterLevel(arr[i].id);
                    if(MonsterVO.getObject(arr[i].id).level > UM.level)
                        arr[i].lv = 9999;
                }
                arr.sort(this.sortByUp)
                break;
            case 2://等级降序
                for(var i=0;i<arr.length;i++)
                {
                    arr[i].lv = UM.getMonsterLevel(arr[i].id);
                    if(MonsterVO.getObject(arr[i].id).level > UM.level)
                        arr[i].lv = -9999;
                }
                arr.sort(this.sortByDown)
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
        if(a.lv > b.lv)
            return -1;
        if(a.lv < b.lv)
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