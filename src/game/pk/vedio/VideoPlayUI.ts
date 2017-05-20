class VideoPlayUI extends game.BaseWindow {
    private static instance:VideoPlayUI;
    public static getInstance() {
        if (!this.instance) this.instance = new VideoPlayUI();
        return this.instance;
    }

    private con: eui.Group;
    private bg: eui.Image;
    private roleCon: eui.Group;
    private effectCon: eui.Group;
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
    private titleText: eui.Label;
    private backBtn: eui.Button;
    private mortBtn: eui.Button;
    private replayBtn: eui.Button;




    private barWidth = 220
    private listArray = []
    private index = 0
    private itemWidth = 114;
    private itemHeight = 110;
    private fightHeight = 450;
    private randomSeed
    private statItem = new VideoStatItem()
    private timer

    private selfPKing
    private enemyPKing

    private itemArray = []
    private poolArray = [];
    private textPool = [];
    private textArray = [];

    public constructor() {
        super();
        this.skinName = "VideoPlayUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn,this.hide)
        this.addBtnEvent(this.mortBtn,this.onMore)
        this.addBtnEvent(this.replayBtn,this.onShow)
        this.con.mask = new egret.Rectangle(0,0,640,this.fightHeight);
    }

    public showMVDebug(v?){}
    public addToGroup(v?){}



    private onMore(){
        VideoUI.getInstance().show();
    }


    public beforeHide(){
        this.clearList([this.statList0,this.statList1])
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

    private removeAllTweens(){
        //egret.Tween.removeTweens(this.bgGroup);
        //egret.Tween.removeTweens(this.bg0);
        //egret.Tween.removeTweens(this.bg1);
        //egret.Tween.removeTweens(this.topMC);
        //egret.Tween.removeTweens(this.bottomMC);
        //egret.Tween.removeTweens(this.jumpBtn);
        var arr = this.itemArray
        for(var i=0;i<arr.length;i++)
        {
            arr[i].stopMV();
        }


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

    private getItem():PKItem2{
        var item:PKItem2 = this.poolArray.pop();
        if(!item)
        {
            item = new PKItem2();
            item.anchorOffsetX = this.itemWidth/2;
            item.anchorOffsetY = this.itemHeight/2;
        }
        item['jumping'] = false;
        item.isPKing = false;
        item.moving = false;
        item.die = false;
        item.alpha = 1;
        item.scaleX = 1;
        item.scaleY = 1;
        item.out = false
        item.action = false
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
        this.poolArray.push(item);
        MyTool.removeMC(item);
        item.stopMV();
    }

    //在PK区内找一空位置
    private findFightEmpty(startPoint,mapData,enemy?,enemyDis?){
        var startX = 60  + 60
        var startY = 100  + 60
        var endX = 640-60 -60
        var endY = this.fightHeight -60 -120 - 80
        var step = 10;
        while(true)
        {
            var ok = true;
            var x = startPoint.x -step + this.random()*step*2
            var y = startPoint.y -step + this.random()*step*2
            if(x < startX)
                x = startX;
            else if(x > endX)
                x = endX;

            if(y < startY)
                y = startY;
            else if(y > endY)
                y = endY;
            var xy = {x:x,y:y}
            for(var s in mapData){
                var dis =MyTool.getDis(xy,mapData[s])
                if(enemy && enemy.id == s && dis <enemyDis)
                {
                    ok = false;
                    break;
                }
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

            step+= 10;
            if(step > 320 + 160)
            {
                enemy = null
            }
            if(step >1000)//找了100次都找不到
            {
                return startPoint;//原地不动了
            }
        }
        return null

    }

    //目标周周有重叠
    private isHitTestOther(item,len=120){
        for(var s in this.itemArray){
            if(item == this.itemArray[s])
                continue;

            var dis =MyTool.getDis(item,this.itemArray[s])
            if(dis < len)
            {
                return true;
            }
        }
        return false;
    }

    //是否不在PK区内
    private testOut(item,fun?){//,enemy?,enemyDis?,testEnemy?
        if(item.x < 60 || item.x > 640 - 60 || item.y < 100 || item.y > this.fightHeight-60-120 || this.isHitTestOther(item))// (testEnemy && MyTool.getDis(item,enemy)<enemyDis))
        {
            var startPoint = item;
            if(!item.action)
                startPoint = item.team == 1?{x:160,y:480} :{x:480,y:480}
            var newPos = this.findFightEmpty(startPoint,this.getCurrentMap(),item.enemy,200) //,enemy,enemyDis
            //console.log(newPos)
            var VM = PKMainMV.getInstance();
            VM.jumpToXY(item,newPos,fun,this,100);
            item.action = true;
            return true
        }
        return false;
    }

        //A跳向B附近，随机的
    private randomJump(atker,fun,enemyDis = 150){
        if(!atker || !atker.isPKing)
            return false;
        if(this.random() < 0.7)
            return false;
        var startPoint = atker;
        var newPos = this.findFightEmpty(startPoint,this.getCurrentMap(),atker.enemy,enemyDis)
        var VM = PKMainMV.getInstance();
        VM.jumpToXY(atker,newPos,fun,this,100);
        return true;
    }

        //取两个目标之间的中间位置
    private getMiddleXY(a,b){
        return {
            x:a.x + (b.x - a.x)/2,
            y:a.y + (b.y - a.y)/2,
        }
    }

    private getCurrentMap(){
        var map = {}
        var arr = this.itemArray
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

    //在目标附近的都跳开
    private jumpOut(item,toXY,noMove?){
        noMove = noMove || []
        var arr = this.itemArray
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
             if(oo != item && MyTool.getDis(toXY,nowXY) < 120)
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
            //if(oo.item.jumping)
            //{
            //    this.needMoveItem.push(oo.item);
            //    continue;
            //}
            if(oo.jump)
                VM.jumpToXY(oo.item,oo.newPos)
            else
                VM.moveToXY(oo.item,oo.newPos)
        }
        return jumpArr.length > 0;
    }

    //找自己附近的位置
    private findRoundPos(item,mapData,limit):any{
        var ok = true;
        var startX = Math.max(60,item.x - limit);
        var startY = Math.max(100,item.y - limit);
        var endX = Math.min(640-60, startX + limit*2);
        var endY = Math.min(this.fightHeight-80, startY + limit*2);

        if(!item.isPKing)
        {
            startX += 50;
            //startY -= 50;
            endX -= 50;
            endY -= 100;
        }
        var step = 30;
        while(step--)
        {
            var ok = true;
            var x = startX + this.random()*(endX - startX);
            var y = startY + this.random()*(endY - startY)
            var xy = {x:x,y:y}
            for(var s in mapData){
                var dis =MyTool.getDis(xy,mapData[s])
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
        return this.findRoundPos(item,mapData,limit + 50);

    }

    //找自己附近的位置外，查找最近的空位置
    private findEmptyPos(item,mapData,limit):any{
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
                        var dis =MyTool.getDis(xy,mapData[s])
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

    public setChoose(chooseData){

        this.team1BG.visible = this.team2BG.visible = false
        var item = chooseData[chooseData.length - 1];
        if(!item || !item.result)
            return;


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

        this.statList1.dataProvider = new eui.ArrayCollection(getList(buff));
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

    public show(){
        super.show()
    }

    public hide(){
        super.hide();
        //GuideManager.getInstance().showGuide(PKWinUI.getInstance())
    }

    public onShow(){
        this.reInit();
        this.listArray = VideoCode.getInstance().listArray;
        this.index = 0
        this.initSeed();
        this.showItem();
    }

    private reInit(){
        while(this.itemArray.length)
        {
            this.freeItem(this.itemArray.pop());
        }
        while(this.textArray.length)
        {
            this.freeWordItem(this.textArray[0]);
        }
        egret.clearTimeout(this.timer);

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

    public showItem(){
        var VC  = VideoCode.getInstance();
        for(var s in VC.playerObject)
        {
            var data = VC.playerObject[s];
            if(data.index >= 0)
            {
                var item = this.getItem()
                item.data = {
                    vo:data.mvo,
                    team:data.teamID,
                    index:data.index
                }
                item.id = data.id;
                this.itemArray.push(item);
                this.roleCon.addChild(item);
                if(data.index == 0)
                {
                    item.y = (this.fightHeight - 100)/2;
                    if(data.teamID == 1)
                    {
                        item.x = 150;
                        this.selfPKing = item
                    }
                    else
                    {
                        item.x = 640-150;
                        this.enemyPKing = item;
                    }
                    item.isPKing = true;
                    item.showLight(true);
                }
                else
                {
                    item.y = this.fightHeight-80;
                    if(data.teamID == 1)
                        item.x = 120 + (data.index-1)*130;
                    else
                        item.x = 640-(120 + (data.index-1)*130);
                    item.showLight();
                }
                item.ox = item.x;
                item.oy = item.y;
            }
        }
        this.selfPKing.enemy = this.enemyPKing
        this.enemyPKing.enemy = this.selfPKing
        this.pkOne();
    }

    public pkOne(){
        var data = this.listArray[this.index];
        if(!data || data.type == 'over')
        {

        }
        else
        {
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
            if(this.testOut(this.selfPKing,this.pkOne))
            {
                return
            }
            if(this.testOut(this.enemyPKing,this.pkOne))
            {
                return
            }

            var atker = data[0].atker;
            var atkerItem = this.getMonster(atker)
            if(this.randomJump(atkerItem,this.pkOne))
                return;


            this.index++;
            this.addOneSkill(data,0)
        }
    }

    private addOneSkill(arr,index) {
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
                this.decode_atk(data,{arr:arr,index:index,type:0});
                break;
            case 52://回合结束时血量改变
                this.decode_hpChange(data,{arr:arr,index:index});
                break;
            default:
                this.decode_skill(data,{arr:arr,index:index});
                break;
        }
    }

    private actionBefore(data){
        var atker = data.atker;
        var defender = data.defender;
        var atkerItem = this.getMonster(atker)

        var selfList = []  //作用于出招者的效果
        var enemyList = [] //作用于被攻击者的效果
        var playList = [] //已使用的技能
        var enemyItem = null;
        for(var i=0;i<defender.length;i++)
        {
            var defenderItem = this.getMonster(defender[i].defender)
            if(defenderItem.team == atkerItem.team)
            {
                if(enemyItem)
                    selfList.push(i);
                else
                {
                    for(var j=0;j<defender[i].list.length;j++)
                    {
                        this.addEffect(defenderItem,defender[i].list[j],j*300);
                        playList.push(i);
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
    private nearAtk(data,roundeData,mvType?,skillID?){
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
            //被攻击击移后
            var xy = VM.behitMoveBack(atkerItem,defenderItem,function(){
                roundeData.stopNext = false;
                roundeData.notEffect = selfList.concat(playList);
                this.addEffectList(data,roundeData);
            },this)

            this.jumpOut(defenderItem,xy,[atkerItem]);

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

            if(mvType == 1)
                VM.playOnItem(skillID,defenderItem,null,null);
            else  if(mvType == 2)
                VM.playOnItem(skillID,defenderItem,null,null,xy);

        },this,waitCD)
        if(atkerItem.isPKing)
            this.jumpOut(atkerItem,xy,[defenderItem]);
    }

    //远攻型
    private bulletAtk(data,roundeData,mvType?,skillID1?,skillID2?){
        var atker = data.atker;
        var defender = data.defender;

        var atkerItem = this.getMonster(atker)


        var VM = PKMainMV.getInstance();

        var oo = this.actionBefore(data);
        var selfList = oo.selfList;  //作用于出招者的效果
        var enemyList = oo.enemyList //作用于被攻击者的效果
        var playList = oo.playList
        var enemyItem = oo.enemyItem;

        var defenderItem = enemyItem || this.getMonster(defender[0].defender);
        var sendXY = VM.getDisPoint(atkerItem,defenderItem,50);
        VM.skillMV2(atkerItem,defenderItem,function(){
            //自己效果
            roundeData.stopNext = true;
            roundeData.notEffect = enemyList.concat(playList);
            this.addEffectList(data,roundeData);

            if(mvType == 5)
            {
                VM.playBullet(skillID1,atkerItem,defenderItem,function(){
                    //被攻击击移后
                    var xy = VM.behitMoveBack(atkerItem,defenderItem,function(){
                        roundeData.stopNext = false;
                        roundeData.notEffect = selfList.concat(playList);
                        this.addEffectList(data,roundeData);
                    },this)
                    this.jumpOut(defenderItem,xy,[atkerItem]);


                    if(skillID2)
                        VM.playOnItem(skillID2,defenderItem,null,null,xy);

                },this,sendXY)
            }
            else
            {
                VM.playBullet2(skillID1,atkerItem,defenderItem,function(){
                    //被攻击击移后
                    var xy = VM.behitMoveBack(atkerItem,defenderItem,function(){
                        roundeData.stopNext = false;
                        roundeData.notEffect = selfList.concat(playList);
                        this.addEffectList(data,roundeData);
                    },this)
                    this.jumpOut(defenderItem,xy,[atkerItem]);


                    if(mvType && skillID2)
                        VM.playOnItem(skillID2,defenderItem,null,null,xy);

                },this,sendXY)
            }


        },this)
    }

    private decode_atk(data,roundeData){
        var VC = VideoCode.getInstance();
        var atkerPlayerVO = VC.getPlayerByID(data.atker);
        if(atkerPlayerVO.mvo.atktype == 0) //近攻
        {
            this.nearAtk(data,roundeData)
        }
        else
        {
            this.bulletAtk(data,roundeData,6,atkerPlayerVO.mvo.atktype)
        }
    }

    private decode_hpChange(data,roundeData){
        var arr = data.defender[0].list;
        var defenderItem = this.getMonster(data.defender[0].defender)
        var count = 0;
        for(var i=0;i<arr.length;i++)
        {
            var effect = arr[i];
            if(effect.key == 'hp')
                count += effect.value.value;
            else
                break;
        }
        var myEffect = {key:'hp',value:{value:count,isCDHP:true,isNegative:count <= 0}};
        this.addEffect(defenderItem,myEffect);
        for(var j=1;i<arr.length;i++,j++)
        {
            this.addEffect(defenderItem,arr[i],j*300);
        }
        roundeData.notEffect = [0];
        this.addEffectList(data,roundeData);
    }

    private decode_skill(data,roundeData){
        var VC = VideoCode.getInstance();
        var atkerPlayerVO = VC.getPlayerByID(data.atker);
        var atkerItem = this.getMonster(data.atker);
        if(data.atker >= 10)
        {
            var mvo = atkerPlayerVO.mvo;
            var svo = mvo.getSkillByID(data.skillID,atkerPlayerVO.isPKing);
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
            atkerPlayerVO.mid = mvo.id;
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
                    this.showSkillName(atkerItem,svo,function(){
                        this.decode_atk(data,roundeData);
                    });
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
            if(!svo.hideName)
                this.showSkillName(atkerItem,svo);


            if(svo.mvType == 1 || svo.mvType == 2)//近攻型
            {
                this.nearAtk(data,roundeData,svo.mvType,svo.mvID1);
            }
            else if(svo.mvType == 5 || svo.mvType == 6)//字弹型
            {
                this.bulletAtk(data,roundeData,svo.mvType,svo.mvID1,svo.mvID2);
            }
            else  //远程型
            {
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

                this.timer = egret.setTimeout(function(){
                    //this.timer = egret.setTimeout(this.nextPK,this,200)
                    this.addEffectList(data,roundeData);
                },this,600)
            }





        }
    }

    private playSkill7(defenderItem,skillID){
        var VM = PKMainMV.getInstance();
        var tw = egret.Tween.get(defenderItem);
        tw.wait(100).call(function(){
            VM.playOnItem(skillID,defenderItem,null,null,{
                x:Math.random()*80-40 + defenderItem.x,y:Math.random()*80-40+defenderItem.y
            });
        }).wait(100).call(function(){
            VM.playOnItem(skillID,defenderItem,null,null,{
                x:Math.random()*80-40 + defenderItem.x,y:Math.random()*80-40 + defenderItem.y
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
            var list = arr[i].list;
            var defenderItem = this.getMonster(arr[i].defender)
            maxEffectNum = Math.max(maxEffectNum,list.length);
            for(var j=0;j<list.length;j++)
            {
                this.addEffect(defenderItem,list[j],j*300);
            }
        }
        if(!roundeData.stopNext)
        {
            this.timer = egret.setTimeout(function(){
                this.addOneSkill(roundeData.arr,roundeData.index+1);
            },this,maxEffectNum*300 + 300);
        }


    }

    //返回下一个动作的CD
    private addEffect(item,effect,delay?)
    {
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
            tw.wait(500).to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300);
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
        return 0
    }

    private showItemHp(item,data){
        //console.log(data.hp);
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
                egret.Tween.removeTweens(item);
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
    }

    private showItemWord(item,data,delay=0,wordType='hp'){
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
        if(wordType == 'name')
        {
            tw.wait(delay).to({scaleX:1.1,scaleY:1.1,alpha:1,y:label.y - 30},200).to({scaleX:1,scaleY:1},200).wait(800);
        }
        else if(wordType == 'stat')
        {
            tw.wait(delay).to({y:label.y - 50,alpha:1},200).wait(400).to({y:label.y - 100,alpha:0},200)
        }
        else
        {
            tw.wait(delay).to({y:label.y - 20,alpha:1},200).wait(600);
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
            this.timer = egret.setTimeout(fun,this,500);
        }
    }


}