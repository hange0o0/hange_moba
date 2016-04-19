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



    private bg: eui.Image;
    private enemyGroup: eui.Group;
    private selfGroup: eui.Group;
    private vsMC: eui.Image;
    private jumpBtn: eui.Button;
    private item1: PKItemBig;
    private item2: PKItemBig;





    //private dataIn;
    private stageHeight;
    private itemWidth = 114;
    private itemHeight = 110;
    private bgHeight = 560;

    private card1X
    private card2X
    private cardY



    private itemCollect = [];
    private itemEnemy = [];
    private itemSelf = [];

    private pkList = [];

    private cardIndex1;
    private cardIndex2;
    private timer;
    private count;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.jumpBtn, this.onJump);

        this.card1X = this.item1.x
        this.card2X = this.item2.x
        this.enemyGroup.addChild(this.item2)
        this.selfGroup.addChild(this.item1)
        this.addChild(this.jumpBtn);
    }

    private onJump(){
        this.stopAll();
        this.showResult();
    }

    public show(){
        //this.dataIn = PKManager.getInstance().pkData;//data;
        this.pkList = PKManager.getInstance().pkList.concat();
        this.cardIndex1 = -1;
        this.cardIndex2 = -1;
        super.show();
    }

    public onShow() {
        this.initView();
        this.addItemMovie();
    }

    private getItem():PKItem{
        var item = this.itemCollect.pop();
        if(!item)
        {
            item = new PKItem();
            item.anchorOffsetX = this.itemWidth/2;
            item.anchorOffsetY = this.itemHeight/2;
        }
        return item;
    }
    private freeItem(item){
        this.itemCollect.push(item);
        MyTool.removeMC(item);
    }

    private initView(){
        var stageHeight = this.stageHeight = this.stage.stageHeight;
        this.bg.y =  (stageHeight)/2;
        this.vsMC.y =  (stageHeight)/2;
        //this.item1.y = this.item2.y = (stageHeight - 280)/2;
        this.jumpBtn.y = this.bg.y + this.bgHeight/2 - 80;
        this.cardY =  this.bgHeight/2;

        this.bg.visible = false;
        this.vsMC.visible = false;
        this.item1.visible = false;
        this.item2.visible = false;
        this.jumpBtn.visible = false;

        while(this.itemEnemy.length > 0)
        {
             this.freeItem(this.itemEnemy.pop());
        }
        while(this.itemSelf.length > 0)
        {
             this.freeItem(this.itemSelf.pop());
        }

        this.enemyGroup.y = this.bg.y - this.bgHeight/2 + 120;
        this.selfGroup.y = this.bg.y - this.bgHeight/2 - 120;
    }

    private addItemMovie(){
        var joinCD = 100;
        var myTeam = PKManager.getInstance().team1Base.list
        var y1 = this.bgHeight/2+120+this.itemHeight/2 +50
        var y2 = this.bgHeight/2-120-this.itemHeight/2 -50
        for(var i=0;i<myTeam.length;i++)
        {
            var item = this.getItem();
            item.x = this.getX(i);
            item.y = y1 + Math.floor(i/5) * 120;
            item.data = {vo:MonsterVO.getObject(myTeam[i])};
            this.itemSelf.push(item);
            this.addItemMV(item,this.selfGroup,joinCD*i + 200);
        }

        var enemyTeam = PKManager.getInstance().team2Base.list
        for(var i=0;i<enemyTeam.length;i++)
        {
            var item = this.getItem();
            item.x = 640 - this.getX(i);
            item.y = y2 - Math.floor(i/5) * 120;
            item.data = {vo:MonsterVO.getObject(enemyTeam[i])};
            this.itemEnemy.push(item);
            this.addItemMV(item,this.enemyGroup,joinCD*i + 200);
        }

        this.timer = egret.setTimeout(this.onJoinFinish,this,Math.max(enemyTeam.length,myTeam.length)*joinCD + 600);
    }

    //加入动画
    private addItemMV(item,par,cd){
        setTimeout(function(){
            par.addChild(item);
            var itemX = item.x;
            item.x -= (320-item.x)/1;

            item.scaleX = 3;
            item.scaleY = 3;
            item.alpha = 0;
            var tw:egret.Tween = egret.Tween.get(item);
            tw.to({alpha:0.5,scaleX:1,scaleY:1,x:itemX}, 300,egret.Ease.sineIn).call(function(){
                item.alpha = 1;
            })
        },cd)
    }

    private getX(index)
    {
        var des = 620/5;
        return (index%5)*des + des/2 + 10;
    }
    private getX2(index)
    {
        var des = 560/10;
         return index*des + des/2 + 40;
    }

    //双方都入场了
    private onJoinFinish(){
        egret.Tween.get(this.selfGroup).to({y:this.bg.y-this.bgHeight/2}, 300)
        egret.Tween.get(this.enemyGroup).to({y:this.bg.y-this.bgHeight/2}, 300)

        this.vsMC.visible = true;
        this.vsMC.alpha = 0;
        this.addItemMV(this.vsMC,this.vsMC.parent,200)

        this.timer = egret.setTimeout(this.changeLine,this,1000);
    }

    //转成一条直线
    private changeLine(){
        for(var i=this.itemSelf.length - 1;i>=0;i--)
        {
            var item = this.itemSelf[i];
            item.parent.addChild(item);
            this.delayMove(item,this.getX2(i),this.bgHeight + this.itemHeight/2,0);
        }
        for(var i=this.itemEnemy.length - 1;i>=0;i--)
        {
            var item = this.itemEnemy[i];
            item.parent.addChild(item);
            this.delayMove(item,640-this.getX2(i),0 - this.itemHeight/2,0);
        }

        this.bg.visible = true;
        this.bg.scaleX = 0;
        this.bg.scaleY = 0;
        egret.Tween.get(this.bg).to({scaleX:1.2,scaleY:1.2}, 200).to({scaleX:1,scaleY:1}, 100).wait(500).call(function(){
            egret.Tween.get(this.vsMC).to({alpha:0,scaleX:2,scaleY:2}, 400).call(function(){
                this.vsMC.visible = false;
            },this);
        },this);






        this.timer = egret.setTimeout(this.playOne,this,1500);
    }

    private delayMove(item,x,y,cd){
        if(cd == 0)
        {
            egret.Tween.get(item).to({y:y,x:x}, 300)
            return;
        }
        this.timer = egret.setTimeout(function(){
            egret.Tween.get(item).to({y:y,x:x}, 300)
        },this,cd);

    }

    //开始播放动画
    private playOne(){
        //console.log('playOne');
        var oo = this.pkList.shift();
        if(oo == null)//pk结束
        {
            this.showResult();
             return;
        }
        this.jumpBtn.visible = true;
        var player1 = oo.player1
        var player2 = oo.player2
        this.count = 0;
        if(this.testJumpPK(player1,1))
            this.count ++;
        if(this.testJumpPK(player2,2))
            this.count ++;

    }

    //测试是否有进场动画
    private testJumpPK(player,team){
        var item,x,temp;
        if(team == 1)
        {
            item =this.item1;
            x = this.card1X;
            temp = this.itemSelf[player.index]
        }
        else
        {
            item =this.item2;
            x = this.card2X;
            temp = this.itemEnemy[player.index]
        }

        if(this['cardIndex' + team] != player.index)
        {
            temp.parent.addChild(temp);
            temp.scaleX = temp.scaleY = 1.2;

            var tw:egret.Tween = egret.Tween.get(item);
            item.visible = true;
            item.alpha = 1;
            item.scaleX = 0.1;
            item.scaleY = 0.4;
            item.x = temp.x
            item.y = temp.y
            tw.to({scaleX:1,scaleY:1,x:x,y:this.cardY}, 400 + (player.index) - 2 * 20).wait(300).call(function(){
                this.count --;
                this.onPlayJumpFinish();
            },this)
            item.data = player;
            this['cardIndex' + team] = player.index;
             return true;
        }
        else
        {
            item.data = player;
        }
        return false;
    }

    private onPlayJumpFinish(){
        if(this.count == 0)
        {
            this.count = 2;
            this.playerPK(1)
            this.playerPK(2)
        }
    }

    //PK动画
    private playerPK(team){
        //console.log('playerPK')
        var item,x,x2,y

        if(team == 1)
        {
            item =this.item1;
            x = 320-100;
            x2 = this.card1X;
            y = this.cardY - 30;
        }
        else
        {
            item =this.item2;
            x = 320+100;
            x2 = this.card2X;
            y = this.cardY - 30;
        }
        var tw:egret.Tween = egret.Tween.get(item);
        tw.to({scaleX:1.2,scaleY:1.2,x:x,y:y}, 200).to({scaleX:1,scaleY:1,x:x2,y:this.cardY}, 200).wait(200).call(function(){
            this.count --;
            this.onPlayPKFinish();
        },this)
    }

    private onPlayPKFinish(){
        if(this.count == 0)
        {
            this.count = 2;
            this.item1.decHp(this.onDecHpFinish,this);
            this.item2.decHp(this.onDecHpFinish,this);
        }
    }

    //扣血动画
    private onDecHpFinish(){
        this.count --;
        if(this.count == 0)
        {
            this.testPlayerBack(1);
            this.testPlayerBack(2);
        }
    }


    //3次胜利后回归动画
    private testPlayerBack(team){
        var item,x,temp
        if(team == 1)
        {
            item =this.item1;
            x = this.card1X;
            temp = this.itemSelf[item.data.index]
        }
        else
        {
            item =this.item2;
            x = this.card2X;
            temp = this.itemEnemy[item.data.index]
        }

        if(item.data.after > 0)
        {
            var tw:egret.Tween = egret.Tween.get(item);
            if(item.data.winCount == 3)   //回列表
            {
                temp.showWin3();
                temp.scaleX = temp.scaleY = 1;
                tw.to({alpha:0,scaleX:0.1,scaleY:0.1,x:temp.x,y:temp.y}, 300).call(function(){
                    this.playOne();
                    //console.log('win3')
                },this)

            }
            else //回原位
            {
                tw.wait(50).call(function(){
                    this.playOne();
                },this)
                //console.log('win',item.data)
                //this.playOne();

            }
        }
        else
        {
            temp.scaleX = temp.scaleY = 1;
        }

    }

    private stopAll()
    {
        egret.clearTimeout(this.timer);
        egret.Tween.removeAllTweens()
    }

    private showResult()
    {
        PKResultUI.getInstance().show();
        //if(PKManager.getInstance().pkResult.result)
        //    console.log('win');
        //else
        //    console.log('loss');
    }



}