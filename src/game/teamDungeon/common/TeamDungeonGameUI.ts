class TeamDungeonGameUI extends game.BaseUI {
    private static instance:TeamDungeonGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TeamDungeonGameUI();
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
    private cardText: eui.Label;
    private resetBtn: eui.Button;
    private taskText: eui.Label;
    private chooseBtn0: eui.Button;
    private taskBtn: eui.Image;







    public enemyArray;

    public constructor() {
        super();
        this.skinName = "TeamDungeonGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('公会评定');
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.chooseBtn0, this.onChoose1);


        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.myList0.itemRenderer =  MyHeadItem;
        this.scroller.bounces = false;


        //this.enemyList.add
        this.addBtnEvent(this.resetBtn, this.onReset);
        //this.addBtnEvent(this.logBtn, this.onLog);
        this.addBtnEvent(this.taskBtn, this.onTask);
    }

    private onTask(){
        MyCardTaskUI.getInstance().show();
    }


    private onReset(){
        PKManager.getInstance().reChooseMyCard()
    }


    public scrollToEnd(){
      if(this.scroller.viewport.height < this.scroller.viewport.contentHeight)
            this.scroller.viewport.scrollV =  this.scroller.viewport.contentHeight -  this.scroller.viewport.height;
    }



    private onHelp(){
        HelpManager.getInstance().mainHelp();
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

        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.my_card_change,this.renewSelf);
    }



    public renewEnemy(){
        var MM = MainGameManager.getInstance();
        //更新敌人
        var specialData:any = {
            isNPC:true
        };
        var enemyList = this.enemyArray = [];
        var arr = MainGameVO.getObject(UM.main_game.level).list;
        var killNum = 0;
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            if(MM.isKill(i))
            {
                killNum ++;
                continue;
            }
            enemyList.push({
                vo: MonsterVO.getObject(id),
                isMain:true,
                isTeam:true,

                id: id,
                specialData: specialData,

                index: i-killNum,

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


        return enemyList;
    }

    public onShow(){
        GuideManager.getInstance().enableScrollV(this.scroller);
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);
        this.topUI.setTitle('公会评定-第'+(UM.main_game.level)+'关');

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
        var hard;
        var myCard = UM.getMyCard();
        var specialData = {hard:hard};
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
        var hard;
        PKDressUI.getInstance().show({pktype:'main_game',data:UM.pk_common.my_card,enemy: this.enemyArray,hard:hard})
    }

}