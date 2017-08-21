class LeaderMainUI extends game.BaseUI {
    private static instance:LeaderMainUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LeaderMainUI();
        return this.instance;
    }

    private bg: eui.Rect;
    private tab: eui.TabBar;
    private topUI: TopUI;
    private chooseList: eui.List;
    private mainGroup: eui.Group;
    private btn1: eui.Button;
    private des1: eui.Label;
    private des2: eui.Label;
    private btn2: eui.Button;
    private des3: eui.Label;
    private des4: eui.Label;
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab0: eui.TabBar;
    private desText: eui.Label;
    private continueBtn: eui.Button;











    public constructor() {
        super();
        this.skinName = "LeaderMainUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('卡将系统')
        this.topUI.addEventListener('hide',this.hide,this);

        this.tab.touchChildren = this.tab.touchEnabled = false;

        this.scroller.viewport = this.list;

        this.chooseList.itemRenderer = LeaderItem

        this.tab0.addEventListener(eui.ItemTapEvent.CHANGE, this.typeBarClick, this);

        this.addBtnEvent(this.btn1,this.onClick1)
        this.addBtnEvent(this.btn2,this.onClick2)

    }

    private onClick1(){

    }

    private onClick2(){

    }

    private typeBarClick(){

    }



    public beforeHide(){
        this.clearList([this.list])
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
        this.scroller.viewport.scrollV = 0;
        this.renew();

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)

    }

    private onTimer(){
        if(this.mainGroup.visible)
        {
            this.btn1.touchChildren = this.btn1.touchEnabled = true;
            var num = 0;
            var haveDone = 0;
            if(num == 0)
            {
                this.des2.text = ''
                if(haveDone)
                {
                    this.des1.text = DateUtil.getStringBySecond(DateUtil.getNextDateTimeByHours(0) - TM.now())+'后免费';
                    this.btn1.skinName = 'Btn_d2Skin'
                    this.btn1.label = '学　习'
                    this.btn1.touchChildren = this.btn1.touchEnabled = false;
                }
                else
                {
                    this.des1.text = '可免费学习一次'
                    this.btn1.label = '免费学习'
                    this.btn1.skinName = 'Btn_r2Skin'
                }
            }
            else
            {
                if(haveDone)
                {
                    this.des2.text = DateUtil.getStringBySecond(DateUtil.getNextDateTimeByHours(0) - TM.now())+'后免费';
                    this.des1.text = '初级学习卡X' + num;
                    this.btn1.skinName = 'Btn_r2Skin'
                    this.btn1.label = '学　习'
                }
                else
                {
                    this.des1.text = '可免费学习一次'
                    this.des2.text = '初级学习卡X' + num
                    this.btn1.label = '免费学习'
                    this.btn1.skinName = 'Btn_r2Skin'
                }
            }

        }
    }

    private renew(){
         this.renewMain();


    }

    private renewMain(){
        this.mainGroup.visible = true;
        this.chooseList.visible = false;
        this.mainGroup.scaleX = this.mainGroup.scaleY = 1;
        this.bg.visible = true
        this.continueBtn.visible = false
        this.desText.text = ''


        var num = 0;
        if(num)
            this.des3.text = '高级学习卡X' + num;
        else
            this.des3.text = '钻石X' + 500;

        this.des4.text = ''

        this.onTimer();
    }

    private renewChoose(){
        this.mainGroup.visible = false;
        this.chooseList.visible = true;
        this.chooseList.scaleX = this.chooseList.scaleY = 1;
        this.bg.visible = false

        this.continueBtn.visible = true

        var arr = [];
        this.chooseList.dataProvider = new eui.ArrayCollection(arr)
        this.chooseList.selectedIndex = -1;

        if(arr.length  == 2)
        {
            (<eui.TileLayout>this.chooseList.layout).requestedColumnCount = 2;
            (<eui.TileLayout>this.chooseList.layout).horizontalGap = 60;
            this.desText.text = '你可以选取其中一项进行提升'
        }
        else
        {
            (<eui.TileLayout>this.chooseList.layout).requestedColumnCount = 3;
            (<eui.TileLayout>this.chooseList.layout).horizontalGap = 20;
            this.desText.text = '你可以选取其中两项进行提升'
        }
    }

    //动画表现
    private mvShow(){
       var tw = egret.Tween.get(this.mainGroup);
        tw.to({scaleX:0,scaleY:0},300).call(function(){
            this.mainGroup.visible = false;
        },this);

        this.desText.text = ''
        this.continueBtn.visible = false
        this.chooseList.scaleX = this.chooseList.scaleY = 0
        this.chooseList.visible = true;
        var tw = egret.Tween.get(this.chooseList);
        tw.wait(500).to({scaleX:1.1,scaleY:1.1},300).to({scaleX:1,scaleY:11},300).call(function(){
            this.desText.text = '你可以选取其中两项进行提升'
            this.continueBtn.visible = true
        },this);
    }


}