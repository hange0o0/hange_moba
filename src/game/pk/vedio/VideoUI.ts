class VideoUI extends game.BaseUI {
    private static instance:VideoUI;

    public static getInstance() {
        if (!this.instance) this.instance = new VideoUI();
        return this.instance;
    }


    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private upGroup: eui.Group;
    private playerGroup1: eui.Group;
    private hpBar0: eui.Rect;
    private hpText0: eui.Label;
    private mpBar0: eui.Rect;
    private mpText0: eui.Label;
    private apBar0: eui.Rect;
    private apText0: eui.Label;
    private headMC0: eui.Image;
    private team1BG: eui.Image;
    private atkText0: eui.Label;
    private speedText0: eui.Label;
    private defGroup0: eui.Group;
    private defText0: eui.Label;
    private statList0: eui.List;
    private playerGroup2: eui.Group;
    private hpBar1: eui.Rect;
    private hpText1: eui.Label;
    private mpBar1: eui.Rect;
    private mpText1: eui.Label;
    private apBar1: eui.Rect;
    private apText1: eui.Label;
    private headMC1: eui.Image;
    private team2BG: eui.Image;
    private defGroup1: eui.Group;
    private defText1: eui.Label;
    private speedText1: eui.Label;
    private atkText1: eui.Label;
    private statList1: eui.List;
    private topUI: TopUI;
    private guideBtn: eui.Group;
    private guideMC: VideoGuide;
    private resultMC: eui.Group;
    private rbg1: eui.Image;
    private rbg2: eui.Image;
    private rbg3: eui.Image;
    private b1: eui.Rect;
    private f1: eui.Rect;
    private rhpText1: eui.Label;
    private rheadMC1: VideoMonsterItem;
    private b0: eui.Rect;
    private f0: eui.Rect;
    private rhpText0: eui.Label;
    private rheadMC0: VideoMonsterItem;
    private resultText: eui.Label;
    private myItemGroup: eui.Group;
    private myItem0: VideoItem;
    private myItem1: VideoItem;
    private myItem2: VideoItem;
    private enemyItemGroup: eui.Group;
    private enemyItem0: VideoItem;
    private enemyItem1: VideoItem;
    private enemyItem2: VideoItem;
    private tipsGroup: eui.Group;
    private videoInfo: VideoInfoUI;












    private vGroup = new VScrollerGroup();


    public listArray = [];
    //private currentList = []
    private barWidth = 220;
    //private upGroupY = 70;
    public lastChooseData;
    private scrollTime;
    private setChooseTimer

    public debugShow = false



    public currentVideoIndex = 0;
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
        this.vGroup.margin = -1;
        this.vGroup.desTop = 15;
        this.vGroup.marginBottom = 10;


        this.topUI.addEventListener('hide',this.hide,this);

        this.statList0.itemRenderer = VideoTopStatItem;
        this.statList1.itemRenderer = VideoTopStatItem;

        this.upGroup.visible = false;
        this.guideMC.visible = false;


        this.addBtnEvent(this.guideBtn,this.openGuide);
        //this.addBtnEvent(this.playerGroup1,this.playerClick1);
        //this.addBtnEvent(this.playerGroup2,this.playerClick2);
        this.upGroup.addEventListener(egret.Event.RESIZE,this.onUpResize,this)

        MyTool.removeMC(this.resultMC);

        DragManager.getInstance().setDrag(this.guideBtn,true);
        this.guideBtn.addEventListener('end_drag',this.onDragEnd,this);

        this.tipsGroup.touchChildren = this.tipsGroup.touchEnabled = false;
        this.setHtml(this.resultText,this.createHtml('伤害',0xFF0000) + ' & ' + this.createHtml('回血',0x00FF00))
    }

    private onUpResize(){
        if(this.guideMC.visible)
        {
            this.guideMC.height = GameManager.stage.stageHeight - 70 - this.upGroup.height
            this.guideMC.y = GameManager.stage.stageHeight - this.guideMC.height
        }
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

   public showInfo(data){
        this.videoInfo.showInfo(data)
   }
   public showSkill(data,svo){
       this.videoInfo.showSkill(data,svo)
   }
   public showLeaderSkill(data,svo){
       this.videoInfo.showLeaderSkill(data,svo)
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

        this.upGroup.visible = true;
        this.upGroup.y = -130;
        var tw = egret.Tween.get(this.upGroup);
        tw.wait(200).to({y:70},100);

        this.guideMC.visible = true;
        this.guideMC.height = GameManager.stage.stageHeight - 70 - this.upGroup.height
        this.guideMC.y = GameManager.stage.stageHeight;
        var tw = egret.Tween.get(this.guideMC);
        tw.to({y:GameManager.stage.stageHeight - this.guideMC.height},300);





        this.guideMC.renew(this.lastChooseData,this.listArray)
    }

    public closeGuide(){
        var tw = egret.Tween.get(this.guideMC);
        tw.to({y:GameManager.stage.stageHeight},300).call(function(){
            this.guideMC.visible = false;
            this.upGroup.visible = false;
            this.guideMC.onClose()
        },this);

        var tw = egret.Tween.get(this.upGroup);
        tw.to({y:-130},100);

        if(this.tipsGroup.alpha)
        {
            console.log(9999)
            this.tipsGroup.visible = true;
            var tw:egret.Tween = egret.Tween.get(this.tipsGroup);
            tw.wait(3000).to({alpha:0}, 300).call(function(){
                this.tipsGroup.visible = false;
            },this)
        }
    }

    public scrollTo(item){
        this.closeGuide();
        this.vGroup.scrollToItem(item);
        //this.setChoose(item)
    }

    private onScroll(){
        //this.scroller.stopAnimation();
        this.vGroup.onScroll(this.scroller.viewport.scrollV)
        //egret.clearTimeout(this.setChooseTimer);
        //this.setChooseTimer = egret.setTimeout(this.showFirstItem,this,200)
        this.scrollTime = egret.getTimer();
        //if(this.upGroup.visible && this.upGroup.y == this.upGroupY)
        //    this.closeGroup();

        if(this.tipsGroup.alpha)
        {
            this.tipsGroup.visible = false;
            egret.Tween.removeTweens(this.tipsGroup)
            this.tipsGroup.alpha = 0;
        }

    }

    private onScrollEnd(){
        if(egret.getTimer() - this.scrollTime < 500)
            this.onScroll();
    }

    //private showFirstItem(){
    //    var firstItem = this.vGroup.getFirstItem(this.scroller.viewport.scrollV);
    //    if(firstItem)
    //        this.setChoose(firstItem.data)
    //}

    public setChoose(chooseData,isClick?){

        egret.clearTimeout(this.setChooseTimer);
        //if(isClick)
        //{
        //    this.openGuide();
        //    //this.scrollTime = 0;
        //    //this.scroller.stopAnimation();
        //    //if(this.tipsGroup.alpha)
        //    //{
        //    //    this.tipsGroup.visible = true;
        //    //    var tw:egret.Tween = egret.Tween.get(this.tipsGroup);
        //    //    tw.wait(800).to({alpha:0}, 300).call(function(){
        //    //        this.tipsGroup.visible = false;
        //    //    },this)
        //    //}
        //}
        if(this.lastChooseData == chooseData)
        {
            if(isClick)
            {
                this.openGuide();
            }
            return;
        }

        this.team1BG.visible = this.team2BG.visible = false
        var item = chooseData[chooseData.length - 1];
        if(!item || !item.result)
            return;

        this.lastChooseData = chooseData
        if(isClick)
        {
            this.openGuide();
        }

        var VC = VideoCode.getInstance();

        var base = chooseData[0];
        var atker = VC.getPlayerByID(base.atker);
        if(atker.teamID == 1)
            this.team1BG.visible = true;
        else
            this.team2BG.visible = true;

        var data = item.result.player1;
        this.headMC0.source = VC.player1.mvo.thumb;
        this.hpText0.text = data.hp  + '/' + data.maxHp;
        this.mpText0.text = data.mp  + '/' + data.maxMp;
        this.apText0.text = data.ap  + '/' + PKManager.ApMax;
        this.hpBar0.width =  Math.min(1,data.hp  / data.maxHp) * this.barWidth;
        this.mpBar0.width =  Math.min(1,data.mp  / data.maxMp) * this.barWidth;
        this.apBar0.width =  Math.min(1,data.ap  / PKManager.ApMax) * this.barWidth;

        var buff = JSON.parse(data.buffList);
        var valueAdd = this.getValueAdd(buff);
        if(valueAdd.atk)
        {
            this.setHtml(this.atkText0,this.createHtml(valueAdd.atk + VC.player1.atk,valueAdd.atk>0?0x00FF00:0xFF0000));
        }
        else
        {
            this.atkText0.text = VC.player1.atk;
        }

        if(valueAdd.speed)
        {
            this.setHtml(this.speedText0,this.createHtml(valueAdd.speed + VC.player1.speed,valueAdd.speed>0?0x00FF00:0xFF0000));
        }
        else
        {
            this.speedText0.text = VC.player1.speed;
        }

        if(valueAdd.def)
        {
            this.defGroup0.visible = true
            if(valueAdd.def > 0)
                this.setHtml(this.defText0,'' + this.createHtml('+' + valueAdd.def + '%',0x00FF00));
            else
                this.setHtml(this.defText0,'' + this.createHtml('' + valueAdd.def + '%',0xFF0000));
        }
        else
        {
            this.defGroup0.visible = false
        }

        this.statList0.dataProvider = new eui.ArrayCollection(getList(buff));




        var data = item.result.player2;
        this.headMC1.source = VC.player2.mvo.thumb;
        this.hpText1.text = data.hp  + '/' + data.maxHp;
        this.mpText1.text = data.mp  + '/' + data.maxMp;
        this.apText1.text = data.ap  + '/' + PKManager.ApMax;
        this.hpBar1.width =  Math.min(1,data.hp  / data.maxHp) * this.barWidth;
        this.mpBar1.width =  Math.min(1,data.mp  / data.maxMp) * this.barWidth;
        this.apBar1.width =  Math.min(1,data.ap  / PKManager.ApMax) * this.barWidth;

        var buff = JSON.parse(data.buffList);
        var valueAdd = this.getValueAdd(buff);
        if(valueAdd.atk)
        {
            this.setHtml(this.atkText1,this.createHtml(valueAdd.atk + VC.player2.atk,valueAdd.atk>0?0x00FF00:0xFF0000));
        }
        else
        {
            this.atkText1.text = VC.player2.atk;
        }

        if(valueAdd.speed)
        {
            this.setHtml(this.speedText1,this.createHtml(valueAdd.speed + VC.player2.speed,valueAdd.speed>0?0x00FF00:0xFF0000));
        }
        else
        {
            this.speedText1.text = VC.player2.speed;
        }

        if(valueAdd.def)
        {
            this.defGroup1.visible = true
            if(valueAdd.def > 0)
                this.setHtml(this.defText1,'' + this.createHtml('+' + valueAdd.def + '%',0x00FF00));
            else
                this.setHtml(this.defText1,'' + this.createHtml('' + valueAdd.def + '%',0xFF0000));
        }
        else
        {
            this.defGroup1.visible = false
        }

        var buffList = getList(buff);
        this.statList1.dataProvider = new eui.ArrayCollection(buffList);
        (<eui.TileLayout>this.statList1.layout).requestedColumnCount = Math.min(8,buffList.length);


        //for(var i=0;i<this.vGroup.numChildren;i++)
        //{
        //    (<any>this.vGroup.getChildAt(i)).setChoose(chooseData,isClick);
        //}
        //for(var i=0;i<this.list.numChildren;i++)
        //{
        //    (<any>this.list.getChildAt(i)).setChoose(chooseData);
        //}


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

    private getValueAdd(list){
        var atk = 0
        var speed = 0
        var def = 0;
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
        }
        return{
            atk:atk,
            speed:speed,
            def:def,
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

    public hide(){
        super.hide();
        //PKResultUI.getInstance().tempShow();
        GuideManager.getInstance().showGuide(PKFailUI.getInstance())
    }

    public onShow(){
        this.currentVideoIndex = VideoManager.getInstance().index;
        this.topUI.setTitle('战报 - 第'+StringUtil.numToStr(VideoManager.getInstance().index+1)+'轮');
        //return;
        this.upGroup.visible = false;
        this.listArray = VideoCode.getInstance().listArray;
        //this.currentList = [];
        this.lastChooseData = null;
        //this.listArray.push(this.currentList);
        //this.once(egret.Event.ENTER_FRAME,function(){

            //this.upGroup.visible = false;
            //this.visible = false;
        this.onOver()
        this.onDragEnd();
        //},this)

        if(this.debugShow)
            this.visible = false;

        this.tipsGroup.visible = false;
        this.videoInfo.visible = false;

        //PKResultUI.getInstance().tempHide();

        if(GuideManager.getInstance().isGuiding)
            PKResultUI.getInstance()['scroller'].viewport.scrollV = 0;

    }

    //单个回合结束
    //public roundOver(v?){
    //    var VC = VideoCode.getInstance();
    //    if(this.currentList.length > 0)
    //    {
    //        VC.addRoundOverData();
    //        this.currentList = [];
    //        this.listArray.push(this.currentList);
    //    }
    //    VC.onMovieOver();
    //}

    //PK结束
    public onOver(){
        //for(var i=0;i<this.listArray.length;i++)//重新编号
        //{
        //    this.listArray[i][0].index = i+1;
        //}
        //
        //this.listArray.push({type:'over',isWin:VideoManager.getInstance().baseData.result.w == 1})
        this.vGroup.setData(this.listArray);
        this.scroller.viewport.scrollV = 0;
        egret.setTimeout(function(){
            this.vGroup.onScroll(this.scroller.viewport.scrollV)


            //for(var i=0;i<this.vGroup.numChildren;i++)
            //{
            //    (<any>this.vGroup.getChildAt(i)).setChoose(this.lastChooseData);
            //}
            //this.showFirstItem();
            this.renewResultMC();
        },this,500)

        this.setChoose(this.listArray[0])
        //
        //this.lastChooseData = this.listArray[0];
        this.upGroup.visible = true;
        this.guideMC.visible = true;
        this.upGroup.y = 70
        this.guideMC.y = 70 + this.upGroup.height
        this.guideMC.height = GameManager.stage.stageHeight - 70 - this.upGroup.height
        this.guideMC.renew(this.lastChooseData,this.listArray)

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
            {
                mc1.data = {player:team1[i],heal:heal,hurt:hurt}
                this.myItemGroup.addChild(mc1);
            }
            else
                MyTool.removeMC(mc1)

            if(team2[i])
            {
                mc2.data = {player:team2[i],heal:heal,hurt:hurt}
                this.enemyItemGroup.addChild(mc2);
            }
            else
                MyTool.removeMC(mc2)
        }


        this.renewResultHP();
        this.rheadMC0.data = VC.player1;
        this.rheadMC1.data = VC.player2;
        if(VC.player1.hp == 0)
            this.rheadMC0.changeGray()
        if(VC.player2.hp == 0)
            this.rheadMC1.changeGray()
    }


    public renewResultHP() {
        var data = PKManager.getInstance().pkList[VideoManager.getInstance().index];
        var decColor = 0xFF0000
        var addColor = 0x00FF00
        var defColor = 0x740714
        var barWidth = 220;

        this.f0.fillColor = defColor;
        this.f1.fillColor = defColor;




        var player = data.player1
        var before = player.before/Math.max(player.beforeMax,player.afterMax);
        var after = player.after/player.afterMax;
        if(before > after) //-
        {
            this.b0.fillColor = decColor;
            this.b0.width = barWidth * before
            this.f0.width = barWidth * after
        }
        else
        {
            this.b0.fillColor = addColor;
            this.b0.width = barWidth * after
            this.f0.width = barWidth * before
        }
        var dec = player.after - player.before
        if(dec > 0)
        {
            this.rhpText0.text = '+' + dec
            this.rhpText0.textColor = addColor;
        }
        else if(dec < 0)
        {
            this.rhpText0.text = '' + dec
            this.rhpText0.textColor = decColor;
        }
        else
            this.rhpText0.text = '--';


        var player = data.player2
        var before = player.before/Math.max(player.beforeMax,player.afterMax);
        var after = player.after/player.afterMax;
        if(before > after) //-
        {
            this.b1.fillColor = decColor;
            this.b1.width = barWidth * before
            this.f1.width = barWidth * after
        }
        else
        {
            this.b1.fillColor = addColor;
            this.b1.width = barWidth * after
            this.f1.width = barWidth * before
        }
        var dec = player.after - player.before
        if(dec > 0)
        {
            this.rhpText1.text = '+' + dec
            this.rhpText1.textColor = addColor;
        }
        else if(dec < 0)
        {
            this.rhpText1.text = '' + dec
            this.rhpText1.textColor = decColor;
        }
        else
            this.rhpText1.text = '--';
    }


    //
    ////加入一个动画
    //public playSkill(v?){
    //    this.currentList.push(v);
    //    var VC = VideoCode.getInstance();
    //    VC.onMovieOver();
    //}
}