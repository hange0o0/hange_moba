class VideoUI2 extends game.BaseUI {
    private static instance:VideoUI2;

    public static getInstance() {
        if (!this.instance) this.instance = new VideoUI2();
        return this.instance;
    }


    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    //private list: eui.List;
    private upGroup: eui.Group;
    private upBtn: eui.Group;
    private playerGroup1: eui.Group;
    private hpBar0: eui.Rect;
    private hpText0: eui.Label;
    private mpBar0: eui.Rect;
    private mpText0: eui.Label;
    private apBar0: eui.Rect;
    private apText0: eui.Label;
    private headMC0: eui.Image;
    private statList0: eui.List;
    private playerGroup2: eui.Group;
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
    private resultMC: eui.Group;
    private rbg1: eui.Image;
    private rbg2: eui.Image;
    private rbg3: eui.Image;
    private myItemGroup: eui.Group;
    private myItem0: VideoItem;
    private myItem1: VideoItem;
    private myItem2: VideoItem;
    private enemyItemGroup: eui.Group;
    private enemyItem0: VideoItem;
    private enemyItem1: VideoItem;
    private enemyItem2: VideoItem;



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
        this.vGroup.margin = 20;

        this.topUI.setTitle('战斗回放');
        this.topUI.addEventListener('hide',this.hide,this);

        this.statList0.itemRenderer = VideoTopStatItem;
        this.statList1.itemRenderer = VideoTopStatItem;

        this.upGroup.visible = false;
        this.guideMC.visible = false;


        this.addBtnEvent(this.guideBtn,this.openGuide);
        this.addBtnEvent(this.playerGroup1,this.playerClick1);
        this.addBtnEvent(this.playerGroup2,this.playerClick2);

        MyTool.removeMC(this.resultMC);

        DragManager.getInstance().setDrag(this.guideBtn,true);
        this.guideBtn.addEventListener('end_drag',this.onDragEnd,this);
    }

    public showMVDebug(v?){}
    public addToGroup(v?){}


    private dragTimer = 0;
    private onDragEnd(){
        var w = 93
        var h = 86
        var toY = this.stage.stageHeight - h - 10;
        var toX = 10;
        if(this.guideBtn.x > 320)
        {
            toX = 640-w - 10;
        }
        var dis = MyTool.getDis(this.guideBtn,{x:toX,y:toY});
        if(dis > 0)
        {
            var tw:egret.Tween = egret.Tween.get(this.guideBtn)
            tw.to({x:toX,y:toY},Math.pow(dis,0.8));
        }
        this.dragTimer = egret.getTimer();
    }


    public beforeHide(){
        this.clearList([this.statList0,this.statList1])
        this.vGroup.clean()
    }


    private playerClick1(){
        this.showPlayer(1)
    }
    private playerClick2(){
        this.showPlayer(2)
    }
    private showPlayer(team){
        VideoDetailUI.getInstance().show({data:this.lastChooseData,team:team});
    }

    private openGuide(){
        if(egret.getTimer() - this.dragTimer < 200)
            return;
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
        var VC = VideoCode.getInstance();

        var data = item.result.player1;
        this.headMC0.source = VC.player1.mvo.thumb;
        this.hpText0.text = data.hp  + '/' + data.maxHp;
        this.mpText0.text = data.mp  + '/' + data.maxMp;
        this.apText0.text = data.ap  + '/' + PKManager.ApMax;
        this.hpBar0.width =  Math.min(1,data.hp  / data.maxHp) * this.barWidth;
        this.mpBar0.width =  Math.min(1,data.mp  / data.maxMp) * this.barWidth;
        this.apBar0.width =  Math.min(1,data.ap  / PKManager.ApMax) * this.barWidth;
        this.statList0.dataProvider = new eui.ArrayCollection(getList(JSON.parse(data.buffList)));




        var data = item.result.player2;
        this.headMC1.source = VC.player2.mvo.thumb;
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
        //return;
        this.upGroup.visible = false;
        this.listArray = [];
        this.currentList = [];
        this.lastChooseData = null;
        this.listArray.push(this.currentList);
        //this.once(egret.Event.ENTER_FRAME,function(){
            var VM = VideoManager.getInstance();
            var VC = VideoCode.getInstance()
            VC.initData(VM.baseData);
            VC.play(true);
            //this.upGroup.visible = false;
            //this.visible = false;
            this.openGuide();
            this.onDragEnd();
        //},this)

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

            for(var i=0;i<this.vGroup.numChildren;i++)
            {
                (<any>this.vGroup.getChildAt(i)).setChoose(this.lastChooseData);
            }
            //this.showFirstItem();
            this.renewResultMC();
        },this,200)

        this.setChoose(this.listArray[0])
        this.upGroup.visible = true;

        //this.list.dataProvider = new eui.ArrayCollection(this.listArray);

    }

    public renewResultMC(){
        if(VideoManager.getInstance().baseData.result.w == 1)
        {
            this.rbg1.source = 'pk_win_png'
            this.rbg2.source = 'pk_win_png'
            this.rbg3.source = 'fight_win_png'
        }
        else
        {
            this.rbg1.source = 'pk_fail_png'
            this.rbg2.source = 'pk_fail_png'
            this.rbg3.source = 'fight_fail_1_png'
        }

        var VC = VideoCode.getInstance();
        var team1 = [];
        var team2 = [];
        var hurt = 0
        var heal = 0;
        //var hurtMax = 0;
        //var healMax = 0;
        for(var s in VC.playerObject)
        {
            var player = VC.playerObject[s]
            if(player.id >=10)
            {
                if(player.teamID == 1)
                    team1.push(player);
                else
                    team2.push(player);
            }
            hurt = Math.max(hurt, player.hurtCount);
            heal = Math.max(heal, player.healCount);
        }
        ArrayUtil.sortByField(team1,['id'],[0])
        ArrayUtil.sortByField(team2,['id'],[0])
        hurt = hurt || 1
        heal = heal || 1
        for(var i=0;i<3;i++)
        {
            var mc1 = this['myItem' + i];
            var mc2 = this['enemyItem' + i];
            if(team1[i])
                mc1.data = {player:team1[i],heal:heal,hurt:hurt}
            else
                mc1.visible = false;

            if(team2[i])
                mc2.data = {player:team2[i],heal:heal,hurt:hurt}
            else
                mc2.visible = false;
        }
    }

    //加入一个动画
    public playSkill(v?){
        this.currentList.push(v);
        var VC = VideoCode.getInstance();
        VC.onMovieOver();
    }
}