class ServerGameUI extends game.BaseUI {
    private static instance:ServerGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ServerGameUI();
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
    private ringText0: eui.Label;
    private ringText1: eui.Label;
    private myGroup1: eui.Group;
    private myTitleText1: eui.Label;
    private chooseBtn1: eui.Button;
    private myList1: eui.List;
    private ringText2: eui.Label;
    private ringText3: eui.Label;


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

        this.addBtnEvent(this.ringText0,this.onRing1);
        this.addBtnEvent(this.ringText1,this.onRing2);
        this.addBtnEvent(this.ringText2,this.onRing3);
        this.addBtnEvent(this.ringText3,this.onRing4);

        //this.enemyList.add
    }

    private onRing1(){

    }
    private onRing2(){

    }
    private onRing3(){

    }
    private onRing4(){

    }

    public onShow(){
        var data = UM.server_game;

        //更新敌人
        var enemyList = [];
        if(!data.enemy.userinfo || data.enemy.userinfo.gameid == UM.openid)
            data.enemy.userinfo = {head:1,nick:'神秘人',level:'???',force:'???',win:'???',total:'???','exp':"???"}
        for(var i=0;i<data.enemy.base.list.length;i++)
        {
            enemyList.push({id:data.enemy.base.list[i],type:1});
        }
        this.enemyList.dataProvider = new eui.ArrayCollection(enemyList);
        var uf = data.enemy.userinfo;
        this.nameText.text = uf.nick;
        this.levelText.text = uf.level;
        this.winText.text = uf.win;
        this.rankText.text = uf.exp;
        this.forceText.text = uf.force;
        this.headMC.source = MyTool.getHeadUrl(uf.head);

        //更新卡组1
        var chooseList1 = [];
        for(var i=0;i<data.choose[0].list.length;i++)
        {
            chooseList1.push({id:data.choose[0].list[i],type:1});
        }
        this.myList0.dataProvider = new eui.ArrayCollection(chooseList1);
        this.ringText0.text = RingVO.getObject(data.choose[0].ring[0]).name
        this.ringText1.text = RingVO.getObject(data.choose[0].ring[1]).name


        //更新卡组2
        var chooseList2 = [];
        for(var i=0;i<data.choose[1].list.length;i++)
        {
            chooseList2.push({id:data.choose[1].list[i],type:1});
        }
        this.myList1.dataProvider = new eui.ArrayCollection(chooseList2);
        this.ringText2.text = RingVO.getObject(data.choose[1].ring[0]).name
        this.ringText3.text = RingVO.getObject(data.choose[1].ring[1]).name


    }

    private onChoose1(){
        PKDressUI.getInstance().show({pktype:'server_game',data:UM.server_game.choose[0],enemy:UM.server_game.enemy.base.list})
    }

    private onChoose2(){
        PKDressUI.getInstance().show({pktype:'server_game',data:UM.server_game.choose[1],enemy:UM.server_game.enemy.base.list})
    }
}