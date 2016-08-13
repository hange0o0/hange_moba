class CollectUI extends game.BaseUI {
    private static instance:CollectUI;
    public static getInstance() {
        if (!this.instance) this.instance = new CollectUI();
        return this.instance;
    }

    private topUI: TopUI;
    private numText: eui.Label;
    private fillAllGroup: eui.Group;
    private fillBtn: eui.Image;
    private fillText: eui.Label;
    private fillGroup: eui.Group;
    private fillList: eui.List;
    private scroller: eui.Scroller;
    private list: eui.List;
    private splitBtn: eui.Button;
    private oneBtn: eui.Button;
    private tenBtn: eui.Button;


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

        this.addBtnEvent(this.splitBtn, this.onSplit);
        this.addBtnEvent(this.tenBtn, this.onDraw10);
        this.addBtnEvent(this.oneBtn, this.onDraw1);

        this.list.itemRenderer = CollectItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

        //EM.addEvent(GameEvent.client.collect_change,this.renew,this);
        EM.addEvent(GameEvent.client.prop_change,this.renewDraw,this);

        this.addBtnEvent(this.fillBtn,this.onFill);
        this.addBtnEvent(this.fillText,this.onFill);
        this.fillList.selectedIndex = 0;
        this.fillList.addEventListener(egret.Event.CHANGE,this.onSelectFill,this)
    }

    private onSelectFill(){
        this.fillMonster = this.fillList.selectedItem.id
        this.renewList();
    }
    private onFill(){
        GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.onHideFill,this);
        this.fillGroup.visible = true;
        var arr = [{id:0,label:'全部属性'}];
        //var mdata = CM.table[MonsterKindVO.dataKey];
        //for(var s in mdata)
        //{
        //    var vo = mdata[s];
        //    if(vo.level<= UM.level)
        //        arr.push({
        //            id:vo.id,
        //            label:'【'+vo.word+'】属性'
        //        });
        //}
        this.fillList.dataProvider = new eui.ArrayCollection(arr)
    }

    private onHideFill(){
        this.fillGroup.visible = false;
    }

    private onSplit(){
        var CM = CollectManager.getInstance();
        var obj = {};
        var count = 0;
        for(var i=0;i<this.listArr.length;i++)
        {
            var id = this.listArr[i].id;
            var num = CM.getCollectNum(id)
            if(num && !CM.isLock(id))
            {
                obj[id] = num;
                count += num;
            }
        }

        if(count == 0)
        {
            Alert('没有可被拆解的元素');
            return;
        }


        var self = this;
        Confirm('拆解所有的非锁定元素，\n可获得元素：'+count*CM.splitNum + '\n是否继续？',function(t){
            if(t == 1)
            {
                CM.split(obj,function(num){
                    Alert('拆解成功，获得元素：'+ num);
                    self.renew();
                })
            }
        })
    }

    private onDraw1(){
        var self = this;
        var need = CollectManager.getInstance().drawNeed * 1;
        var now = UM.getPropNum(22);
        if(need > now)
        {
            Alert('所需元素数量不足！\n本次抽碎片需要元素数量为：' +need);
            return;
        }
        CollectManager.getInstance().draw(1,function(){

        })
    }

    private onDraw10(){
        var self = this;
        var need = CollectManager.getInstance().drawNeed * 10;
        var now = UM.getPropNum(22);
        if(need > now)
        {
            Alert('所需元素数量不足！\n本次抽碎片需要元素数量为：' +need);
            return;
        }
        CollectManager.getInstance().draw(10,function(){

        })
    }

    public show(){
        var self = this;
        CollectManager.getInstance().getCollectMore(function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renew();
    }

    public renew(){


        this.renewList();
        this.renewDraw();
    }

    public renewList(){
        this.listArr = CollectManager.getInstance().getList(this.fillMonster);
        this.fillGroup.visible = false;
        if(this.fillMonster == 0)
            this.fillText.text = '全部属性'
        else
            this.fillText.text = this.fillList.selectedItem.label;

        this.list.dataProvider = new eui.ArrayCollection(this.listArr)
    }

    public renewDraw(){
        if(!this.stage)
            return;
        this.numText.text = '' + UM.getPropNum(22);
    }
}