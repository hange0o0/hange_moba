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
    private selfGroup: eui.Group;
    private topMC: eui.Image;
    private bottomMC: eui.Image;
    private upBG: eui.Group;
    private downBG: eui.Group;
    private jumpBtn: eui.Image;










    //private dataIn;
    private stageHeight;
    private itemWidth = 114;
    private itemHeight = 110;


    private itemCollect = [];
    private itemEnemy = [];
    private itemSelf = [];
    private talkList = [];
    private emoList = [];

    private pkList = [];
    private currentStep;

    private cardIndex1;
    private cardIndex2;
    private timer;
    private count;

    //private posArray = []

    private pkStep
    private atker

    private player1
    private player2

    private randomSeed
    private fightHeight = 960

    //private fightStarY = 320 + 60
    //private fightEndY = 640 - 60

    private isStop = false

    private needUpArr1 = [];
    private needUpArr2 = [];

    private scene;


    private middlePos1 = {x:220,y:this.fightHeight/2}
    private middlePos2 = {x:420,y:this.fightHeight/2}

    private cloudTimer = 0;
    private cloudArr = [];
    private loadGroup2 = []
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.jumpBtn, this.onJump);






        this.selfGroup.height = this.fightHeight;

        this.bg0.scrollRect = new egret.Rectangle(0,0,325,1500)
        this.bg1.scrollRect = new egret.Rectangle(315,0,325,1500)
    }

    private initSeed(){
        var arr = PKManager.getInstance().team2Base.list; //PKManager.getInstance().team1Base.list.concat(
        this.randomSeed = 0;
        for(var i=0;i<arr.length;i++)
        {
            this.randomSeed += Math.pow(arr[i],2)*(i+1) + arr[i]*100;
        }
        this.randomSeed /= PKManager.getInstance().team1Base.list.length;
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

    private onJump(){
        this.jumpBtn.visible = false;
        this.showResult();
    }

    public show(){
        var isPKJump = PKManager.getInstance().pkJump;
        this.loadGroup2 = [];
        this.initSeed();
        var group = []
        if(!isPKJump)
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

        this.pkList = PKManager.getInstance().mainVideoList.concat();

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
        if(this.loadUI == null)
        {
            MainPageUI.getInstance().visible = true;
        }
        this.bgBlack.visible = false;
        this.removeAllTweens()
        egret.clearTimeout(this.timer);
        PopUpManager.removeShape();
        this.initView();
        this.addSceneMovie();
        this.isStop = false;

        var isPKJump = PKManager.getInstance().pkJump;
        if(!isPKJump)
            SoundManager.getInstance().playSound(SoundConfig.bg_pk);
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private removeAllTweens(){
        egret.Tween.removeTweens(this.bgGroup);
        egret.Tween.removeTweens(this.bg0);
        egret.Tween.removeTweens(this.bg1);
        egret.Tween.removeTweens(this.topMC);
        egret.Tween.removeTweens(this.bottomMC);
        egret.Tween.removeTweens(this.jumpBtn);
        var arr = this.itemEnemy.concat(this.itemSelf)
        for(var i=0;i<arr.length;i++)
        {
            arr[i].stopMV();
        }
    }



    private getItem():PKItem2{
        var item:PKItem2 = this.itemCollect.pop();
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
        item.out = false
        item.action = false
        item.talking = false
        item.isPKing = false
        item.moving = false
        item.die = false
        item.win3 = false
        return item;
    }

    private mvFreeItem(item){
        if(item.out)
            return;
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({alpha:0}, 1000).call(function(){
            this.freeItem(item);
        },this)
    }

    private freeItem(item){
        if(item.out)
            return;
        item.out = true;
        this.itemCollect.push(item);
        MyTool.removeMC(item);
        item.stopMV();
    }

    private initView(){
        var stageHeight = this.stageHeight = this.stage.stageHeight;
        this.jumpBtn.x = 720;
        //this.jumpBtn.visible = false;
        //this.jumpBtn.bottom = Math.max(10,(stageHeight - this.fightHeight)/2 + 10);

        //var scene = PKManager.getInstance().getPKBG(PKManager.getInstance().pkType);
        this.bg0.source = this.scene;
        this.bg1.source = this.scene;
        this.upBG.visible = false
        this.downBG.visible = false

        while(this.itemEnemy.length > 0)
        {
             this.freeItem(this.itemEnemy.pop());
        }
        while(this.itemSelf.length > 0)
        {
             this.freeItem(this.itemSelf.pop());
        }

        this.selfGroup.removeChildren()


        //this.enemyGroup.y = stageHeight/2 - (400+40);
        this.selfGroup.y = (stageHeight - this.fightHeight)/2// + 40

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

    }

    private addSceneMovie(){
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
            this.bgBlack.visible = true;
            this.shakeBG();
            if(!PKManager.getInstance().pkJump)
            {
                this.showCound(true)
                this.showCound(true)
            }
        },this).wait(600).call(this.addItemMovie,this);    //.wait(100)
        tw2.to({x:315,y:Y},500,egret.Ease.sineIn) //.wait(100)

        var itemHeight = 123;
        var des = (this.stageHeight - this.fightHeight)/2;
        this.topMC.y = -itemHeight+des
        this.bottomMC.y = this.stageHeight-des

        this.upBG.y = des
        this.downBG.y = this.stageHeight - des - this.downBG.height;
        //if(des > 0)
        //{
        //    this.topMC.alpha = 0
        //    this.bottomMC.alpha = 0
        //    var tw:egret.Tween = egret.Tween.get(this.topMC);
        //    tw.to({alpha:1},100)
        //    var tw:egret.Tween = egret.Tween.get(this.bottomMC);
        //    tw.to({alpha:1},100)
        //}

        this.jumpBtn.y = this.stageHeight- des - 70;
    }

    private onTimer(){
        if(!this.isStop && egret.getTimer() - this.cloudTimer > 1000*10)
            this.showCound();
    }

    private showCound(b?){
        var rect = {
            x:0,
            y:this.selfGroup.y + 125,
            width:640,
            height:this.fightHeight - 250
        }
        var mc = AniManager.getInstance().showCloud(this,rect,b)


        this.cloudArr.push(mc)
        this.cloudTimer  = egret.getTimer();
    }

    private shakeBG(){
        var tw:egret.Tween = egret.Tween.get(this.bgGroup);
        tw.to({x:-6,y:-5},80).to({x:5,y:3},120).to({x:-2,y:-1},50).to({x:0,y:0},30)
    }

    //加所有单位
    private addItemMovie(){
        MainPageUI.getInstance().visible = false;
        var isPKJump = PKManager.getInstance().pkJump;
        if(isPKJump)
        {
            this.showResult()
            return;
        }

        var myTeam = PKManager.getInstance().team1Base.list
        var enemyTeam = PKManager.getInstance().team2Base.list
        if(PKManager.getInstance().teamChange)
        {
            var temp = enemyTeam
            enemyTeam = myTeam
            myTeam = temp
        }

        for(var i=0;i<myTeam.length;i++)
        {
            this.addOneItem(myTeam[i],1,i);
        }
        this.resetXY(this.itemSelf,1);

        for(var i=0;i<enemyTeam.length;i++)
        {
            this.addOneItem(enemyTeam[i],2,i);
        }
        this.resetXY(this.itemEnemy,2);



        this.timer = egret.setTimeout(this.playOne,this,Math.max(myTeam.length,enemyTeam.length) * 200 + 500)
        SoundManager.getInstance().loadPKSound();

        var tw:egret.Tween = egret.Tween.get(this.jumpBtn);
        this.jumpBtn.visible = true;
        tw.to({x:556},300).to({x:566},100)
        //this.jumpBtn.visible = true;
    }




    //加一个单位到舞台上
    private addOneItem(data,team,index){
        var item =this.getItem();
        item.data = {vo:MonsterVO.getObject(data),team:team,index:index};
        item.alpha = 0;
        if(team == 1)
        {
            this.itemSelf.push(item);
        }
        else
        {
            this.itemEnemy.push(item);
        }
        this.selfGroup.addChild(item);
        return item;
    }

    //两点间距离
    private getDis(p1,p2){
        return Math.pow(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),0.5)
    }

    //定位
    private resetXY(arr,team){
        arr = arr.concat();
        this.randomSort(arr);
        var itemY = 135
        var middle = this.fightHeight/2;
        var x = 20 + this.itemWidth / 2;
        if(team == 2)
            x = 640 - this.itemWidth/2 - 20;
        var desY = (this.fightHeight - (arr.length*itemY))/2;
        for(var i=0;i<arr.length;i++)
        {
            var item = arr[i];
            item.y = i*itemY + desY + itemY/2// - this.itemHeight)/2;
            var des =  Math.pow(Math.abs(middle-item.y)/35,2);
            if(team == 1)
                item.x = x + des;
            else
                item.x = x - des;

            des = Math.pow(Math.abs(middle-item.y)/20,1.25);
            if(item.y > middle)
                item.y -= des;
            else if(item.y < middle)
                item.y += des;

            item.line = i + 1
            item.ox = item.x
            item.oy = item.y


            if(team == 1)
                egret.setTimeout(this.showItemMV,this,i * 200,item)
            else
                egret.setTimeout(this.showItemMV,this,(arr.length - 1 - i) * 200,item)
        }
    }

    //玩家出场动画
    private showItemMV(item){
        if(this.isStop)
            return;
        item.parent.addChild(item);
        item.alpha = 1;
        var y = item.y;
        var x = item.x;

        //var des = Math.max(0,(this.stageHeight - this.fightHeight)/2)
        item.x = 320;
        if(item.team  == 1)  //1P
        {
            item.y = this.fightHeight + this.itemHeight;
        }
        else
        {
            item.y =  -this.itemHeight;
        }
        //var tw:egret.Tween = egret.Tween.get(item);
        //tw.to({y:y + decY},500).to({y:y},100);
        var VM = PKMainMV.getInstance();
        egret.Tween.removeTweens(item)
        VM.jumpToXY(item,{x:x,y:y},null,null,null,0.8);
    }

    //开始播放动画
    private playOne(){
        if(this.isStop)
            return;
        //console.log('playOne');
        if(this.loadGroup2)
        {
            RES.createGroup('pk_load',this.loadGroup2,true);
            RES.loadGroup("pk_load",-2);
            this.loadGroup2 = null;
        }


        var oo:any = this.currentStep = this.pkList.shift();
        if(oo == null)//pk结束
        {
            this.jumpBtn.visible = false;
            this.timer = egret.setTimeout(this.showResult,this,1200)
             return;
        }
        this.needUpArr1 = [];
        this.needUpArr2 = [];
        this.jumpBtn.visible = true;
        this.player1 = this.itemSelf[oo.p1];
        this.player2 = this.itemEnemy[oo.p2];
        var lastPKing1 =  this.player1.isPKing
        var lastPKing2 =  this.player2.isPKing
        //var nextPlayer1 = this.itemSelf[oo.p1 + 1];
        //var nextPlayer2 = this.itemEnemy[oo.p2 + 1];
        for(var s in this.itemSelf)
        {
            var item = this.itemSelf[s];
            item.enemy = this.player2
            item.self = this.player1
            item.isPKing = false

        }
        for(var s in this.itemEnemy)
        {
            var item = this.itemEnemy[s];
            item.enemy = this.player1
            item.self = this.player2
            item.isPKing = false
        }

        this.player1.isPKing = true
        this.player2.isPKing = true
        this.player1.hideLight();
        this.player2.hideLight();


        var VM = PKMainMV.getInstance();

        var count = 0;
        var fun = function(){
            count --;
            if(count == 0)
            {
                this.stepOne();
            }
        }

        if(!lastPKing1)
        {
            VM.jumpToXY(this.player1,this.middlePos1,fun,this,300);
            count ++;
        }

        if(!lastPKing2)
        {
            VM.jumpToXY(this.player2,this.middlePos2,fun,this,300)
            count ++;
        }

        if(this.random() < 0.3)
            this.showPKWord();
    }

    private stepOne(){
        if(this.isStop)
            return;

        var oo = this.currentStep.list.shift();
        var player
        //if(oo)
        //{
        //    console.log(oo.type)
        //}
        if(!oo)
        {
            this.timer = egret.setTimeout(this.playOne,this,200);
        }
        else if(oo.type == 'atk')
        {
            var des = 50;
            var cd = 200;
            var b = this.random() > 0.5
            var des1 = {
                x:-30 + 60*this.random(),
                y:-30 + 60*this.random()
            }
            var des2 = {
                x:-30 + 60*this.random(),
                y:-30 + 60*this.random()
            }
            var tw:egret.Tween = egret.Tween.get(this.player1);
            tw.to({x:this.middlePos1.x + des},cd).to({x:this.middlePos1.x + this.rand(-40,10),y:this.middlePos1.y + this.getYAdd(b)},cd).wait(100).
                to({x:this.middlePos1.x + des + des1.x,y:this.middlePos1.y + des1.y},cd).to({x:this.middlePos1.x+ this.rand(-40,10),y:this.middlePos1.y + this.getYAdd(!b)},cd).wait(100).
                to({x:this.middlePos1.x + des + des2.x,y:this.middlePos1.y + des2.y},cd).to({x:this.middlePos1.x,y:this.middlePos1.y},cd)

            var tw:egret.Tween = egret.Tween.get(this.player2);
            tw.to({x:this.middlePos2.x - des},cd).call(this.playAni,this).to({x:this.middlePos2.x+ this.rand(-10,40),y:this.middlePos2.y + this.getYAdd(!b)},cd).wait(100).
                to({x:this.middlePos2.x - des + des1.x,y:this.middlePos2.y + des1.y},cd).call(this.playAni,this).to({x:this.middlePos2.x + this.rand(-10,40),y:this.middlePos2.y + this.getYAdd(b)},cd).wait(100).
                to({x:this.middlePos2.x - des + des2.x,y:this.middlePos2.y+ des2.y},cd).call(this.playAni,this).to({x:this.middlePos2.x,y:this.middlePos2.y},cd).call(this.stepOne,this)
            this.lightFuZhu();
            if(this.random() < 0.2)
                this.showPKWord();
            if(this.random() < 0.2)
                this.timer = egret.setTimeout(this.showPKWord,this,500);
        }
        else if(oo.type == 'hp')
        {
            this.player1.showHpChange(oo.value.player1)
            this.player2.showHpChange(oo.value.player2)
            this.timer = egret.setTimeout(this.stepOne,this,1200);
            if(this.random() < 0.3)
                this.showPKWord();
        }
        else if(oo.type == 'die')
        {
            if(oo.value == 1)
                player = (this.player1)
            else
                player = (this.player2)
            this.playDie(player,oo.star);
            if(this.random() < 0.2)
                this.showPKWord(player);
            this.stepOne();
        }
        else if(oo.type == 'win3')
        {
            if(oo.value == 1)
                player = (this.player1)
            else
                player = (this.player2)
            this.playWinRemove(player);
            if(this.random() < 0.2)
                this.showPKWord(player);
            this.timer = egret.setTimeout(this.stepOne,this,200);
        }
        else
        {
            this.stepOne();
        }
    }

    private playAni(){
        var arr = this.player1.data.vo.mv1.concat(this.player2.data.vo.mv1)
        var id = this.randomOne(arr);
        var VM = PKMainMV.getInstance();
        var xy = this.getMiddleXY(this.player1,this.player2)
        VM.playOnItem(id,this.player1,null,null,xy);
    }
    private getYAdd(b){
        if(this.random() < 0.1)
            this.showPKWord();
         if(b)
            return -80 + this.rand(-50,10)
        return 80+ this.rand(-10,50)
    }

    private lightFuZhu(){
        var oo:any = this.currentStep
        for(var i=oo.p1+1,j=0;i<this.itemSelf.length && j<2;i++,j++)
        {
            var item = this.itemSelf[i];
            item.showLight();
        }
        for(var i=oo.p2+1,j=0;i<this.itemEnemy.length && j<2;i++,j++)
        {
            var item = this.itemEnemy[i];
            item.showLight();
        }
    }



    //取两个目标之间的中间位置
    private getMiddleXY(a,b){
        return {
            x:a.x + (b.x - a.x)/2,
            y:a.y + (b.y - a.y)/2,
        }
    }




    private testItemBG(item){
        if(!this.upBG.visible && item.team == 2)
        {
            this.upBG.visible = true
            this.upBG.alpha = 0
            var tw:egret.Tween = egret.Tween.get(this.upBG);
            tw.to({alpha:1},200)
        }
        else if(!this.downBG.visible && item.team == 1)
        {
            this.downBG.visible = true
            this.downBG.alpha = 0
            var tw:egret.Tween = egret.Tween.get(this.downBG);
            tw.to({alpha:1},200)
        }
    }
    //死的动画
    public playDie(item,star){
        item.die = true;
        item.moving = true;
        var x = item.x;
        var v = 2
        var pos = this.getDiePos(item);
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300).call(this.testItemBG,this,[item]).wait(100).call(function(){
            item.scaleX = 0.9;
            item.scaleY = 0.9;
            item.x = pos.x;
            item.y = pos.y;
            item.setGray();

            egret.Tween.removeTweens(item);
            var tw:egret.Tween = egret.Tween.get(item);
            tw.to({alpha:1}, 300).call(function(){
                item.moving = false;
                item.showStar(star)
                if(this.random() > 0.5)
                    this.itemTalk(item);
            },this)
        },this)//.to({alpha:1}, 300) //,x:pos.x
    }

    //3胜后移除
    public playWinRemove(item){
        item.win3 = true;
        item.moving = true;
        if(item.parent)
            item.parent.addChild(item);

        var pos = this.getDiePos(item);

        var tw:egret.Tween = egret.Tween.get(item);
        item.parent.addChild(item);
        var dis = Math.max(400,MyTool.getDis(pos,item));
        tw.to({scaleX:1.3,scaleY:1.3}, 300,egret.Ease.sineOut).to({scaleX:1.2,scaleY:1.2}, 200).to({scaleX:1.3,scaleY:1.3}, 200).call(this.testItemBG,this,[item]).
            to({x:pos.x,y:pos.y,scaleX:0.9,scaleY:0.9}, dis/2).call(function(){
                item.showStar(3)
                item.moving = false;
                this.itemTalk(item);
            },this);
    }

    private getDiePos(item){

        var des = 0//(this.stageHeight - this.fightHeight)/2;
        var pos = {x:item.index*103 + this.itemWidth/2 + 10,y: 1 + des +this.itemHeight/2}
        if(item.team == 1)
            pos.y = this.fightHeight - des - this.itemHeight/2 - 1;
        return pos;
    }


    private stopAll()
    {
        egret.clearTimeout(this.timer);
        this.removeAllTweens()

        while(this.itemEnemy.length > 0)
        {
            this.mvFreeItem(this.itemEnemy.pop());
        }
        while(this.itemSelf.length > 0)
        {
            this.mvFreeItem(this.itemSelf.pop());
        }

        this.upBG.visible = false
        this.downBG.visible = false

        while(this.cloudArr.length > 0)
        {
            var mc = this.cloudArr.pop();
            MyTool.removeMC(mc);
            egret.Tween.removeTweens(mc);
        }


        //var tw:egret.Tween = egret.Tween.get(this.upBG);
        //tw.to({y:this.upBG.y - this.upBG.height},200)
        //var tw:egret.Tween = egret.Tween.get(this.downBG);
        //tw.to({y:this.downBG.y + this.downBG.height},200)

        AniManager.getInstance().removeAllMV();
        this.isStop = true;
    }

    private showResult()
    {
        PKLoadingUI.getInstance().realHide();
        this.stopAll();
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
        var arr = this.itemSelf.concat(this.itemEnemy);
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

            if(this.random() < 0.1)
            {
                this.timer = egret.setTimeout(function(){
                    this.showPKWord(actionItem);
                },this,300);
            }

        }
    }

    //要求这个item发话
    private itemTalk(item){
        if(this.random() < 0.3)
        {
            var b = item.team == 2 && (item.die || item.win3)
            if(!b) {
                this.showPKEMO(item)
                return;
            }
        }
        this.displayTalkWord({item:item,txt:this.getTalkStr(item)})
    }

    private displayTalkWord(data){
        var talkItem = this.getTalkItem();
        this.addChild(talkItem);
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
        if(id)
        {
            var emoItem = this.getEmoItem();
            this.addChild(emoItem);
            emoItem.setData({item:item,id:id});
        }
    }

    public showItemEmo(item,id)
    {
        var emoItem = this.getEmoItem();
        this.addChild(emoItem);
        emoItem.setData({item:item,id:id,disActive:true});
    }


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



}