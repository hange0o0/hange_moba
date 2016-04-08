class MainGameUI extends game.BaseUI {
    private static instance:MainGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MainGameUI();
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
        this.skinName = "MainGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('试练场PK');
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.chooseBtn0, this.onChoose1);

        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.myList0.itemRenderer =  MyHeadItem;

        this.addBtnEvent(this.ringText0,this.onRing1);
        this.addBtnEvent(this.ringText1,this.onRing2);

        //this.enemyList.add
    }

    private onRing1(){

    }
    private onRing2(){

    }

    public onShow(){
        var data = UM.server_game;

        this.levelText.text = '第'+(UM.main_game.level + 1)+'关'
        //更新敌人
        var enemyList = [];
        var arr = MainGameVO.getObject(UM.main_game.level + 1).list;
        for(var i=0;i<arr.length;i++)
        {
            enemyList.push({id:arr,type:2});
        }
        this.enemyList.dataProvider = new eui.ArrayCollection(enemyList);

        //更新卡组1
        var chooseList1 = [];
        for(var i=0;i<data.choose[0].list.length;i++)
        {
            chooseList1.push({id:data.choose[0].list[i],type:1});
        }
        this.myList0.dataProvider = new eui.ArrayCollection(chooseList1);
        this.ringText0.text = RingVO.getObject(data.choose[0].ring[0]).name;
        this.ringText1.text = RingVO.getObject(data.choose[0].ring[1]).name;

    }

    private onChoose1(){
        PKDressUI.getInstance().show({pktype:'main_game',data:UM.server_game_equal.choose[0],enemy: MainGameVO.getObject(UM.main_game.level + 1).list})
    }

}