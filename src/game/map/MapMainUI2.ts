//class MapMainUI2 extends game.BaseUI {
//    private static instance:MapMainUI2;
//    public static getInstance() {
//        if (!this.instance) this.instance = new MapMainUI2();
//        return this.instance;
//    }
//
//    public constructor() {
//        super();
//        this.skinName = "MapMainUISkin";
//        //this.LoadFiles = ['pk'];
//    }
//
//    private bg: eui.Image;
//    private con: eui.Group;
//    private topUI: TopUI;
//    private helpBtn: eui.Group;
//    private hpGroup: eui.Group;
//    private bb: eui.Rect;
//    private bf: eui.Rect;
//    private bottomGroup: eui.Group;
//    private leftBtn: eui.Group;
//    private la: eui.Image;
//    private lt: eui.Label;
//    private rightBtn: eui.Group;
//    private ra: eui.Image;
//    private rt: eui.Label;
//    private desText: eui.Label;
//    private awardText: eui.Label;
//    private getBtn: eui.Button;
//    private redMC: eui.Image;
//    private valueText: eui.Label;
//    private exchangeBtn: eui.Button;
//    private pkText: eui.Label;
//    private pkBtn: eui.Button;
//    private videoBtn: eui.Group;
//    private timeText: eui.Label;
//
//
//    private con1 = new eui.Group()
//    private con2 = new eui.Group()
//
//
//
//    private talkList = [];
//    private emoList = [];
//
//
//    private poolArray = [];
//    private itemWidth = 114;
//    private itemHeight = 110;
//    private fightHeight = 110;
//    private fightWidth = 640//+320;
//
//    private isStop = false;
//
//
//    public data
//    public itemArray = [];
//    public myMonsterList = [];
//    public enemyMonsterList = [];
//
//    public pkList
//    public pkIndex
//
//    public timeDic
//
//    private cloudTimer = 0;
//    private cloudArr = [];
//
//    private isFirst
//    private openTime
//
//    private posData = {}//记录站位上有没有人
//
//
//    public childrenCreated() {
//        super.childrenCreated();
//        this.topUI.addEventListener('hide',this.hide,this);
//
//        //this.addBtnEvent(this.leftBtn,this.onLeft)
//        //this.addBtnEvent(this.rightBtn,this.onRight)
//        //this.addBtnEvent(this.helpBtn,this.onHelp)
//        //this.addBtnEvent(this.exchangeBtn,this.onExchange)
//        //this.addBtnEvent(this.pkBtn,this.onPK)
//        //this.addBtnEvent(this.getBtn,this.onGet)
//        //this.addBtnEvent(this.videoBtn,this.onVideo)
//
//        //this.con.anchorOffsetX = 160.
//        //this.con.anchorOffsetY = 200.
//
//
//        this.con1.x = 100
//        this.con1.scaleX = this.con1.scaleY = 0.8
//        this.con2.x = 100
//        this.con2.scaleX = this.con2.scaleY = 0.8
//
//        this.con.addChild(this.con1)
//        this.con.addChild(this.con2)
//
//
//
//    }
//
//    public random(){
//        return Math.random();
//    }
//
//    private setTimeout(fun,cd,data?){
//        var tw:egret.Tween = egret.Tween.get(this);
//        tw.wait(cd).call(fun,this,data)
//    }
//    private setInterval(fun,cd,data?){
//        var tw:egret.Tween = egret.Tween.get(this,{loop:true});
//        tw.wait(cd).call(fun,this,data)
//    }
//
//    private stopAll(){
//        //this.isStop = true;
//        egret.Tween.removeTweens(this);
//        egret.Tween.removeTweens(this.con1);
//        egret.Tween.removeTweens(this.con2);
//        for(var i=0;i<this.itemArray.length;i++)
//        {
//             this.freeItem(this.itemArray[i]);
//        }
//        this.itemArray.length = 0;
//
//        while(this.cloudArr.length > 0)
//        {
//            var mc = this.cloudArr.pop();
//            MyTool.removeMC(mc);
//            egret.Tween.removeTweens(mc);
//        }
//
//        this.posData = {}
//        AniManager.getInstance().removeAllMV();
//    }
//
//
//
//
//    private getItem():PKItem2{
//        var item:PKItem2 = this.poolArray.pop();
//        if(!item)
//        {
//            item = new PKItem2();
//            item.anchorOffsetX = this.itemWidth/2;
//            item.anchorOffsetY = this.itemHeight/2;
//        }
//        item['jumping'] = false;
//        item.alpha = 1;
//        item.scaleX = 1;
//        item.scaleY = 1;
//        item.out = false
//        item.die = false
//        item.action = false
//        item.talking = false
//        item.isPKing = true
//        item.isAtking = 0
//        item.isBeAtking = 0
//        item.moving = 0
//        return item;
//    }
//
//    private freeItem(item){
//        if(!item)
//            return;
//        this.poolArray.push(item);
//        MyTool.removeMC(item);
//        item.stopMV();
//    }
//
//
//
//    public hide(){
//        this.stopAll();
//        this.stage.removeEventListener(egret.Event.ACTIVATE,this.onActive,this);
//
//        TaskManager.getInstance().cleanNowAcrion('map_game_buy');
//        TaskManager.getInstance().cleanNowAcrion('map_game_pk');
//        TaskManager.getInstance().cleanNowAcrion('map_game_next');
//        super.hide();
//    }
//
//    public show(data?){
//
//        var self = this;
//        var MD = MapData.getInstance();
//        var MM = MapManager.getInstance();
//        this.isFirst = false;
//        if(MD.lastTime == 0)
//        {
//            this.isFirst = true;
//            MM.start(function(){
//                self.superShow()
//            })
//        }
//        else if(MD.getCurrentCD() != MD.serverBossCD){
//            MM.MapSync(function(){
//                self.superShow()
//            })
//        }
//        else
//            self.superShow()
//
//    }
//
//    private superShow(){
//        super.show();
//    }
//
//    public onShow(){
//        this.fightHeight = (this.stage.stageHeight - 410) //+ 320
//        this.con1.y = this.fightHeight/2 + 30
//        this.con2.y = this.fightHeight/2 - 30
//
//        PKPosManager.getInstance().controller = this;
//        this.onMapChange();
//
//        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer);
//        this.addPanelOpenEvent(GameEvent.client.map_change,this.onMapChange);
//
//        this.stage.addEventListener(egret.Event.ACTIVATE,this.onActive,this);
//        this.stage.addEventListener(egret.Event.DEACTIVATE,this.onDeActive,this);
//    }
//
//    //激活后重新表现
//    private onActive(){
//        if(this.openTime && egret.getTimer() - this.openTime < 1000)
//            return;
//        this.onMapChange();
//    }
//
//    private onDeActive(){
//        this.openTime = 0;
//        this.stopAll();
//    }
//
//    private onMapChange(){
//        this.openTime = egret.getTimer();
//        var MD = MapData.getInstance();
//        MD.reInit();
//        MD.setPKDisplayData();
//        this.stopAll();
//        this.isStop = false;
//
//
//        this.myMonsterList = MonsterVO.getListByLevel(UM.level);
//        this.enemyMonsterList = MonsterVO.getListByLevel(MD.level);
//
//        this.showCound(true)
//        this.showCound(true)
//
//        this.onTimer();
//        this.setInterval(this.onCD,300)
//    }
//
//
//
//    private onCD(){
//        this.removeDie()
//        for(var i=0;i<5;i++)
//        {
//            if(Math.random() > 0.4 + this.getLineNum(1,i)*0.15)
//                this.addLine(1,i)
//            if(Math.random() > 0.4 + this.getLineNum(2,i)*0.15)
//                this.addLine(2,i);
//        }
//        if(Math.random() > 0.5)
//            this.selfAtk();
//        if(Math.random() > 0.5)
//            this.enemyAtk();
//
//    }
//
//    //向前一格
//    private walkItem(item,index){
//        this.posData[item.key] = null;
//        var keyArr = item.key.split('_');
//        var toIndex = parseInt(keyArr[2]) - 1
//        keyArr[2]  =toIndex
//
//        item.line = toIndex;
//        item.key = keyArr.join('_');
//        this.posData[item.key] = item;
//
//        var yy = toIndex * 130 + 60;
//        if(keyArr[0] == 2)
//        {
//            yy = -yy;
//        }
//        if(item.y != yy)
//        {
//            var VM = PKMainMV.getInstance();
//            VM.walkTo(item,{x:item.x,y:yy},null,null,index * 200)
//        }
//    }
//
//    private getLineNum(team,column){
//        var count = 0;
//        for(var i=0;i<5;i++)
//        {
//            if(this.posData[team+'_'+column+'_' + i])
//                count ++;
//        }
//        return count
//    }
//
//    private addLine(team,column){
//        var list = [];
//        var index = 0;
//        for(var i=1;i<5;i++)
//        {
//            var key = team+'_'+column+'_' + i;
//            var frontKey = team+'_'+column+'_' + (i-1);
//            var frontItem = this.posData[frontKey];
//            var item = this.posData[key];
//            if(item && !item.moving && !frontItem && (!item.isAtking || egret.getTimer() - item.isAtking > 2000)) //要向前走
//            {
//                this.walkItem(item,index);
//                index ++;
//                return;
//            }
//        }
//
//        if(!this.posData[team+'_'+column+'_'+3])
//        {
//            var item:any = this.getItem();
//            item.x = column * 120 + 20
//            if(team == 1)
//            {
//                this.con1.addChild(item);
//                item.data = {vo:ArrayUtil.randomOne(this.myMonsterList),team:1};
//                item.y = 500
//            }
//            else
//            {
//                this.con2.addChild(item);
//                item.data = {vo:ArrayUtil.randomOne(this.enemyMonsterList),team:2};
//                item.y = -500
//            }
//            item.line = -1;
//            item.key = team+'_'+column+'_'+4;
//            list.push(item)
//            this.itemArray.push(item);
//
//            this.walkItem(item,index);
//        }
//    }
//
//    //private addPlayer(){
//    //    //var MD = MapData.getInstance();
//    //    var add = false
//    //    for(var i=0;i<5;i++)
//    //    {
//    //        add = this.addLine(1,i) || add;
//    //        add = this.addLine(2,i) || add;
//    //    }
//    //    if(add)
//    //        this.setTimeout(this.addPlayer,500)
//    //    else
//    //        this.pk();
//    //}
//    //
//    //private pk(){
//    //    var tw = egret.Tween.get(this.con1);
//    //    this.con1.y = this.fightHeight/2+100;
//    //    //tw.to({y:this.con1.y + 30},200,egret.Ease.sineOut).wait(200).to({y:this.fightHeight/2-10},400,egret.Ease.sineIn)
//    //    //.to({y:this.fightHeight/2+10},200).wait(1000)
//    //    //for(var i=0;i<10;i++)
//    //    //{
//    //    //    tw.call(this.selfAtk,this).wait(200);
//    //    //}
//    //    //tw.wait(800).to({y:this.fightHeight/2+100},400).wait(500)
//    //
//    //
//    //    var tw = egret.Tween.get(this.con2);
//    //    this.con2.y = this.fightHeight/2-100;
//    //    //tw.to({y:this.con2.y - 30},200,egret.Ease.sineOut).wait(200).to({y:this.fightHeight/2+10},400,egret.Ease.sineIn)
//    //    //    .to({y:this.fightHeight/2-10},200).call(this.collideDie,this).wait(1000);
//    //    //for(var i=0;i<10;i++)
//    //    //{
//    //    //    tw.call(this.enemyAtk,this).wait(200);
//    //    //}
//    //    //tw.wait(800).to({y:this.fightHeight/2-100},400).wait(500).call(this.readdPlayer,this)
//    //}
//
//    //private collideDie(){
//    //    var line1Arr = [];
//    //    for(var i=0;i<this.itemArray.length;i++)
//    //    {
//    //        var item = this.itemArray[i];
//    //        if(item.die)
//    //            continue;
//    //        if(item.line == 0)
//    //            line1Arr.push(item)
//    //    }
//    //    ArrayUtil.random(line1Arr);
//    //
//    //    var index = 0;
//    //    while(Math.random() > 0.5 && line1Arr.length > 6){
//    //         this.showDie(line1Arr.pop(),null,index*200)
//    //        index ++;
//    //    }
//    //
//    //}
//
//    private removeDie(){
//        var t = egret.getTimer();
//        for(var i=0;i<this.itemArray.length;i++)
//        {
//            var item = this.itemArray[i];
//            if(item.die && t-item.die > 1000)
//            {
//                this.itemArray.splice(i,1);
//                this.freeItem(item);
//                delete this.posData[item.key];
//                i--;
//            }
//        }
//    }
//
//    //补充满玩家
//    //private readdPlayer(){
//    //    this.removeDie();
//    //    this.addPlayer();
//    //}
//
//    //取攻击数据
//    private getAtkObj(team){
//        var atkerList = []
//        var defendList = []
//        var t = egret.getTimer();
//        for(var i=0;i<this.itemArray.length;i++)
//        {
//            var item = this.itemArray[i];
//            if(item.die)
//                continue;
//            if(item.moving)
//                continue;
//            if(item.line >= 3)
//                continue;
//            if(item.team == team)
//            {
//                if(item.line > 0) //如果前面没人
//                {
//                    var keyArr = item.key.split('_');
//                    keyArr[2]  = 0
//                    if(!this.posData[keyArr.join('_')])
//                        continue;
//                }
//                if(!item.isAtking || t - item.isAtking > 2000)
//                    atkerList.push(item);
//                continue;
//            }
//            if(item.line < 2 && !item.moving) //只会打前两排
//            {
//                if(item.line == 1 && Math.random()>0.5)//第二排有一定几率不被攻击
//                {
//                    continue
//                }
//                defendList.push(item);
//            }
//        }
//        return {
//            atkerList:atkerList,
//            defendList:defendList
//        }
//    }
//
//    //队伍1攻击
//    private selfAtk(){
//        var obj = this.getAtkObj(1);
//        this.randomAtk(obj.atkerList,obj.defendList)
//    }
//    //队伍2攻击
//    private enemyAtk(){
//        var obj = this.getAtkObj(2);
//        this.randomAtk(obj.atkerList,obj.defendList)
//    }
//
//    private randomAtk(self,enemy){
//        var VM = PKMainMV.getInstance();
//        var atker = ArrayUtil.randomOne(self)
//        if(!atker)
//            return;
//        var defender
//        var defenderDis
//        for(var i=0;i<enemy.length;i++) {
//            if (!defender) {
//                defender = enemy[i];
//                defenderDis = MyTool.getDis(atker, defender)
//            }
//            else {
//                var dis = MyTool.getDis(atker, enemy[i])
//                if(defenderDis > dis)
//                {
//                    if(defenderDis - dis < 100 && Math.random()<0.5)
//                        continue;
//                    defender = enemy[i];
//                    defenderDis = MyTool.getDis(atker, defender)
//                }
//            }
//        }
//
//        if(!defender)
//            return;
//        var mvo = atker.data.vo
//        if(mvo.atktype)// && Math.random() > 0.2)
//        {
//            this.bulletAtk(atker,defender)
//            return;
//        }
//        atker.isAtking = egret.getTimer();
//
//        VM.skillMV(atker,function(){
//            this.playAniOnItem(atker,defender)
//            this.testItemDie(defender);
//        },this)
//
//        var fromPoint = this.getXYOnCon(atker)
//        var toPoint = this.getXYOnCon(defender)
//        VM.drawLine(fromPoint,toPoint,atker.team,this.con)
//    }
//
//
//    private testItemDie(item){
//        var b = Math.random() > 0.7
//        if(b)
//        {
//            this.showDie(item);
//        }
//    }
//
//    private isItemEnable(enemy){
//        var t = egret.getTimer();
//        if(enemy.isAtking && t - enemy.isAtking < 5000)
//            return false;
//        if(enemy.isBeAtking && t - enemy.isBeAtking < 5000)
//            return false;
//        if(enemy.moving && t - enemy.moving < 5000)
//            return false;
//        return true;
//    }
//
//    //远攻型
//    private bulletAtk(atkerItem,defenderItem){
//        var VM = PKMainMV.getInstance();
//        var PPM = PKPosManager.getInstance();
//
//        atkerItem.isAtking = egret.getTimer()
//        defenderItem.isBeAtking = atkerItem.isAtking;
//
//        var mvo = atkerItem.data.vo
//        var fromPoint = this.getXYOnCon(atkerItem)
//        var toPoint = this.getXYOnCon(defenderItem)
//        var sendXY = VM.getDisPoint(fromPoint,toPoint,50);
//        VM.skillMV2(atkerItem,defenderItem,function(){
//            VM.playBullet2(mvo.atktype,this.con1,toPoint,function(){
//                if(this.isStop) //子弹有Tween
//                    return;
//                //被攻击击移后
//                //var xy = VM.behitMoveBack(atkerItem,defenderItem,function(){
//                //    atkerItem.isAtking = 0
//                //    defenderItem.isBeAtking = 0
//                //},this)
//                //PPM.jumpOut(defenderItem,xy,[atkerItem]);
//                if(AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvo.mapMV)))
//                {
//                    var mc = VM.playOnItem(mvo.mapMV,this.con1,null,null,this.getXYOnCon(defenderItem));
//                    mc.scaleX =  mc.scaleY = 1
//                    this.testItemDie(defenderItem);
//                }
//
//            },this,sendXY)
//
//        },this)
//    }
//
//    private onTimer(){
//        if(egret.getTimer() - this.cloudTimer > 1000*10)
//            this.showCound();
//    }
//
//    private showCound(b?){
//        var rect = {
//            x:0,
//            y:0,
//            width:640,
//            height:this.con.height
//        }
//        var mc = AniManager.getInstance().showCloud(this.con,rect,b)
//
//
//        this.cloudArr.push(mc)
//        this.cloudTimer  = egret.getTimer();
//    }
//
//
//
//    ////在a和B之前放动画
//    //private playAni(atker,defender){
//    //    var mvID = atker.data.vo.mapMV
//    //    if(AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID)))
//    //    {
//    //        var xy = this.getMiddleXY(atker,defender)
//    //        var VM = PKMainMV.getInstance();
//    //        VM.playOnItem(mvID,atker,null,null,xy);
//    //    }
//    //}
//
//    private playAniOnItem(atker,defender){
//        var mvID = atker.data.vo.mapMV
//        if(AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID)))
//        {
//            //var xy = this.getMiddleXY(atker,defender)
//            var VM = PKMainMV.getInstance();
//            var mc = VM.playOnItem(mvID,this.con1,null,null,this.getXYOnCon(defender));
//            mc.scaleX =  mc.scaleY = 1
//        }
//    }
//
//    private getXYOnCon(item){
//        var p = item.localToGlobal(60,60)
//        return this.con.globalToLocal(p.x,p.y,p)
//    }
//
//    private rand(a,b){
//        return a + Math.floor( Math.random()*(b-a + 1))
//    }
//
//
//
//    private getMiddleXY(a,b){
//        return {
//            x:a.x + (b.x - a.x)/2,
//            y:a.y + (b.y - a.y)/2,
//        }
//    }
//
//
//    private showDie(item,fun?,cd=-1){
//        if(cd == -1)
//            cd = 500;
//        item.die = egret.getTimer() + cd;
//
//        var x = item.x;
//        var v = 2
//        var tw:egret.Tween = egret.Tween.get(item);
//        tw.wait(cd).to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300);
//        if(fun)
//            tw.call(fun,this);
//    }
//
//    private renewBossHp(mv?){
//        var MD = MapData.getInstance();
//        var rate = MD.currentBossHp/MD.currentBossMaxHp;
//        if(mv)
//        {
//            this.bb.width = this.bf.width
//            var tw = egret.Tween.get(this.bf)
//            tw.to({width:640*rate},200);
//        }
//        else
//        {
//            this.bf.width = 640*rate;
//            this.bb.width = this.bf.width
//        }
//    }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//}