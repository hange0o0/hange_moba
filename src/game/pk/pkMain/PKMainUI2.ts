class PKMainUI extends game.BaseUI {
    private static instance:PKMainUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKMainUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "PKMainUI2Skin";
        this.hideVisible = true;
    }


    private bgBlack: eui.Rect;
    private bgGroup: eui.Group;
    private bg1: eui.Image;
    private bg0: eui.Image;
    private con: eui.Group;
    private downBG: eui.Group;
    private roleCon: eui.Group;
    private effectCon: eui.Group;
    private cloudGroup: eui.Group;
    private upGroup: eui.Group;
    private hpGroup: eui.Group;
    private hpBar0_: eui.Rect;
    private hpBar0: eui.Rect;
    private hpText0: eui.Label;
    private hpBar1_: eui.Rect;
    private hpBar1: eui.Rect;
    private hpText1: eui.Label;
    private playerGroup1: eui.Group;
    private nameText0: eui.Label;
    private ms2: eui.Image;
    private ms1: eui.Image;
    private ms0: eui.Image;
    private mpBar0: eui.Rect;
    private mpText0: eui.Label;
    private apBar0: eui.Rect;
    private apText0: eui.Label;
    private headMC0: eui.Image;
    private atkText0: eui.Label;
    private speedText0: eui.Label;
    private defGroup0: eui.Group;
    private defText0: eui.Label;
    private statList0: eui.Group;
    private playerGroup2: eui.Group;
    private es2: eui.Image;
    private es1: eui.Image;
    private es0: eui.Image;
    private nameText1: eui.Label;
    private mpBar1: eui.Rect;
    private mpText1: eui.Label;
    private apBar1: eui.Rect;
    private apText1: eui.Label;
    private headMC1: eui.Image;
    private defGroup1: eui.Group;
    private defText1: eui.Label;
    private speedText1: eui.Label;
    private atkText1: eui.Label;
    private statList1: eui.Group;
    private resultGroup: eui.Group;
    private resultBG: eui.Rect;
    private resultMC: eui.Group;
    private rbg0: eui.Image;
    private rbg1: eui.Image;
    private rbg2: eui.Image;
    private resultBtnGroup: eui.Group;
    private backBtn: eui.Button;
    private nextBtn: eui.Button;
    private reviewBtn: eui.Button;
    private skillGroup: eui.Group;
    private skillBG: eui.Rect;
    private monsterGroup: eui.Group;
    private monsterMC: eui.Image;
    private skillText: eui.Label;
    private jumpBtn: eui.Group;
    private jumpCon: eui.Group;
    private jumpArrow: eui.Image;
    private jumpBtn2: eui.Group;
    private jumpIcon: eui.Image;
    private bottomMC: eui.Image;
    private topMC: eui.Image;
    private roundGroup: eui.Group;
    private roundMC1: eui.Image;
    private roundMC2: eui.Image;
    private roundText: eui.Label;











    //private dataIn;
    private stageHeight;
    private itemWidth = 114;
    private itemHeight = 110;
    private barWidth = 220;
    private fightHeight = 425
    private fightWidth = 640
    private conHeight = 960


    //private itemCollect = [];
    //private itemEnemy = [];
    //private itemSelf = [];
    private talkList = [];
    private emoList = [];
    private statItem = new VideoStatItem()

    private selfPKing
    private enemyPKing
    private index;
    private pkStep

    private itemArray = []
    private poolArray = [];
    private textPool = [];
    private textArray = [];
    private listArray = [];




    private cardIndex1;
    private cardIndex2;
    private timer;
    private count;

    //private posArray = []


    private atker

    private player1
    private player2

    private randomSeed
    private isStop = false


    private scene;
    private pkJump;



    private cloudTimer = 0;
    private cloudArr = [];
    private loadGroup2 = []


    public get speed(){return PKMainMV.getInstance().speed}
    public set speed(v){PKMainMV.getInstance().speed = v}


    public playVideoIndex = 0;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.jumpBtn, this.onChangeSpeed);
        this.addBtnEvent(this.jumpBtn2, this.onQuickJump);
        this.addBtnEvent(this.backBtn, this.onJump);
        this.addBtnEvent(this.nextBtn, this.onNext);
        this.addBtnEvent(this.reviewBtn, this.onReview);

        for(var i=0;i<8;i++)
        {
            this.statList0.addChild(new VideoTopStatItem());
            this.statList1.addChild(new VideoTopStatItem());
        }



        this.bg0.scrollRect = new egret.Rectangle(0,0,325,1500)
        this.bg1.scrollRect = new egret.Rectangle(315,0,325,1500)
    }

    private onQuickJump(){
        if(PKManager.getInstance().pkAward)
        {
            if(GuideManager.getInstance().isGuiding)
            {
                Alert('新手过程中不能跳过')
                return;
            }
            var self = this;
            PKJumpWindow.getInstance().show(function(){
                self.onJump();
            })
        }
        else
            this.onJump();
    }
    private onReview(){
        this.resultGroup.visible = false;
        this.playVideoIndex = this.pkStep
        this.onShow()
    }

    private onChangeSpeed(){
         this.speed = !this.speed
         this.renewJumpBtn();
        SharedObjectManager.instance.setMyValue('pk_speed',this.speed)
    }

    private renewJumpBtn(){
        if(this.speed)
            this.jumpCon.addChild(this.jumpArrow)
        else
            MyTool.removeMC(this.jumpArrow)
    }

    private setTimeout(fun,cd,data?){
        var tw:egret.Tween = egret.Tween.get(this);
        tw.wait(cd).call(fun,this,data)
    }

    private onNext(){
        this.resultGroup.visible = false;
        this.playOneRound()
    }
    private onJump(){

        this.showResult();
    }

    private initSeed(){
        var arr = PKManager.getInstance().team2Base.list; //PKManager.getInstance().team1Base.list.concat(
        this.randomSeed = 0;
        for(var i=0;i<arr.length;i++)
        {
            this.randomSeed += Math.pow(arr[i],2)*(i+1) + arr[i]*100;
        }
        this.randomSeed /= PKManager.getInstance().team1Base.list.length;
        this.randomSeed += this.pkStep*1024
    }

    public random(){
        var seed = this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        this.randomSeed = rd * 100000000;
        return rd;
    }
    public rand(from,to){
       return from + Math.floor((to - from + 1)*this.random())
    }
    private randomSort(arr){
        var self = this;
        var fun = function(a,b){
            if(self.random()>0.5)
                return 1;
            return -1;
        }
        arr.sort(fun);
    }
    private randomOne(arr){
        return arr[Math.floor(this.random()*arr.length)];
    }

    private getItem():PKItem2{
        var item:PKItem2 = this.poolArray.pop();
        if(!item)
        {
            item = new PKItem2();
            item.anchorOffsetX = this.itemWidth/2;
            item.anchorOffsetY = this.itemHeight/2;
        }
        item['jumping'] = false;
        item.alpha = 1;
        item.scaleX = 1;
        item.scaleY = 1;
        item.out = true
        item.action = false
        item.talking = false
        item.isPKing = false
        item.moving = false
        item.die = false
        item.win3 = false
        return item;
    }

    private mvFreeItem(item){
        //if(item.out)
        //    return;
        item.stopMV();
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({alpha:0}, 1000).call(function(){
            this.freeItem(item);
        },this)
    }

    private freeItem(item){
        //if(item.out)
        //    return;
        //item.out = true;
        if(this.poolArray.indexOf(item) == -1)
            this.poolArray.push(item);
        MyTool.removeMC(item);
        item.stopMV();
    }

    private getWordItem():eui.Label{
        var item:eui.Label = this.textPool.pop();
        if(!item)
        {
            item = new eui.Label();
            item['key'] = 'word';
            item.stroke = 3;
            item.width = 160;
            item.size = 26;
            item.anchorOffsetX = 80;
            item.anchorOffsetY = 15;
            item.verticalCenter = 'middle';
            item.textAlign = 'center';
        }
        item.alpha = 1;
        item.scaleX = 1;
        item.scaleY = 1;
        item['addTime'] = egret.getTimer();
        this.textArray.push(item);
        this.effectCon.addChild(item);
        return item;
    }
    private freeWordItem(item){
        egret.Tween.removeTweens(item);
        var index = this.textPool.indexOf(item);
        if(index == -1)
            this.textPool.push(item);
        MyTool.removeMC(item);
        ArrayUtil.removeItem(this.textArray,item);
    }

    private onTimer(){
        if(!this.isStop && egret.getTimer() - this.cloudTimer > 1000*10)
            this.showCound();
    }

    private showCound(b?){
        var rect = {
            x:0,
            y:(this.stageHeight - this.conHeight)/2 + 260 - 100,
            width:640,
            height:this.fightHeight + 100
        }
        var mc = AniManager.getInstance().showCloud(this.cloudGroup,rect,b)


        this.cloudArr.push(mc)
        this.cloudTimer  = egret.getTimer();
    }

    private shakeBG(){
        var tw:egret.Tween = egret.Tween.get(this.bgGroup);
        tw.to({x:-6,y:-5},80).to({x:5,y:3},120).to({x:-2,y:-1},50).to({x:0,y:0},30)
    }



    public show(v?,noJump?){
        this.playVideoIndex = v;
        this.pkJump = PKManager.getInstance().pkJump && !v;
        if(noJump)
            this.pkJump = false;
        this.loadGroup2 = [];
        this.pkStep = 0;
        this.initSeed();
        var group = []
        if(!this.pkJump)
        {
            group = VideoManager.getInstance().getVideoAniGroup();
            var arr = PKManager.getInstance().team1Base.list.concat(PKManager.getInstance().team2Base.list);
            var mObj = {};
            for(var i=0;i<arr.length;i++)
            {
                mObj[arr[i]] = true;
            }
            for(var s in mObj)
            {
                if(!RES.getRes('m_thumbr_' + s))
                    group.push('m_thumbr_' + s);
                this.loadGroup2.push('m_thumb_' + s);
            }
        }


        this.scene =  PKManager.getInstance().getPKBG(PKManager.getInstance().pkType,this.random());
        if(!RES.getRes(this.scene))
            group.push(this.scene);




        //console.log(this.scene)
        //if(group.length == 0)
        //    this.LoadFiles = [];
        //else
        //{

        //}
        this.LoadFiles = [];
        if(!RES.isGroupLoaded('pk'))
            this.LoadFiles.push('pk')
        if(group.length > 0)
        {
            RES.createGroup('skill_ani',group,true);
            this.LoadFiles.push('skill_ani')
        }


        this.cardIndex1 = -1;
        this.cardIndex2 = -1;


        if(this.LoadFiles.length > 0)
        {
            this.loadData = {
                min:1200,
                source:PKManager.getInstance().getLoadingBG(PKManager.getInstance().pkType)
            }
            this.loadUI = PKLoadingUI.getInstance();
        }
        else
        {
            this.loadUI = null;
        }
        super.show();
    }

    public onShow() {

        //VideoManager.getInstance().playVideo(PKManager.getInstance().pkType,0);
        //this.hide();
        //return;
        PKPosManager.getInstance().controller = this;
        this.speed = SharedObjectManager.instance.getMyValue('pk_speed') || false;
        if(GuideManager.getInstance().isGuiding)
            this.speed = false;
        this.renewJumpBtn();


        if(this.loadUI == null)
        {
            MainPageUI.getInstance().visible = true;
        }
        this.bgBlack.visible = false;
        this.removeAllTweens()
        egret.clearTimeout(this.timer);
        PopUpManager.removeShape();
        this.initView();
        if(this.playVideoIndex)
            this.initIndex();
        else
            this.addSceneMovie();
        this.isStop = false;

        if(!this.pkJump)
            SoundManager.getInstance().playSound(SoundConfig.bg_pk);
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }


    private removeAllTweens(){
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.bgGroup);
        egret.Tween.removeTweens(this.bg0);
        egret.Tween.removeTweens(this.bg1);
        egret.Tween.removeTweens(this.topMC);
        egret.Tween.removeTweens(this.bottomMC);
        egret.Tween.removeTweens(this.jumpBtn);
        egret.Tween.removeTweens(this.jumpBtn2);
        egret.Tween.removeTweens(this.roundGroup);
        egret.Tween.removeTweens(this.skillGroup);
        egret.Tween.removeTweens(this.upGroup);
        egret.Tween.removeTweens(this.con);
        egret.Tween.removeTweens(this.mpBar0);
        egret.Tween.removeTweens(this.mpBar1);

        var arr = this.itemArray;
        for(var i=0;i<arr.length;i++)
        {
            arr[i].stopMV();
        }
    }





    private initView(){
        var stageHeight = this.stageHeight = this.stage.stageHeight;
        this.jumpBtn.visible = false;
        this.jumpBtn2.visible = false;
        this.upGroup.visible = false;
        this.hpGroup.y = 150;
        this.con.visible = false;
        this.roundGroup.visible = false;
        this.skillGroup.visible = false;

        this.resultGroup.visible = false;

        var itemHeight = 123;
        var des = (this.stageHeight - this.conHeight)/2;
        this.topMC.y = -itemHeight+des
        this.bottomMC.y = this.stageHeight-des
        this.jumpBtn.y =  des + 700;
        this.jumpBtn2.y =  des + 700;


        MyTool.changeGray(this.jumpBtn2,false)
        if(PKManager.getInstance().pkAward)
        {
            this.jumpIcon.source = 'jump_icon_png'
        }
        else
        {
            this.jumpIcon.source = 'jump_icon2_png'

        }
        //this.jumpBtn.bottom = Math.max(10,(stageHeight - this.fightHeight)/2 + 10);

        //var scene = PKManager.getInstance().getPKBG(PKManager.getInstance().pkType);
        this.bg0.source = this.scene;
        this.bg1.source = this.scene;

        this.cloudTimer  = egret.getTimer();

        while(this.itemArray.length > 0)
        {
             this.freeItem(this.itemArray.pop());
        }

        this.roleCon.removeChildren()


        //this.enemyGroup.y = stageHeight/2 - (400+40);
        this.con.y = (stageHeight - this.conHeight)/2 + 260 + 400 + 20
        this.upGroup.y = (stageHeight - this.conHeight)/2 - 400


        for(var i=0;i<this.talkList.length;i++)
        {
            var item = this.talkList[i]
            MyTool.removeMC(item)
            item.active = false;
        }
        for(var i=0;i<this.emoList.length;i++)
        {
            var item = this.emoList[i]
            MyTool.removeMC(item)
            item.active = false;
        }

        this.renewStar();
    }

    private initIndex(){
        var Y =this.stageHeight/2;

        this.bg0.scaleX = this.bg0.scaleY = 1;
        this.bg1.scaleX = this.bg1.scaleY = 1;
        this.bg0.x = 0;
        this.bg0.y = Y;
        this.bg1.x = 315;
        this.bg1.y = Y;


        MainPageUI.getInstance().visible = false;
        PKLoadingUI.getInstance().realHide();
        this.bgBlack.visible = true;
        this.showCound(true)
        this.showCound(true)

        this.con.visible = true;
        this.downBG.visible = true;
        this.con.y = this.con.y-400;
        this.playerGroup1.visible = true
        this.playerGroup2.visible = true
        this.upGroup.visible = true;
        this.upGroup.y = this.upGroup.y+400;
        this.initTeamItem();


        this.jumpBtn.visible = true
        this.jumpBtn.scaleX = this.jumpBtn.scaleY = 1;
        this.jumpBtn.rotation = 0;

        this.jumpBtn2.visible = true
        this.jumpBtn2.scaleX = this.jumpBtn2.scaleY = 1;
        this.jumpBtn2.rotation = 0;


        this.pkStep = this.playVideoIndex - 1;
        this.playOneRound();

        //处理已阵亡单位
        for(var i=0;i<this.itemArray.length;i++)
        {
            var item = this.itemArray[i];
            if((item.team == 1 && item.index < this.selfPKing.index) || (item.team == 2 && item.index < this.enemyPKing.index))
            {
                var winCount = PKManager.getInstance().winCount[item.id]
                if(winCount == 3)
                {
                    item.win3 = true;
                }
                else
                {
                    item.die = true;
                    item.setGray();
                }
                item.showStar(winCount)
            }
        }

    }

    private addSceneMovie(){
        this.touchChildren = this.touchEnabled = false;
        var Y =this.stageHeight/2;
        var desY =  this.random()*200-100
        var scale = 1.5

        this.bg0.x = -320-170;
        this.bg0.y = Y+desY;

        this.bg1.x = 640+170;
        this.bg1.y = Y-desY;

        this.bg0.scaleX = this.bg0.scaleY = scale;
        this.bg1.scaleX = this.bg1.scaleY = scale;
        var tw:egret.Tween = egret.Tween.get(this.bg0);
        var tw2:egret.Tween = egret.Tween.get(this.bg0);
        tw.to({scaleX:1,scaleY:1},500);// .wait(200)
        tw2.to({x:0,y:Y},500,egret.Ease.sineIn); //.wait(200)


        var tw:egret.Tween = egret.Tween.get(this.bg1);
        var tw2:egret.Tween = egret.Tween.get(this.bg1);
        tw.to({scaleX:1,scaleY:1},500).call(function(){
            PKLoadingUI.getInstance().realHide();
            this.bgBlack.visible = true;
            this.shakeBG();
            this.showCound(true)
            this.showCound(true)
            if(PKDressUI.getInstance().stage)
                PKDressUI.getInstance().closeRelate();
        },this).wait(600).call(this.addItemMovie,this);    //.wait(100)
        tw2.to({x:315,y:Y},500,egret.Ease.sineIn) //.wait(100)
    }



    //加所有单位
    private addItemMovie(){
        MainPageUI.getInstance().visible = false;
        if(this.pkJump)
        {
            this.showResult()
            return;
        }

        var tw:egret.Tween = egret.Tween.get(this.con);
        this.con.visible = true;
        this.downBG.visible = true;
        tw.to({y:this.con.y-400},300)

        this.playerGroup1.visible = false
        this.playerGroup2.visible = false
        var tw:egret.Tween = egret.Tween.get(this.upGroup);
        this.upGroup.visible = true;
        tw.to({y:this.upGroup.y+400},300)

      
        this.initTeamItem();


        this.pkStep = 0;
        this.setTimeout(this.playOneRound,1500);
        SoundManager.getInstance().loadPKSound();

        var tw:egret.Tween = egret.Tween.get(this.jumpBtn2);
        this.jumpBtn2.visible = true;
        this.jumpBtn2.scaleX = 0;
        this.jumpBtn2.scaleY = 0;
        this.jumpBtn2.rotation = 0;
        tw.wait(1000).to({scaleX:1.2,scaleY:1.2,rotation:360},300).to({scaleX:1,scaleY:1},300).call(function(){
            if(GuideManager.getInstance().isGuiding)
            {
                MyTool.changeGray(this.jumpBtn2,true)
            }
            this.touchChildren = this.touchEnabled = true;
        },this)

        var tw:egret.Tween = egret.Tween.get(this.jumpBtn);
        this.jumpBtn.visible = true;
        this.jumpBtn.scaleX = 0;
        this.jumpBtn.scaleY = 0;
        this.jumpBtn.rotation = 0;
        tw.wait(1000).to({scaleX:1.2,scaleY:1.2,rotation:360},300).to({scaleX:1,scaleY:1},300)
    }
    
    private initTeamItem(){
        var myTeam = PKManager.getInstance().team1Base.list
        var enemyTeam = PKManager.getInstance().team2Base.list
        if(PKManager.getInstance().teamChange)
        {
            var temp = enemyTeam
            enemyTeam = myTeam
            myTeam = temp
        }

        var myItems = []
        for(var i=0;i<myTeam.length;i++)
        {
            myItems.push(this.addOneItem(myTeam[i],1,i));
        }
        this.resetXY(myItems,1);


        var enemyItems = []
        for(var i=0;i<enemyTeam.length;i++)
        {
            enemyItems.push(this.addOneItem(enemyTeam[i],2,i));
        }
        this.resetXY(enemyItems,2);
    }

    //加一个单位到舞台上
    private addOneItem(data,team,index){
        var item =this.getItem();
        item.data = {vo:MonsterVO.getObject(data),team:team,index:index};
        if(team == 1)
            item.id = 10 + index;
        else
            item.id = 30 + index;

        item.visible = false;
        this.itemArray.push(item);
        this.roleCon.addChild(item);
        return item;
    }

    //定位
    private resetXY(arr,team){
        for(var i=0;i<arr.length;i++)
        {
            var item = arr[i];
            item.y = Math.floor(i/3) * 100 + 510;
            var x = (i%3) * 100
            if(team == 1)
                item.x = x + 60;
            else
                item.x = 320+60 + x;

            item.ox = item.x
            item.oy = item.y
            item.boxX = item.x
            item.boxY = item.y
            if(this.playVideoIndex)
            {
                item.visible = true;
                item.scaleX = 0.85;
                item.scaleY = 0.85;
            }
            else
            {
                if(team == 1)
                    this.setTimeout(this.showItemMV,(i%3) * 200+500,[item])
                else
                    this.setTimeout(this.showItemMV,(2-i%3) * 200+500,[item])
            }

        }
    }

    //玩家出场动画
    private showItemMV(item){
        if(this.isStop)
            return;
        item.parent.addChild(item);
        item.visible = true;

        item.scaleX = 0;
        item.scaleY = 1;
        egret.Tween.removeTweens(item)
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({scaleX:1.2,scaleY:1.2},200).to({scaleX:0.85,scaleY:0.85},300)
    }

    private playOneRound(){
        this.pkStep ++;
        if(!PKManager.getInstance().getVedioBase(this.pkStep - 1))
        {
            this.showResult();
            return;
        }

        VideoManager.getInstance().playVideo(PKManager.getInstance().pkType,this.pkStep - 1);
        this.listArray = VideoCode.getInstance().listArray;
        this.index = 0
        this.outPKer()
        var cd = 1000
        if(this.speed)
            cd = 300;
        if(this.playVideoIndex && this.pkStep == this.playVideoIndex)
        {
            egret.Tween.removeTweens(this.playerGroup1);
            egret.Tween.removeTweens(this.playerGroup2);
            this.playerGroup1.visible = true
            this.playerGroup2.visible = true
            this.mpBar0.width = 1;
            this.mpBar1.width = 1;
            this.playerGroup1.x = 10
            this.playerGroup2.x = 322
            this.inPKer();
        }
        else if(this.pkStep == 1)
        {
            egret.Tween.removeTweens(this.playerGroup1);
            egret.Tween.removeTweens(this.playerGroup2);
            this.playerGroup1.visible = true
            this.playerGroup2.visible = true
            this.playerGroup1.x = -320
            this.playerGroup2.x = 640
            this.mpBar0.width = 1;
            this.mpBar1.width = 1;
            //var tw:egret.Tween = egret.Tween.get(this.playerGroup1);
            //tw.to({x:10},300)
            //var tw:egret.Tween = egret.Tween.get(this.playerGroup2);
            //tw.to({x:322},300)
            this.inPKer();
        }
        else
        {
            var temp = 1000;
            if(this.speed)
                temp = 300;
            this.setTimeout(this.inPKer,temp)
            cd += temp;
        }

        this.setTimeout(this.showRoundTalk,cd)
    }

    private renewStar(){
        if(!this.selfPKing || !this.enemyPKing)//不显示星星
        {
            for(var i=0;i<3;i++)
            {
                this['ms' + i].visible = false
                this['es' + i].visible = false
            }
            return;
        }
        var kill1 = PKManager.getInstance().kill[this.selfPKing.id] || []
        var kill2 = PKManager.getInstance().kill[this.enemyPKing.id] || []
        for(var i=0;i<3;i++)
        {
            this['ms' + i].visible = kill1[i] < this.enemyPKing.index+1;
            this['es' + i].visible = kill2[i] < this.selfPKing.index+1;
        }
        //if(data.kill && data.kill.length > 0 && data.kill.indexOf(i+1) != -1)
    }

    private showRoundTalk(){
        var tw = egret.Tween.get(this.hpGroup)
        tw.to({y:193},300);

        var tw = egret.Tween.get(this.playerGroup1)
        tw.to({x:0},300);

        var tw = egret.Tween.get(this.playerGroup2)
        tw.to({x:322},300);


        this.initSeed();
        if(this.random() > 0.5)
        {
            this.itemTalk(this.enemyPKing)
            this.setTimeout(function(){
                this.itemTalk(this.selfPKing)
            },500)
        }
        else
        {
            this.itemTalk(this.selfPKing)
            this.setTimeout(function(){
                this.itemTalk(this.enemyPKing)
            },500)
        }
        if(this.speed)
            this.setTimeout(this.showRoundMovie,500)
        else
            this.setTimeout(this.showRoundMovie,2000)
    }

    private showRoundMovie(){
        if(this.speed)
        {
            this.pkOne();
            return;
        }
        this.roundGroup.visible = true;
        this.addChild(this.roundGroup);
        this.roundGroup.y = this.upGroup.y + 260
        //this.roundGroup.skewX = 0;
        //this.roundMC1.x = 0
        //this.roundMC2.x = 360
        //this.roundMC1.scaleX = 1
        //this.roundMC2.scaleX = -1
        //this.roundMC1.scaleY = 1
        //this.roundMC2.scaleY = 1
        this.roundText.text = 'ROUND ' + this.pkStep;
        var tw:egret.Tween = egret.Tween.get(this.roundGroup);
        tw.to({scaleX:3,scaleY:3,alpha:0}).to({scaleX:0.9,scaleY:0.9,alpha:1},200).to({scaleX:1,scaleY:1},200).wait(800).
            to({alpha:0,scaleX:2.5,scaleY:0},200).call(function(){
                this.roundGroup.visible = false;
            },this);
        //var tw:egret.Tween = egret.Tween.get(this.roundMC1);
        //tw.wait(1200).to({scaleX:2.5,x:-500,scaleY:0.1},500)
        //var tw:egret.Tween = egret.Tween.get(this.roundMC2);
        //tw.wait(1200).to({scaleX:-2.5,x:360+500,scaleY:0.1},500)
        this.setTimeout(this.pkOne,2000)
    }

    public outPKer(){
        var tw = egret.Tween.get(this.hpGroup)
        tw.to({y:150},300);

        var tw = egret.Tween.get(this.playerGroup1)
        tw.to({x:-320},300);

        var tw = egret.Tween.get(this.playerGroup2)
        tw.to({x:640},300);

        var VC  = VideoCode.getInstance();
        var appearObj = {};
        for(var s in VC.playerObject)
        {
            var data = VC.playerObject[s];
            if(data.index >= 0)
            {
                appearObj[data.id] = true;
            }
        }

        //将非上阵单位理场
        for(var i=0;i<this.itemArray.length;i++)
        {
            var item = this.itemArray[i];
            if(!item.out && !appearObj[item.id])
            {
                item.hideLight();
                if(item.die)
                    this.playDie(item,PKManager.getInstance().winCount[item.id]);
                else
                    this.playWinRemove(item);
                item.out = true;
            }
        }

    }

    //出战单位上阵,其它单位下阵
    public inPKer(){
        var VC  = VideoCode.getInstance();
        var VM = PKMainMV.getInstance();
        for(var s in VC.playerObject)
        {
            var data = VC.playerObject[s];
            if(data.index >= 0)
            {
                var item = this.getMonster(data.id)
                var x,y,cd;
                if(data.index == 0)
                {
                    cd = 0
                    y = (this.fightHeight - 100)/2;
                    if(data.teamID == 1)
                    {
                        x = 150;
                        this.selfPKing = item
                        this.headMC0.source = data.mvo.thumb;
                        this.nameText0.text = data.mvo.name;
                        this.renewTop(data.orginData,data,0)
                    }
                    else
                    {
                        x = 640-150;
                        this.enemyPKing = item;
                        this.headMC1.source = data.mvo.thumb;
                        this.nameText1.text = data.mvo.name;
                        this.renewTop(data.orginData,data,1)
                    }
                    item.isPKing = true;
                    item.showLight(true);
                }
                else
                {
                    cd = 200 + 100*(data.index - 1);
                    y = this.fightHeight-60;
                    if(data.teamID == 1)
                        x = 130 + (data.index-1)*130;
                    else
                        x = 380 + ((data.index-1)*130);
                    item.isPKing = false;
                }

                if(this.isNotEqual(item.x,x) || this.isNotEqual(item.y,y))
                {
                    if(item.out)
                    {
                        var tw = egret.Tween.get(item);
                        if(item.isPKing)
                        {
                            if(item.team == 1)
                                tw.to({x:-100},300).wait(200).to({y:y,scaleX:1,scaleY:1}).to({x:x + 50},200).to({x:x},200)
                            else
                                tw.to({x:640+100},300).wait(200).to({y:y,scaleX:1,scaleY:1}).to({x:x - 50},200).to({x:x},200)
                        }
                        else
                        {
                            tw.wait(cd).to({alpha:0,scaleX:0,scaleY:0},300).wait(200).to({x:x,y:y,alpha:1}).to({scaleX:1.2,scaleY:1.2},200).to({scaleX:1,scaleY:1},300)
                        }
                    }
                    else
                    {
                        var toXY = {
                            x:x,y:y
                        }
                        if(this.getDis(item,toXY) < 100)
                            VM.moveToXY(item,toXY,null,null,cd);
                        else
                            VM.jumpToXY(item,toXY,null,null,0,1,{before:cd});
                    }
                }
                item.ox = x;
                item.oy = y;
                item.out = false;

            }
        }
        this.selfPKing.enemy = this.enemyPKing
        this.enemyPKing.enemy = this.selfPKing
        this.renewStar();
    }


    private isNotEqual(a,b)
    {
        return Math.abs(a-b)>3;
    }

    //两点间距离
    private getDis(p1,p2){
        return Math.pow(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),0.5)
    }

    //取两个目标之间的中间位置
    private getMiddleXY(a,b){
        return {
            x:a.x + (b.x - a.x)/2,
            y:a.y + (b.y - a.y)/2,
        }
    }

    //死的动画
    public playDie(item,star){
        item.die = true;
        item.moving = true;
        var x = item.x;
        var v = 2
        var pos = {
            x:item.boxX,
            y:item.boxY,
        };
        item.scaleX = 0.85;
        item.scaleY = 0.85;
        item.x = pos.x;
        item.y = pos.y;
        item.setGray();

        egret.Tween.removeTweens(item);
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({alpha:1}, 300).call(function(){
            item.moving = false;
            item.showStar(star)
            if(this.random() > 0.8)
                this.itemTalk(item);
        },this)
    }

    //3胜后移除
    public playWinRemove(item){
        item.win3 = true;
        item.moving = true;
        if(item.parent)
            item.parent.addChild(item);

        var pos = {
            x:item.boxX,
            y:item.boxY,
        };

        var tw:egret.Tween = egret.Tween.get(item);
        item.parent.addChild(item);
        var dis = Math.max(400,MyTool.getDis(pos,item));
        tw.to({scaleX:1.3,scaleY:1.3}, 300,egret.Ease.sineOut).to({scaleX:1.2,scaleY:1.2}, 200).to({scaleX:1.3,scaleY:1.3}, 200).
            to({x:pos.x,y:pos.y,scaleX:0.8,scaleY:0.8}, dis/2).call(function(){
                item.showStar(3)
                item.moving = false;
                this.itemTalk(item);
            },this);
    }

    private stopAll()
    {
        egret.clearTimeout(this.timer);
        this.removeAllTweens()

        while(this.itemArray.length > 0)
        {
            this.mvFreeItem(this.itemArray.pop());
        }

        while(this.textArray.length)
        {
            this.freeWordItem(this.textArray[0]);
        }

        while(this.cloudArr.length > 0)
        {
            var mc = this.cloudArr.pop();
            MyTool.removeMC(mc);
            egret.Tween.removeTweens(mc);
        }

        this.upGroup.visible = false;
        this.downBG.visible = false;
        this.roundGroup.visible = false;
        this.resultGroup.visible = false;
        this.skillGroup.visible = false;



        this.selfPKing = null
        this.enemyPKing = null
        AniManager.getInstance().removeAllMV();
        this.isStop = true;
    }

    private showResult()
    {
        this.jumpBtn.visible = false;
        this.jumpBtn2.visible = false;
        this.stopAll();
        if(this.playVideoIndex)
        {
            if(PKResultUI.getInstance().stage)
            {
                PKResultUI.getInstance().reShow();
                VideoUI.getInstance().visible = true;
            }
            else if(DayLogMoreUI.getInstance().stage)
            {
                this.hide();
            }

            if(VideoUI.getInstance().stage)
            {

                VideoManager.getInstance().playVideo(PKManager.getInstance().pkType,this.pkStep - 1);
                VideoUI.getInstance().onShow();

            }


        }
        else
            PKResultUI.getInstance().show();
    }

    private getTalkItem():PKTalkItem{
        for(var i=0;i<this.talkList.length;i++)
        {
            if(!this.talkList[i].active)
            {
                 return this.talkList[i];
            }
        }
        var item:PKTalkItem = new PKTalkItem();
        this.talkList.push(item);
        return item;
    }

    private getEmoItem():PKEmoItem{
        for(var i=0;i<this.emoList.length;i++)
        {
            if(!this.emoList[i].active)
            {
                 return this.emoList[i];
            }
        }
        var item:PKEmoItem = new PKEmoItem();
        this.emoList.push(item);
        return item;
    }

    //显示PK对话    actionItem:触发这个行为的item
    private showPKWord(actionItem?){
        var arr = this.itemArray;
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            var item = arr[i];
            if(!item.talking && !item.isPKing && !item.moving)
            {
                if(item.die)
                {
                    if(this.random() < 0.5) //死了就不要多说话了
                        list.push(item);
                }
                else
                    list.push(item);
            }

        }
        if(list.length > 0)
        {
            item = this.randomOne(list);
            if(this.random() < 0.3)
            {
                var b = item.team == 2 && (item.die || item.win3)
                if(!b)
                {
                    this.showPKEMO(item,actionItem)
                    return;
                }
            }

            this.displayTalkWord({item:item,txt:this.getTalkStr(item,actionItem)})

            //if(this.random() < 0.1)
            //{
            //    this.setTimeout(function(){
            //        this.showPKWord(actionItem);
            //    },300);
            //}

        }
    }

    //要求这个item发话
    private itemTalk(item){
        if(this.random() < 0.3)
        {
            this.showPKEMO(item)
            return;
        }
        this.displayTalkWord({item:item,txt:this.getTalkStr(item)})
    }

    private displayTalkWord(data){
        if(this.speed)
            return;
        var talkItem = this.getTalkItem();
        if(data.item.out)
            this.addChild(talkItem);
        else
            this.cloudGroup.addChild(talkItem);
        talkItem.setData(data);
        for(var i=0;i<this.talkList.length;i++)//重叠了
        {
            var item = this.talkList[i];
            if(item.active && item != talkItem)
            {
                if(Math.abs(item.y - talkItem.y) < 10 && Math.abs(item.x - talkItem.x) < 130)
                {
                    talkItem.remove()
                    break;
                }
            }
        }
    }

    //item发话,actionItem的行为进行评价
    private getTalkStr(item,actionItem?){
        var talkBase = PKManager.getInstance().pkWord
        return this.getTalkData(item,talkBase,actionItem);
    }


    //显示PK表情
    private showPKEMO(item,actionItem?){
        var talkBase = PKManager.getInstance().pkEmo
        var id = this.getTalkData(item,talkBase,actionItem);
        if(this.speed)
            return;
        if(id)
        {
            var emoItem = this.getEmoItem();
            if(item.out)
                this.addChild(emoItem);
            else
                this.cloudGroup.addChild(emoItem);
            emoItem.setData({item:item,id:id});
        }
    }

    //public showItemEmo(item,id)
    //{
    //    var emoItem = this.getEmoItem();
    //    this.cloudGroup.addChild(emoItem);
    //    emoItem.setData({item:item,id:id,disActive:true});
    //}


    private getTalkData(item,talkBase,actionItem?){
        var str;
        if(actionItem)
        {
            if(actionItem.die)
            {
                if(actionItem.team == item.team){
                    if(actionItem == item)
                        str = this.randomOne(talkBase.loss)
                    else
                        str = this.randomOne(talkBase.loss_view)
                }
                else
                {
                    if(actionItem == item)
                        str = this.randomOne(talkBase.win)
                    else
                        str = this.randomOne(talkBase.win_view)
                }
            }
            else if(actionItem.win3)
            {
                if(actionItem == item)
                    str = this.randomOne(talkBase.win3)
            }
        }
        if(!str)
        {
            if(item.win3)
                str = this.randomOne(talkBase.win3)
            else if(item.die)
                str = this.randomOne(talkBase.loss)
            else if(item.isPKing)
                str = this.randomOne(talkBase.pking)
            else
                str = this.randomOne(talkBase.view)
        }
        return str;
    }

    private renewHP(data,index){
        var text = this['hpText'+index];
        var bf = this['hpBar'+index];
        var bb = this['hpBar'+index + '_'];
        egret.Tween.removeTweens(bf)
        egret.Tween.removeTweens(bb)

        if(data.max < 0)
        {
            text.text = '';
            bb.width = 0
            bf.width = 0
            return;
        }


        var barWidth = 320;
        var decColor = 0xFF0000
        var addColor = 0x00FF00
        var rate1 = data.last/data.max
        var rate2 = data.current/data.max
        if(rate1 > rate2)//-
        {
            bb.fillColor = decColor;
            bb.width = barWidth * rate1
            bf.width = barWidth * rate1
            var tw = egret.Tween.get(bf)
            tw.to({width:barWidth * rate2},200);
        }
        else
        {
            bb.fillColor = addColor;
            bf.width = barWidth * rate1
            bb.width = barWidth * rate1

            var tw = egret.Tween.get(bb)
            tw.to({width:barWidth * rate2},200);
        }
        text.text = (data.current || 0) + ' /' + (data.max || 0)
    }



    private renewTop(data,player,index){
        egret.Tween.removeTweens(this['hpBar'+index])
        egret.Tween.removeTweens(this['hpBar'+index + '_'])
        this['hpText'+index].text = (data.hp || 0)  + ' /' + (data.maxHp || 0);
        this['apText'+index].text = data.ap  +  '/' + PKManager.ApMax;
        this['hpBar'+index].width =  Math.min(1,(data.hp || 0)  / (data.maxHp || 1)) * 320;
        this['hpBar'+index + '_'].width =  0;
        this['apBar'+index].width =  Math.min(1,data.ap  / PKManager.ApMax) * this.barWidth;

        this.renewMP(data,player,index);
        this.renewBuffer(data,player,index);
    }

    private renewMP(data,player,index){
        egret.Tween.removeTweens(this['mpBar'+index])
        this['mpText'+index].text = data.mp  + ' /' + data.maxMp;
        var tw = egret.Tween.get(this['mpBar'+index])
        tw.to({width:Math.min(1,data.mp  / data.maxMp) * this.barWidth},200)
    }

    public renewBuffer(data,player,index){
        var buff = JSON.parse(data.buffList);
        var valueAdd = this.getValueAdd(buff);
        if(valueAdd.atk)
        {
            this.setHtml(this['atkText'+index],this.createHtml(valueAdd.atk + player.atk,valueAdd.atk>0?0x00FF00:0xFF0000));
        }
        else
        {
            this['atkText'+index].text = player.atk;
        }

        if(valueAdd.speed)
        {
            this.setHtml(this['speedText'+index],this.createHtml(valueAdd.speed + player.speed,valueAdd.speed>0?0x00FF00:0xFF0000));
        }
        else
        {
            this['speedText'+index].text = player.speed;
        }

        if(valueAdd.def)
        {
            this['defGroup'+index].visible = true
            if(valueAdd.def > 0)
                this.setHtml(this['defText'+index],'' + this.createHtml('+' + valueAdd.def + '%',0x00FF00));
            else
                this.setHtml(this['defText'+index],'' + this.createHtml('' + valueAdd.def + '%',0xFF0000));
        }
        else
        {
            this['defGroup'+index].visible = false
        }

        var list = getList(buff);
        //var len =
        for(var i=0;i<8;i++)
        {
            if(index == 0)
                var mc:any = this['statList'+index].getChildAt(i);
            else
                var mc:any = this['statList'+index].getChildAt(7-i);


            if(mc)
                mc.data = list[i];
        }

        //this['statList'+index].dataProvider = new eui.ArrayCollection();


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

    public setChoose(chooseData){
        if(!chooseData)
            return;
        var item = chooseData[chooseData.length - 1];
        if(!item || !item.result)
            return;

        var VC = VideoCode.getInstance();
        this.renewTop(item.result.player1,VC.player1,0)
        this.renewTop(item.result.player2,VC.player2,1)

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


    private getMonster(id){
        for(var i=0;i<this.itemArray.length;i++)
        {
            var item = this.itemArray[i];
            if(item.id == id)
                return item;
        }
        return null;
    }

    //public showItem(){
    //    var VC  = VideoCode.getInstance();
    //    for(var s in VC.playerObject)
    //    {
    //        var data = VC.playerObject[s];
    //        if(data.index >= 0)
    //        {
    //            var item = this.getItem()
    //            item.data = {
    //                vo:data.mvo,
    //                team:data.teamID,
    //                index:data.index
    //            }
    //            item.id = data.id;
    //            this.itemArray.push(item);
    //            this.roleCon.addChild(item);
    //            if(data.index == 0)
    //            {
    //                item.y = (this.fightHeight - 100)/2;
    //                if(data.teamID == 1)
    //                {
    //                    item.x = 150;
    //                    this.selfPKing = item
    //                }
    //                else
    //                {
    //                    item.x = 640-150;
    //                    this.enemyPKing = item;
    //                }
    //                item.isPKing = true;
    //                item.showLight(true);
    //            }
    //            else
    //            {
    //                item.y = this.fightHeight-80;
    //                if(data.teamID == 1)
    //                    item.x = 120 + (data.index-1)*130;
    //                else
    //                    item.x = 640-(120 + (data.index-1)*130);
    //            }
    //            item.ox = item.x;
    //            item.oy = item.y;
    //        }
    //    }
    //    this.selfPKing.enemy = this.enemyPKing
    //    this.enemyPKing.enemy = this.selfPKing
    //    this.pkOne();
    //}

    public pkOne(){
        var data = this.listArray[this.index];
        if(!data || data.type == 'over')
        {
            if(this.playVideoIndex)
            {
                this.resultGroup.y = this.upGroup.y + 195
                this.resultGroup.visible = true;
                if(VideoManager.getInstance().baseData.result.w == 1)
                {
                    this.rbg0.source = 'pk_win_png'
                    this.rbg1.source = 'pk_win_png'
                    this.rbg2.source = 'fight_win_png'
                }
                else
                {
                    this.rbg0.source = 'pk_fail_png'
                    this.rbg1.source = 'pk_fail_png'
                    this.rbg2.source = 'fight_fail_1_png'
                }
                if(PKManager.getInstance().getVedioBase(this.pkStep))
                    this.resultBtnGroup.addChildAt(this.nextBtn,1)
                else
                    MyTool.removeMC(this.nextBtn)

                this.resultMC.scaleX = this.resultMC.scaleY = 0;
                var tw = egret.Tween.get(this.resultMC);
                tw.to({scaleX:1.1,scaleY:1.1},200).to({scaleX:1,scaleY:1},200)

                this.resultBtnGroup.visible = false
                this.resultBG.alpha = 0;
                var tw = egret.Tween.get(this.resultBG);
                tw.wait(500).to({alpha:0.85},300).call(function(){
                    this.resultBtnGroup.visible = true
                },this)
                //console.log('PK结束，卡一下')
                return;
            }
            this.playOneRound()

        }
        else
        {
            this.setChoose(this.listArray[this.index - 1]);
            for(var i=0;i<this.itemArray.length;i++)
            {
                var item = this.itemArray[i];
                if(!item.isPKing && !item.moving && (Math.abs(item.x - item.ox)> 3 || Math.abs(item.y - item.oy)> 3))
                {
                    var VM = PKMainMV.getInstance();
                    VM.moveToXY(item,{
                        x:item.ox,
                        y:item.oy
                    })
                }
            }
            var PPM = PKPosManager.getInstance();
            if(PPM.testOut(this.selfPKing,this.pkOne))
            {
                return
            }
            if(PPM.testOut(this.enemyPKing,this.pkOne))
            {
                return
            }

            var atker = data[0].atker;
            //var atkerItem = this.getMonster(atker)
            //if(this.randomJump(atkerItem,this.pkOne))
            //    return;


            this.index++;
            this.addOneSkill(data,0)
        }
    }

    private addOneSkill(arr,index) {
        if(this.isStop)
            return;
        var data = arr[index];
        if(!data)
        {
            this.pkOne();
            return;
        }

        var skill = data.skillID;

        switch (skill) {
            case -1://无行为的回合结速
                this.addOneSkill(arr,index+1);
                break;
            case 50://物攻
                this.decode_atk(data,{arr:arr,index:index,type:0});
                break;
            case 51://秒杀
                var atkerItem = this.getMonster(data.atker);
                this.showItemWord(atkerItem,{text:'绝杀',textColor:0xFF0000},0,'name');
                this.setTimeout(function(){
                    this.decode_atk(data,{arr:arr,index:index,type:0});
                },500);

                break;
            case 52://回合结束时血量改变
                this.decode_hpChange(data,{arr:arr,index:index});
                break;
            default:
                this.decode_skill(data,{arr:arr,index:index});
                break;
        }

        if(this.random() < 0.2)
            this.showPKWord()
    }

    private actionBefore(data){
        if(this.isStop)
            return;
        var atker = data.atker;
        var defender = data.defender;
        var atkerItem = this.getMonster(atker)

        var selfList = []  //作用于出招者的效果
        var enemyList = [] //作用于被攻击者的效果
        var playList = [] //已使用的技能
        var enemyItem = null;
        var effectEnemy = false;
        for(var i=0;i<defender.length;i++)  //这个技能是否对敌人有作用
        {
            var defenderItem = this.getMonster(defender[i].defender)
            if(defenderItem.team != atkerItem.team)
            {
                effectEnemy = true;
                break;
            }
        }

        for(var i=0;i<defender.length;i++)
        {
            var defenderItem = this.getMonster(defender[i].defender)
            if(defenderItem.team == atkerItem.team)
            {
                if(enemyItem)
                    selfList.push(i);
                else
                {
                    if(effectEnemy) //对敌人有效，则触发前置效果
                    {
                        var cd = 0;
                        for(var j=0;j<defender[i].list.length;j++)
                        {
                            cd += this.addEffect(defenderItem,defender[i].list[j],cd);
                            playList.push(i);
                        }
                    }
                    else  //无效的话就在放完技能才表现
                    {
                        selfList.push(i);
                    }

                }
            }
            else
            {
                enemyItem = defenderItem;
                enemyList.push(i);
            }
        }
        return {
            selfList:selfList,
            enemyList:enemyList,
            playList:playList,
            enemyItem:enemyItem
        }
    }

    //近攻型
    private nearAtk(data,roundeData,svo?){
        //var mvType,skill
        //mvType?,skillID?
        var PPM = PKPosManager.getInstance();
        var atker = data.atker;
        var defender = data.defender;

        var atkerItem = this.getMonster(atker)


        var VM = PKMainMV.getInstance();
        var pos = {x:atkerItem.x,y:atkerItem.y};

        var oo = this.actionBefore(data);
        var selfList = oo.selfList;  //作用于出招者的效果
        var enemyList = oo.enemyList //作用于被攻击者的效果
        var playList = oo.playList
        var enemyItem = oo.enemyItem;
        var waitCD = playList.length * 300;

        var defenderItem = enemyItem || this.getMonster(defender[0].defender);

        var xy = VM.moveToTarget(atkerItem,defenderItem,function(){
            if(atkerItem.isPKing && svo && !svo.hideName)
                this.showSkillName(atkerItem,svo);
            //被攻击击移后
            var xy = VM.behitMoveBack(atkerItem,defenderItem,function(){
                roundeData.stopNext = false;
                roundeData.notEffect = selfList.concat(playList);
                this.addEffectList(data,roundeData);
            },this)

            PPM.jumpOut(defenderItem,xy,[atkerItem]);

            if(!atkerItem.isPKing)
            {
                VM.moveToXY(atkerItem,pos,function(){
                    roundeData.stopNext = true;
                    roundeData.notEffect = enemyList.concat(playList);
                    this.addEffectList(data,roundeData);
                },this);
            }
            else
            {
                roundeData.stopNext = true;
                roundeData.notEffect = enemyList.concat(playList);
                this.addEffectList(data,roundeData);
            }

            if(svo)
            {
                if(svo.mvType == 1)
                    VM.playOnItem(svo.mvID1,defenderItem,null,null);
                else  if(svo.mvType == 2)
                    VM.playOnItem(svo.mvID1,defenderItem,null,null,xy);
            }
            else
                VM.playSkillSound(16);


        },this,waitCD)
        if(atkerItem.isPKing)
            PPM.jumpOut(atkerItem,xy,[defenderItem]);
    }

    //远攻型
    private bulletAtk(data,roundeData,mvType?,skillID1?,skillID2?,fun?){
        var VM = PKMainMV.getInstance();
        var PPM = PKPosManager.getInstance();

        var atker = data.atker;
        var defender = data.defender;

        var atkerItem = this.getMonster(atker)
        var defenderItem = this.getMonster(defender[0].defender);

        if(atkerItem.isPKing && this.getDis(atkerItem,defenderItem) < 200)
        {
            var newPos = PPM.findFightEmpty(atkerItem,PPM.getCurrentMap(),defenderItem,200) //,enemy,enemyDis
            if(newPos)
            {
                VM.jumpToXY(atkerItem,newPos,function(){
                    this.bulletAtk(data,roundeData,mvType,skillID1,skillID2,fun);
                },this,100);
                return;
            }
        }
        fun && fun.apply(this);
        var oo = this.actionBefore(data);
        var selfList = oo.selfList;  //作用于出招者的效果
        var enemyList = oo.enemyList //作用于被攻击者的效果
        var playList = oo.playList
        var enemyItem = oo.enemyItem;
        defenderItem = enemyItem || defenderItem;

        var sendXY = VM.getDisPoint(atkerItem,defenderItem,50);
        VM.skillMV2(atkerItem,defenderItem,function(){
            //自己效果
            roundeData.stopNext = true;
            roundeData.notEffect = enemyList.concat(playList);
            this.addEffectList(data,roundeData);

            if(mvType == 5)
            {
                VM.playBullet(skillID1,atkerItem,defenderItem,function(){
                    if(this.isStop) //子弹有Tween
                        return;
                    //被攻击击移后
                    var xy = VM.behitMoveBack(atkerItem,defenderItem,function(){
                        roundeData.stopNext = false;
                        roundeData.notEffect = selfList.concat(playList);
                        this.addEffectList(data,roundeData);
                    },this)
                    PPM.jumpOut(defenderItem,xy,[atkerItem]);


                    if(skillID2)
                        VM.playOnItem(skillID2,defenderItem,null,null,xy);
                    //else
                    //    VM.playSkillSound(16);

                },this,sendXY)
            }
            else
            {
                VM.playBullet2(skillID1,atkerItem,defenderItem,function(){
                    if(this.isStop) //子弹有Tween
                        return;
                    //被攻击击移后
                    var xy = VM.behitMoveBack(atkerItem,defenderItem,function(){
                        roundeData.stopNext = false;
                        roundeData.notEffect = selfList.concat(playList);
                        this.addEffectList(data,roundeData);
                    },this)
                    PPM.jumpOut(defenderItem,xy,[atkerItem]);


                    if(mvType && skillID2)
                        VM.playOnItem(skillID2,defenderItem,null,null,xy);
                    else
                        VM.playSkillSound(16);

                },this,sendXY)
            }


        },this)
    }

    private decode_atk(data,roundeData,svo?){
        var VC = VideoCode.getInstance();
        //var atkerPlayerVO = VC.getPlayerByID(data.atker);
        var atkerItem = this.getMonster(data.atker);
        if(atkerItem.data.vo.atktype == 0) //近攻
        {
            if(svo && !atkerItem.isPKing && !svo.hideName)
                this.showSkillName(atkerItem,svo);
            this.nearAtk(data,roundeData,svo)
        }
        else
        {
            if(svo)
            {
                this.showSkillName(atkerItem,svo);
            }
            this.bulletAtk(data,roundeData,6,atkerItem.data.vo.atktype)
        }
    }

    private decode_hpChange(data,roundeData){
        var arr = data.defender[0].list;
        var defenderItem = this.getMonster(data.defender[0].defender)
        var count = 0;
        var last = -1;
        var current = -1;
        var max = -1;
        for(var i=0;i<arr.length;i++)
        {
            var effect = arr[i];
            if(effect.key == 'hp')
            {
                count += effect.value.value;
                if(last == -1)
                    last = effect.value.last
                max = effect.value.max
                current = effect.value.current
            }
            else
                break;
        }
        var myEffect = {key:'hp',value:{value:count,isCDHP:true,isNegative:count <= 0,last:last,max:max,current:current}};
        var cd = this.addEffect(defenderItem,myEffect);
        for(var j=1;i<arr.length;i++,j++)
        {

            cd += this.addEffect(defenderItem,arr[i],cd);
        }
        roundeData.notEffect = [0];
        this.addEffectList(data,roundeData);
    }

    private decode_skill(data,roundeData,stopMainSkill?){
        var VC = VideoCode.getInstance();
        //var atkerPlayerVO = VC.getPlayerByID(data.atker);
        var atkerItem = this.getMonster(data.atker);
        if(data.atker >= 10)
        {
            var mvo = atkerItem.data.vo;
            var svo = mvo.getSkillByID(data.skillID,atkerItem.isPKing);
        }
        else
        {
            var VDOM = VideoManager.getInstance()
            if(data.atker == 1)
                var oo = VDOM.leaderSkill1[data.skillID - 2]
            else
                var oo = VDOM.leaderSkill2[data.skillID - 2]
            var mvo = oo.mvo;
            var svo = oo.svo;
            data.atker = oo.orginOwnerID;
            atkerItem = this.getMonster(data.atker);
        }


        if(svo.type == 1 && !stopMainSkill && !this.speed)
        {
            this.showMainSkillName(atkerItem,svo,{
                data:data,
                roundeData:roundeData
            })
            return;
        }


        if(!svo.mvType)
        {
            roundeData.svo = svo;
            if(svo.mv == 'atk')
            {
                if(svo.name == '助攻' || svo.hideName == true)
                    this.decode_atk(data,roundeData);
                else
                {
                    //this.showSkillName(atkerItem,svo,function(){
                        this.decode_atk(data,roundeData,svo);
                    //});
                }
            }
            else
            {
                if(svo.hideName == true)
                {
                    this.addEffectList(data,roundeData);
                }
                else
                {
                    this.showSkillName(atkerItem,svo,function(){
                        this.addEffectList(data,roundeData);
                    });
                }

            }
        }
        else
        {
            var defender = data.defender;
            var VM = PKMainMV.getInstance();



            if(svo.mvType == 1 || svo.mvType == 2)//近攻型
            {
                if(!atkerItem.isPKing && !svo.hideName)
                    this.showSkillName(atkerItem,svo);
                this.nearAtk(data,roundeData,svo);
            }
            else if(svo.mvType == 5 || svo.mvType == 6)//字弹型
            {
                this.bulletAtk(data,roundeData,svo.mvType,svo.mvID1,svo.mvID2,function(){
                    if(!svo.hideName)
                        this.showSkillName(atkerItem,svo);
                });
            }
            else  //远程型
            {
                if(!svo.hideName)
                    this.showSkillName(atkerItem,svo);
                var actionData = this.actionBefore(data);
                var selfList = actionData.selfList;  //作用于出招者的效果
                var enemyList = actionData.enemyList //作用于被攻击者的效果
                var playList = actionData.playList
                var enemyItem = actionData.enemyItem;

                roundeData.notEffect = playList;


                VM.skillMV(atkerItem,function(){

                    //VM.behitMV(defenderItem);
                    for(var i=0;i<defender.length;i++)
                    {
                        var defenderItem = this.getMonster(defender[i].defender)
                        var stopHit = false;

                        var skillID = svo.mvID1;
                        if(svo.id == '39_11' && atkerItem.team == defenderItem.team)
                        {
                            stopHit = true;
                            skillID = 30;
                        }

                        if(enemyItem)
                        {
                            if(defenderItem.team == enemyItem.team)
                            {
                                VM.playOnItem(skillID,defenderItem,null,null);
                                if(svo.mvType == 7)
                                    this.playSkill7(defenderItem,skillID)
                            }
                        }
                        else
                        {
                            VM.playOnItem(skillID,defenderItem,null,null);
                            if(svo.mvType == 7)
                                this.playSkill7(defenderItem,skillID)
                        }


                        if(svo.mvType == 7 || svo.mvType == 3)//攻击型技能
                        {

                            if(!stopHit)
                                VM.behitMV(defenderItem);
                        }
                    }
                },this)

                this.setTimeout(function(){
                    this.addEffectList(data,roundeData);
                },this.speed?300:600)
            }





        }
    }

    private playSkill7(defenderItem,skillID){
        var VM = PKMainMV.getInstance();
        var tw = egret.Tween.get(defenderItem);
        tw.wait(100).call(function(){
            VM.playOnItem(skillID,defenderItem,null,null,{
                x:-Math.random()*40 + defenderItem.x,y:Math.random()*40+defenderItem.y
            });
        }).wait(100).call(function(){
            VM.playOnItem(skillID,defenderItem,null,null,{
                x:Math.random()*40 + defenderItem.x,y:Math.random()*40 + defenderItem.y
            });
        }).wait(100).call(function(){
            VM.playOnItem(skillID,defenderItem,null,null,{
                x:Math.random()*40 + defenderItem.x,y:-Math.random()*40+defenderItem.y
            });
        }).wait(100).call(function(){
            VM.playOnItem(skillID,defenderItem,null,null,{
                x:-Math.random()*40 + defenderItem.x,y:-Math.random()*40 + defenderItem.y
            });
        })
    }


    public addEffectList(data,roundeData){
        var arr = data.defender;
        var maxEffectNum = 0;
        for(var i=0;i<arr.length;i++)
        {
            if(roundeData.notEffect && roundeData.notEffect.indexOf(i) != -1)
                continue;
            var cd = 0;
            var list = arr[i].list;
            var defenderItem = this.getMonster(arr[i].defender)

            for(var j=0;j<list.length;j++)
            {
                cd += this.addEffect(defenderItem,list[j],cd);
            }
            maxEffectNum = Math.max(maxEffectNum,cd);
        }
        if(!roundeData.stopNext)
        {
            this.setTimeout(function(){
                this.addOneSkill(roundeData.arr,roundeData.index+1);
            },maxEffectNum + (this.speed?100:300));
        }


    }

    //返回下一个动作的CD
    private addEffect(item,effect,delay?)
    {
        if(effect.changeValue)
        {
            var VC = VideoCode.getInstance();
            for(var i=0;i<effect.changeValue.length;i++)
            {
                var temp =  effect.changeValue[i];
                if(temp.change.buffList)
                    this.renewBuffer(temp.change,VC['player' + temp.id],temp.id - 1);
                else if(temp.change.maxMp)
                    this.renewMP(temp.change,VC['player' + temp.id],temp.id - 1);
            }
        }
        var mc:any
        if(effect.key == 'hp')
        {
            this.showItemHp(item,effect.value)
        }
        else if(effect.key == 'nohurt')
        {
            this.showItemWord(item,{text:'免伤',textColor:0xFF0000},delay)
        }
        else if(effect.key == 'miss')
        {
            this.showItemWord(item,{text:'闪避',textColor:0xFF0000},delay)
        }
        else if(effect.key == 'die')
        {
            item.die = true;
            //item.moving = true;
            var x = item.x;
            var v = 2
            var tw:egret.Tween = egret.Tween.get(item);
            tw.wait(100).to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300);
            return 600;
            //this.showItemWord(item,{text:'死亡',textColor:0xFF0000},delay)
        }
        else if(effect.key == 'stat')
        {
            if(effect.value.id > 100)
            {
                this.showItemWord(item,{text:MonsterVO.getObject(effect.value.value[0]).getSkillByID(effect.value.value[1],effect.value.value[2]).name,textColor:0xFFDC5B},delay)
            }
            else
            {
                var oo = this.statItem.baseData[effect.value.id];
                if(oo.stat == 'upStat')
                    var textColor = 0xFFDC5B
                else
                    var textColor = 0xFE7430
                if(effect.value.value && effect.value.id < 20)
                {
                    if(effect.value.value > 0)
                        var str = oo.txt + '提升'// + effect.value.value;
                    else
                        var str = oo.txt + '降低'// + effect.value.value;

                    //if(effect.value.id == 3 || effect.value.id == 13)
                    //    str += '%'
                }
                else
                    var str = oo.txt + ''

                this.showItemWord(item,{text:str,textColor:textColor},delay,'stat');
            }
        }
        else if(effect.key == 'clean')
        {

        }
        else if(effect.key == 'mhp')
        {

            var str = '血量上限';
            if(effect.value > 0)
                this.showItemWord(item,{text:str + '增加',textColor:0xFFDC5B},delay,'stat')
            else
                this.showItemWord(item,{text:str + '降低',textColor:0xFE7430},delay,'stat')
        }
        else if(effect.key == 'mmp')
        {
            var str = '怒气上限';
            if(effect.value > 0)
                this.showItemWord(item,{text:str + '增加',textColor:0xFFDC5B},delay,'stat')
            else
                this.showItemWord(item,{text:str + '降低',textColor:0xFE7430},delay,'stat')
        }
        else if(effect.key == 'mp')
        {
            var str = '怒气';
            if(effect.value > 0)
                this.showItemWord(item,{text:str + '增加',textColor:0xFFDC5B},delay,'stat')
            else
                this.showItemWord(item,{text:str + '降低',textColor:0xFE7430},delay,'stat')
        }
        else if(effect.key == 'manahp')
        {

        }
        if(this.speed)
            return 100;
        return 300
    }

    private showItemHp(item,data){

        var str = ''
        if(data.isCDHP)
        {
            if(data.isNegative)
                str = '失血 ';
            else
                str = '治疗 ';
        }
        if(!data.isNegative)
        {
            this.showItemWord(item,{text:str + '+' + data.value,textColor:0x00ff00});
            if(item.die)
            {
                item.die = false;
                var tw:egret.Tween = egret.Tween.get(item);
                tw.to({alpha:1}, 300);
            }
        }
        else
        {
            if(!data.value)
            {
                this.showItemWord(item,{text:str + '不破防',textColor:0xFF0000})
            }
            else
                this.showItemWord(item,{text:str + (data.value || '-0'),textColor:0xff0000});
        }



        this.renewHP(data,item.team - 1);
    }

    private showItemWord(item,data,delay=0,wordType='hp'){
        if(!item)
            return;
        var label = this.getWordItem();
        label.text = data.text;
        label.textColor = data.textColor;


        label.x = item.x
        label.y = item.y - 50
        var len = this.textArray.length;
        //while(true && wordType != 'name')
        //{
        //    var find = false;
        //    for(var i=0;i<len;i++)
        //    {
        //        var mc = this.textArray[i];
        //        if(mc != label && Math.abs(mc.x - label.x) < 3 && Math.abs(mc.y - label.y) < 30 ){
        //            find = true;
        //            label.y -= 30
        //            break;
        //        }
        //    }
        //    if(!find)
        //        break
        //}
        label.alpha = 0;
        var tw = egret.Tween.get(label);
        if(wordType == 'name')  //技能
        {
            label['targetY'] = label.y - 30;
        }
        else
        {
            label['targetY'] = label.y - 20;
        }

        var len = this.effectCon.numChildren;
        for(var i=0;i<len;i++)
        {
            var temp = this.effectCon.getChildAt(i);
            if(temp != label && egret.getTimer() - temp['addTime'] < 700)//0.5秒内产生的
            {
                while(Math.abs(label.x - temp.x) < 10 && Math.abs(label['targetY'] - temp['targetY']) < 30)
                {
                    label['targetY'] -= 10;
                    i = -1;
                }
            }
        }
        if(this.speed)
        {
            if(wordType == 'name')  //技能
            {
                tw.wait(delay).to({scaleX:1.1,scaleY:1.1,alpha:1,y:label['targetY']},100).to({scaleX:1,scaleY:1},100).wait(300);
            }
            else if(wordType == 'stat')
            {
                tw.wait(delay).to({y:label['targetY'],alpha:1},100).wait(300).to({y:label['targetY'] - 30,alpha:0},100)
            }
            else //血
            {
                tw.wait(delay).to({y:label['targetY'],alpha:1},100).wait(300);
            }

        }
        else
        {
            if(wordType == 'name')  //技能
            {
                tw.wait(delay).to({scaleX:1.1,scaleY:1.1,alpha:1,y:label['targetY']},200).to({scaleX:1,scaleY:1},200).wait(500);
            }
            else if(wordType == 'stat')
            {
                tw.wait(delay).to({y:label['targetY'],alpha:1},200).wait(500).to({y:label['targetY'] - 30,alpha:0},100)
            }
            else //血
            {
                tw.wait(delay).to({y:label['targetY'],alpha:1},200).wait(600);
            }
        }




        tw.call(function(){
            this.freeWordItem(label);
        },this)
    }

    private showSkillName(item,skillVO,fun?){
        var  color
        if(skillVO.type == 1)
        {
            color = 0xEB911B;
            if(!this.speed)
            {
                fun && fun();
                return;
            }
        }
        else if(skillVO.type == 2)
        {
            color = 0x00DEFF;
        }
        else if(skillVO.type == 3)
        {
            color = 0x6fda13;
        }
        this.showItemWord(item,{text:skillVO.name,textColor:color},0,'name');
        if(fun)
        {
            this.setTimeout(fun,this.speed?250:500);
        }
    }

    private showMainSkillName(item,skillVO,afterData){
        var mX = 320,mX2 =260,mY=240

        //egret.Tween.removeTweens(this.skillGroup)
        //egret.Tween.removeTweens(this.skillBG)
        egret.Tween.removeTweens(this.monsterGroup)
        //egret.Tween.removeTweens(this.skillNameGroup)

        var skillName = skillVO.name.split('').join(' ');
        this.skillGroup.visible = true;
        this.skillText.width = 999;
        this.skillText.text = skillName;
        this.skillText.width = this.skillText.textWidth;
        this.skillText.text = ''
        this.skillGroup.y = this.upGroup.y + 195
        //this.skillBG.alpha = 0;

        this.monsterGroup.alpha = 0.5;
        this.monsterMC.source = item.data.vo.url;

        var p = item.localToGlobal(item.anchorOffsetX,item.anchorOffsetY);
        p= this.skillGroup.globalToLocal(p.x,p.y,p);

        this.monsterGroup.x = p.x
        this.monsterGroup.y = p.y
        this.monsterGroup.scaleX = this.monsterGroup.scaleY = 0;
        //var tw = egret.Tween.get(this.skillBG);
        //tw.to({alpha:0.8},200).wait(1200).to({alpha:0},200);

        var tw = egret.Tween.get(this.monsterGroup);
        tw.wait(100).to({x:mX,y:mY,scaleX:1.1,scaleY:1.1,alpha:1},200).call(function(){
            this.skillBG.visible = true;
        },this).to({scaleX:1,scaleY:1},200).wait(300);

        for(var i=0;i<skillName.length;i++)
        {
            tw.call(function(index){
                this.skillText.text = skillName.substr(0,index)
            },this,[i+1]).wait(100)
        }

        tw.wait(500).call(function(){
            this.skillBG.visible = false;
        },this).to({x:p.x,y:p.y,scaleX:0,scaleY:0,alpha:0.5},300).wait(200).call(function(){
            this.skillGroup.visible = false;
            this.decode_skill(afterData.data,afterData.roundeData,true)
        },this);

        //var tw = egret.Tween.get(this.skillNameGroup);
        //tw.wait(300).to({scaleX:0.8,scaleY:0.8,alpha:1},300).to({scaleX:1,scaleY:1},200);

    }
}