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





    private dataIn;
    private stageHeight;
    private itemWidth = 114;
    private itemHeight = 110;
    private bgHeight = 560;



    private itemCollect = [];
    private itemEnemy = [];
    private itemSelf = [];


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.jumpBtn, this.onJump);
    }

    private onJump(){

    }

    public show(data?){
        data = {"pkdata":[{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":1},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":1},"player1":[{"hp":100,"id":10,"mid":101},{"hp":100,"id":11,"mid":102},{"hp":100,"id":12,"mid":103}],"player2":[{"hp":100,"id":30,"mid":101},{"hp":100,"id":31,"mid":102},{"hp":100,"id":32,"mid":103}],"result":{"w":1,"hp":5}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":1},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":2},"player1":[{"hp":5,"id":10,"mid":101},{"hp":100,"id":11,"mid":102},{"hp":100,"id":12,"mid":103}],"player2":[{"hp":100,"id":31,"mid":102},{"hp":100,"id":32,"mid":103},{"hp":100,"id":33,"mid":104}],"result":{"w":2,"hp":91}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":3},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":2},"player1":[{"hp":100,"id":11,"mid":102},{"hp":100,"id":12,"mid":103},{"hp":100,"id":13,"mid":104}],"player2":[{"hp":91,"id":31,"mid":102},{"hp":100,"id":32,"mid":103},{"hp":100,"id":33,"mid":104}],"result":{"w":1,"hp":21}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":3},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":4},"player1":[{"hp":21,"id":11,"mid":102},{"hp":100,"id":12,"mid":103},{"hp":100,"id":13,"mid":104}],"player2":[{"hp":100,"id":32,"mid":103},{"hp":100,"id":33,"mid":104},{"hp":100,"id":34,"mid":105}],"result":{"w":2,"hp":74}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":5},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":4},"player1":[{"hp":100,"id":12,"mid":103},{"hp":100,"id":13,"mid":104},{"hp":100,"id":14,"mid":105}],"player2":[{"hp":74,"id":32,"mid":103},{"hp":100,"id":33,"mid":104},{"hp":100,"id":34,"mid":105}],"result":{"w":1,"hp":60}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":5},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":6},"player1":[{"hp":60,"id":12,"mid":103},{"hp":100,"id":13,"mid":104},{"hp":100,"id":14,"mid":105}],"player2":[{"hp":100,"id":33,"mid":104},{"hp":100,"id":34,"mid":105},{"hp":100,"id":35,"mid":106}],"result":{"w":2,"hp":39}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":7},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":6},"player1":[{"hp":100,"id":13,"mid":104},{"hp":100,"id":14,"mid":105},{"hp":100,"id":15,"mid":106}],"player2":[{"hp":39,"id":33,"mid":104},{"hp":100,"id":34,"mid":105},{"hp":100,"id":35,"mid":106}],"result":{"w":1,"hp":54}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":7},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":8},"player1":[{"hp":54,"id":13,"mid":104},{"hp":100,"id":14,"mid":105},{"hp":100,"id":15,"mid":106}],"player2":[{"hp":100,"id":34,"mid":105},{"hp":100,"id":35,"mid":106},{"hp":100,"id":36,"mid":107}],"result":{"w":2,"hp":61}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":9},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":8},"player1":[{"hp":100,"id":14,"mid":105},{"hp":100,"id":15,"mid":106},{"hp":100,"id":16,"mid":107}],"player2":[{"hp":61,"id":34,"mid":105},{"hp":100,"id":35,"mid":106},{"hp":100,"id":36,"mid":107}],"result":{"w":1,"hp":42}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":9},"team2":{"ac":["sm_101_f1","sm_106_f1","sm_105_d1"],"jr":10},"player1":[{"hp":42,"id":14,"mid":105},{"hp":100,"id":15,"mid":106},{"hp":100,"id":16,"mid":107}],"player2":[{"hp":100,"id":35,"mid":106},{"hp":100,"id":36,"mid":107},{"hp":100,"id":37,"mid":108}],"result":{"w":2,"hp":100}},{"team1":{"ac":["sm_101_f1","sm_106_f1","sm_105_d1"],"jr":11},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":10},"player1":[{"hp":100,"id":15,"mid":106},{"hp":100,"id":16,"mid":107},{"hp":100,"id":17,"mid":108}],"player2":[{"hp":100,"id":35,"mid":106,"add_speed":15},{"hp":100,"id":36,"mid":107},{"hp":100,"id":37,"mid":108}],"result":{"w":1,"hp":8}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":11},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":12},"player1":[{"hp":8,"id":15,"mid":106,"add_speed":15},{"hp":100,"id":16,"mid":107},{"hp":100,"id":17,"mid":108}],"player2":[{"hp":100,"id":36,"mid":107},{"hp":100,"id":37,"mid":108},{"hp":100,"id":38,"mid":101}],"result":{"w":2,"hp":25}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":13},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":12},"player1":[{"hp":100,"id":16,"mid":107},{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101}],"player2":[{"hp":25,"id":36,"mid":107},{"hp":100,"id":37,"mid":108},{"hp":100,"id":38,"mid":101}],"result":{"w":1,"hp":89}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":13},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":14},"player1":[{"hp":89,"id":16,"mid":107},{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101}],"player2":[{"hp":100,"id":37,"mid":108},{"hp":100,"id":38,"mid":101},{"hp":100,"id":39,"mid":101}],"result":{"w":1,"hp":35}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":13},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":15},"player1":[{"hp":35,"id":16,"mid":107},{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101}],"player2":[{"hp":100,"id":38,"mid":101},{"hp":100,"id":39,"mid":101}],"result":{"w":2,"hp":69}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":16},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":15},"player1":[{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101},{"hp":100,"id":19,"mid":101}],"player2":[{"hp":69,"id":38,"mid":101},{"hp":100,"id":39,"mid":101}],"result":{"w":1,"hp":35}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":16},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":17},"player1":[{"hp":35,"id":17,"mid":108},{"hp":100,"id":18,"mid":101},{"hp":100,"id":19,"mid":101}],"player2":[{"hp":100,"id":39,"mid":101}],"result":{"w":2,"hp":56}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":18},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":17},"player1":[{"hp":100,"id":18,"mid":101},{"hp":100,"id":19,"mid":101}],"player2":[{"hp":56,"id":39,"mid":101}],"result":{"w":1,"hp":63}}],"result":1,"team1base":{"rl":0,"r":1,"tl":null,"list":[101,102,103,104,105,106,107,108,101,101],"mb":{"101":{"hp":100,"atk":10,"speed":50},"102":{"hp":100,"atk":10,"speed":50},"103":{"hp":100,"atk":10,"speed":50},"104":{"hp":100,"atk":10,"speed":50},"105":{"hp":100,"atk":10,"speed":50},"106":{"hp":100,"atk":10,"speed":50},"107":{"hp":100,"atk":10,"speed":50},"108":{"hp":100,"atk":10,"speed":50}}},"team2base":{"rl":0,"r":1,"tl":null,"list":[101,102,103,104,105,106,107,108,101,101],"mb":{"101":{"hp":100,"atk":10,"speed":50},"102":{"hp":100,"atk":10,"speed":50},"103":{"hp":100,"atk":10,"speed":50},"104":{"hp":100,"atk":10,"speed":50},"105":{"hp":100,"atk":10,"speed":50},"106":{"hp":100,"atk":10,"speed":50},"107":{"hp":100,"atk":10,"speed":50},"108":{"hp":100,"atk":10,"speed":50}}}}
        this.dataIn = data;
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
        this.bg.y =  (stageHeight - this.bgHeight)/2;
        this.vsMC.y =  (stageHeight - 223)/2;
        this.item1.y = this.item2.y = (stageHeight - 280)/2;
        this.jumpBtn.y = this.bg.y + this.bgHeight - 100;

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

        this.enemyGroup.y = this.bg.y +120;
        this.selfGroup.y = this.bg.y - 120;
    }

    private addItemMovie(){
        var joinCD = 150;
        var myTeam = this.dataIn.team1base.list
        var y1 = this.bgHeight/2+120+this.itemHeight/2 +10
        var y2 = this.bgHeight/2-120-this.itemHeight/2 -10
        for(var i=0;i<myTeam.length;i++)
        {
            var item = this.getItem();
            item.x = this.getX(i);
            item.y = y1 + Math.floor(i/5) * 120;
            item.data = {vo:MonsterVO.getObject(myTeam[i])};
            this.itemSelf.push(item);
            this.addItemMV(item,this.selfGroup,joinCD*i + 200);
        }

        var enemyTeam = this.dataIn.team1base.list
        for(var i=0;i<enemyTeam.length;i++)
        {
            var item = this.getItem();
            item.x = 640 - this.getX(i);
            item.y = y2 - Math.floor(i/5) * 120;
            item.data = {vo:MonsterVO.getObject(enemyTeam[i])};
            this.itemEnemy.push(item);
            this.addItemMV(item,this.enemyGroup,joinCD*i + 200);
        }

        egret.setTimeout(this.onJoinFinish,this,Math.max(enemyTeam.length,myTeam.length)*joinCD + 600);
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
        egret.Tween.get(this.selfGroup).to({y:this.bg.y}, 300)
        egret.Tween.get(this.enemyGroup).to({y:this.bg.y}, 300)

        this.vsMC.visible = true;
        this.addItemMV(this.vsMC,this.vsMC.parent,200)

        egret.setTimeout(this.changeLine,this,1000);
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

        egret.Tween.get(this.vsMC).to({alpha:0,scaleX:2,scaleY:2}, 400).call(function(){
            this.vsMC.visible = false;
        },this)


        egret.setTimeout(this.playOne,this,1000);
    }

    private delayMove(item,x,y,cd){
        if(cd == 0)
        {
            egret.Tween.get(item).to({y:y,x:x}, 300)
            return;
        }
        egret.setTimeout(function(){
            egret.Tween.get(item).to({y:y,x:x}, 300)
        },this,cd);

    }

    private playOne(){

    }

    //加入动画
    private addItemMV(item,par,cd){
        setTimeout(function(){
            par.addChild(item);
            item.scaleX = 3;
            item.scaleY = 3;
            item.alpha = 0;
            var tw:egret.Tween = egret.Tween.get(item);
            tw.to({alpha:0.3,scaleX:1,scaleY:1}, 300).call(function(){
                item.alpha = 1;
            })
        },cd)
    }

}