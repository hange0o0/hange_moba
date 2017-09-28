class MapGameUI extends game.BaseUI {
    private static instance:MapGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapGameUI();
        return this.instance;
    }

    private topUI: TopUI;
    private enemyBtn: eui.Button;
    private resetBtn: eui.Button;
    private chooseBtn: eui.Button;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private desText: eui.Label;
    private enemyList: eui.List;
    private helpBtn: eui.Group;
    private historyList: eui.List;
    private myCardGroup: MyCardGroupUI;
    private leaderText: eui.Label;










    public enemyArray;

    public constructor() {
        super();
        this.skinName = "MapGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        //this.topUI.setTitle('试练场PK');
        this.topUI.addEventListener('hide',this.onClose,this);

        this.addBtnEvent(this.chooseBtn, this.onChoose1);
        //this.addBtnEvent(this.coinGroup, this.onCoin);


        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.historyList.itemRenderer =  DayLogItem2;
        this.scroller.bounces = false;


        //this.enemyList.add
        this.addBtnEvent(this.helpBtn,this.onHelp);
        this.addBtnEvent(this.resetBtn, this.onReset);
        this.addBtnEvent(this.enemyBtn, this.onEnemy);
        this.historyList.addEventListener('use_card',this.onUseHistory,this)
    }

    private onUseHistory(e){
        var list = e.data
        this.onChoose1();
        PKDressUI.getInstance().changeChooseList(list)
    }


    private onClose(){
        var self = this;
        //Confirm('确定放弃本次挑战吗？',function(type){
        //    if(type == 1)
        //    {
                self.hide();
                //MapMainUI.getInstance().show();
        //    }
        //});
    }

    private onEnemy(){
        var self = this;
        Confirm('重新搜寻敌人需花费'+this.createHtml('1',0xE0A44A)+'个通辑令，是否继续？',function(type){
            if(type == 1)
            {
                var MM = MapManager.getInstance();
                MM.getEnemy(function(){
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
        this.clearList([this.enemyList])
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
        var MD = MapData.getInstance();
        this.topUI.setTitle('据点 '+MD.level + ' 通辑令');
        //更新敌人
        //var specialData:any = {
        //    isNPC:true,
        //    fight:MD.enemy.force
        //};
        var enemyList = this.enemyArray = [];
        var arr = MD.enemy.list

        var fight = MD.enemy.force;
        var lv = MonsterManager.getInstance().getEnemyMonsterLevel(fight);
        var leader = MonsterManager.getInstance().getEnemyMonsterLeader(fight);
        if(leader)
            MyTool.setColorText(this.leaderText,'[统\n帅\n▼]\n'+ leader);
        else
            this.leaderText.text = '';
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            enemyList.push({
                vo: MonsterVO.getObject(id),
                isTeam:true,

                id: id,
                specialData:{
                    isNPC:true,
                    fight:fight,
                    lv:lv,
                    leader:leader,
                },

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


        return enemyList;
    }

    public renewForce(){
        var MD = MapData.getInstance();

        var enemyForce = MD.enemy.force;
        var myForce = UM.getForce();

        var str = '[关卡战力:]' + enemyForce;

        if(enemyForce < myForce)
            str += this.createHtml('(+'+(myForce - enemyForce)+')',0x00cc00)
        else if(enemyForce > myForce)
            str += this.createHtml('(-'+(enemyForce-myForce)+')',0xCC0000)

        if(MD.enemy.skill)
            str += '　[队伍技能:]' + LeaderSkillVO.getObject(MD.enemy.skill).name;

        MyTool.setColorText(this.desText,str);
    }

    public onShow(){
        this.renewEnemy();
        this.renewSelf();
        this.renewHistory();
        this.scroller.viewport.scrollV = 0;
    }

    private renewSelf(){
        this.myCardGroup.renew();
        this.renewForce();
    }
    private renewHistory(){
        var MD =  MapData.getInstance();
        var arr = MapManager.getInstance().logList;
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            var data = arr[i];
            if(data.sp.round == MD.level && MD.enemy.list.join(',') == data.team2Base.list.join(','))
                list.push(data)
        }
        if(list.length > 5)
            list.length = 5;
        this.historyList.dataProvider = new eui.ArrayCollection(list);
    }

    private onChoose1(){
        //this.hide();
        PKDressUI.getInstance().show({pktype:'map_game',data:UM.pk_common.my_card,enemy: this.enemyArray})
    }

}