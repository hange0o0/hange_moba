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
    private videoBtn: eui.Group;
    private timeText: eui.Label;



    private talkList = [];
    private emoList = [];


    private poolArray = [];
    private itemWidth = 114;
    private itemHeight = 110;
    private pkHeight = 110;


    public data
    public itemArray = [];

    public bossItem
    public pkItem
    public pkList
    public pkIndex

    public timeDic

    private cloudTimer = 0;
    private cloudArr = [];

    private isFirst
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
        this.addBtnEvent(this.videoBtn,this.onVideo)

        this.bossItem = this.getItem();
        this.con.addChildAt(this.bossItem,0);

        this.addChild(MapExchangeUI.getInstance())
        MapExchangeUI.getInstance().hide();

    }

    private setTimeout(fun,cd,data?){
        var tw:egret.Tween = egret.Tween.get(this);
        tw.wait(cd).call(fun,this,data)
    }

    private stopAll(){
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.bossItem);
        this.freeItem(this.pkItem);
        for(var i=0;i<this.itemArray.length;i++)
        {
             this.freeItem(this.itemArray[i]);
        }
        this.itemArray.length = 0;
        this.pkItem = null;

        while(this.cloudArr.length > 0)
        {
            var mc = this.cloudArr.pop();
            MyTool.removeMC(mc);
            egret.Tween.removeTweens(mc);
        }

        AniManager.getInstance().removeAllMV();
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
            this.hide()
            return;
        }
        var self = this;
        MM.getEnemy(function(){
            MapGameUI.getInstance().show();
            self.hide()
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
        this.hide();
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

        TaskManager.getInstance().cleanNowAcrion('map_game_buy');
        TaskManager.getInstance().cleanNowAcrion('map_game_pk');
        TaskManager.getInstance().cleanNowAcrion('map_game_next');
        super.hide();
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
        this.pkHeight = this.stage.stageHeight - 560
        this.onMapChange();






        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer);
        this.addPanelOpenEvent(GameEvent.client.map_change,this.onMapChange);
        this.addPanelOpenEvent(GameEvent.client.map_value_change,this.renewInfo);


        this.stage.addEventListener(egret.Event.ACTIVATE,this.onActive,this);

        AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(30)) //+hp
        AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(39)) //add


        if(TaskManager.getInstance().nowAction == 'map_game_pk')
        {
            TaskManager.getInstance().showGuideMC(this.pkBtn)
        }
        else if(TaskManager.getInstance().nowAction == 'map_game_buy')
        {
            TaskManager.getInstance().showGuideMC(this.getBtn)
        }
        else if(TaskManager.getInstance().nowAction == 'map_game_next')
        {
            TaskManager.getInstance().showGuideMC(this.rightBtn)
        }
    }

    //激活后重新表现
    private onActive(){
        if(this.openTime && egret.getTimer() - this.openTime < 1000)
            return;
        this.onMapChange();
    }

    private onMapChange(){
        this.openTime = egret.getTimer();
        var MD = MapData.getInstance();
        MD.reInit();
        MD.setPKDisplayData();
        this.stopAll();
        this.renew();
        this.renewInfo();
        this.onTimer();

        this.showCound(true)
        this.showCound(true)
    }

    private onTimer(){
        var MD = MapData.getInstance();
        var pkTime = Math.floor((MD.getAwardMax() - MD.bag)/MD.getCurrentAward() - 1)*MD.getCurrentCD()
        pkTime +=  MD.getCurrentCD() - (TM.now() - MD.lastTime) + this.timeDic
        if(pkTime > 0)
            MyTool.setColorText(this.timeText,'[功勋背包满载：]' + DateUtil.getStringBySeconds(pkTime,false,2))
        else
            this.timeText.text = ('功勋背包已满载')
        if(egret.getTimer() - this.cloudTimer > 1000*10)
            this.showCound();


        //console.log('map running')
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

    private renew(){
        var MD = MapData.getInstance();
        this.topUI.setTitle('第'+MD.level+'据点')
        this.bg.source = 'pk_bg'+(MD.level%20 || 20)+'_jpg';

        var scale = 0.85;
        var pkList = this.pkList = MD.pkList;
        var index = this.pkIndex = MD.getPKingIndex();
        var pos = 0;
        while(this.itemArray.length <6)
        {
             var item = this.getItem();
            item.data = {vo:MonsterVO.getObject(pkList[index])};
            this.itemArray.push(item);
            this.bottomGroup.addChild(item);
            item.scaleX = item.scaleY = scale
            item.x = (this.itemWidth * scale + 3) * pos + 70;
            item.y = 70;

            index ++;
            pos ++;
        }

        this.renewBossHp()
        this.bossItem.alpha = 1;
        this.bossItem.data = {vo:MD.getBossVO()};
        this.bossItem.x = 460;
        this.bossItem.y = this.pkHeight / 2;

        this.timeDic = (TM.now() - MD.lastTime) - this.pkIndex*MD.showCD + 1
        if(this.isFirst)
        {
            this.setTimeout(this.inPker,1000);
        }
        else if(this.timeDic > 4)
        {
            this.timeDic -= 4;
            this.inPker(true);
            this.showPKResult()
        }
        else if(this.timeDic > 2)
        {
            this.timeDic -= 2;
            this.inPker(true);
            this.onPKAction();
        }
        else
        {
            this.timeDic -= 1;
            this.inPker();
        }
        ////延迟2秒表现
        //var passCD = MD.getPKPass();
        //if(passCD >= 2)
        //    this.inPker();
        //else
        //    this.setTimeout(this.inPker,(2-passCD)*1000);
    }

    private renewInfo(){
        var MD = MapData.getInstance();
        if(MD.level<MD.maxLevel || MD.maxBossTimes == MD.step)
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

        MyTool.setColorText(this.awardText,'[功勋背包：]' + MD.bag + '/' + MD.getAwardMax());
        MyTool.setColorText(this.valueText,'[功勋积累：]' + MD.value);
        MyTool.setColorText(this.pkText,'[通缉令：]' + MD.pkValue);
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

    //进场
    private inPker(quick = false){ //1500ms
        //BOSS死了
        var MD = MapData.getInstance();
        if(MD.currentBossHp <= 0){
            MD.onKillBoss();
            this.pkList = MD.pkList;
            this.pkIndex = 0;
            MD.currentBossHp = MD.currentBossMaxHp;
            this.bossItem.data = {vo:MD.getBossVO()};
            this.renewInfo();

            this.bossItem.alpha = 1;
            this.bossItem.x = 740;
            var tw = egret.Tween.get(this.bossItem);
            tw.call(function(){
                if(this.pkItem.tempObj)
                {
                    this.pkItem.showHpChange({
                        rate1:this.pkItem.tempObj.rate,
                        rate2:1,
                        hp:this.pkItem.tempObj.hp
                    })
                    if(!AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(30)))
                        return;
                    var VM = PKMainMV.getInstance();
                    VM.playOnItem(30,this.pkItem);
                }
            },this).wait(500).to({x:440},300).to({x:460},200).call(function(){
                this.renewBossHp(true)
            },this).wait(500).call(this.onPKAction,this)
        }
        else
        {
            if(this.pkItem)
            {
                this.freeItem(this.pkItem);
            }
            this.pkItem = this.itemArray.shift();
            var mvID = this.pkItem.data.vo.mapMV;
            AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID))
            if(quick)
            {
                this.con.addChildAt(this.pkItem,0);
                this.pkItem.x = 180
                this.pkItem.y = this.pkHeight/2
                this.pkItem.scaleX = this.pkItem.scaleY = 1;
                this.bb.width = this.bf.width
                this.otherIn(true);
                return;
            }
            var tw = egret.Tween.get(this.pkItem);
            tw.to({x:-100},300).to({y:this.pkHeight / 2}).wait(200).call(function(){
                this.con.addChildAt(this.pkItem,0);
                this.pkItem.scaleX = this.pkItem.scaleY = 1;
                this.otherIn();
            },this).to({x:200},300).to({x:180},200).call(function(){
                var tw = egret.Tween.get(this.bb);
                tw.to({width:this.bf.width},200);
            },this).wait(500).call(this.onPKAction,this)
        }

        this.setTimeout(function(){
            if(Math.random() > 0.5)
                this.showItemTalk();
        },1000)
    }



    private otherIn(quick = false){
        var item = this.getItem();
        var scale = 0.85;
        item.data = {vo:MonsterVO.getObject(this.pkList[this.pkIndex + 6])};
        this.itemArray.push(item);
        this.bottomGroup.addChild(item);
        item.scaleX = item.scaleY = scale
        item.x = (this.itemWidth * scale + 3) * 6 + 70;
        item.y = 70;

        for(var i=0;i<this.itemArray.length;i++)
        {
            item = this.itemArray[i];
            var toX = (this.itemWidth * scale + 3) * i + 70;
            if(quick)
            {
                item.x = toX;
            }
            else
            {
                var tw:egret.Tween = egret.Tween.get(item);
                tw.to({x:toX - 10},300).to({x:toX},200)
            }

        }
    }

    private onPKAction(){     //1500ms
        var des = 90;
        var cd = 200;
        var b = Math.random() > 0.5
        var des1 = {
            x:-30 + 60*Math.random(),
            y:-30 + 60*Math.random()
        }
        var des2 = {
            x:-30 + 60*Math.random(),
            y:-30 + 60*Math.random()
        }
        var middlePos1 = {x:180,y:this.pkHeight / 2}
        var middlePos2 = {x:460,y:this.pkHeight / 2}
        var tw:egret.Tween = egret.Tween.get(this.pkItem);
        tw.to({x:middlePos1.x + des},cd).to({x:middlePos1.x + this.rand(-40,10),y:middlePos1.y + this.getYAdd(b)},cd).wait(100).
            to({x:middlePos1.x + des + des1.x,y:middlePos1.y + des1.y},cd).to({x:middlePos1.x+ this.rand(-40,10),y:middlePos1.y + this.getYAdd(!b)},cd).wait(100).
            to({x:middlePos1.x + des + des2.x,y:middlePos1.y + des2.y},cd).to({x:middlePos1.x,y:middlePos1.y},cd)

        var tw:egret.Tween = egret.Tween.get(this.bossItem);
        tw.to({x:middlePos2.x - des},cd).call(this.playAni,this).to({x:middlePos2.x+ this.rand(-10,40),y:middlePos2.y + this.getYAdd(!b)},cd).wait(100).
            to({x:middlePos2.x - des + des1.x,y:middlePos2.y + des1.y},cd).call(this.playAni,this).to({x:middlePos2.x + this.rand(-10,40),y:middlePos2.y + this.getYAdd(b)},cd).wait(100).
            to({x:middlePos2.x - des + des2.x,y:middlePos2.y+ des2.y},cd).call(this.playAni,this).to({x:middlePos2.x,y:middlePos2.y},cd).wait(100).call(this.showPKResult,this)

        if(Math.random() > 0.5)
            this.showItemTalk();
    }

    private playAni(){
        var mvID = this.pkItem.data.vo.mapMV
        if(AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(mvID)))
        {
            var VM = PKMainMV.getInstance();
            var xy = this.getMiddleXY(this.pkItem,this.bossItem)
            VM.playOnItem(mvID,this.pkItem,null,null,xy);
        }
    }

    private rand(a,b){
        return a + Math.floor( Math.random()*(b-a + 1))
    }

    private getYAdd(b){
        if(b)
            return -80 + this.rand(-50,10)
        return 80+ this.rand(-10,50)
    }

    private getMiddleXY(a,b){
        return {
            x:a.x + (b.x - a.x)/2,
            y:a.y + (b.y - a.y)/2,
        }
    }


    private showPKResult(){  //2000ms
        var MD = MapData.getInstance();
        var hurt = MD.monsterHurts[this.pkItem.data.vo.id];

        MD.currentBossHp -=  hurt
        //this.bossItem.showWord(-hurt,0xFF0000)
        this.renewBossHp(true);

        this.bossItem.showHpChange({
            rate1:(MD.currentBossHp + hurt)/MD.currentBossMaxHp,
            rate2:MD.currentBossHp/MD.currentBossMaxHp,
            hp:-hurt
        })

        if(MD.currentBossHp == 0)//BOSS死了
        {
            this.showDie(this.bossItem,function(){
                if(!AniManager.getInstance().preLoadMV(PKMainMV.getInstance().getMVKey(39)))
                    return;
                var VM = PKMainMV.getInstance();
                var p = this.awardText.localToGlobal(180,10);
                p = this.globalToLocal(p.x,p.y,p);
                VM.playOnItem(39,this,null,null,p).rotation = -30;
            })
            if(Math.random() > 0.5)
                this.showPKEMO(this.pkItem)

            var mValue = MD.monsterValues[this.pkItem.data.vo.id];
            var rate2 = Math.random()*0.6 + 0.1
            this.pkItem.tempObj = {
                rate:rate2,
                hp:Math.floor(rate2*mValue.hp)
            }
            this.pkItem.showHpChange({
                rate1:1,
                rate2:rate2,
                hp:-this.pkItem.tempObj.hp
            })


        }
        else
        {
            this.showDie(this.pkItem)
            this.pkIndex ++;



            var mValue = MD.monsterValues[this.pkItem.data.vo.id];
            this.pkItem.showHpChange({
                rate1:1,
                rate2:0,
                hp:-mValue.hp
            })
        }

        this.setTimeout(this.inPker,2000);

        if(Math.random() > 0.5)
            this.showItemTalk();
    }

    private showDie(item,fun?){

        item.die = true;
        var x = item.x;
        var v = 2
        var tw:egret.Tween = egret.Tween.get(item);
        tw.wait(1000).to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300);
        if(fun)
            tw.call(fun,this);
    }

    private renewBossHp(mv?){
        var MD = MapData.getInstance();
        var rate = MD.currentBossHp/MD.currentBossMaxHp;
        if(mv)
        {
            this.bb.width = this.bf.width
            var tw = egret.Tween.get(this.bf)
            tw.to({width:640*rate},200);
        }
        else
        {
            this.bf.width = 640*rate;
            this.bb.width = this.bf.width
        }
    }
























     /////////////////*******************************************************************************************************
    //要求这个item发话
    private itemTalk(item){
        if(Math.random() < 0.4)
        {
            this.showPKEMO(item)
            return;
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

    //item发话,actionItem的行为进行评价
    private getTalkStr(item){
        var talkBase = PKManager.getInstance().pkWord
        return this.getTalkData(item,talkBase);
    }


    //显示PK表情
    private showPKEMO(item,actionItem?){
        var talkBase = PKManager.getInstance().pkEmo
        var id = this.getTalkData(item,talkBase);
        if(id)
        {
            var emoItem = this.getEmoItem();
            this.addChild(emoItem);
            emoItem.setData({item:item,id:id});
        }
    }

    private getTalkData(item,talkBase){
        return ArrayUtil.randomOne(talkBase.map);
    }

    private showItemTalk(){
        if(MapExchangeUI.getInstance().visible)
            return;
        if(this.openTime && egret.getTimer() - this.openTime < 1000)
            return;
        this.openTime = 0;
        this.itemTalk(ArrayUtil.randomOne(this.itemArray))
        if(Math.random() < 0.3)
        {
            this.setTimeout(this.showItemTalk,500);
        }
    }
}