class VideoUI2 extends game.BaseUI {
    private static instance:VideoUI2;

    public static getInstance() {
        if (!this.instance) this.instance = new VideoUI2();
        return this.instance;
    }


    private scroller: eui.Scroller;
    private list: eui.List;
    private upGroup: eui.Group;
    private upBtn: eui.Group;
    private scrollGroup: eui.Group;
    private hpBar0: eui.Rect;
    private hpText0: eui.Label;
    private mpBar0: eui.Rect;
    private mpText0: eui.Label;
    private apBar0: eui.Rect;
    private apText0: eui.Label;
    private headMC0: eui.Image;
    private statList0: eui.List;
    private hpBar1: eui.Rect;
    private hpText1: eui.Label;
    private mpBar1: eui.Rect;
    private mpText1: eui.Label;
    private apBar1: eui.Rect;
    private apText1: eui.Label;
    private headMC1: eui.Image;
    private statList1: eui.List;
    private topUI: TopUI;

    private vGroup = new VScrollerGroup();


    private listArray = [];
    private currentList = []
    private barWidth = 220;
    //private upGroupY = 70;
    private lastChooseData;
    private scrollTime;
    private setChooseTimer



    public constructor() {
        super();
        this.skinName = "VideoUI2Skin";
    }


    public childrenCreated() {
        super.childrenCreated();

        //this.list.itemRenderer = VideoItem3;
        //this.scroller.viewport = this.list;
        //this.list.useVirtualLayout = false;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
        this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.onScrollEnd,this)
        this.scroller.bounces = false;

        this.scrollGroup.addChild(this.vGroup)
        this.vGroup.itemRenderer = VideoItem3;

        this.topUI.addEventListener('hide',this.hide,this);

        this.statList0.itemRenderer = VideoTopStatItem;
        this.statList1.itemRenderer = VideoTopStatItem;

        this.upGroup.visible = false;
        //this.addBtnEvent(this.upBtn,this.closeGroup);
    }

    public showMVDebug(v?){}
    public addToGroup(v?){}

    private onScroll(){
        //this.scroller.stopAnimation();
        this.vGroup.onScroll(this.scroller.viewport.scrollV,this.scroller.height)
        clearTimeout(this.setChooseTimer);
        this.setChooseTimer = egret.setTimeout(this.showFirstItem,this,200)
        this.scrollTime = egret.getTimer();
        //if(this.upGroup.visible && this.upGroup.y == this.upGroupY)
        //    this.closeGroup();
    }

    private onScrollEnd(){
        if(egret.getTimer() - this.scrollTime < 500)
            this.onScroll();
    }

    private showFirstItem(){
        var firstItem = this.vGroup.getFirstItem(this.scroller.viewport.scrollV);
        if(firstItem)
            this.setChoose(firstItem.data)
    }

    public setChoose(chooseData,isClick?){
        clearTimeout(this.setChooseTimer);
        if(this.lastChooseData == chooseData)
            return;

        var item = chooseData[chooseData.length - 1];
        if(!item || !item.result)
            return;

        if(isClick)
            console.log(chooseData)
        var data = item.result.player1;
        this.hpText0.text = data.hp  + '/' + data.maxHp;
        this.mpText0.text = data.mp  + '/' + data.maxMp;
        this.apText0.text = data.ap  + '/' + 30;
        this.hpBar0.width =  Math.min(1,data.hp  / data.maxHp) * this.barWidth;
        this.mpBar0.width =  Math.min(1,data.mp  / data.maxMp) * this.barWidth;
        this.apBar0.width =  Math.min(1,data.ap  / 30) * this.barWidth;
        this.statList0.dataProvider = new eui.ArrayCollection(JSON.parse(data.buffList));

        var data = item.result.player2;
        this.hpText1.text = data.hp  + '/' + data.maxHp;
        this.mpText1.text = data.mp  + '/' + data.maxMp;
        this.apText1.text = data.ap  + '/' + 30;
        this.hpBar1.width =  Math.min(1,data.hp  / data.maxHp) * this.barWidth;
        this.mpBar1.width =  Math.min(1,data.mp  / data.maxMp) * this.barWidth;
        this.apBar1.width =  Math.min(1,data.ap  / 30) * this.barWidth;
        this.statList1.dataProvider = new eui.ArrayCollection(JSON.parse(data.buffList));

        for(var i=0;i<this.vGroup.numChildren;i++)
        {
            (<any>this.vGroup.getChildAt(i)).setChoose(chooseData);
        }
        //for(var i=0;i<this.list.numChildren;i++)
        //{
        //    (<any>this.list.getChildAt(i)).setChoose(chooseData);
        //}
        this.lastChooseData = chooseData
    }

    //private closeGroup(){
    //    for(var i=0;i<this.vGroup.numChildren;i++)
    //    {
    //        (<any>this.vGroup.getChildAt(i)).setChoose(null);
    //    }
    //    var tw:egret.Tween = egret.Tween.get(this.upGroup);
    //    tw.to({y:-100},200).call(function() {
    //        this.upGroup.visible = false;
    //    },this);
    //}

    //public show(){
    //    super.show();
    //}

    public onShow(){
        this.upGroup.visible = false;
        this.listArray = [];
        this.currentList = [];
        this.lastChooseData = null;
        this.listArray.push(this.currentList);
        var VM = VideoManager.getInstance();
        var VC = VideoCode.getInstance()
        VC.initData(VM.baseData);
        VC.play(true);
        //this.upGroup.visible = false;
        //this.visible = false;
    }

    //单个回合结束
    public roundOver(v?){
        if(this.currentList.length > 0)
        {
            this.currentList = [];
            this.listArray.push(this.currentList);
        }

        var VC = VideoCode.getInstance();
        VC.onMovieOver();
    }

    //PK结束
    public onOver(v?){

        this.listArray.push({type:'over',isWin:VideoManager.getInstance().baseData.result.w == 1})
        this.vGroup.setData(this.listArray);
        this.scroller.viewport.scrollV = 0;
        egret.setTimeout(function(){
            this.onScroll();
            this.showFirstItem();
            this.upGroup.visible = true;
        },this,200)
        //this.list.dataProvider = new eui.ArrayCollection(this.listArray);
    }

    //加入一个动画
    public playSkill(v?){
        this.currentList.push(v);
        var VC = VideoCode.getInstance();
        VC.onMovieOver();
    }
}