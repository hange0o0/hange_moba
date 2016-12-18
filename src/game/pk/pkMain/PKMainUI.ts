class PKMainUI extends game.BaseUI {
    private static instance:PKMainUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKMainUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "PKMainUISkin";
    }



    private bg1: eui.Image;
    private bg0: eui.Image;
    private jumpBtn: eui.Button;
    //private enemyGroup: eui.Group;
    private selfGroup: eui.Group;






    //private dataIn;
    private stageHeight;
    private itemWidth = 114;
    private itemHeight = 110;


    private itemCollect = [];
    private itemEnemy = [];
    private itemSelf = [];

    private pkList = [];
    private currentStep;

    private cardIndex1;
    private cardIndex2;
    private timer;
    private count;

    private posArray = []

    private pkStep
    private atker

    private player1
    private player2


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.jumpBtn, this.onJump);

        this.addChild(this.jumpBtn);

        var startY = 80 + this.itemHeight/2;
        var stepY = 115;
        this.posArray.push({x:320,y:startY});
        this.posArray.push({x:320 - 60,y:startY + stepY});
        this.posArray.push({x:320 + 60,y:startY + stepY});
        for(var i=0;i<7;i++)
        {
            this.posArray.push({x:320,y:startY + stepY*(i+2)});
        }
        //this.enemyGroup.scaleY = -1;

        //this.bg0.width = 325;
        //this.bg1.width = 325;
        this.bg0.scrollRect = new egret.Rectangle(0,0,325,1500)
        this.bg1.scrollRect = new egret.Rectangle(315,0,325,1500)
    }

    private onJump(){
        this.showResult();
    }

    public show(){
        //this.dataIn = PKManager.getInstance().pkData;//data;
        this.pkList = PKManager.getInstance().mainVideoList.concat();
        this.cardIndex1 = -1;
        this.cardIndex2 = -1;
        super.show();
    }

    public onShow() {
        PopUpManager.removeShape();
        this.initView();
        this.addSceneMovie();
    }

    private getItem():PKItem{
        var item:PKItem = this.itemCollect.pop();
        if(!item)
        {
            item = new PKItem();
            item.anchorOffsetX = this.itemWidth/2;
            item.anchorOffsetY = this.itemHeight/2;
        }
        item.alpha = 1;
        item.scaleX = 1;
        item.scaleY = 1;
        return item;
    }
    private freeItem(item){
        this.itemCollect.push(item);
        MyTool.removeMC(item);
        item.stopMV();
    }

    private initView(){
        var stageHeight = this.stageHeight = this.stage.stageHeight;
        this.jumpBtn.visible = false;

        var scene = PKManager.getInstance().getPKBG(PKManager.getInstance().pkType);
        this.bg0.source = scene;
        this.bg1.source = scene;

        while(this.itemEnemy.length > 0)
        {
             this.freeItem(this.itemEnemy.pop());
        }
        while(this.itemSelf.length > 0)
        {
             this.freeItem(this.itemSelf.pop());
        }

        //this.enemyGroup.y = stageHeight/2 - (400+40);
        this.selfGroup.y = (stageHeight - 880)/2// + 40

    }

    private addSceneMovie(){
        var Y =this.stageHeight/2;
        var desY =  Math.random()*600-300
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
        tw.to({scaleX:1,scaleY:1},500).call(this.shakeBG,this).wait(600).call(this.addItemMovie,this);    //.wait(100)
        tw2.to({x:315,y:Y},500,egret.Ease.sineIn) //.wait(100)
        //this.bg1.x = 0;
        //this.bg0.x = 640;
        //this.bg1.y = Y;
        //this.bg0.y = Y;
        //this.bg0.scaleX = this.bg0.scaleY = 0;
        //this.bg1.scaleX = this.bg1.scaleY = 0;
        //var tw:egret.Tween = egret.Tween.get(this.bg0);
        //var tw2:egret.Tween = egret.Tween.get(this.bg0);
        //
        //var desY =  Math.random()*600-300
        //var scale = 1.5
        //
        //tw.wait(100).to({scaleX:scale,scaleY:scale}, 700,egret.Ease.sineIn).to({scaleX:1,scaleY:1},500);// .wait(200)
        //tw2.wait(100).to({x:-320-170,y:Y+desY}, 700,egret.Ease.sineOut).to({x:0,y:Y},500,egret.Ease.sineIn); //.wait(200)
        //
        //
        //var tw:egret.Tween = egret.Tween.get(this.bg1);
        //var tw2:egret.Tween = egret.Tween.get(this.bg1);
        //tw.to({scaleX:scale,scaleY:scale}, 800,egret.Ease.sineIn).to({scaleX:1,scaleY:1},500).call(this.shakeBG,this).wait(600).call(this.addItemMovie,this);    //.wait(100)
        //tw2.to({x:640+170,y:Y-desY}, 800,egret.Ease.sineOut).to({x:315,y:Y},500,egret.Ease.sineIn) //.wait(100)

    }

    private shakeBG(){
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({x:-6,y:-5},80).to({x:5,y:3},120).to({x:-2,y:-1},50).to({x:0,y:0},30)
    }

    private addItemMovie(){

        //34,28,22
        //this.hide();
        //return;
        var desY = this.stageHeight/2;
        var myTeam = PKManager.getInstance().team1Base.list
        var time = this.stageHeight * 2;
        for(var i=0;i<myTeam.length;i++)
        {
            this.addOneItem(myTeam[i],1,Math.floor(1+i*100 + 20*Math.random())).index = i;
        }
        this.resetXY(this.itemSelf,1);

        var enemyTeam = PKManager.getInstance().team2Base.list
        for(var i=0;i<enemyTeam.length;i++)
        {
            this.addOneItem(enemyTeam[i],2,Math.floor(1+i*100 + 20*Math.random())).index = i;
        }
        this.resetXY(this.itemEnemy,2);

        this.jumpBtn.visible = true;

        this.timer = egret.setTimeout(this.playOne,this,1500)
    }

    private addOneItem(data,team,delay){
        var item =this.getItem();
        item.data = {vo:MonsterVO.getObject(data),team:team};
        item.visible = false;
        if(team == 1)
        {
            this.itemSelf.push(item);
        }
        else
        {
            this.itemEnemy.push(item);
        }
        this.selfGroup.addChild(item);
        egret.setTimeout(this.showItemMV,this,delay,item)
        return item;
    }

    private resetXY(arr,team){
        var ok = false
        var tryTime2 = 1000;
        var addArr = [];
        while(tryTime2 --){
            addArr = [];
            ok = false
            var minX = 640;
            var maxX = 0;
            for(var i=0;i<arr.length;i++)
            {
                var tryTime = 10;
                ok = false;
                while(tryTime --)
                {
                    var x1 = Math.floor(280 * Math.random()) + 180
                    var y1 = Math.floor(280 * Math.random()) + 60
                    ok = true
                    for(var s in addArr){
                        var x2 = addArr[s].x
                        var y2 = addArr[s].y
                        var dis = Math.pow(Math.pow(x1-x2,2) + Math.pow(y1-y2,2),0.5)
                        if(dis < 120)
                        {
                            ok = false;
                            break;
                        }
                    }
                    if(ok)  //成功加入一个位置
                    {
                        if(x1 < minX)
                            minX = x1;
                        if(x1 > maxX)
                            maxX = x1;
                        arr[i].x = x1;
                        arr[i].y = y1;
                        addArr.push({x:x1,y:y1})
                        break;
                    }
                }
                if(!ok)
                    break;
            }
            if(ok)  //成功加入所有位置
            {
                break;
            }
        }
        var des = (640 - (maxX - minX))/2 - minX;
        if(team == 1)
        {
            ArrayUtil.sortByField(addArr,['y'],[0])
            for(var i=0;i<arr.length;i++)
            {
                arr[i].x =  addArr[i].x + des;
                arr[i].y =  addArr[i].y + 480;
            }
        }
        else
        {
            ArrayUtil.sortByField(addArr,['y'],[1])
            for(var i=0;i<arr.length;i++)
            {
                arr[i].x =  addArr[i].x + des;
                arr[i].y =  addArr[i].y;
            }
        }



        console.log(tryTime2)
    }

    private showItemMV(item){
        item.visible = true;
    }


    ////双方都入场了
    //private onJoinFinish(){
    //
    //    this.vsMC.visible = true;
    //    this.vsMC.alpha = 0;
    //
    //    var tw:egret.Tween = egret.Tween.get(this.vsMC);
    //    tw.to({alpha:1}, 300,egret.Ease.sineIn).wait(200).call(function(){
    //        this.showInfo();
    //    },this)
    //}
    //
    ////显示其它杂项
    //private showInfo(){
    //    this.vsMC.visible = false;
    //    this.timer = egret.setTimeout(this.playOne,this,1500);
    //}

    //开始播放动画
    private playOne(){
        //console.log('playOne');
        var oo:any = this.currentStep = this.pkList.shift();
        if(oo == null)//pk结束
        {
            this.showResult();
             return;
        }
        this.jumpBtn.visible = true;
        this.player1 = this.itemSelf[oo.p1];
        this.player2 = this.itemEnemy[oo.p2];
        this.player1.enemy = this.player2;
        this.player2.enemy = this.player1;
        //var player1 = oo.player1
        //var player2 = oo.player2
        //this.itemSelf[0].playerData = player1
        //this.itemEnemy[0].playerData = player2
        this.stepOne();
        //this.count = 0;
        //if(this.testJumpPK(player1,1))
        //    this.count ++;
        //if(this.testJumpPK(player2,2))
        //    this.count ++;
    }

    private stepOne(){
         var oo = this.currentStep.list.shift();
        var player
        if(!oo)
        {
            this.playOne();
        }
        else if(oo.type == 'atk')
        {
            this.pkStep = 0;
            this.atker = oo.value;
            this.nextPK();
        }
        else if(oo.type == 'lastAtk')
        {
            if(oo.value == 1)
                player = (this.player1)
            else
                player = (this.player2)
            this.pkOne(player)
        }
        else if(oo.type == 'die')
        {
            if(oo.value == 1)
                player = (this.player1)
            else
                player = (this.player2)
            this.playDie(player);
            this.stepOne();
        }
        else if(oo.type == 'win3')
        {
            if(oo.value == 1)
                player = (this.player1)
            else
                player = (this.player2)
            this.playWinRemove(player);
            this.stepOne();
        }
    }

    //行动动画
    private nextPK(){
        this.pkStep ++;
        var player
        switch(this.pkStep){
            case 1:
                if(this.atker == 1)
                    player = (this.player1)
                else
                    player = (this.player2)
               break;
            case 2:
                if(this.atker == 1)
                    player = (this.player2)
                else
                    player = (this.player1)
               break;
            case 3:
                if(this.atker == 1)
                    player = (this.player1)
                else
                    player = (this.player2)
                break;
            case 4:
                if(this.atker == 1)
                    player = (this.player2)
                else
                    player = (this.player1)
               break;
            case 5:
                if(this.atker == 1)
                    player = (this.itemSelf[this.currentStep.p1 + 1])
                else
                    player = (this.itemEnemy[this.currentStep.p2 + 1])
               break;
            case 6:
                if(this.atker == 1)
                    player = (this.itemEnemy[this.currentStep.p2 + 1])
                else
                    player = (this.itemSelf[this.currentStep.p1 + 1])
               break;
            case 7:
                if(this.atker == 1)
                    player = (this.itemSelf[this.currentStep.p1 + 2])
                else
                    player = (this.itemEnemy[this.currentStep.p2 + 2])
               break;
            case 8:
                if(this.atker == 1)
                    player = (this.itemEnemy[this.currentStep.p2 + 2])
                else
                    player = (this.itemSelf[this.currentStep.p1 + 2])
               break;
            default :
            {
                this.stepOne();
                return;
            }
        }

        if(player) {
            console.log(player.team*10 + player.index)
            this.pkOne(player)
        }
        else
            this.nextPK(); //



    }

    private pkOne(item){
        //var
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({scaleX:1.2,scaleY:1.2}, 200).to({scaleX:1,scaleY:1}, 200).call(this.nextPK,this);
    }

    //行动结果
    private playActionResult(){
        //先显示扣血
        this.playPlayerResult();
    }

    //表现移除动画
    private playPlayerResult(){
        this.testPlayer(this.itemSelf[0])
        this.testPlayer(this.itemEnemy[0])
        this.timer = egret.setTimeout(this.addNewPlayer,this,800);
    }

    private testPlayer(item){
         if(item.playerData.after == 0)//死了的
         {
             this.playDie(item);
             return true
         }
         else if(item.playerData.winCount == 3)//连胜3次的
         {
             this.playWinRemove(item);
             return true
         }
        else
         {
             return false
         }
    }


    //死的动画
    public playDie(item){
        var x = item.x;
        var v = 2
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300)
    }
    //3胜后移除
    public playWinRemove(item){
        item.parent.addChild(item);
        var x = this.x;
        var v = 2
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({alpha:0,scaleX:3,scalyY:3}, 300)
    }

    private addNewPlayer(){
        var b = false
        if(this.removeOne(1))
            b = true;
        if(this.removeOne(2))
            b = true;
        //有新加入
        if(b)
        {
            this.timer = egret.setTimeout(this.playOne,this,800);
        }
        else
        {
            this.playOne();
        }
    }

    private removeOne(team){
        var arr,item
        if(team ==1)
        {
            arr = this.itemSelf;
        }
        else
            arr = this.itemEnemy;
        item = arr[0];

        if(item.playerData.after == 0 || item.playerData.winCount == 3)
        {
            this.freeItem(item);
            arr.shift();
        }
        if(arr.length > 0)
        {
            for(var i=0;i<arr.length;i++)
            {
                var item = arr[i];
                var tw:egret.Tween = egret.Tween.get(item);
                tw.wait(i*50).to({x:this.posArray[i].x,y:this.posArray[i].y}, 200);
            }
            return true;
        }
        return false;
    }


    private stopAll()
    {
        egret.clearTimeout(this.timer);
        egret.Tween.removeAllTweens()

        while(this.itemEnemy.length > 0)
        {
            this.freeItem(this.itemEnemy.pop());
        }
        while(this.itemSelf.length > 0)
        {
            this.freeItem(this.itemSelf.pop());
        }
    }

    private showResult()
    {
        this.hide();
        this.stopAll();
        //PKResultUI.getInstance().show();
        //if(PKManager.getInstance().pkResult.result)
        //    console.log('win');
        //else
        //    console.log('loss');
    }



}