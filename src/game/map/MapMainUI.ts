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
    private bottomGroup: eui.Group;
    private bb: eui.Rect;
    private bf: eui.Rect;
    private tb: eui.Rect;
    private tf: eui.Rect;
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

    }
    private onRight(){

    }
    private onHelp(){

    }
    private onExchange(){

    }
    private onPK(){

    }
    private onGet(){

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
        MD.reInit();
        this.pkHeight = this.stage.stageHeight - 560
        this.renew();
    }

    private renew(){
        var MD = MapData.getInstance();
        this.topUI.setTitle('第'+MD.level+'据点')

        var scale = 0.85;
        var pkList = this.pkList = MD.pkList.concat(MD.bakList);
        while(this.itemArray.length <6)
        {
            var index = this.itemArray.length;
             var item = this.getItem();

            item.data = {vo:MonsterVO.getObject(pkList[index])};
            this.itemArray.push(item);
            this.bottomGroup.addChild(item);
            item.scaleX = item.scaleY = scale
            item.x = (this.itemWidth * scale + 3) * index + 70;
            item.y = 70;
        }

        this.bossItem.data = {vo:MD.getBossVO()};
        this.bossItem.x = 460;
        this.bossItem.y = this.pkHeight / 2;

        this.inPker();
    }

    //进场
    private inPker(){
         if(this.pkItem)
         {
             this.freeItem(this.pkItem);
         }
        this.pkItem = this.itemArray.shift();
        var tw = egret.Tween.get(this.pkItem);
        tw.to({x:-100},200).to({y:this.pkHeight / 2}).call(function(){
            this.con.addChild(this.pkItem);
            this.pkItem.scaleX = this.pkItem.scaleY = 1;
            this.otherIn();
        },this).to({x:200},200).to({x:180},200).wait(500).call(this.onPKAction,this)
    }

    private otherIn(){
        var item = this.getItem();
        var scale = 0.85;
        item.data = {vo:MonsterVO.getObject(this.pkList[6])};
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

    private onPKAction(){
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
            to({x:middlePos2.x - des + des2.x,y:middlePos2.y+ des2.y},cd).call(this.playAni,this).to({x:middlePos2.x,y:middlePos2.y},cd).call(this.showPKResult,this)
    }

    private playAni(){
        //var arr = this.player1.data.vo.mv1.concat(this.player2.data.vo.mv1)
        //var id = this.randomOne(arr);
        //var VM = PKMainMV.getInstance();
        //var xy = this.getMiddleXY(this.player1,this.player2)
        //VM.playOnItem(id,this.player1,null,null,xy);
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


    private showPKResult(){


        this.bossItem.showWord(-100,0xFF0000)

        var item = this.pkItem;
        item.die = true;
        var x = item.x;
        var v = 2
        var tw:egret.Tween = egret.Tween.get(item);
        tw.wait(500).to({x:x - 30}, 30*v).to({x:x + 20}, 50*v).to({x:x - 10}, 30*v).to({x:x}, 10*v).to({alpha:0}, 300);

        this.pkList.shift();
        this.setTimeout(this.inPker,2000);
    }
}