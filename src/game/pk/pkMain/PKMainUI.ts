//class PKMainUI extends game.BaseUI {
//    private static instance:PKMainUI2;
//    public static getInstance() {
//        if (!this.instance) this.instance = new PKMainUI2();
//        return this.instance;
//    }
//
//    public constructor() {
//        super();
//        this.skinName = "PKMainUISkin";
//        this.hideVisible = true;
//    }
//
//
//    private bgBlack: eui.Rect;
//    private bgGroup: eui.Group;
//    private bg1: eui.Image;
//    private bg0: eui.Image;
//    private jumpBtn: eui.Button;
//    private selfGroup: eui.Group;
//    private topMC: eui.Image;
//    private bottomMC: eui.Image;
//
//
//
//
//
//
//
//
//
//    //private dataIn;
//    private stageHeight;
//    private itemWidth = 114;
//    private itemHeight = 110;
//
//
//    private itemCollect = [];
//    private itemEnemy = [];
//    private itemSelf = [];
//
//    private pkList = [];
//    private currentStep;
//
//    private cardIndex1;
//    private cardIndex2;
//    private timer;
//    private count;
//
//    //private posArray = []
//
//    private pkStep
//    private atker
//
//    private player1
//    private player2
//
//    private randomSeed
//    private fightHeight = 960
//
//    private fightStarY = 320 + 60
//    private fightEndY = 640 - 60
//
//    private isStop = false
//
//    private needUpArr1 = [];
//    private needUpArr2 = [];
//
//    private scene;
//
//
//
//    private loadGroup2 = []
//    public childrenCreated() {
//        super.childrenCreated();
//        this.addBtnEvent(this.jumpBtn, this.onJump);
//
//
//
//
//
//
//        this.selfGroup.height = this.fightHeight;
//
//        this.bg0.scrollRect = new egret.Rectangle(0,0,325,1500)
//        this.bg1.scrollRect = new egret.Rectangle(315,0,325,1500)
//    }
//
//    private initSeed(){
//        var arr = PKManager.getInstance().team2Base.list; //PKManager.getInstance().team1Base.list.concat(
//        this.randomSeed = 0;
//        for(var i=0;i<arr.length;i++)
//        {
//            this.randomSeed += Math.pow(arr[i],2)*(i+1) + arr[i]*100;
//        }
//        this.randomSeed /= PKManager.getInstance().team1Base.list.length;
//    }
//
//    public random(){
//        var seed = this.randomSeed;
//        seed = ( seed * 9301 + 49297 ) % 233280;
//        var rd = seed / ( 233280.0 );
//        this.randomSeed = rd * 100000000;
//        return rd;
//    }
//
//    private onJump(){
//        this.jumpBtn.visible = false;
//        this.showResult();
//    }
//
//    public show(){
//        var isPKJump = PKManager.getInstance().pkJump;
//        this.loadGroup2 = [];
//        this.initSeed();
//        var group = []
//        if(!isPKJump)
//        {
//            group = VideoManager.getInstance().getVideoAniGroup();
//            var arr = PKManager.getInstance().team1Base.list.concat(PKManager.getInstance().team2Base.list);
//            var mObj = {};
//            for(var i=0;i<arr.length;i++)
//            {
//                mObj[arr[i]] = true;
//            }
//            for(var s in mObj)
//            {
//                if(!RES.getRes('m_thumbr_' + s))
//                    group.push('m_thumbr_' + s);
//                this.loadGroup2.push('m_thumb_' + s);
//            }
//        }
//
//
//        this.scene =  PKManager.getInstance().getPKBG(PKManager.getInstance().pkType,this.random());
//        if(!RES.getRes(this.scene))
//            group.push(this.scene);
//
//
//
//
//        //console.log(this.scene)
//        //if(group.length == 0)
//        //    this.LoadFiles = [];
//        //else
//        //{
//
//        //}
//        this.LoadFiles = [];
//        if(!RES.isGroupLoaded('pk'))
//            this.LoadFiles.push('pk')
//        if(group.length > 0)
//        {
//            RES.createGroup('skill_ani',group,true);
//            this.LoadFiles.push('skill_ani')
//        }
//
//        this.pkList = PKManager.getInstance().mainVideoList.concat();
//
//        this.cardIndex1 = -1;
//        this.cardIndex2 = -1;
//
//
//        if(this.LoadFiles.length > 0)
//        {
//            this.loadData = {
//                min:1200,
//                source:PKManager.getInstance().getLoadingBG(PKManager.getInstance().pkType)
//            }
//            this.loadUI = PKLoadingUI.getInstance();
//        }
//        else
//        {
//            this.loadUI = null;
//        }
//        super.show();
//    }
//
//    public onShow() {
//        if(this.loadUI == null)
//        {
//            MainPageUI.getInstance().visible = true;
//        }
//        this.bgBlack.visible = false;
//        this.removeAllTweens()
//        egret.clearTimeout(this.timer);
//        PopUpManager.removeShape();
//        this.initView();
//        this.addSceneMovie();
//        this.isStop = false;
//
//        var isPKJump = PKManager.getInstance().pkJump;
//        if(!isPKJump)
//            SoundManager.getInstance().playSound(SoundConfig.bg_pk);
//    }
//
//    private removeAllTweens(){
//        egret.Tween.removeTweens(this.bgGroup);
//        egret.Tween.removeTweens(this.bg0);
//        egret.Tween.removeTweens(this.bg1);
//        egret.Tween.removeTweens(this.topMC);
//        egret.Tween.removeTweens(this.bottomMC);
//        egret.Tween.removeTweens(this.jumpBtn);
//        var arr = this.itemEnemy.concat(this.itemSelf)
//        for(var i=0;i<arr.length;i++)
//        {
//            arr[i].stopMV();
//        }
//    }
//
//    private getItem():PKItem{
//        var item:PKItem = this.itemCollect.pop();
//        if(!item)
//        {
//            item = new PKItem();
//            item.anchorOffsetX = this.itemWidth/2;
//            item.anchorOffsetY = this.itemHeight/2;
//        }
//        item['jumping'] = false;
//        item.alpha = 1;
//        item.scaleX = 1;
//        item.scaleY = 1;
//        item.out = false
//        item.action = false
//        return item;
//    }
//
//    private mvFreeItem(item){
//        if(item.out)
//            return;
//        var tw:egret.Tween = egret.Tween.get(item);
//        tw.to({alpha:0}, 1000).call(function(){
//            this.freeItem(item);
//        },this)
//    }
//
//    private freeItem(item){
//        if(item.out)
//            return;
//        item.out = true;
//        this.itemCollect.push(item);
//        MyTool.removeMC(item);
//        item.stopMV();
//    }
//
//    private initView(){
//        var stageHeight = this.stageHeight = this.stage.stageHeight;
//        this.jumpBtn.x = 720;
//        //this.jumpBtn.visible = false;
//        //this.jumpBtn.bottom = Math.max(10,(stageHeight - this.fightHeight)/2 + 10);
//
//        //var scene = PKManager.getInstance().getPKBG(PKManager.getInstance().pkType);
//        this.bg0.source = this.scene;
//        this.bg1.source = this.scene;
//
//        while(this.itemEnemy.length > 0)
//        {
//             this.freeItem(this.itemEnemy.pop());
//        }
//        while(this.itemSelf.length > 0)
//        {
//             this.freeItem(this.itemSelf.pop());
//        }
//
//        this.selfGroup.removeChildren()
//
//
//        //this.enemyGroup.y = stageHeight/2 - (400+40);
//        this.selfGroup.y = (stageHeight - this.fightHeight)/2// + 40
//
//    }
//
//    private addSceneMovie(){
//        var Y =this.stageHeight/2;
//        var desY =  this.random()*200-100
//        var scale = 1.5
//
//        this.bg0.x = -320-170;
//        this.bg0.y = Y+desY;
//
//        this.bg1.x = 640+170;
//        this.bg1.y = Y-desY;
//
//        this.bg0.scaleX = this.bg0.scaleY = scale;
//        this.bg1.scaleX = this.bg1.scaleY = scale;
//        var tw:egret.Tween = egret.Tween.get(this.bg0);
//        var tw2:egret.Tween = egret.Tween.get(this.bg0);
//        tw.to({scaleX:1,scaleY:1},500);// .wait(200)
//        tw2.to({x:0,y:Y},500,egret.Ease.sineIn); //.wait(200)
//
//
//        var tw:egret.Tween = egret.Tween.get(this.bg1);
//        var tw2:egret.Tween = egret.Tween.get(this.bg1);
//        tw.to({scaleX:1,scaleY:1},500).call(function(){
//            this.bgBlack.visible = true;
//            this.shakeBG();
//        },this).wait(600).call(this.addItemMovie,this);    //.wait(100)
//        tw2.to({x:315,y:Y},500,egret.Ease.sineIn) //.wait(100)
//
//        var itemHeight = 123;
//        var des = (this.stageHeight - this.fightHeight)/2;
//        this.topMC.y = -itemHeight+des
//        this.bottomMC.y = this.stageHeight-des
//        //if(des > 0)
//        //{
//        //    this.topMC.alpha = 0
//        //    this.bottomMC.alpha = 0
//        //    var tw:egret.Tween = egret.Tween.get(this.topMC);
//        //    tw.to({alpha:1},100)
//        //    var tw:egret.Tween = egret.Tween.get(this.bottomMC);
//        //    tw.to({alpha:1},100)
//        //}
//
//        this.jumpBtn.y = this.stageHeight- des - 70;
//    }
//
//    private shakeBG(){
//        var tw:egret.Tween = egret.Tween.get(this.bgGroup);
//        tw.to({x:-6,y:-5},80).to({x:5,y:3},120).to({x:-2,y:-1},50).to({x:0,y:0},30)
//    }
//
//    //加所有单位
//    private addItemMovie(){
//        MainPageUI.getInstance().visible = false;
//        var isPKJump = PKManager.getInstance().pkJump;
//        if(isPKJump)
//        {
//            this.showResult()
//            return;
//        }
//
//        var myTeam = PKManager.getInstance().team1Base.list
//        var enemyTeam = PKManager.getInstance().team2Base.list
//        if(PKManager.getInstance().teamChange)
//        {
//            var temp = enemyTeam
//            enemyTeam = myTeam
//            myTeam = temp
//        }
//
//        var arr = [1,200,400,600,800,1000,1200]
//        arr.length =myTeam.length+1
//        this.randomSort(arr);
//        for(var i=0;i<myTeam.length;i++)
//        {
//            this.addOneItem(myTeam[i],1,i,arr[i]);
//        }
//        this.resetXY(this.itemSelf,1);
//
//
//        var arr = [1,200,400,600,800,1000,1200]
//        arr.length =enemyTeam.length+1
//        this.randomSort(arr);
//        for(var i=0;i<enemyTeam.length;i++)
//        {
//            this.addOneItem(enemyTeam[i],2,i,arr[i]);
//        }
//        this.resetXY(this.itemEnemy,2);
//
//
//
//        this.timer = egret.setTimeout(this.playOne,this,arr.length * 200 + 300)
//        SoundManager.getInstance().loadPKSound();
//
//        var tw:egret.Tween = egret.Tween.get(this.jumpBtn);
//        tw.to({x:556},300).to({x:566},100)
//        //this.jumpBtn.visible = true;
//
//
//    }
//
//    private randomSort(arr){
//        var self = this;
//        var fun = function(a,b){
//            if(self.random()>0.5)
//                return 1;
//            return -1;
//        }
//        arr.sort(fun);
//    }
//
//    //加一个单位到舞台上
//    private addOneItem(data,team,index,delay){
//        var item =this.getItem();
//        item.data = {vo:MonsterVO.getObject(data),team:team,index:index};
//        item.alpha = 0;
//        if(team == 1)
//        {
//            this.itemSelf.push(item);
//        }
//        else
//        {
//            this.itemEnemy.push(item);
//        }
//        this.selfGroup.addChild(item);
//        egret.setTimeout(this.showItemMV,this,delay,item)
//        return item;
//    }
//
//    //两点间距离
//    private getDis(p1,p2){
//        return Math.pow(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),0.5)
//    }
//
//    //定位
//    private resetXY(arr,team){
//        var maxX = 0;
//        var maxY = 0;
//        for(var i=0;i<arr.length;i++)
//        {
//            var item = arr[i];
//            if(arr.length == 4)
//            {
//                item.x = (i%2)*150;
//                item.y = Math.floor(i/2)*145;
//                item.line = Math.floor(i/2) + 1
//            }
//            else
//            {
//                item.x = (i%3)*150;
//                item.y = Math.floor(i/3)*145;
//                item.line = Math.floor(i/3) + 1
//                if(arr.length == 5 && i >= 3)
//                {
//                    item.x += 150 / 2
//                }
//            }
//
//            if(item.x > maxX)
//                maxX = item.x;
//            if(item.y > maxY)
//                maxY = item.y;
//        }
//        var decX = (640 - maxX)/2
//        var decY = (320 - maxY)/2
//
//        for(var i=0;i<arr.length;i++)
//        {
//            var item = arr[i];
//            if(team == 1)
//            {
//                item.x = item.x + decX;
//                item.y = item.y + decY + 640;
//                item.ar = -1;
//            }
//            else
//            {
//                item.x = 640 - item.x - decX;
//                item.y = 320 - item.y - decY;
//                item.ar = 1;
//            }
//            item.ox = item.x
//            item.oy = item.y
//        }
//    }
//
//    //玩家出场动画
//    private showItemMV(item){
//        if(this.isStop)
//            return;
//        //var VM = PKMainMV.getInstance();
//        //if(item.team == 1)
//        //    VM.playOnItem(28,item)
//        //else
//        //    VM.playOnItem(34,item)
//        //var x = item.x;
//        item.parent.addChild(item);
//        item.alpha = 1;
//        var y = item.y;
//        var decY = 20 + this.random()*20;
//        if(y < 480)
//        {
//            item.y = -200;
//        }
//        else
//        {
//            item.y = this.fightHeight + 200
//            decY = -20 + this.random()*20;
//        }
//
//
//
//        var tw:egret.Tween = egret.Tween.get(item);
//
//        tw.to({y:y + decY},200).to({y:y},100);
//    }
//
//    //开始播放动画
//    private playOne(){
//        if(this.isStop)
//            return;
//        //console.log('playOne');
//        if(this.loadGroup2)
//        {
//            RES.createGroup('pk_load',this.loadGroup2,true);
//            RES.loadGroup("pk_load",-2);
//            this.loadGroup2 = null;
//        }
//
//
//        var oo:any = this.currentStep = this.pkList.shift();
//        if(oo == null)//pk结束
//        {
//            this.jumpBtn.visible = false;
//            this.timer = egret.setTimeout(this.showResult,this,1000)
//             return;
//        }
//        this.needUpArr1 = [];
//        this.needUpArr2 = [];
//        this.jumpBtn.visible = true;
//        this.player1 = this.itemSelf[oo.p1];
//        this.player2 = this.itemEnemy[oo.p2];
//        var nextPlayer1 = this.itemSelf[oo.p1 + 1];
//        var nextPlayer2 = this.itemEnemy[oo.p2 + 1];
//        for(var s in this.itemSelf)
//        {
//            var item = this.itemSelf[s];
//            item.enemy = this.player2
//            item.self = this.player1
//            item.isPKing = false
//            if(nextPlayer1 && nextPlayer1.line == 2 && item.line == 2)
//                this.needUpArr1.push(item);
//        }
//        for(var s in this.itemEnemy)
//        {
//            var item = this.itemEnemy[s];
//            item.enemy = this.player1
//            item.self = this.player2
//            item.isPKing = false
//
//            if(nextPlayer2 && nextPlayer2.line == 2 && item.line == 2)
//                this.needUpArr2.push(item);
//        }
//        this.player1.isPKing = true
//        this.player2.isPKing = true
//        this.player1.line = 1
//        this.player2.line = 1
//
//
//
//        this.stepOne();
//
//    }
//
//    private stepOne(){
//        if(this.isStop)
//            return;
//         var oo = this.currentStep.list.shift();
//        var player
//        //if(oo)
//        //{
//        //    console.log(oo.type)
//        //}
//        if(!oo)
//        {
//            this.timer = egret.setTimeout(this.playOne,this,200);
//        }
//        else if(oo.type == 'atk')
//        {
//            this.pkStep = 0;
//            this.atker = oo.value;
//            this.nextPK();
//        }
//        else if(oo.type == 'lastAtk')
//        {
//            if(oo.value == 1)
//                player = (this.player1)
//            else
//                player = (this.player2)
//            this.pkOne(player,true)
//        }
//        else if(oo.type == 'die')
//        {
//            if(oo.value == 1)
//                player = (this.player1)
//            else
//                player = (this.player2)
//            this.playDie(player);
//            this.stepOne();
//        }
//        else if(oo.type == 'win3')
//        {
//            if(oo.value == 1)
//                player = (this.player1)
//            else
//                player = (this.player2)
//            this.playWinRemove(player);
//            this.timer = egret.setTimeout(this.stepOne,this,200);
//        }
//    }
//
//
//    //行动动画
//    private nextPK(){
//        if(this.isStop)
//            return;
//        this.pkStep ++;
//        var player
//        switch(this.pkStep){
//            case 1:
//                if(this.atker == 1)
//                    player = (this.player1)
//                else
//                    player = (this.player2)
//               break;
//            case 2:
//                if(this.atker == 1)
//                    player = (this.player2)
//                else
//                    player = (this.player1)
//
//                if(this.random() < 0.6) //可能会少播2回合
//                    this.pkStep += 2;
//                else if(this.random() < 0.3) //有一定的几率跳过下一回合
//                    this.pkStep += 1;
//               break;
//            case 3:
//                if(this.atker == 1)
//                    player = (this.player1)
//                else
//                    player = (this.player2)
//
//                if(this.random() < 0.3) //有一定的几率跳过下一回合
//                    this.pkStep += 1;
//
//                break;
//            case 4:
//                if(this.atker == 1)
//                    player = (this.player2)
//                else
//                    player = (this.player1)
//
//                if(this.random() < 0.4) //有一定的几率跳过下一回合
//                    this.pkStep += 1;
//               break;
//            case 5:
//                if(this.atker == 1)
//                    player = (this.itemSelf[this.currentStep.p1 + 1])
//                else
//                    player = (this.itemEnemy[this.currentStep.p2 + 1])
//
//                if(this.random() < 0.4) //有一定的几率跳过下一回合
//                    this.pkStep += 1;
//               break;
//            case 6:
//                if(this.atker == 1)
//                    player = (this.itemEnemy[this.currentStep.p2 + 1])
//                else
//                    player = (this.itemSelf[this.currentStep.p1 + 1])
//
//                if(this.random() < 0.4) //有一定的几率跳过下一回合
//                    this.pkStep += 1;
//               break;
//            case 7:
//                if(this.atker == 1)
//                    player = (this.itemSelf[this.currentStep.p1 + 2])
//                else
//                    player = (this.itemEnemy[this.currentStep.p2 + 2])
//
//                if(this.random() < 0.4) //有一定的几率跳过下一回合
//                    this.pkStep += 1;
//               break;
//            case 8:
//                if(this.atker == 1)
//                    player = (this.itemEnemy[this.currentStep.p2 + 2])
//                else
//                    player = (this.itemSelf[this.currentStep.p1 + 2])
//               break;
//            default :
//            {
//                this.stepOne();
//                return;
//            }
//        }
//
//        if(player) {
//            this.pkOne(player)
//        }
//        else
//            this.nextPK();
//    }
//
//    //在PK区内找一空位置
//    private findFightEmpty(startPoint,mapData,enemy?,enemyDis?){
//        var startX = 60  + 30
//        var startY = this.fightStarY  + 30
//        var endX = 640-60 -30
//        var endY = this.fightEndY  - 30
//        var step = 10;
//        while(true)
//        {
//            var ok = true;
//            var x = startPoint.x -step + this.random()*step*2
//            var y = startPoint.y -step + this.random()*step*2
//            if(x < startX)
//                x = startX;
//            else if(x > endX)
//                x = endX;
//
//            if(y < startY)
//                y = startY;
//            else if(y > endY)
//                y = endY;
//            var xy = {x:x,y:y}
//            for(var s in mapData){
//                var dis =this.getDis(xy,mapData[s])
//                if(enemy && enemy.id == s && dis <enemyDis)
//                {
//                    ok = false;
//                    break;
//                }
//                if(dis < 120)
//                {
//                    ok = false;
//                    break;
//                }
//            }
//
//            if(ok)//找到
//            {
//                return xy;
//            }
//            step+= 10;
//            if(step > 320 + 160)
//            {
//                enemy = null
//            }
//        }
//        return null
//
//    }
//
//    //是否不在PK区内
//    private testOut(item,fun,enemy?,enemyDis?,testEnemy?){
//        if(item.x < 60 || item.x > 640 - 60 || item.y < this.fightStarY || item.y > this.fightEndY || (testEnemy && this.getDis(item,enemy)<enemyDis))
//        {
//            var startPoint = item;
//            if(!item.action)
//                startPoint = item.team == 1?{x:160,y:480} :{x:480,y:480}
//            var newPos = this.findFightEmpty(startPoint,this.getCurrentMap(),enemy,enemyDis)
//            var VM = PKMainMV.getInstance();
//            VM.jumpToXY(item,newPos,fun,this,100);
//            item.action = true;
//            return true
//        }
//        return false;
//    }
//
//    private pkOne(item,shake?,disDec=0){
//        if(this.isStop)
//            return;
//        var self = this;
//        function rePKOne(){
//            self.pkOne(item,shake,disDec);
//        }
//
//        var mvo = item.data.vo;
//        if(item.isPKing)
//        {
//            var arr = mvo.mvType1;
//        }
//        else
//        {
//            var arr = mvo.mvType2;
//        }
//
//        var skillData = arr[Math.floor(arr.length * this.random())];
//        while((shake && skillData.type == 3) || (!shake && skillData.isLast))
//        {
//            skillData = arr[Math.floor(arr.length * this.random())];
//        }
//
//        var type = skillData.type;
//        var newPos:any;
//        if(skillData.type ==0) //移过去近攻
//        {
//            //移过去
//            if(this.testOut(item.enemy,rePKOne,item,250))
//            {
//                return;
//            }
//            if(item.isPKing && this.randomJump(item,rePKOne))
//            {
//                return
//            }
//            this.atkType0(item,skillData,shake);
//        }
//        else if(skillData.type ==1) //1远程对方
//        {
//            if(this.testOut(item.enemy,rePKOne,item,250))
//            {
//                return;
//            }
//            if(item.isPKing)
//            {
//                if(this.randomJump(item,rePKOne))
//                {
//                    return
//                }
//                if(this.testOut(item,rePKOne,item.enemy,250+disDec,true))
//                {
//                    disDec -= 20;
//                    return;
//                }
//
//                this.atkType1(item,skillData,shake);
//            }
//            else
//            {
//                this.atkType1(item,skillData,shake);
//            }
//        }
//        else if(skillData.type == 2) //1远程字弹
//        {
//            if(this.testOut(item.enemy,rePKOne,item,250))
//            {
//                return;
//            }
//            if(item.isPKing)
//            {
//                if(this.randomJump(item,rePKOne))
//                {
//                    return
//                }
//                if(this.testOut(item,rePKOne,item.enemy,250+disDec,true))
//                {
//                    disDec -= 20;
//                    return;
//                }
//
//                this.atkType2(item,skillData,shake);
//            }
//            else
//            {
//                this.atkType2(item,skillData,shake);
//            }
//        }
//        else if(skillData.type ==3) //1远程自己
//        {
//            //if(this.testOut(item.enemy,rePKOne))
//            //{
//            //    return;
//            //}
//            if(item.isPKing)
//            {
//                if(this.testOut(item,rePKOne,item.enemy,250+disDec,true))
//                {
//                    disDec -= 20;
//                    return;
//                }
//                this.atkType3(item,skillData);
//            }
//            else
//            {
//                this.atkType3(item,skillData);
//            }
//        }
//        else if(skillData.type ==4) //移过去近攻,状态
//        {
//            //移过去
//            if(this.testOut(item.enemy,rePKOne,item,250))
//            {
//                return;
//            }
//            if(item.isPKing && this.randomJump(item,rePKOne))
//            {
//                return
//            }
//            this.atkType4(item,skillData,shake);
//        }
//
//        if(item.isPKing)
//            item.action = true;
//        if(this.pkStep >= 1 && this.needUpArr1.length > 0)
//        {
//             this.upArr(this.needUpArr1);
//        }
//        if(this.pkStep >= 2 && this.needUpArr2.length > 0)
//        {
//             this.upArr(this.needUpArr2);
//        }
//    }
//
//    //A跳向B附近，随机的
//    private randomJump(atker,fun,enemyDis = 150){
//        if(this.random() < 0.9)
//            return false;
//        var startPoint = atker;
//        var newPos = this.findFightEmpty(startPoint,this.getCurrentMap(),atker.enemy,enemyDis)
//        var VM = PKMainMV.getInstance();
//        VM.jumpToXY(atker,newPos,fun,this,100);
//        return true;
//    }
//
//    private upArr(arr){
//        for(var i=0;i<arr.length;i++)
//        {
//            var item = arr[i];
//            item.line = 1;
//            var tw:egret.Tween = egret.Tween.get(item);
//            if(item.team == 1){
//                tw.wait(this.random() * 300).to({y:item.y  - 100},300)
//            }
//            else
//            {
//                tw.wait(this.random() * 300).to({y:item.y  + 100},300)
//            }
//        }
//        arr.length = 0;
//    }
//
//    private atkType0(item,mv,shake){
//        var VM = PKMainMV.getInstance();
//        var pos = {x:item.x,y:item.y};
//
//        //SoundManager.getInstance().playEffect(SoundConfig.pk_jump2);
//        var xy = VM.moveToTarget(item,item.enemy,function(){
//            //被攻击击移后
//            var xy = VM.behitMoveBack(item,item.enemy,function(){
//                this.timer = egret.setTimeout(this.nextPK,this,200)
//            },this)
//            this.jumpOut(item.enemy,xy,[item]);
//
//            if(!item.isPKing)
//            {
//                VM.moveToXY(item,pos);
//            }
//
//            //击中动画
//            var id = mv.id;
//            VM.playOnItem(id,item.enemy,null,null);
//            if(shake)
//                this.shakeBG();
//        },this)
//        if(item.isPKing)
//            this.jumpOut(item,xy,[item.enemy]);
//    }
//
//    //1远程对方
//    private atkType1(item,mv,shake){
//        var VM = PKMainMV.getInstance();
//        VM.skillMV(item,function(){
//            //被攻击击移后
//            this.timer = egret.setTimeout(this.nextPK,this,400)
//
//            VM.behitMV(item.enemy);
//            //击中动画
//            var id = mv.id;
//            VM.playOnItem(id,item.enemy,null,null);
//            if(shake)
//                this.shakeBG()
//        },this)
//    }
//
//    //2远程对方
//    private atkType2(item,mv,shake){
//        var VM = PKMainMV.getInstance();
//        var sendXY = VM.getDisPoint(item,item.enemy,50);
//        VM.skillMV2(item,item.enemy,function(){
//            VM.playBullet(mv.id,item,item.enemy,function(){
//                //被攻击击移后
//                var xy = VM.behitMoveBack(item,item.enemy,function(){
//                    this.timer = egret.setTimeout(this.nextPK,this,200)
//                },this)
//                this.jumpOut(item.enemy,xy,[item]);
//
//                //击中动画
//                VM.playOnItem(mv.id2,item.enemy,null,null,xy);
//                if(shake)
//                    this.shakeBG()
//            },this,sendXY)
//        },this)
//    }
//
//    //远程自己
//    private atkType3(item,mv){
//        var VM = PKMainMV.getInstance();
//        VM.skillMV(item,function(){
//            this.timer = egret.setTimeout(this.nextPK,this,400)
//            //击中动画
//            var id = mv.id;
//            VM.playOnItem(id,item.self,null,null);
//        },this)
//
//    }
//
//    //近攻，动画放在对方面上
//    private atkType4(item,mv,shake){
//        var VM = PKMainMV.getInstance();
//        var pos = {x:item.x,y:item.y};
//
//        //SoundManager.getInstance().playEffect(SoundConfig.pk_jump2);
//        var xy = VM.moveToTarget(item,item.enemy,function(){
//            //被攻击击移后
//            var xy = VM.behitMoveBack(item,item.enemy,function(){
//                this.timer = egret.setTimeout(this.nextPK,this,200)
//            },this)
//            this.jumpOut(item.enemy,xy,[item]);
//
//            if(!item.isPKing)
//            {
//                VM.moveToXY(item,pos);
//            }
//
//            //击中动画
//            var id = mv.id;
//            VM.playOnItem(id,item.enemy,null,null,xy);
//            if(shake)
//                this.shakeBG();
//        },this)
//        if(item.isPKing)
//            this.jumpOut(item,xy,[item.enemy]);
//    }
//
//    //得到当前还在场上单位的布局
//    private getCurrentMap(){
//        var map = {}
//        var arr = this.itemSelf.concat(this.itemEnemy);
//        for(var i=0;i<arr.length;i++)
//        {
//            var oo = arr[i];
//            if(!oo.out)
//            {
//                map[oo.id] = {x:oo.x,y:oo.y}
//            }
//        }
//        return map;
//    }
//
//    //取两个目标之间的中间位置
//    private getMiddleXY(a,b){
//        return {
//            x:a.x + (b.x - a.x)/2,
//            y:a.y + (b.y - a.y)/2,
//        }
//    }
//
//    //在目标附近的都跳开
//    private jumpOut(item,toXY,noMove?){
//        noMove = noMove || []
//        var arr = this.itemSelf.concat(this.itemEnemy);
//        var map = this.getCurrentMap();
//        map[item.id + '_'] = map[item.id];
//        map[item.id] = toXY
//        var jumpArr = [];
//        for(var i=0;i<arr.length;i++)
//        {
//            var oo = arr[i];
//            if(oo.out)
//                continue;
//            if(noMove.length && noMove.indexOf(oo) != -1)
//                continue;
//            var nowXY = map[oo.id]
//             if(oo != item && this.getDis(toXY,nowXY) < 120)
//             {
//                 delete map[oo.id];
//                 var newPos = this.findRoundPos(oo,map,30)
//                 if(!newPos)
//                    newPos = this.findRoundPos(oo,map,60)
//                 if(!newPos)
//                    newPos = this.findRoundPos(oo,map,90)
//                 if(!newPos)
//                    newPos = this.findRoundPos(oo,map,120)
//
//                 if(newPos)
//                    jumpArr.push({item:oo,newPos:newPos});
//                 else
//                 {
//                     newPos = this.findEmptyPos(oo,map,160)
//                     jumpArr.push({item:oo,newPos:newPos,jump:true});
//                 }
//
//                 map[oo.id] = newPos;
//             }
//        }
//
//        var VM = PKMainMV.getInstance();
//        for(var i=0;i<jumpArr.length;i++)
//        {
//            var oo = jumpArr[i];
//            //if(oo.item.jumping)
//            //{
//            //    this.needMoveItem.push(oo.item);
//            //    continue;
//            //}
//            if(oo.jump)
//                VM.jumpToXY(oo.item,oo.newPos)
//            else
//                VM.moveToXY(oo.item,oo.newPos)
//        }
//        return jumpArr.length > 0;
//    }
//
//    //找自己附近的位置
//    private findRoundPos(item,mapData,limit):any{
//        var ok = true;
//        var startX = Math.max(60,item.x - limit);
//        var startY = Math.max(80,item.y - limit);
//        var endX = Math.min(640-60, startX + limit*2);
//        var endY = Math.min(this.fightHeight-80, startY + limit*2);
//        var step = 30;
//        while(step--)
//        {
//            var ok = true;
//            var x = startX + this.random()*(endX - startX);
//            var y = startY + this.random()*(endY - startY)
//            var xy = {x:x,y:y}
//            for(var s in mapData){
//                var dis =this.getDis(xy,mapData[s])
//                if(dis < 120)
//                {
//                    ok = false;
//                    break;
//                }
//            }
//
//            if(ok)//找到
//            {
//                return xy;
//            }
//        }
//        return this.findRoundPos(item,mapData,limit + 50);
//
//    }
//
//    //找自己附近的位置外，查找最近的空位置
//    private findEmptyPos(item,mapData,limit):any{
//        var step = 10;//10次后会变成全屏
//        var x1 = Math.max(60,item.x - limit)
//        var x2 = Math.min(640-60,item.x + limit)
//        var y1 = Math.max(80,item.y - limit)
//        var y2 = Math.min(this.fightHeight-80,item.y + limit);
//        var stepX1 = (x1-60)/5
//        var stepX2 = (640-60 - x2)/5
//        var stepY1 = (y1-80)/10
//        var stepY2 = (this.fightHeight-80 - y2)/10;
//
//        while(step--)
//        {
//            var tryTime = 40;//试20次
//            if(step < 6)
//            {
//                tryTime = 20
//            }
//            while(true)
//            {
//                var error = false
//                if(step < 6)
//                {
//                    var startX = x1;
//                    var startY = y1 - stepY1;
//                    var endX = x2;
//                    var endY = y2 + stepY2;
//                    var type = tryTime%2;
//                    if(item.y < this.fightHeight/2)  //在上半地图由下开始找
//                        type = 1-type;
//
//                    if(type == 0)
//                    {
//
//                        if(y1 - startY == 0)
//                            error = true;
//                        else
//                            var y = startY + this.random()*(y1 - startY);
//                    }
//                    else
//                    {
//
//                        if(endY - y2 == 0)
//                            error = true;
//                        else
//                            var y = y2 + this.random()*(endY - y2);
//                    }
//                    if(!error)
//                        var x = x1 + this.random()*(x2 - x1);
//                }
//                else
//                {
//
//                    var startX = x1 - stepX1;
//                    var startY = y1 - stepY1;
//                    var endX = x2 + stepX2;
//                    var endY = y2 + stepY2;
//                    var type = tryTime%4
//                    if(item.y < this.fightHeight/2)  //在上半地图由下开始找
//                        type = 3-type;
//                    if(type == 0)
//                    {
//                        if(x1 - startX == 0)
//                            error = true;
//                        else
//                        {
//                            var x = startX + this.random()*(x1 - startX);
//                            var y = startY + this.random()*(y2 - startY)
//                        }
//
//
//                    }
//                    else if(type == 1)
//                    {
//                        if(y1 - startY == 0)
//                            error = true;
//                        else
//                        {
//                            var x = x1 + this.random()*(endX - x1);
//                            var y = startY + this.random()*(y1 - startY)
//                        }
//
//
//                    }
//                    else if(type == 2)
//                    {
//                        if(endX - x2 == 0)
//                            error = true;
//                        else
//                        {
//                            var x = x2 + this.random()*(endX - x2);
//                            var y = y1 + this.random()*(endY - y1)
//                        }
//                    }
//                    else
//                    {
//                        if(endY - y2 == 0)
//                            error = true;
//                        else {
//                            var x = startX + this.random() * (x2 - startX);
//                            var y = y2 + this.random() * (endY - y2)
//                        }
//                    }
//                }
//
//
//                if(!error)
//                {
//                    var ok = true;
//                    var xy = {x:x,y:y}
//                    for(var s in mapData){
//                        var dis =this.getDis(xy,mapData[s])
//                        if(dis < 120)
//                        {
//                            ok = false;
//                            break;
//                        }
//                    }
//
//                    if(ok)//找到
//                    {
//                        return xy;
//                    }
//                }
//
//                tryTime --;
//                if(tryTime == 0)
//                    break;
//            }
//            //向加大一圈的地方找
//            x1 = startX
//            x2 = endX
//            y1 = startY
//            y2 = endY
//        }
//        return {x:item.x,y:item.y};//找不到就不动了
//    }
//
//    //死的动画
//    public playDie(item){
//        var x = item.x;
//        var v = 2
//        var tw:egret.Tween = egret.Tween.get(item);
//        tw.to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300).call(function(){
//            this.freeItem(item);
//        },this)
//    }
//
//    //3胜后移除
//    public playWinRemove(item){
//
//        if(item.parent)
//            item.parent.addChild(item);
//        var x = this.x;
//        var v = 2
//
//        var VM = PKMainMV.getInstance();
//        var pos = {x:item.x,y:-60}
//        if(item.team == 1)
//            pos = {x:item.x,y:this.fightHeight + 60}
//
//        var tw:egret.Tween = egret.Tween.get(item);
//        item.parent.addChild(item);
//        var dis = Math.max(400,MyTool.getDis(pos,item));
//        tw.to({scaleX:1.3,scaleY:1.3}, 300,egret.Ease.sineOut).to({scaleX:1.2,scaleY:1.2}, 200).to({scaleX:1.3,scaleY:1.3}, 200).to({x:pos.x,y:pos.y,scaleX:1,scaleY:1}, dis/2).call(function(){
//            this.freeItem(item);
//        },this);
//    }
//
//
//    private stopAll()
//    {
//        egret.clearTimeout(this.timer);
//        this.removeAllTweens()
//
//        while(this.itemEnemy.length > 0)
//        {
//            this.mvFreeItem(this.itemEnemy.pop());
//        }
//        while(this.itemSelf.length > 0)
//        {
//            this.mvFreeItem(this.itemSelf.pop());
//        }
//
//        AniManager.getInstance().removeAllMV();
//        this.isStop = true;
//    }
//
//    private showResult()
//    {
//        //this.hide();
//        PKLoadingUI.getInstance().realHide();
//        this.stopAll();
//        PKResultUI.getInstance().show();
//        //if(PKManager.getInstance().pkResult.result)
//        //    console.log('win');
//        //else
//        //    console.log('loss');
//    }
//
//
//
//}