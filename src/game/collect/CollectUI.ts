class CollectUI extends game.BaseUI {
    private static instance:CollectUI;
    public static getInstance() {
        if (!this.instance) this.instance = new CollectUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private splitBtn: eui.Button;
    private tenBtn: eui.Button;
    private oneBtn: eui.Button;
    private numText: eui.Label;


    private listArr;
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.splitBtn, this.onSplit);
        this.addBtnEvent(this.tenBtn, this.onDraw10);
        this.addBtnEvent(this.oneBtn, this.onDraw1);

        this.list.itemRenderer = CollectItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }

    private onSplit(){
        var CM = CollectManager.getInstance();
        var obj = {};
        var count = 0;
        for(var i=0;i<this.listArr.length;i++)
        {
            var id = this.listArr[i];
            var num = CM.getCollectNum(id)
            if(num && !CM.isLock(id))
            {
                obj[id] = num;
                count += num;
            }
        }


        var self = this;
        Confirm('拆解所有的非锁定元素，可获得元素：'+count*CM.splitNum + '\n是否继续？',function(t){
            if(t == 1)
            {
                CM.split(obj,function(num){
                    Alert('拆解成功，获得元素：'+ num);
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
        this.listArr = CollectManager.getInstance().getList();
        this.renewList();
        this.renewDraw();
    }

    public renewList(){
        this.list.dataProvider = new eui.ArrayCollection(this.listArr)
    }

    public renewDraw(){

    }
}