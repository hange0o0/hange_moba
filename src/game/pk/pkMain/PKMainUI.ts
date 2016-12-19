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
        var group = VideoManager.getInstance().getVideoAniGroup();
        if(group.length == 0)
            this.LoadFiles = [];
        else
        {
            RES.createGroup('skill_ani',group,true);
            this.LoadFiles = ['skill_ani'];
        }

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
        item.out = false
        return item;
    }
    private freeItem(item){
        item.out = true;
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
        //this.selfGroup.y = (stageHeight - 880)/2// + 40

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
            this.addOneItem(myTeam[i],1,i,Math.floor(1+i*200 + 100*Math.random()));
        }
        this.resetXY(this.itemSelf,1);

        var enemyTeam = PKManager.getInstance().team2Base.list
        for(var i=0;i<enemyTeam.length;i++)
        {
            this.addOneItem(enemyTeam[i],2,i,Math.floor(1+i*200 + 100*Math.random()));
        }
        this.resetXY(this.itemEnemy,2);

        this.jumpBtn.visible = true;

        this.timer = egret.setTimeout(this.playOne,this,2500)
        //this.playOne()
    }

    private addOneItem(data,team,index,delay){
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
        egret.setTimeout(this.showItemMV,this,delay,item)
        return item;
    }

    private getDis(p1,p2){
        return Math.pow(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),0.5)
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
                var tryTime = 30;
                ok = false;
                while(tryTime --)
                {
                    var x1 = Math.floor(280 * Math.random()) + 180
                    var y1 = Math.floor(280 * Math.random()) + 60
                    ok = true
                    for(var s in addArr){
                        //var x2 = addArr[s].x
                        //var y2 = addArr[s].y
                        var dis = this.getDis({x:x1,y:y1},addArr[s]);
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
        var middle = this.stageHeight/2
        if(team == 1)
        {
            ArrayUtil.sortByField(addArr,['y'],[0])
            for(var i=0;i<arr.length;i++)
            {
                arr[i].x =  addArr[i].x + des;
                arr[i].y =  addArr[i].y + middle + 40;
            }
        }
        else
        {
            ArrayUtil.sortByField(addArr,['y'],[1])
            for(var i=0;i<arr.length;i++)
            {
                arr[i].x =  addArr[i].x + des;
                arr[i].y =  addArr[i].y + (middle-440);
            }
        }
    }

    private showItemMV(item){
        var VM = PKMainMV.getInstance();
        if(item.team == 1)
            VM.playOnItem(28,item)
        else
            VM.playOnItem(34,item)

        var tw:egret.Tween = egret.Tween.get(item);

        tw.wait(200).to({alpha:1},500);
    }

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
        for(var s in this.itemSelf)
        {
            this.itemSelf[s].enemy = this.player2
            this.itemSelf[s].self = this.player1
            this.itemSelf[s].isPKing = false
        }
        for(var s in this.itemEnemy)
        {
            this.itemEnemy[s].enemy = this.player1
            this.itemEnemy[s].self = this.player2
            this.itemEnemy[s].isPKing = false
        }
        this.player1.isPKing = true
        this.player2.isPKing = true

        this.stepOne();

    }

    private stepOne(){
         var oo = this.currentStep.list.shift();
        var player
        if(!oo)
        {
            this.timer = egret.setTimeout(this.playOne,this,1000);
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
            //console.log(player.team*10 + player.index)
            this.pkOne(player)
        }
        else
            this.nextPK(); //



    }

    private pkOne(item){

        var mvo = item.data.vo;
        var skillData = item.isPKing?mvo.mvType1:mvo.mvType2;
        var newPos:any;
        if(skillData.type ==0) //移过去近攻
        {
            //移过去
            if(item.x < 60 || item.x > 640 - 60 || item.y < 80 || item.y > this.stageHeight - 80)
            {
                newPos = this.findEmptyPos(item,this.getCurrentMap(),200)
                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType0(item);
                },this,300);
            }
            else
                this.atkType0(item);
        }
        else if(skillData.type ==1) //1远程对方
        {
            //移过去
            var dis = this.getDis(item,item.enemy);
            if(item.x < 60 || item.x > 640 - 60 || item.y < 80 || item.y > this.stageHeight - 80 ||  dis< 200)
            {
                newPos = this.findEmptyPos(item.enemy,this.getCurrentMap(),250)
                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType1(item);
                },this,300);
            }
            else if(dis > 500)
            {
                var mid = this.getMiddleXY(item,item.enemy);
                newPos = this.findRoundPos(mid,this.getCurrentMap(),150)
                if(!newPos)
                newPos = this.findEmptyPos(mid,this.getCurrentMap(),0)

                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType1(item);
                },this,300);
            }
            else
                this.atkType1(item);
        }
        else if(skillData.type == 2) //1远程字弹
        {
            //移过去
            var dis = this.getDis(item,item.enemy);
            if(item.x < 60 || item.x > 640 - 60 || item.y < 80 || item.y > this.stageHeight - 80 ||  dis< 200 )
            {
                newPos = this.findEmptyPos(item.enemy,this.getCurrentMap(),250)
                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType2(item);
                },this,300);
            }
            else if(dis > 500)
            {
                var mid = this.getMiddleXY(item,item.enemy);
                newPos = this.findRoundPos(mid,this.getCurrentMap(),150)
                if(!newPos)
                    newPos = this.findEmptyPos(mid,this.getCurrentMap(),0)

                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType2(item);
                },this,300);
            }
            else
                this.atkType2(item);
        }
        else if(skillData.type ==3) //1远程自己
        {
            //移过去
            var dis = this.getDis(item,item.self);
            if(item.x < 60 || item.x > 640 - 60 || item.y < 80 || item.y > this.stageHeight - 80)
            {
                newPos = this.findEmptyPos(item,this.getCurrentMap(),120)
                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType3(item);
                },this,300);
            }
            else if(dis > 500)
            {
                var mid = this.getMiddleXY(item,item.self);
                newPos = this.findRoundPos(mid,this.getCurrentMap(),150)
                if(!newPos)
                    newPos = this.findEmptyPos(mid,this.getCurrentMap(),0)

                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType3(item);
                },this,300);
            }
            else
                this.atkType3(item);
        }
    }

    private atkType0(item){
        var VM = PKMainMV.getInstance();
        var xy = VM.moveToTarget(item,item.enemy,function(){
            //被攻击击移后
            var xy = VM.behitMoveBack(item,item.enemy,function(){
                this.timer = egret.setTimeout(this.nextPK,this,500)
            },this)
            this.jumpOut(item.enemy,xy,[item]);

            //击中动画
            var mv = item.isPKing?item.data.vo.mvType1.mv:item.data.vo.mvType2.mv
            var id = ArrayUtil.randomOne(mv);
            VM.playOnItem(id,item.enemy,null,null,xy);
        },this)
        this.jumpOut(item,xy,[item.enemy]);
    }


    //1远程对方
    private atkType1(item){
        console.log('atkType1');
        var VM = PKMainMV.getInstance();
        VM.skillMV(item,function(){
            //被攻击击移后
            this.timer = egret.setTimeout(this.nextPK,this,800)


            //击中动画
            var mv = item.isPKing?item.data.vo.mvType1.mv:item.data.vo.mvType2.mv
            var id = ArrayUtil.randomOne(mv);
            VM.playOnItem(id,item.enemy,null,null);
        },this)

    }
    //2远程对方
    private atkType2(item){
        var VM = PKMainMV.getInstance();
        var mv = item.isPKing?item.data.vo.mvType1.mv:item.data.vo.mvType2.mv;

        VM.playBullet(mv[0],item,item.enemy,function(){
            //被攻击击移后
            var xy = VM.behitMoveBack(item,item.enemy,function(){
                this.timer = egret.setTimeout(this.nextPK,this,500)
            },this)
            this.jumpOut(item.enemy,xy,[item]);

            //击中动画
            VM.playOnItem(mv[1],item.enemy,null,null,xy);
        },this)

    }
    //远程自己
    private atkType3(item){
        var VM = PKMainMV.getInstance();
        VM.skillMV(item,function(){
            this.timer = egret.setTimeout(this.nextPK,this,800)
            //击中动画
            var mv = item.isPKing?item.data.vo.mvType1.mv:item.data.vo.mvType2.mv
            var id = ArrayUtil.randomOne(mv);
            VM.playOnItem(id,item.self,null,null);
        },this)

    }

    //得到当前还在场上单位的布局
    private getCurrentMap(){
        var map = {}
        var arr = this.itemSelf.concat(this.itemEnemy);
        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            if(!oo.out)
            {
                map[oo.id] = {x:oo.x,y:oo.y}
            }
        }
        return map;
    }

    private getMiddleXY(a,b){
        return {
            x:a.x + (b.x - a.x)/2,
            y:a.y + (b.y - a.y)/2,
        }
    }

    //在目标附近的都跳开
    private jumpOut(item,toXY,noMove?){
        noMove = noMove || []
        var arr = this.itemSelf.concat(this.itemEnemy);
        var map = this.getCurrentMap();
        map[item.id + '_'] = map[item.id];
        map[item.id] = toXY
        var jumpArr = [];
        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            if(oo.out)
                continue;
            if(noMove.length && noMove.indexOf(oo) != -1)
                continue;
            var nowXY = map[oo.id]
             if(oo != item && this.getDis(toXY,nowXY) < 120)
             {
                 delete map[oo.id];
                 var newPos = this.findRoundPos(oo,map,60)
                 if(!newPos)
                    newPos = this.findRoundPos(oo,map,80)
                 if(!newPos)
                    newPos = this.findRoundPos(oo,map,100)
                 if(!newPos)
                    newPos = this.findRoundPos(oo,map,120)

                 if(newPos)
                    jumpArr.push({item:oo,newPos:newPos});
                 else
                 {
                     newPos = this.findEmptyPos(oo,map,160)
                     jumpArr.push({item:oo,newPos:newPos,jump:true});
                 }

                 map[oo.id] = newPos;
             }
        }

        var VM = PKMainMV.getInstance();
        for(var i=0;i<jumpArr.length;i++)
        {
            var oo = jumpArr[i];
            if(oo.jump)
                VM.jumpToXY(oo.item,oo.newPos)
            else
                VM.moveToXY(oo.item,oo.newPos)
        }
        return jumpArr.length > 0;
    }

    //找自己附近的位置
    private findRoundPos(item,mapData,limit){
        var ok = true;
        var startX = Math.max(60,item.x - limit);
        var startY = Math.max(80,item.y - limit);
        var endX = Math.min(640-60, startX + limit*2);
        var endY = Math.min(this.stageHeight-80, startY + limit*2);
        var step = 30;
        while(step--)
        {
            var ok = true;
            var x = startX + Math.random()*(endX - startX);
            var y = startY + Math.random()*(endY - startY)
            var xy = {x:x,y:y}
            for(var s in mapData){
                var dis =this.getDis(xy,mapData[s])
                if(dis < 120)
                {
                    ok = false;
                    break;
                }
            }

            if(ok)//找到
            {
                return xy;
            }
        }
        return null;

    }

    //找自己附近的位置外，查找最近的空位置
    private findEmptyPos(item,mapData,limit){
        var step = 10;//10次后会变成全屏
        var x1 = Math.max(60,item.x - limit)
        var x2 = Math.min(640-60,item.x + limit)
        var y1 = Math.max(80,item.y - limit)
        var y2 = Math.min(this.stageHeight-80,item.y + limit);
        var stepX1 = (x1-60)/5
        var stepX2 = (640-60 - x2)/5
        var stepY1 = (y1-80)/10
        var stepY2 = (this.stageHeight-80 - y2)/10;

        while(step--)
        {
            var tryTime = 40;//试20次
            if(step < 6)
            {
                tryTime = 20
            }
            while(true)
            {
                if(step < 6)
                {
                    var startX = x1;
                    var startY = y1 - stepY1;
                    var endX = x2;
                    var endY = y2 + stepY2;
                    var type = tryTime%2;
                    if(item.y < this.stageHeight/2)  //在上半地图由下开始找
                        type = 1-type;
                    var x = x1 + Math.random()*(x2 - x1);
                    if(type == 0)
                    {
                        var y = startY + Math.random()*(y1 - startY);
                    }
                    else
                    {
                        var y = y2 + Math.random()*(endY - y2);
                    }
                }
                else
                {
                    var startX = x1 - stepX1;
                    var startY = y1 - stepY1;
                    var endX = x2 + stepX2;
                    var endY = y2 + stepY2;
                    var type = tryTime%4
                    if(item.y < this.stageHeight/2)  //在上半地图由下开始找
                        type = 3-type;
                    if(type = 0)
                    {
                        var x = startX + Math.random()*(x1 - startX);
                        var y = startY + Math.random()*(y2 - startY)
                    }
                    else if(type == 1)
                    {
                        var x = x1 + Math.random()*(endX - x1);
                        var y = startY + Math.random()*(y1 - startY)
                    }
                    else if(type == 2)
                    {
                        var x = x2 + Math.random()*(endX - x2);
                        var y = y1 + Math.random()*(endY - y1)
                    }
                    else
                    {
                        var x = startX + Math.random()*(x2 - startX);
                        var y = y2 + Math.random()*(endY - y2)
                    }
                }


                var ok = true;
                var xy = {x:x,y:y}
                for(var s in mapData){
                    var dis =this.getDis(xy,mapData[s])
                    if(dis < 120)
                    {
                        ok = false;
                        break;
                    }
                }

                if(ok)//找到
                {
                    return xy;
                }


                tryTime --;
                if(tryTime == 0)
                    break;
            }
            //向加大一圈的地方找
            x1 = startX
            x2 = endX
            y1 = startY
            y2 = endY



        }
        return {x:item.x,y:item.y};//找不到就不动了
    }

    ////移开单位
    //private jumpTarget(item,newPos){
    //    var VM = PKMainMV.getInstance();
    //    if(this.getDis(item,newPos) < 200)
    //        VM.moveToXY(item,newPos)
    //    else
    //        VM.jumpToXY(item,newPos)
    //}


    ////行动结果
    //private playActionResult(){
    //    //先显示扣血
    //    this.playPlayerResult();
    //}
    //
    ////表现移除动画
    //private playPlayerResult(){
    //    this.testPlayer(this.itemSelf[0])
    //    this.testPlayer(this.itemEnemy[0])
    //    this.timer = egret.setTimeout(this.addNewPlayer,this,800);
    //}
    //
    //private testPlayer(item){
    //     if(item.playerData.after == 0)//死了的
    //     {
    //         this.playDie(item);
    //         return true
    //     }
    //     else if(item.playerData.winCount == 3)//连胜3次的
    //     {
    //         this.playWinRemove(item);
    //         return true
    //     }
    //    else
    //     {
    //         return false
    //     }
    //}


    //死的动画
    public playDie(item){
        var x = item.x;
        var v = 2
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300).call(function(){
            this.freeItem(item);
        },this)
    }
    //3胜后移除
    public playWinRemove(item){

        if(item.parent)
            item.parent.addChild(item);
        var x = this.x;
        var v = 2
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({alpha:0,scaleX:3,scaleY:3}, 300).call(function(){
            this.freeItem(item);
        },this)
    }

    //private addNewPlayer(){
    //    var b = false
    //    if(this.removeOne(1))
    //        b = true;
    //    if(this.removeOne(2))
    //        b = true;
    //    //有新加入
    //    if(b)
    //    {
    //        this.timer = egret.setTimeout(this.playOne,this,800);
    //    }
    //    else
    //    {
    //        this.playOne();
    //    }
    //}
    //
    //private removeOne(team){
    //    var arr,item
    //    if(team ==1)
    //    {
    //        arr = this.itemSelf;
    //    }
    //    else
    //        arr = this.itemEnemy;
    //    item = arr[0];
    //
    //    if(item.playerData.after == 0 || item.playerData.winCount == 3)
    //    {
    //        this.freeItem(item);
    //        arr.shift();
    //    }
    //    if(arr.length > 0)
    //    {
    //        for(var i=0;i<arr.length;i++)
    //        {
    //            var item = arr[i];
    //            var tw:egret.Tween = egret.Tween.get(item);
    //            tw.wait(i*50).to({x:this.posArray[i].x,y:this.posArray[i].y}, 200);
    //        }
    //        return true;
    //    }
    //    return false;
    //}


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

        AniManager.getInstance().removeAllMV();
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