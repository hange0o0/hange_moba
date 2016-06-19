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

    public show(){
        var self = this
        MainGameManager.getInstance().loadCache(UM.main_game.level,function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();
    }

    public renewPrice(){
        this.moneyText.text = '本次秒杀价格：' + MainGameManager.getInstance().getKillCost();
    }

    public onShow(){
        var MM = MainGameManager.getInstance();
        var data = UM.main_game;
        this.topUI.setTitle('试练场PK-第'+(UM.main_game.level + 1)+'关');
        this.renewPrice();
        //更新敌人
        var specialData:any = {
            isNPC:true
        };
        var enemyList = this.enemyArray = [];
        var arr = MainGameVO.getObject(UM.main_game.level + 1).list;
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            enemyList.push({
                vo: MonsterVO.getObject(id),
                type:2,

                id: id,
                specialData: specialData,

                index: i,
                list:enemyList,

                isKill:MM.isKill(i)
            });
        }
        this.enemyList.dataProvider = new eui.ArrayCollection(enemyList);

        specialData = {};
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
        this.ringText0.text = '技能1：' +RingVO.getObject(data.choose[0].ring[0]).name;
        this.ringText1.text = '技能2：' +RingVO.getObject(data.choose[0].ring[1]).name;

    }

    private onChoose1(){
        PKDressUI.getInstance().show({pktype:'main_game',data:UM.main_game.choose[0],enemy: this.enemyArray})
    }

}