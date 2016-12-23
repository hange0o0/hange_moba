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

    private randomSeed
    private fightHeight = 960

    private isStop = false


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
        this.selfGroup.height = this.fightHeight;

        //this.bg0.width = 325;
        //this.bg1.width = 325;
        this.bg0.scrollRect = new egret.Rectangle(0,0,325,1500)
        this.bg1.scrollRect = new egret.Rectangle(315,0,325,1500)
    }

    private initSeed(){
        var arr = PKManager.getInstance().team1Base.list.concat(PKManager.getInstance().team2Base.list);
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
        this.initSeed();
        this.cardIndex1 = -1;
        this.cardIndex2 = -1;
        super.show();
    }

    public onShow() {
        PopUpManager.removeShape();
        this.initView();
        this.addSceneMovie();
        this.isStop = false;
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
        this.selfGroup.y = (stageHeight - this.fightHeight)/2// + 40

    }

    private addSceneMovie(){
        var Y =this.stageHeight/2;
        var desY =  this.random()*600-300
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

    //加所有单位
    private addItemMovie(){
        var myTeam = PKManager.getInstance().team1Base.list
        for(var i=0;i<myTeam.length;i++)
        {
            this.addOneItem(myTeam[i],1,i,Math.floor(1+i*200 + 100*this.random()));
        }
        this.resetXY(this.itemSelf,1);

        var enemyTeam = PKManager.getInstance().team2Base.list
        for(var i=0;i<enemyTeam.length;i++)
        {
            this.addOneItem(enemyTeam[i],2,i,Math.floor(1+i*200 + 100*this.random()));
        }
        this.resetXY(this.itemEnemy,2);

        this.jumpBtn.visible = true;

        this.timer = egret.setTimeout(this.playOne,this,2500)

    }

    //加一个单位到舞台上
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

    //两点间距离
    private getDis(p1,p2){
        return Math.pow(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),0.5)
    }

    //定位
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
                    var x1 = Math.floor(280 * this.random()) + 180
                    var y1 = Math.floor(280 * this.random()) + 60
                    ok = true
                    for(var s in addArr){
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
        var middle = this.fightHeight/2
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

    //玩家出场动画
    private showItemMV(item){
        if(this.isStop)
            return;
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
            this.pkOne(player,true)
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

                if(this.random() > 0.6) //可能会少播2回合
                    this.pkStep += 2;
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
            this.pkOne(player)
        }
        else
            this.nextPK();
    }

    private pkOne(item,shake?){

        var mvo = item.data.vo;
        if(item.isPKing)
        {
            var arr = mvo.mvType1;
        }
        else
        {
            var arr = mvo.mvType2;
        }

        var skillData = arr[Math.floor(arr.length * this.random())];

        var newPos:any;
        if(skillData.type ==0) //移过去近攻
        {
            //移过去
            if(item.x < 60 || item.x > 640 - 60 || item.y < 80 || item.y > this.fightHeight - 80)
            {
                newPos = this.findEmptyPos(item,this.getCurrentMap(),120)
                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType0(item,skillData,shake);
                },this,300);
            }
            else
                this.atkType0(item,skillData,shake);
        }
        else if(skillData.type ==1) //1远程对方
        {
            //移过去
            var dis = this.getDis(item,item.enemy);
            if(item.x < 60 || item.x > 640 - 60 || item.y < 80 || item.y > this.fightHeight - 80 ||  dis< 200 || dis > 500)
            {
                if(dis > 500) {
                    var mid = this.getMiddleXY(item, item.enemy);
                    newPos = this.findRoundPos(mid, this.getCurrentMap(), 150)
                    if (!newPos)
                        newPos = this.findEmptyPos(mid, this.getCurrentMap(), 0)
                }
                else
                    newPos = this.findEmptyPos(item.enemy,this.getCurrentMap(),250)
                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType1(item,skillData,shake);
                },this,300);
            }
            else
                this.atkType1(item,skillData,shake);
        }
        else if(skillData.type == 2) //1远程字弹
        {
            //移过去
            var dis = this.getDis(item,item.enemy);
            if(item.x < 60 || item.x > 640 - 60 || item.y < 80 || item.y > this.fightHeight - 80 ||  dis< 200 || dis > 500)
            {
                if(dis > 500) {
                    var mid = this.getMiddleXY(item, item.enemy);
                    newPos = this.findRoundPos(mid, this.getCurrentMap(), 150)
                    if (!newPos)
                        newPos = this.findEmptyPos(mid, this.getCurrentMap(), 0)
                }
                else
                    newPos = this.findEmptyPos(item.enemy,this.getCurrentMap(),250)
                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType2(item,skillData,shake);
                },this,300);
            }
            else
                this.atkType2(item,skillData,shake);
        }
        else if(skillData.type ==3) //1远程自己
        {
            //移过去
            var dis = this.getDis(item,item.self);
            if(item.x < 60 || item.x > 640 - 60 || item.y < 80 || item.y > this.fightHeight - 80 || dis > 400)
            {
                if(dis > 400)
                {
                    var mid = this.getMiddleXY(item,item.self);
                    newPos = this.findRoundPos(mid,this.getCurrentMap(),150)
                    if(!newPos)
                        newPos = this.findEmptyPos(mid,this.getCurrentMap(),0)
                }
                else
                {
                    newPos = this.findEmptyPos(item,this.getCurrentMap(),120)
                }

                var VM = PKMainMV.getInstance();
                VM.jumpToXY(item,newPos,function(){
                    this.atkType3(item,skillData);
                },this,300);
            }
            else
                this.atkType3(item,skillData);
        }
    }

    private atkType0(item,mv,shake){
        var VM = PKMainMV.getInstance();
        var xy = VM.moveToTarget(item,item.enemy,function(){
            //被攻击击移后
            var xy = VM.behitMoveBack(item,item.enemy,function(){
                this.timer = egret.setTimeout(this.nextPK,this,500)
            },this)
            this.jumpOut(item.enemy,xy,[item]);

            //击中动画
            var id = mv.id;
            VM.playOnItem(id,item.enemy,null,null,xy);
            if(shake)
                this.shakeBG();
        },this)
        this.jumpOut(item,xy,[item.enemy]);
    }

    //1远程对方
    private atkType1(item,mv,shake){
        var VM = PKMainMV.getInstance();
        VM.skillMV(item,function(){
            //被攻击击移后
            this.timer = egret.setTimeout(this.nextPK,this,800)

            VM.behitMV(item.enemy);
            //击中动画
            var id = mv.id;
            VM.playOnItem(id,item.enemy,null,null);
            if(shake)
                this.shakeBG()
        },this)
    }

    //2远程对方
    private atkType2(item,mv,shake){
        var VM = PKMainMV.getInstance();
        var sendXY = VM.getDisPoint(item,item.enemy,50);
        VM.skillMV2(item,item.enemy,function(){
            VM.playBullet(mv.id,item,item.enemy,function(){
                //被攻击击移后
                var xy = VM.behitMoveBack(item,item.enemy,function(){
                    this.timer = egret.setTimeout(this.nextPK,this,500)
                },this)
                this.jumpOut(item.enemy,xy,[item]);

                //击中动画
                VM.playOnItem(mv.id2,item.enemy,null,null,xy);
                if(shake)
                    this.shakeBG()
            },this,sendXY)
        },this)
    }

    //远程自己
    private atkType3(item,mv){
        var VM = PKMainMV.getInstance();
        VM.skillMV(item,function(){
            this.timer = egret.setTimeout(this.nextPK,this,800)
            //击中动画
            var id = mv.id;
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

    //取两个目标之间的中间位置
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
                 var newPos = this.findRoundPos(oo,map,30)
                 if(!newPos)
                    newPos = this.findRoundPos(oo,map,60)
                 if(!newPos)
                    newPos = this.findRoundPos(oo,map,90)
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
        var endY = Math.min(this.fightHeight-80, startY + limit*2);
        var step = 30;
        while(step--)
        {
            var ok = true;
            var x = startX + this.random()*(endX - startX);
            var y = startY + this.random()*(endY - startY)
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
        var y2 = Math.min(this.fightHeight-80,item.y + limit);
        var stepX1 = (x1-60)/5
        var stepX2 = (640-60 - x2)/5
        var stepY1 = (y1-80)/10
        var stepY2 = (this.fightHeight-80 - y2)/10;

        while(step--)
        {
            var tryTime = 40;//试20次
            if(step < 6)
            {
                tryTime = 20
            }
            while(true)
            {
                var error = false
                if(step < 6)
                {
                    var startX = x1;
                    var startY = y1 - stepY1;
                    var endX = x2;
                    var endY = y2 + stepY2;
                    var type = tryTime%2;
                    if(item.y < this.fightHeight/2)  //在上半地图由下开始找
                        type = 1-type;

                    if(type == 0)
                    {

                        if(y1 - startY == 0)
                            error = true;
                        else
                            var y = startY + this.random()*(y1 - startY);
                    }
                    else
                    {

                        if(endY - y2 == 0)
                            error = true;
                        else
                            var y = y2 + this.random()*(endY - y2);
                    }
                    if(!error)
                        var x = x1 + this.random()*(x2 - x1);
                }
                else
                {

                    var startX = x1 - stepX1;
                    var startY = y1 - stepY1;
                    var endX = x2 + stepX2;
                    var endY = y2 + stepY2;
                    var type = tryTime%4
                    if(item.y < this.fightHeight/2)  //在上半地图由下开始找
                        type = 3-type;
                    if(type == 0)
                    {
                        if(x1 - startX == 0)
                            error = true;
                        else
                        {
                            var x = startX + this.random()*(x1 - startX);
                            var y = startY + this.random()*(y2 - startY)
                        }


                    }
                    else if(type == 1)
                    {
                        if(y1 - startY == 0)
                            error = true;
                        else
                        {
                            var x = x1 + this.random()*(endX - x1);
                            var y = startY + this.random()*(y1 - startY)
                        }


                    }
                    else if(type == 2)
                    {
                        if(endX - x2 == 0)
                            error = true;
                        else
                        {
                            var x = x2 + this.random()*(endX - x2);
                            var y = y1 + this.random()*(endY - y1)
                        }
                    }
                    else
                    {
                        if(endY - y2 == 0)
                            error = true;
                        else {
                            var x = startX + this.random() * (x2 - startX);
                            var y = y2 + this.random() * (endY - y2)
                        }
                    }
                }


                if(!error)
                {
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
        this.isStop = true;
    }

    private showResult()
    {
        this.hide();
        this.stopAll();
        PKResultUI.getInstance().show();
        //if(PKManager.getInstance().pkResult.result)
        //    console.log('win');
        //else
        //    console.log('loss');
    }



}