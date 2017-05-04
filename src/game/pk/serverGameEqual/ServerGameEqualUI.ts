class ServerGameEqualUI extends game.BaseUI {
    private static instance:ServerGameEqualUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ServerGameEqualUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private winText: eui.Label;
    private rankText: eui.Label;
    private forceText: eui.Label;
    private nameText: eui.Label;
    private maxText: eui.Label;
    private headMC: eui.Image;
    private helpBtn: eui.Group;
    private enemyList: eui.List;
    private myGroup: eui.Group;
    private myList: eui.List;
    private cardText: eui.Label;
    private resetBtn: eui.Button;
    private chooseBtn: eui.Button;
    //private logBtn: eui.Button









    private enemyArray

    public constructor() {
        super();
        this.skinName = "ServerGameEqualUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('修正场PK');
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.chooseBtn, this.onChoose);
        this.addBtnEvent(this.headMC, this.onOtherInfo);

        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.myList.itemRenderer =  MyHeadItem;


        this.scroller.bounces = false;

        //this.enemyList.add

        this.addBtnEvent(this.helpBtn,this.onHelp);
        this.addBtnEvent(this.resetBtn, this.onReset);
        //this.addBtnEvent(this.logBtn, this.onLog);
    }

    private onLog(){
        DayLogUI.getInstance().show(ServerGameEqualManager.getInstance().logList,'修正挑战日志');
    }

    private onReset(){
        PKManager.getInstance().reChooseMyCard()
    }

    private onHelp(){
        HelpManager.getInstance().serverEqualHelp();
    }

    public beforeHide(){
        this.clearList([this.myList,this.enemyList])
    }


    private onOtherInfo(){
        var gameid = UM.server_game_equal.enemy.userinfo.gameid;
        if(gameid && gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(gameid);
    }

    public onShow(){
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);
        var data = UM.server_game_equal;


        //更新敌人
        var enemyList = this.enemyArray = [];
        if(!data.enemy.userinfo || data.enemy.userinfo.gameid == UM.gameid)
            data.enemy.userinfo = {head:0,nick:Base64.encode('神秘人'),level:'???',force:'???',win:'???',total:'???','exp':"???",max:'???'}
        var specialData = {
            isEqual:true
        };
        var isTeam = false;
        var arr = data.enemy.base.list;
        if(data.enemy.pkdata)
        {
            arr = data.enemy.pkdata.list;
            isTeam = true;
        }
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i];
            enemyList.push({
                vo: MonsterVO.getObject(id),
                isTeam:isTeam,

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
            else if(enemyList.length <=6)
                (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 3
            else
                (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 4
        }




        var uf = data.enemy.userinfo;
        this.nameText.text = Base64.decode(uf.nick);
        //this.levelText.text = uf.level;
        if(uf.win == '???')
            this.winText.text = '??';
        else
        {
            if(uf.win == 0)
                this.winText.text = '0%';
            else
                this.winText.text = MyTool.toFixed(uf.win/uf.total*100,1) + '%';
        }
        this.rankText.text = uf.exp;
        this.forceText.text = uf.force;
        this.maxText.text = '(LV.'+uf.level+')';// + uf.max;
        this.headMC.source = MyTool.getHeadUrl(uf.head);

        this.renewChoose();
        this.addPanelOpenEvent(GameEvent.client.my_card_change,this.renewChoose);
    }

    private renewChoose(){
        var myCard = UM.getMyCard();
        var specialData = {isEqual:true};
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
        this.myList.dataProvider = new eui.ArrayCollection(chooseList1);
        this.cardText.text = '剩余次数：'+myCard.num+'/10'
    }

    private onChoose(){
        //this.hide();
        PKDressUI.getInstance().show({pktype:'server_game_equal',data:UM.pk_common.my_card,enemy:this.enemyArray,isEqual:true})
    }

}