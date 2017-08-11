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
    private helpBtn: eui.Group;
    private myGroup0: eui.Group;
    private myList0: eui.List;
    private historyList: eui.List;
    private chooseBtn0: eui.Button;





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
        //this.addBtnEvent(this.todayBtn, this.onLog);

        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.myList0.itemRenderer =  MyHeadItem;
        this.historyList.itemRenderer =  DayLogItem;

        this.scroller.bounces = false;
        //this.enemyList.add
        this.addBtnEvent(this.helpBtn,this.onHelp);
    }



    public hide(){
        TaskManager.getInstance().cleanNowAcrion('day_game');
        super.hide();
    }

    private onHelp(){
        HelpManager.getInstance().dayHelp();
    }

    public beforeHide(){
        this.clearList([this.myList0,this.enemyList])
    }

    private onLog(){
        DayLogUI.getInstance().show(DayGameManager.getInstance().logList,'每日挑战日志');
    }
    
    private onRing2(){

    }

    public show(v?){
        if(UM.day_game.level == 10)
        {
            Alert('已通关，明天继续')
            return;
        }
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
        this.scroller.viewport.scrollV = 0;
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);
        var DM = DayGameManager.getInstance();
        var myData = UM.day_game;
        this.desText.text = '当前进度：' + myData.level + '/10'
        //更新敌人
        var specialData:any = {
            isNPC:true,
            fight:(myData.level + 1 - 3)*35 + Config.equalValue
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

        this.renewHistory();

        if(TaskManager.getInstance().nowAction == 'day_game')
        {
            TaskManager.getInstance().showGuideMC(this.chooseBtn0)
        }
    }

    private renewHistory(){
        var arr = DayGameManager.getInstance().logList;
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            var data = arr[i];
            if(data.sp.round == (UM.day_game.level + 1) && DateUtil.formatDate('yyyy-MM-dd', DateUtil.timeToChineseDate(data.time)) == DateUtil.formatDate('yyyy-MM-dd', TM.chineseDate()))
                list.push(data)
        }
        if(list.length > 5)
            list.length = 5;
        this.historyList.dataProvider = new eui.ArrayCollection(list);
    }

    private onChoose1(){
        //this.hide();
        var self = this;
        var upFun = function(){
            PKDressUI.getInstance().show({pktype:'day_game',data:[DayGameManager.getInstance().data.choose],enemy: self.enemyArray,isEqual:true})
        }
        var addForce = 1
        if(MainGameManager.getInstance().testMainAdd(addForce,'挑战胜利后',upFun))
            return;
        upFun();
    }

}