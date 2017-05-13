class MapGameUI extends game.BaseUI {
    private static instance:MapGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapGameUI();
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
    private enemyBtn: eui.Button;
    private cardText: eui.Label;
    private resetBtn: eui.Button;
    private taskText: eui.Label;
    private chooseBtn0: eui.Button;
    private taskBtn: eui.Image;








    public enemyArray;

    public constructor() {
        super();
        this.skinName = "MapGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        //this.topUI.setTitle('试练场PK');
        this.topUI.addEventListener('hide',this.onClose,this);

        this.addBtnEvent(this.chooseBtn0, this.onChoose1);
        //this.addBtnEvent(this.coinGroup, this.onCoin);


        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.myList0.itemRenderer =  MyHeadItem;
        this.scroller.bounces = false;


        //this.enemyList.add
        this.addBtnEvent(this.helpBtn,this.onHelp);
        this.addBtnEvent(this.resetBtn, this.onReset);
        this.addBtnEvent(this.enemyBtn, this.onEnemy);
        this.addBtnEvent(this.taskBtn, this.onTask);
    }

    private onTask(){
        MyCardTaskUI.getInstance().show();
    }

    private onClose(){
        var self = this;
        Confirm('确定放弃本次挑战吗？',function(type){
            if(type == 1)
            {
                self.hide();
            }
        });
    }

    private onEnemy(){
        var self = this;
        Confirm('重新搜索敌人需花费1点体力，是否继续？',function(type){
            if(type == 1)
            {
                var MM = MapManager.getInstance();
                MM.getEnemy(MM.pkLevel,function(){
                    self.renewEnemy();
                })
            }
        });

    }
    private onReset(){
        PKManager.getInstance().reChooseMyCard()
    }




    private onHelp(){
        HelpManager.getInstance().mapHelp();
    }

    public beforeHide(){
        this.clearList([this.myList0,this.enemyList])
    }

    private onCoin(){
        ShopUI.getInstance().show('coin');
    }

    public show(){
        var self = this
        //MainGameManager.getInstance().loadCache(UM.main_game.level,function(){
            self.superShow();
        //})
    }

    private superShow(){
        super.show();
        GuideManager.getInstance().enableScrollV(this.scroller);

        this.addPanelOpenEvent(GameEvent.client.main_kill,this.renewEnemy)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewSelf)
        //this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewPrice)

        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.my_card_change,this.renewSelf);
    }

    //public renewPrice(){
    //    var cost = MainGameManager.getInstance().getKillCost();
    //    if(cost > UM.coin)
    //        this.setHtml(this.moneyText, '<font color="#ff0000">' + cost + '</font>/' + UM.coin);
    //    else
    //        this.moneyText.text = '' + cost + '/' + UM.coin;
    //}

    public renewEnemy(){
        var MM = MapManager.getInstance();
        this.topUI.setTitle('据点'+MM.pkLevel + '　('+MM.getRate(MM.pkLevel)+'/'+MM.getMaxPKNum(MM.pkLevel)+')');
        //更新敌人
        var specialData:any = {
            isNPC:true,
            fight:MM.enemy.force
        };
        var enemyList = this.enemyArray = [];
        var arr = MM.enemy.list
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
        this.setHtml(this.desText,this.createHtml('敌方战力：',0xE0A44A) + MM.enemy.force);


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
        this.renewEnemy();
        this.renewSelf();
    }

    private renewSelf(){
        var myCard = UM.getMyCard();
        var specialData = {};
        //更新卡组1
        var chooseList1 = [];
        PKManager.getInstance().sortMonster(myCard.list);
        for(var i=0;i<myCard.list.length;i++)
        {
            var id = myCard.list[i]
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
        this.cardText.text = '使用次数：'+(10-myCard.num)+'/10'
        var task = myCard.task
        if(task)
            this.taskText.text = '任务进度：'+Math.min(task.current,task.num)+'/'+task.num
        else
            this.taskText.text = '';
    }

    private onChoose1(){
        //this.hide();
        PKDressUI.getInstance().show({pktype:'map_game',data:UM.pk_common.my_card,enemy: this.enemyArray})
    }

}