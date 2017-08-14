class TeamDungeonGameUI extends game.BaseUI {
    private static instance:TeamDungeonGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TeamDungeonGameUI();
        return this.instance;
    }

    private topUI: TopUI;
    private resetBtn: eui.Button;
    private chooseBtn: eui.Button;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private desText: eui.Label;
    private enemyList: eui.List;
    private historyList: eui.List;
    private myCardGroup: MyCardGroupUI;







    public data
    public type
    public enemyArray;

    public constructor() {
        super();
        this.skinName = "TeamDungeonGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('公会评定');
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.chooseBtn, this.onChoose1);


        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.historyList.itemRenderer =  DayLogItem;
        this.scroller.bounces = false;


        //this.enemyList.add
        this.addBtnEvent(this.resetBtn, this.onReset);
        //this.addBtnEvent(this.logBtn, this.onLog);
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
        this.clearList([this.enemyList])
    }

    private onCoin(){
        ShopUI.getInstance().show('coin');
    }

    public show(data?,type?){
        this.data = data;
        this.type = type;
        var self = this
        self.superShow();
    }

    private superShow(){
        super.show();



        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewSelf)

        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.my_card_change,this.renewSelf);
    }



    public renewEnemy(){
        var MM = MainGameManager.getInstance();
        //更新敌人
        //var specialData:any = {isOther:true};
        var enemyList = this.enemyArray = [];
        if(this.type == 'pve')
        {
            var PVEM = TeamPVEManager.getInstance();
            //specialData = {
            //    isNPC:true,
            //    fight:TeamDungeonManager.getInstance().getEnemyForce(PVEM.data.game_data.hard,this.data.index)
            //};

            var fight = TeamDungeonManager.getInstance().getEnemyForce(PVEM.data.game_data.hard,this.data.index)
            var lv = MonsterManager.getInstance().getEnemyMonsterLevel(fight);

            for(var i=0;i<this.data.list.length;i++)
            {
                var id = this.data.list[i];
                enemyList.push({
                    vo: MonsterVO.getObject(id),
                    isTeam:true,

                    id: id,
                    specialData:{
                        isNPC:true,
                        fight:fight,
                        lv:lv,
                    },
                    index: i,
                    list:enemyList
                });
            }
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
        var name = TeamDungeonManager.DungeonName[this.type] + ' - ' + this.data.index;
        this.topUI.setTitle(name);
        //var hard = TeamPVEManager.getInstance().data.game_data.hard;
        //this.desText.text = '敌方战力：' + TeamDungeonManager.getInstance().getEnemyForce(hard,this.data.index);
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);
        this.renewEnemy();
        this.renewSelf();
        this.renewHistory();
        this.scroller.viewport.scrollV = 0;
    }

    public renewForce(){

        var enemyForce = MainGameManager.getInstance().getMainForce()
        var myForce = UM.getForce();

        var hard = TeamPVEManager.getInstance().data.game_data.hard;
        var str = '[关卡战力:]' + TeamDungeonManager.getInstance().getEnemyForce(hard,this.data.index);

        if(enemyForce < myForce)
            str += this.createHtml('(+'+(myForce - enemyForce)+')',0xCC0000)
        else if(enemyForce > myForce)
            str += this.createHtml('(-'+(enemyForce-myForce)+')',0x00cc00)

        MyTool.setColorText(this.desText,str);
    }

    private renewSelf(){
        var hard = TeamPVEManager.getInstance().data.game_data.hard;
        this.myCardGroup.renew({hard:hard});
        this.renewForce();
    }

    private renewHistory(){
        var arr = TeamPVEManager.getInstance().logList;
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            var data = arr[i];
            if(data.sp.round == this.data.index && DateUtil.formatDate('yyyy-MM-dd', DateUtil.timeToChineseDate(data.time)) == DateUtil.formatDate('yyyy-MM-dd', TM.chineseDate()))
                list.push(data)
        }
        if(list.length > 5)
            list.length = 5;
        this.historyList.dataProvider = new eui.ArrayCollection(list);
    }

    private onChoose1(){
        //this.hide();
        var hard = TeamPVEManager.getInstance().data.game_data.hard;
        PKDressUI.getInstance().show({pktype:'pve_game',data:UM.pk_common.my_card,enemy: this.enemyArray,hard:hard})
    }

}