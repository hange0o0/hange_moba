class DayGameUI extends game.BaseUI {
    private static instance:DayGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new DayGameUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private moneyText: eui.Label;
    private enemyList: eui.List;
    private myGroup0: eui.Group;
    private myList0: eui.List;
    private ringText0: eui.Label;
    private ringText1: eui.Label;
    private chooseBtn0: eui.Button;


    private enemyArray;

    public constructor() {
        super();
        this.skinName = "DayGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('今日挑战');
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

    public show(){
        var self = this;
        DayGameManager.getInstance().getDayGame(function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        var DM = DayGameManager.getInstance();
        var myData = UM.day_game;
        this.moneyText.text = '当前进度：' + myData.level + '/10';
        //更新敌人
        var specialData:any = {
            isNPC:true,
            fight:(myData.level + 1 - 1)*9 + Config.equalValue
        };
        var enemyList = this.enemyArray = [];
        var arr = DM.data.levels[myData.level].list;
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            enemyList.push({
                vo: MonsterVO.getObject(id),
                type:2,

                id: id,
                specialData: specialData,

                index: i,
                list:enemyList
            });
        }
        this.enemyList.dataProvider = new eui.ArrayCollection(enemyList);

        specialData = {
            isEqual:true
        };
        //更新卡组1
        var data = DM.data;
        var chooseList1 = [];
        for(var i=0;i<data.choose.list.length;i++)
        {
            var id = data.choose.list[i]
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
        this.ringText0.text = RingVO.getObject(data.choose.ring[0]).name;
        this.ringText1.text = RingVO.getObject(data.choose.ring[1]).name;

    }

    private onChoose1(){
        PKDressUI.getInstance().show({pktype:'day_game',data:DayGameManager.getInstance().data.choose,enemy: this.enemyArray})
    }

}