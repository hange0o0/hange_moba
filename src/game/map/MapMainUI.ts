class MapMainUI extends game.BaseUI {
    private static instance:MapMainUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapMainUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapMainUISkin";
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
    private valueText: eui.Label;
    private exchangeBtn: eui.Button;
    private pkText: eui.Label;
    private pkBtn: eui.Button;
    private videoBtn: eui.Group;




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
        this.con.addChild(this.bossItem);

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
    }

    private onLeft(){
         MapManager.getInstance().change_level(MapData.getInstance().level - 1)
    }

    private onRight(){
        MapManager.getInstance().change_level(MapData.getInstance().level + 1)
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
        if(MM.enemy && MM.enemy.level == MD.level && !MM.enemy.is_pk)
        {
            MM.pkLevel = MD.level;
            MapGameUI.getInstance().show();
            this.hide()
            return;
        }
        var self = this;
        MM.getEnemy(MD.level,function(){
            MapGameUI.getInstance().show();
            self.hide()
        })
    }
    private onGet(){
        var self = this;
        MapManager.getInstance().get_award(function(){
            self.renewInfo();
        })
    }
    private onVideo(){
        DayLogUI.getInstance().show(MapManager.getInstance().logList,'挑战日志');
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
        super.hide();
    }

    public show(data?){
        var self = this;
        self.superShow()
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        var MD = MapData.getInstance();
        if(!MD.lastPKTime)
            MD.lastPKTime = TM.now();

        MD.reInit();
        MD.setPKDisplayData();
        this.pkHeight = this.stage.stageHeight - 560

        this.renew();
        this.renewInfo();

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.onTimer();
    }

    private onTimer(){
        var MD = MapData.getInstance();
        var pkTime = Math.floor((MD.getAwardMax() - MD.awardValue)/MD.getCurrentAward() - 1)*MD.getCurrentCD()
        pkTime +=  MD.getCurrentCD() - (TM.now() - MD.lastPKTime) + this.timeDic
        if(pkTime == 0)
            console.log('能量背包已充满')
        else
            console.log('能量背包充满时间：' + DateUtil.getStringBySeconds(pkTime,false,2))
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

        this.timeDic = (TM.now() - MD.lastPKTime) - this.pkIndex*MD.showCD
        this.inPker();
        ////延迟2秒表现
        //var passCD = MD.getPKPass();
        //if(passCD >= 2)
        //    this.inPker();
        //else
        //    this.setTimeout(this.inPker,(2-passCD)*1000);
    }

    private renewInfo(){
        var MD = MapData.getInstance();
        if(MD.level<MD.maxLevel || MD.maxBossTimes == MD.pkBossTimes)
        {
            this.desText.text = '已通关';
            this.setBtnEnable('left',MD.level > 1 && MD.maxLevel - MD.level < 3)
            this.setBtnEnable('right',true)
        }
        else
        {
            this.desText.text = MD.pkBossTimes + '/' + MD.maxBossTimes;
            this.setBtnEnable('left',MD.level > 1)
            this.setBtnEnable('right',false)
        }

        MyTool.setColorText(this.awardText,'[能量背包：]' + MD.awardValue + '/' + MD.getAwardMax());
        MyTool.setColorText(this.valueText,'[能量仓库：]' + MD.scoreValue);
        MyTool.setColorText(this.pkText,'[通缉令：]' + MD.pkValue);
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
                this.lt.textColor = 0x734B41
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
                this.rt.textColor = 0x734B41
            }
        }
    }

    //进场
    private inPker(){ //1500ms
        //BOSS死了
        var MD = MapData.getInstance();
        if(MD.currentBossHp == 0){
            MD.onKillBoss();
            this.pkList = MD.pkList;
            this.pkIndex = 0;
            MD.currentBossHp = MD.currentBossMaxHp;
            this.bossItem.data = {vo:MD.getBossVO()};
            this.renewInfo();

            this.bossItem.alpha = 1;
            this.bossItem.x = 740;
            var tw = egret.Tween.get(this.bossItem);
            tw.wait(500).to({x:440},300).to({x:460},200).call(function(){
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
            var tw = egret.Tween.get(this.pkItem);
            tw.to({x:-100},300).to({y:this.pkHeight / 2}).wait(200).call(function(){
                this.con.addChild(this.pkItem);
                this.pkItem.scaleX = this.pkItem.scaleY = 1;
                this.otherIn();
            },this).to({x:200},300).to({x:180},200).call(function(){
                this.bb.width = this.bf.width
                var tw = egret.Tween.get(this.bb);
                tw.to({width:this.bf.width},200);
            },this).wait(500).call(this.onPKAction,this)
        }

    }

    private otherIn(){
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
            var tw:egret.Tween = egret.Tween.get(item);
            tw.to({x:toX - 10},300).to({x:toX},200)
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
        this.bossItem.showWord(-hurt,0xFF0000)
        this.renewBossHp(true);
        if(MD.currentBossHp == 0)//BOSS死了
        {
            this.showDie(this.bossItem)
            //this.showPKerWin();
        }
        else
        {
            this.showDie(this.pkItem)
            this.pkIndex ++;
        }

        this.setTimeout(this.inPker,2000);
    }

    private showPKerWin(){
        var tw:egret.Tween = egret.Tween.get(this.pkItem);
        tw.wait(500).to({x:-100}, 500);
    }
    private showDie(item){

        item.die = true;
        var x = item.x;
        var v = 2
        var tw:egret.Tween = egret.Tween.get(item);
        tw.wait(500).to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300);
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
}