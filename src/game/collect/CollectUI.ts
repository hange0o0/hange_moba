class CollectUI extends game.BaseUI {
    private static instance:CollectUI;
    public static getInstance() {
        if (!this.instance) this.instance = new CollectUI();
        return this.instance;
    }

    private topUI: TopUI;
    private coinText: eui.Label;
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

        this.topUI.setTitle('收集列表')
        this.topUI.addEventListener('hide',this.hide,this);



        this.list.itemRenderer = CollectItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;



        this.addBtnEvent(this.sortBtn,this.onSort);
        this.addBtnEvent(this.sortText,this.onSort);

        this.sortList.selectedIndex = 0;
        this.sortList.addEventListener(egret.Event.CHANGE,this.onSelect,this)
        this.sortGroup.visible = false;
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
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewCoin);
    }

    public renew(){
        this.renewList();
        this.renewCoin();
    }

    public renewCoin(){
        this.coinText.text = UM.coin + '';
    }

    public renewList(){
        this.listArr = TecManager.getInstance().getList3(this.fillMonster);

        this.resort();
        this.list.dataProvider = new eui.ArrayCollection(this.listArr)
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
            case 1://可升级
                arr.sort(this.sortByLevelUp)
                break;
            case 2://等级升序
                arr.sort(this.sortByUp)
                break;
            case 3://等级降序
                arr.sort(this.sortByDown)
                break;
        }
    }
    private sortByDefault(a,b){
        if(a.id < b.id)
            return -1;
        return 1;
    }
    private sortByLevelUp(a,b){
        if(a.id < b.id)
            return -1;
        return 1;
    }
    private sortByUp(a,b){
        if(a.id < b.id)
            return -1;
        return 1;
    }
    private sortByDown(a,b){
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