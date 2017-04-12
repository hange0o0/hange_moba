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
    private desText: eui.Label;
    private enemyList: eui.List;
    private myGroup0: eui.Group;
    private myList0: eui.List;
    private chooseBtn0: eui.Button;
    private helpBtn: eui.Group;



    private enemyArray;
    private quickStart

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

        this.scroller.bounces = false;
        //this.enemyList.add
        this.addBtnEvent(this.helpBtn,this.onHelp);
    }

    private onHelp(){
        HelpManager.getInstance().dayHelp();
    }

    public beforeHide(){
        this.clearList([this.myList0,this.enemyList])
    }

    private onRing1(){

    }
    
    private onRing2(){

    }

    public show(v?){
        this.quickStart = v
        var self = this;
        DayGameManager.getInstance().getDayGame(function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);
        var DM = DayGameManager.getInstance();
        var myData = UM.day_game;
        this.desText.text = '当前进度：' + myData.level + '/10'
        //更新敌人
        var specialData:any = {
            isNPC:true,
            fight:(myData.level + 1 - 1)*15 + Config.equalValue
        };
        var enemyList = this.enemyArray = [];
        var arr = DM.data.levels[myData.level].list;
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            enemyList.push({
                vo: MonsterVO.getObject(id),
                isTeam:true,

                id: id,
                specialData: specialData,

                index: i,
                list:enemyList
            });
        }
        this.enemyList.dataProvider = new eui.ArrayCollection(enemyList);

        if(enemyList.length <4)
        {
            (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 0;
            (<eui.TileLayout>this.enemyList.layout).requestedRowCount = 1
        }
        else
        {
            (<eui.TileLayout>this.enemyList.layout).requestedRowCount = 2;
            if(enemyList.length ==4)
                (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 2
            else
                (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 3
        }

        specialData = {
            isEqual:true
        };
        //更新卡组1
        var data = DM.data;
        var chooseList1 = [];
        PKManager.getInstance().sortMonster(data.choose.list);
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
        if(this.quickStart){
            this.onChoose1();
            this.hide();
        }

    }

    private onChoose1(){
        PKDressUI.getInstance().show({pktype:'day_game',data:[DayGameManager.getInstance().data.choose],enemy: this.enemyArray,isEqual:true})
    }

}