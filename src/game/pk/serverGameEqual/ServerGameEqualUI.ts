class ServerGameEqualUI extends game.BaseUI {
    private static instance:ServerGameEqualUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ServerGameEqualUI();
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
    private maxText: eui.Label;
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



    private enemyArray

    public constructor() {
        super();
        this.skinName = "ServerGameEqualUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('修正场PK');
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.chooseBtn0, this.onChoose1);
        this.addBtnEvent(this.chooseBtn1, this.onChoose2);
        this.addBtnEvent(this.headMC, this.onOtherInfo);

        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.myList0.itemRenderer =  MyHeadItem;
        this.myList1.itemRenderer =  MyHeadItem;



        //this.enemyList.add


    }

    private onOtherInfo(){
        var gameid = UM.server_game_equal.enemy.userinfo.gameid;
        if(gameid && gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(gameid);
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
        var data = UM.server_game_equal;

        //更新敌人
        var enemyList = this.enemyArray = [];
        if(!data.enemy.userinfo || data.enemy.userinfo.gameid == UM.gameid)
            data.enemy.userinfo = {head:'???',nick:'神秘人',level:'???',force:'???',win:'???',total:'???','exp':"???",max:'???'}
        var specialData = {
            isEqual:true
        };
        for(var i=0;i<data.enemy.base.list.length;i++)
        {
            var id = data.enemy.base.list[i];
            enemyList.push({
                vo: MonsterVO.getObject(id),
                type:1,

                id: id,
                specialData: specialData,

                index: i,
                list:enemyList
            });
        }
        this.enemyList.dataProvider = new eui.ArrayCollection(enemyList);
        var uf = data.enemy.userinfo;
        this.nameText.text = uf.nick;
        this.levelText.text = uf.level;
        this.winText.text = uf.win;
        this.rankText.text = uf.exp;
        this.forceText.text = uf.force;
        this.maxText.text = uf.max;
        this.headMC.source = MyTool.getHeadUrl(uf.head);

        //更新卡组1
        var chooseList1 = [];
        for(var i=0;i<data.choose[0].list.length;i++)
        {
            var id = data.choose[0].list[i]
            chooseList1.push({
                vo: MonsterVO.getObject(id),
                type:1,

                id: id,
                specialData: specialData,

                index: i,
                list:chooseList1
            });
        }
        this.myList0.dataProvider = new eui.ArrayCollection(chooseList1);



        //更新卡组2
        var chooseList2 = [];
        for(var i=0;i<data.choose[1].list.length;i++)
        {
            var id = data.choose[1].list[i]
            chooseList2.push({
                vo: MonsterVO.getObject(id),
                type:1,

                id: id,
                specialData: specialData,

                index: i,
                list:chooseList2
            });
        }
        this.myList1.dataProvider = new eui.ArrayCollection(chooseList2);



    }

    private onChoose1(){
        PKDressUI.getInstance().show({pktype:'server_game_equal',data:UM.server_game_equal.choose[0],enemy:this.enemyArray,index:0})
    }

    private onChoose2(){
        PKDressUI.getInstance().show({pktype:'server_game_equal',data:UM.server_game_equal.choose[1],enemy:this.enemyArray,index:1})
    }
}