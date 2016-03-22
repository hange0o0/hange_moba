class ServerGameUI extends game.BaseUI {
    private static instance:DebugUI;
    public static getInstance() {
        if (!this.instance) this.instance = new DebugUI();
        return this.instance;
    }
    
    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private winText: eui.Label;
    private rankText: eui.Label;
    private forceText: eui.Label;
    private headMC: eui.Image;
    private enemyList: eui.List;
    private myGroup0: eui.Group;
    private myTitleText0: eui.Label;
    private chooseBtn0: eui.Button;
    private myList0: eui.List;
    private myGroup1: eui.Group;
    private myTitleText1: eui.Label;
    private chooseBtn1: eui.Button;
    private myList1: eui.List;


    public constructor() {
        super();
        this.skinName = "ServerGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('竞技场PK');
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.chooseBtn0, this.onChoose1);
        this.addBtnEvent(this.chooseBtn1, this.onChoose2);

        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.myList0.itemRenderer =  MyHeadItem;
        this.myList1.itemRenderer =  MyHeadItem;
    }

    public onShow(){
        var data = UM.server_game;

        //更新敌人
        var enemyList = [];
        for(var i=0;i<data.enemy.length;i++)
        {
            enemyList.push({id:data.enemy[i],type:1});
        }
        this.enemyList.dataProvider = new eui.ArrayCollection(enemyList);

        //更
        var chooseList1 = [];
        for(var i=0;i<data.choose[0].length;i++)
        {
            enemyList.push({id:data.enemy[i],type:1});
        }


    }

    private onChoose1(){

    }

    private onChoose2(){

    }
}