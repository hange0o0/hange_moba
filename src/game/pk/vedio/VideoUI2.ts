class VideoUI2 extends game.BaseUI {
    private static instance:VideoUI2;

    public static getInstance() {
        if (!this.instance) this.instance = new VideoUI2();
        return this.instance;
    }


    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private list: eui.List;
    private upGroup: eui.Group;
    private upBtn: eui.Group;
    private playerGroup1: eui.Group;
    private playerGroup2: eui.Group;
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
    private guideBtn: eui.Image;
    private guideMC: VideoGuide;


    private vGroup = new VScrollerGroup();


    private listArray = [];
    private currentList = []
    private barWidth = 220;
    //private upGroupY = 70;
    public lastChooseData;
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
        this.vGroup.scroller = this.scroller;

        this.topUI.addEventListener('hide',this.hide,this);

        this.statList0.itemRenderer = VideoTopStatItem;
        this.statList1.itemRenderer = VideoTopStatItem;

        this.upGroup.visible = false;
        this.guideMC.visible = false;


        this.addBtnEvent(this.guideBtn,this.openGuide);
        this.addBtnEvent(this.playerGroup1,this.playerClick1);
        this.addBtnEvent(this.playerGroup2,this.playerClick2);
    }

    public showMVDebug(v?){}
    public addToGroup(v?){}

    private playerClick1(){
        this.showPlayer(1)
    }
    private playerClick2(){
        this.showPlayer(2)
    }
    private showPlayer(team){
        var VC = VideoCode.getInstance();
        var chooseData = this.lastChooseData;
        var item = chooseData[chooseData.length - 1];
        var data = item.result['player' + team];
        var otherBuff = item.result.otherBuff;
        var playerList = [];
        for(var s in VC.playerObject)
        {
            if(VC.playerObject[s].teamID == team && VC.playerObject[s].id >=10)
                playerList.push(VC.playerObject[s]);
        }
        ArrayUtil.sortByField(playerList,['id'],[0])

        for(var j=0;j<playerList.length;j++)
        {
            var baseData = playerList[j];

            var atk = 0
            var speed = 0
            var def = 0;
            var list = JSON.parse(j==0?data.buffList:(otherBuff[baseData.id] || '[]'));

            var arr = [];
            for(var i=0;i<list.length;i++)
            {
                var oo = list[i];
                switch(oo.id)
                {
                    case 1:
                    case 11:
                        atk += oo.value;
                        break;
                    case 2:
                    case 12:
                        speed += oo.value;
                        break;
                    case 3:
                    case 13:
                        def += oo.value;
                        break;
                }
                if(!oo.forever || oo.id >20)
                {
                    arr.push(oo);
                }
            }
            console.log('id:',baseData.id,'=======================================')
            if(j == 0)
            {
                var data = item.result.player1;
                console.log('hp:',data.hp  + '/' + data.maxHp)
                console.log('mp:',data.mp  + '/' + data.maxMp)
                console.log('ap:',data.ap  + '/' + PKManager.ApMax)
            }

            console.log('atk:',baseData.atk,atk)
            console.log('speed:',baseData.speed,speed)
            if(j == 0)
                console.log('def:',def)
            console.log('buff:',JSON.stringify(arr))
        }

    }

    private openGuide(){
        this.guideMC.visible = true;
        this.guideMC.renew(this.lastChooseData,this.listArray)
    }

    public scrollTo(item){
        this.guideMC.visible = false;
        this.vGroup.scrollToItem(item);
        this.setChoose(item,true)
    }

    private onScroll(){
        //this.scroller.stopAnimation();
        this.vGroup.onScroll(this.scroller.viewport.scrollV)
        egret.clearTimeout(this.setChooseTimer);
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
        egret.clearTimeout(this.setChooseTimer);
        if(this.lastChooseData == chooseData)
            return;

        var item = chooseData[chooseData.length - 1];
        if(!item || !item.result)
            return;

        if(isClick)
        {
            this.scrollTime = 0;
            this.scroller.stopAnimation();
        }

        var data = item.result.player1;
        this.hpText0.text = data.hp  + '/' + data.maxHp;
        this.mpText0.text = data.mp  + '/' + data.maxMp;
        this.apText0.text = data.ap  + '/' + PKManager.ApMax;
        this.hpBar0.width =  Math.min(1,data.hp  / data.maxHp) * this.barWidth;
        this.mpBar0.width =  Math.min(1,data.mp  / data.maxMp) * this.barWidth;
        this.apBar0.width =  Math.min(1,data.ap  / PKManager.ApMax) * this.barWidth;
        this.statList0.dataProvider = new eui.ArrayCollection(getList(JSON.parse(data.buffList)));

        var data = item.result.player2;
        this.hpText1.text = data.hp  + '/' + data.maxHp;
        this.mpText1.text = data.mp  + '/' + data.maxMp;
        this.apText1.text = data.ap  + '/' + PKManager.ApMax;
        this.hpBar1.width =  Math.min(1,data.hp  / data.maxHp) * this.barWidth;
        this.mpBar1.width =  Math.min(1,data.mp  / data.maxMp) * this.barWidth;
        this.apBar1.width =  Math.min(1,data.ap  / PKManager.ApMax) * this.barWidth;
        this.statList1.dataProvider = new eui.ArrayCollection(getList(JSON.parse(data.buffList)));

        for(var i=0;i<this.vGroup.numChildren;i++)
        {
            (<any>this.vGroup.getChildAt(i)).setChoose(chooseData,isClick);
        }
        //for(var i=0;i<this.list.numChildren;i++)
        //{
        //    (<any>this.list.getChildAt(i)).setChoose(chooseData);
        //}
        this.lastChooseData = chooseData

        function getList(data){
            var arr = [];
            for(var i=0;i<data.length;i++)
            {
                if(!data[i].forever)
                {
                    arr.push(data[i]);
                }
            }
            return arr;
        }
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
        this.visible = false;
        this.openGuide();
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
        for(var i=0;i<this.listArray.length;i++)//重新编号
        {
            this.listArray[i][0].index = i+1;
        }

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