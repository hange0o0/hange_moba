class MapMainUI extends game.BaseUI {
    private static instance:MapMainUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapMainUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapMainUISkin";
        //this.LoadFiles = ['pk'];
    }

    private bg: eui.Image;
    private con: eui.Group;
    private topUI: TopUI;
    private helpBtn: eui.Group;
    private hpGroup: eui.Group;
    private bb: eui.Rect;
    private bf: eui.Rect;
    private bottomGroup: eui.Group;
    private leftBtn: eui.Group;
    private la: eui.Image;
    private lt: eui.Label;
    private rightBtn: eui.Group;
    private ra: eui.Image;
    private rt: eui.Label;
    private desText: eui.Label;
    private awardText: eui.Label;
    private getBtn: eui.Button;
    private redMC: eui.Image;
    private valueText: eui.Label;
    private exchangeBtn: eui.Button;
    private pkText: eui.Label;
    private pkBtn: eui.Button;
    private fightText: eui.Label;
    private fightBtn: eui.Button;
    private videoBtn: eui.Group;
    private logBtn: eui.Group;
    private timeText: eui.Label;



    private con1 = new eui.Group()
    private con2 = new eui.Group()


    private talkList = [];
    private emoList = [];


    private poolArray = [];
    private itemWidth = 90;
    private itemHeight = 90;
    private fightHeight = 110;


    public data
    public posData
    public itemArray = [];
    public myMonsterList = [];
    public enemyMonsterList = [];

    public pkList
    public pkIndex


    private cloudTimer = 0;
    private cloudArr = [];

    private isFirst
    private quickRun
    private openTime


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.rightBtn,this.onRight)
        this.addBtnEvent(this.helpBtn,this.onHelp)
        this.addBtnEvent(this.exchangeBtn,this.onExchange)
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.getBtn,this.onGet)
        this.addBtnEvent(this.fightBtn,this.onFight)
        this.addBtnEvent(this.logBtn,this.onLog)
        this.addBtnEvent(this.videoBtn,this.onVideo)


        this.addChild(MapExchangeUI.getInstance())
        MapExchangeUI.getInstance().hide();


        this.con1.x = 95
        this.con2.x = 95

        this.con.addChild(this.con1)
        this.con.addChild(this.con2)

    }

    private setTimeout(fun,cd,data?){
        var tw:egret.Tween = egret.Tween.get(this);
        tw.wait(cd).call(fun,this,data)
    }

    private setInterval(fun,cd,data?){
        var tw:egret.Tween = egret.Tween.get(this,{loop:true});
        tw.wait(cd).call(fun,this,data)
    }

    private stopAll(){
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.con1);
        egret.Tween.removeTweens(this.con2);

        for(var i=0;i<this.itemArray.length;i++)
        {
             this.freeItem(this.itemArray[i]);
        }
        this.itemArray.length = 0;

        while(this.cloudArr.length > 0)
        {
            var mc = this.cloudArr.pop();
            MyTool.removeMC(mc);
            egret.Tween.removeTweens(mc);
        }
        this.posData = {}
        AniManager.getInstance().removeAllMV();
    }

    private onFight(){
        MapFightUI.getInstance().show();
    }
    private onLog(){
         MapLogUI.getInstance().show();
    }

    private onLeft(){
        this.changeLevel(MapData.getInstance().level - 1)
    }

    private onRight(){
        this.changeLevel(MapData.getInstance().level + 1)
    }

    private changeLevel(level){
        var MD = MapData.getInstance();
        var self = this;
        if(MD.pkValue > 0)
        {
            Confirm('切换据点时，将丢弃当前据点所有的通辑令，是否继续？',function(type){
                if(type == 1)
                {
                    MapManager.getInstance().change_level(level,function(){
                        self.isFirst = true;
                        self.onMapChange();
                    })
                }
            });
            return
        }

        MapManager.getInstance().change_level(level,function(){
            self.isFirst = true;
            self.onMapChange();
        })
    }

    private onHelp(){
        HelpManager.getInstance().mapHelp();
    }

    private onExchange(){
        MapExchangeUI.getInstance().show();
    }

    private onPK(){
        var MD = MapData.getInstance();
        var MM = MapManager.getInstance();
        if(MD.enemy && MD.enemy.level == MD.level && !MD.enemy.is_pk)
        {
            MapGameUI.getInstance().show();
            //this.hide()
            return;
        }
        var self = this;
        MM.getEnemy(function(){
            MapGameUI.getInstance().show();
            //self.hide()
        })
    }
    private onGet(){
        var MD = MapData.getInstance();
        var self = this;
        var beforeValue = MD.value
        if(TaskManager.getInstance().nowAction == 'map_game_buy')
        {
            TaskManager.getInstance().showGuideMC(this.exchangeBtn)
        }
        if(MD.bag <= 0)
            return;
        MapManager.getInstance().get_award(function(){
            if(MD.value > beforeValue)
            {
                ShowTips('获得功勋×' + (MD.value - beforeValue))
            }
            self.renewInfo();
        })
    }
    private onVideo(){
        DayLogUI.getInstance().show(MapManager.getInstance().logList,'据点挑战日志','map');
        //this.hide();
    }


    private getItem():MapItem{
        var item:MapItem = this.poolArray.pop();
        if(!item)
        {
            item = new MapItem();
            item.anchorOffsetX = this.itemWidth/2;
            item.anchorOffsetY = this.itemHeight/2;
        }
        item['jumping'] = false;
        item.alpha = 1;
        item.scaleX = 1;
        item.scaleY = 1;
        item.out = false
        item.die = false
        item.action = false
        item.talking = false
        item.isPKing = true
        item.isAtking = 0
        item.isBeAtking = 0
        item.moving = 0
        return item;
    }

    private freeItem(item){
        if(!item)
            return;
        //if(item.out)
        //    return;
        //item.out = true;
        this.poolArray.push(item);
        MyTool.removeMC(item);
        item.stopMV();
    }



    public hide(){
        this.stopAll();
        MainPageUI.getInstance()['mapGame'].renew();
        this.stage.removeEventListener(egret.Event.ACTIVATE,this.onActive,this);
        this.stage.removeEventListener(egret.Event.DEACTIVATE,this.onDeActive,this);

        TaskManager.getInstance().cleanNowAcrion('map_game_buy');
        TaskManager.getInstance().cleanNowAcrion('map_game_pk');
        TaskManager.getInstance().cleanNowAcrion('map_game_next');
        super.hide();
    }

     public onVisibleChange(){
         if(this.visible)
         {
             this.onMapChange();
         }
         else
         {
             this.stopAll();
         }
    }

    public show(data?){
        var self = this;
        var MD = MapData.getInstance();
        var MM = MapManager.getInstance();
        this.isFirst = false;
        if(MD.lastTime == 0)
        {
            this.isFirst = true;
            MM.start(function(){
                self.superShow()
            })
        }
        else if(MD.getCurrentCD() != MD.serverBossCD){
            MM.MapSync(function(){
                self.superShow()
            })
        }
        else
            self.superShow()

    }

    private superShow(){
        super.show();
    }

    public onShow(){
        if(this.isFirst)
            this.onHelp();
        this.fightHeight = (this.stage.stageHeight - 360) //+ 320
        this.con1.y = this.fightHeight/2 + 30
        this.con2.y = this.fightHeight/2 - 30


        this.onMapChange();






        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer);
        this.addPanelOpenEvent(GameEvent.client.map_change,this.onMapChange);
        this.addPanelOpenEvent(GameEvent.client.map_value_change,this.renewInfo);


        this.stage.addEventListener(egret.Event.ACTIVATE,this.onActive,this);
        this.stage.addEventListener(egret.Event.DEACTIVATE,this.onDeActive,this);

        AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(107))


        if(TaskManager.getInstance().nowAction == 'map_game_pk')
        {
            TaskManager.getInstance().showGuideMC(this.pkBtn)
            MapExchangeUI.getInstance().hide();
        }
        else if(TaskManager.getInstance().nowAction == 'map_game_buy')
        {
            TaskManager.getInstance().showGuideMC(this.getBtn)
            MapExchangeUI.getInstance().hide();
        }
        else if(TaskManager.getInstance().nowAction == 'map_game_next')
        {
            TaskManager.getInstance().showGuideMC(this.rightBtn)
            MapExchangeUI.getInstance().hide();
        }
    }

    //激活后重新表现
    private onActive(){
        if(this.openTime && egret.getTimer() - this.openTime < 1000)
            return;
        if(!this.visible)
            return;
        this.onMapChange();
    }

    private onDeActive(){
        this.openTime = 0;
        this.stopAll();
    }

    public onMapChange(){
        var MD = MapData.getInstance();
        this.topUI.setTitle('第'+MD.level+'据点')
        //this.bg.source = Config.localResRoot + 'pk_bg/pk_bg'+(MD.level%20 || 20)+'.jpg';
        this.bg.source = 'pk_bg'+(MD.level%20 || 20)+'_jpg';


        this.openTime = egret.getTimer();
        MD.reInit();
        this.stopAll();
        PKMainMV.getInstance().speed = false;

        this.renewBossHp();
        this.myMonsterList = MonsterVO.getListByLevel(UM.level);
        this.enemyMonsterList = MonsterVO.getListByLevel(MD.level);

        this.renewInfo();
        this.onTimer();

        this.showCound(true)
        this.showCound(true)

        if(!this.isFirst)
        {
            this.quickRun = true
            var times = 10;
            while(times --)
            {
                for(var i=0;i<5;i++)
                {
                    if(Math.random() > 0.5)
                        this.addLine(1,i)
                    if(Math.random() > 0.5)
                        this.addLine(2,i);
                }
            }
            this.quickRun = false
        }
        this.isFirst = false
        this.setInterval(this.onCD,300)
        this.onCD();
    }

    private onTimer(){
        if(!this.visible)
            return;

        var MD = MapData.getInstance();
        var pkTime = Math.floor((MD.getAwardMax() - MD.bag)/MD.getCurrentAward() - 1)*MD.getCurrentCD()
        pkTime +=  MD.getCurrentCD() - (TM.now() - MD.lastTime);
        if(pkTime > 0)
            MyTool.setColorText(this.timeText,'[功勋背包满载：]' + DateUtil.getStringBySeconds(pkTime,false,2) + (MD.getCurrentCD()<= MD.minBossCD?'(效率到顶)':''))
        else
            this.timeText.text = ('功勋背包已满载')
        if(egret.getTimer() - this.cloudTimer > 1000*10)
            this.showCound();


        var cd = MD.getNextFightCD();
        if(cd == 0)
        {
            MyTool.setColorText(this.fightText,'[- 掠夺资源 -]\n' + (MD.maxFightTimes - MD.fight_times) + '/' + MD.maxFightTimes);
            this.fightBtn.touchEnabled = true;
            this.fightText.lineSpacing = 20
            if(MD.get_fight_enemy)
            {
                this.fightBtn.label = '掠　夺'
                this.fightBtn.skinName = 'Btn_b2Skin'
            }
            else
            {
                this.fightBtn.label = '搜　寻'
                this.fightBtn.skinName = 'Btn_r2Skin'
            }
        }
        else
        {
            this.fightText.lineSpacing = -2
            MyTool.setColorText(this.fightText,'[- 掠夺资源 -]\n\n' + DateUtil.getStringBySecond(cd) + '\n(' + (MD.maxFightTimes - MD.fight_times) + '/' + MD.maxFightTimes + ')');
            if(MD.get_fight_enemy)
            {
                this.fightBtn.touchEnabled = true
                this.fightBtn.label = '掠　夺';
                this.fightBtn.skinName = 'Btn_b2Skin'
            }
            else
            {
                this.fightBtn.touchEnabled = false
                this.fightBtn.label = '搜　寻'
                this.fightBtn.skinName = 'Btn_d2Skin'
            }
        }


        //console.log('map running')
    }

    private onCD(){
        this.removeDie()
        for(var i=0;i<5;i++)
        {
            if(Math.random() > 0.4 + this.getLineNum(1,i)*0.15)
                this.addLine(1,i)
            if(Math.random() > 0.4 + this.getLineNum(2,i)*0.15)
                this.addLine(2,i);
        }
        if(Math.random() > 0.5)
            this.selfAtk();
        if(Math.random() > 0.5)
            this.enemyAtk();

    }

    //向前一格
    private walkItem(item,index){
        this.posData[item.key] = null;
        var keyArr = item.key.split('_');
        var toIndex = parseInt(keyArr[2]) - 1
        keyArr[2]  =toIndex

        item.line = toIndex;
        item.key = keyArr.join('_');
        this.posData[item.key] = item;

        var yy = toIndex * 90 + 60;
        if(keyArr[0] == 2)
        {
            yy = -yy;
        }
        if(item.y != yy)
        {
            if(this.quickRun)
            {
                item.y = yy
            }
            else
            {
                var VM = PKMainMV.getInstance();
                VM.walkTo(item,{x:item.x,y:yy},null,null,index * 200)
            }

        }
    }

    private getLineNum(team,column){
        var count = 0;
        for(var i=0;i<5;i++)
        {
            if(this.posData[team+'_'+column+'_' + i])
                count ++;
        }
        return count
    }

    private addLine(team,column){
        var list = [];
        var index = 0;
        for(var i=1;i<5;i++)
        {
            var key = team+'_'+column+'_' + i;
            var frontKey = team+'_'+column+'_' + (i-1);
            var frontItem = this.posData[frontKey];
            var item = this.posData[key];
            if(item && !item.moving && !frontItem && (!item.isAtking || egret.getTimer() - item.isAtking > 2000)) //要向前走
            {
                this.walkItem(item,index);
                index ++;
                return;
            }
        }

        if(!this.posData[team+'_'+column+'_'+3])
        {
            var item:any = this.getItem();
            item.x = column * 90 + 45
            if(team == 1)
            {
                this.con1.addChild(item);
                item.data = {vo:ArrayUtil.randomOne(this.myMonsterList),team:1};
                item.y = 450
            }
            else
            {
                this.con2.addChild(item);
                item.data = {vo:ArrayUtil.randomOne(this.enemyMonsterList),team:2};
                item.y = -450
            }
            item.line = -1;
            item.key = team+'_'+column+'_'+4;
            list.push(item)
            this.itemArray.push(item);

            this.walkItem(item,index);
        }
    }



    private showCound(b?){
        var rect = {
            x:0,
            y:0,
            width:640,
            height:this.con.height
        }
        var mc = AniManager.getInstance().showCloud(this.con,rect,b)


        this.cloudArr.push(mc)
        this.cloudTimer  = egret.getTimer();
    }

    private removeDie(){
        var t = egret.getTimer();
        for(var i=0;i<this.itemArray.length;i++)
        {
            var item = this.itemArray[i];
            if(item.die && t-item.die > 1000)
            {
                this.itemArray.splice(i,1);
                this.freeItem(item);
                delete this.posData[item.key];
                i--;
            }
        }
    }

    //补充满玩家
    //private readdPlayer(){
    //    this.removeDie();
    //    this.addPlayer();
    //}

    //取攻击数据
    private getAtkObj(team){
        var atkerList = []
        var defendList = []
        var t = egret.getTimer();
        for(var i=0;i<this.itemArray.length;i++)
        {
            var item = this.itemArray[i];
            if(item.die)
                continue;
            if(item.moving)
                continue;
            if(item.line >= 3)
                continue;
            if(item.team == team)
            {
                if(item.line > 0) //如果前面没人
                {
                    var keyArr = item.key.split('_');
                    keyArr[2]  = 0
                    if(!this.posData[keyArr.join('_')])
                        continue;
                }
                if(!item.isAtking || t - item.isAtking > 2000)
                    atkerList.push(item);
                continue;
            }
            if(item.line < 2 && !item.moving) //只会打前两排
            {
                if(item.line == 1 && Math.random()>0.5)//第二排有一定几率不被攻击
                {
                    continue
                }
                defendList.push(item);
            }
        }
        return {
            atkerList:atkerList,
            defendList:defendList
        }
    }

    //队伍1攻击
    private selfAtk(){
        var obj = this.getAtkObj(1);
        this.randomAtk(obj.atkerList,obj.defendList)
    }
    //队伍2攻击
    private enemyAtk(){
        var obj = this.getAtkObj(2);
        this.randomAtk(obj.atkerList,obj.defendList)
    }

    private randomAtk(self,enemy){
        var VM = PKMainMV.getInstance();
        var atker = ArrayUtil.randomOne(self)
        if(!atker)
            return;
        var defender
        var defenderDis
        for(var i=0;i<enemy.length;i++) {
            if (!defender) {
                defender = enemy[i];
                defenderDis = MyTool.getDis(atker, defender)
            }
            else {
                var dis = MyTool.getDis(atker, enemy[i])
                if(defenderDis > dis)
                {
                    if(defenderDis - dis < 100 && Math.random()<0.5)
                        continue;
                    defender = enemy[i];
                    defenderDis = MyTool.getDis(atker, defender)
                }
            }
        }

        if(!defender)
            return;
        var mvo = atker.data.vo
        if(mvo.atktype)// && Math.random() > 0.2)
        {
            this.bulletAtk(atker,defender)
            return;
        }

        if(atker.line == 0 && defender.line == 0)
        {
            this.nearAtk(atker,defender)
            return;
        }
        atker.isAtking = egret.getTimer();

        VM.skillMV(atker,function(){
            defender.showBehit();
            this.playAniOnItem(atker,defender)
            this.testItemDie(defender);
        },this)

        var fromPoint = this.getXYOnCon(atker)
        var toPoint = this.getXYOnCon(defender)
        VM.drawLine(fromPoint,toPoint,atker.team,this.con)
    }




    private testItemDie(item){

        var MD = MapData.getInstance();
        var normalDie = 3600*6//6 hour
        var rate = (MapData.getInstance().bossCD*MapData.getInstance().getAwardMax()/MD.getCurrentAward() - normalDie)/normalDie
        if(item.team == 1)
            rate = 0.5 + rate*0.2;
        else
            rate = 0.5 - rate*0.2

        rate = Math.max(rate,0.1)
        rate = Math.min(rate,0.9)

        var b = Math.random() < rate
        if(b)
        {
            this.showDie(item);
        }
    }



    private renewInfo(){
        var MD = MapData.getInstance();
        if(MD.level<MD.maxLevel || MD.maxBossTimes <= MD.step)
        {
            this.desText.text = '已通关';
            this.setBtnEnable('left',MD.level > 1 && MD.maxLevel - MD.level < 2)
            this.setBtnEnable('right',true)
        }
        else
        {
            this.desText.text = MD.step + '/' + MD.maxBossTimes;
            this.setBtnEnable('left',MD.level > 1)
            this.setBtnEnable('right',false)
        }

        MyTool.setColorText(this.awardText,'[- 功勋背包 -]\n' + (MD.bag >=0?MD.bag:this.createHtml(MD.bag,0xFF0000)) + '/' + MD.getAwardMax());
        MyTool.setColorText(this.valueText,'[- 功勋积累 -]\n' + MD.value);
        MyTool.setColorText(this.pkText,'[- 通缉令 -]\n' + MD.pkValue);

        this.redMC.visible = MD.bag >= MD.getAwardMax();

        if(MD.enemy && MD.enemy.level == MD.level && !MD.enemy.is_pk)
        {
            this.pkBtn.label = '挑　战'
            this.pkBtn.skinName = 'Btn_b2Skin'
        }
        else
        {
            this.pkBtn.label = '搜　寻'
            this.pkBtn.skinName = 'Btn_r2Skin'
        }

        this.videoBtn.visible = MapManager.getInstance().logList.length > 0;
    }

    private setBtnEnable(key,b){
        if(key == 'left')
        {
            this.leftBtn.touchChildren = this.leftBtn.touchEnabled = b;
            if(b)
            {
                this.la.source = 'arrow1_png'
                this.lt.textColor = 0xCBB46B
            }
            else
            {
                this.la.source = 'arrow3_png'
                this.lt.textColor = 0x957565
            }
        }
        else
        {
            this.rightBtn.touchChildren = this.rightBtn.touchEnabled = b;
            if(b)
            {
                this.ra.source = 'arrow1_png'
                this.rt.textColor = 0xCBB46B
            }
            else
            {
                this.ra.source = 'arrow3_png'
                this.rt.textColor = 0x957565
            }
        }
    }

    //近攻型
    private nearAtk(atkerItem,defenderItem){
        var PPM = PKPosManager.getInstance();
        var VM = PKMainMV.getInstance();

        atkerItem.isAtking = egret.getTimer()

        var pos = {x:atkerItem.x,y:atkerItem.y}
        var defPos = defenderItem.parent.localToGlobal(defenderItem.x,defenderItem.y);
        defPos = atkerItem.parent.globalToLocal(defPos.x,defPos.y,defPos)

        var xy = VM.moveToTarget(atkerItem,defPos,function(){
            this.playAni(atkerItem,defPos)
            defenderItem.showBehit();
            this.testItemDie(defenderItem);
            VM.moveToXY(atkerItem,pos,function(){

            },this);
        },this)
    }

    //远攻型
    private bulletAtk(atkerItem,defenderItem){
        var VM = PKMainMV.getInstance();
        var PPM = PKPosManager.getInstance();

        atkerItem.isAtking = egret.getTimer()
        defenderItem.isBeAtking = atkerItem.isAtking;

        var mvo = atkerItem.data.vo
        var fromPoint = this.getXYOnCon(atkerItem)
        var toPoint = this.getXYOnCon(defenderItem)
        var sendXY = VM.getDisPoint(fromPoint,toPoint,50);
        VM.skillMV2(atkerItem,defenderItem,function(){
            VM.playBullet2(mvo.atktype,this.con1,toPoint,function(){
                if(this.isStop) //子弹有Tween
                    return;
                var mvID = mvo.mapMV;
                if(!AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID)))
                    mvID = 107
                if(AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID)))
                {
                    var mc = VM.playOnItem(mvID,this.con1,null,null,this.getXYOnCon(defenderItem));
                    mc.scaleX =  mc.scaleY = 1.2

                }
                this.testItemDie(defenderItem);
                defenderItem.showBehit();

            },this,sendXY)

        },this)
    }

    //在a和B之前放动画
    private playAni(atker,defender){
        var mvID = atker.data.vo.mapMV
        if(!AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID)))
            mvID = 107
        if(AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID)))
        {
            var xy = this.getMiddleXY(atker,defender)
            var p = atker.parent.localToGlobal(xy.x,xy.y)
            p =  this.con.globalToLocal(p.x,p.y,p)
            var VM = PKMainMV.getInstance();
            var mc = VM.playOnItem(mvID,this.con1,null,null,p);
            mc.scaleX =  mc.scaleY = 1.2
        }
    }

    private playAniOnItem(atker,defender){
        var mvID = atker.data.vo.mapMV
        if(!AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID)))
            mvID = 107
        if(AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID)))
        {
            //var xy = this.getMiddleXY(atker,defender)
            var VM = PKMainMV.getInstance();
            var mc = VM.playOnItem(mvID,this.con1,null,null,this.getXYOnCon(defender));
            mc.scaleX =  mc.scaleY = 1.2
        }
    }

    private getXYOnCon(item){
        var p = item.localToGlobal(this.itemWidth/2,this.itemHeight/2)
        return this.con.globalToLocal(p.x,p.y,p)
    }

    private rand(a,b){
        return a + Math.floor( Math.random()*(b-a + 1))
    }



    private getMiddleXY(a,b){
        return {
            x:a.x + (b.x - a.x)/2,
            y:a.y + (b.y - a.y)/2,
        }
    }


    private showDie(item,fun?,cd=-1){
        if(cd == -1)
            cd = 500;
        item.die = egret.getTimer() + cd;

        var x = item.x;
        var v = 2
        var tw:egret.Tween = egret.Tween.get(item);
        tw.wait(cd).to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300).call(function(){
            this.renewBossHp(true);
        },this);
        if(fun)
            tw.call(fun,this);
    }

    private renewBossHp(mv?){
        var MD = MapData.getInstance();
        var rate = 1-(TM.now() - MD.lastTime)/MD.getCurrentCD();
        if(mv)
        {
            this.bb.width = this.bf.width
            var tw = egret.Tween.get(this.bf)
            tw.to({width:640*rate},200);
        }
        else
        {
            egret.Tween.removeTweens(this.bf)
            this.bf.width = 640*rate;
            this.bb.width = this.bf.width
        }
        if(rate <= 0)
        {
            MD.reInit()
            this.renewInfo();
        }
    }



}