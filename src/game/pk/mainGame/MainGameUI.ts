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
    private coinGroup: eui.Group;
    private myList0: eui.List;
    private chooseBtn0: eui.Button;


    public enemyArray;

    public constructor() {
        super();
        this.skinName = "MainGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('试练场PK');
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.chooseBtn0, this.onChoose1);
        this.addBtnEvent(this.coinGroup, this.onCoin);

        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.myList0.itemRenderer =  MyHeadItem;
        this.scroller.bounces = false;


        //this.enemyList.add
    }

    public beforeHide(){
        this.clearList([this.myList0,this.enemyList])
    }

    private onCoin(){
        ShopUI.getInstance().show('coin');
    }

    public show(){
        var self = this
        MainGameManager.getInstance().loadCache(UM.main_game.level,function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();
        this.addPanelOpenEvent(GameEvent.client.main_kill,this.renewEnemy)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewSelf)
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewPrice)

        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewSelf);
    }

    public renewPrice(){
        var cost = MainGameManager.getInstance().getKillCost();
        if(cost > UM.coin)
            this.setHtml(this.moneyText, '<font color="#ff0000">' + cost + '</font>/' + UM.coin);
        else
            this.moneyText.text = '' + cost + '/' + UM.coin;
    }

    private renewEnemy(){
        var MM = MainGameManager.getInstance();
        //更新敌人
        var specialData:any = {
            isNPC:true
        };
        var enemyList = this.enemyArray = [];
        var arr = MainGameVO.getObject(UM.main_game.level).list;
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            if(MM.isKill(i))
                continue;
            enemyList.push({
                vo: MonsterVO.getObject(id),
                isMain:true,
                isTeam:true,

                id: id,
                specialData: specialData,

                index: i,

                list:enemyList
            });
        }
        if(enemyList.length == 1) {
            enemyList[0].noKill = true;
            this.moneyText.text = '该单位不能被秒杀'
        }
        else
            this.renewPrice();
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


        return enemyList;
    }

    public onShow(){


        this.topUI.setTitle('试练场PK-第'+(UM.main_game.level)+'关');

        this.renewEnemy();
        this.renewSelf();

        //if(GuideManager.getInstance().isGuiding)
        //{
        //    egret.callLater(function(){
        //        this.validateNow();
        //        this.once(egret.Event.ENTER_FRAME)
                GuideManager.getInstance().showGuide(this)
        //    },this)
        //
        //}

    }

    private renewSelf(){
        var data = UM.main_game;
        if(!data.choose || !data.choose[0])
            return;
        var specialData = {};
        //更新卡组1
        var chooseList1 = [];
        PKManager.getInstance().sortMonster(data.choose[0].list);
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
    }

    private onChoose1(){
        PKDressUI.getInstance().show({pktype:'main_game',data:UM.main_game.choose[0],enemy: this.enemyArray})
    }

}