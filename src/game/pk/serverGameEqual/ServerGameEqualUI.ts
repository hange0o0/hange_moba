class ServerGameEqualUI extends game.BaseUI {
    private static instance:ServerGameEqualUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ServerGameEqualUI();
        return this.instance;
    }

    private topUI: TopUI;
    private helpBtn: eui.Group;
    private resetBtn: eui.Button;
    private chooseBtn: eui.Button;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private infoGroup: eui.Group;
    private winText: eui.Label;
    private rankText: eui.Label;
    private forceText: eui.Label;
    private nameText: eui.Label;
    private maxText: eui.Label;
    private headMC: eui.Image;
    private enemyList: eui.List;
    private openGroup: eui.Group;
    private btnGroup: eui.Group;
    private retryBtn: eui.Button;
    private startBtn: eui.Button;
    private desText: eui.Label;
    private myCardGroup: MyCardGroupUI;
    private historyList: eui.List;












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
        this.historyList.itemRenderer =  DayLogItem;

        this.enemyList.itemRenderer =  EnemyHeadItem;


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
        this.clearList([this.enemyList])
    }


    private onOtherInfo(){
        var gameid = UM.server_game_equal.enemy.userinfo.gameid;
        if(gameid && gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(gameid);
    }

    public onShow(){
        this.scroller.viewport.scrollV = 0;
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);
        var data = UM.server_game_equal;


        //更新敌人
        var enemyList = this.enemyArray = [];
        if(!data.enemy.userinfo || data.enemy.userinfo.gameid == UM.gameid)
            data.enemy.userinfo = {head:0,nick:Base64.encode('神秘人'),level:'???',force:'???',win:'???',total:'???','exp':"???",max:'???'}
        var specialData = {
            isOther:true,
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
        var winStr;
        if(uf.win == '???')
            winStr = '??';
        else
        {
            if(uf.win == 0)
                winStr = '0%';
            else
                winStr = MyTool.toFixed(uf.win/uf.total*100,1) + '%';
        }

        this.maxText.text = '(LV.'+uf.level+')';// + uf.max;

        MyTool.setColorText(this.winText,'[胜率：]'+ winStr);
        MyTool.setColorText(this.rankText,'[积分：]'+ uf.exp);
        MyTool.setColorText(this.forceText,'[战力：]'+ uf.force);


        this.headMC.source = MyTool.getHeadUrl(uf.head);

        this.renewSelf();
        this.renewHistory();
        this.addPanelOpenEvent(GameEvent.client.my_card_change,this.renewSelf);
    }



    private renewSelf(){
        this.myCardGroup.renew({isEqual:true});
    }
    private renewHistory(){
        var arr = ServerGameEqualManager.getInstance().logList;
        var list = [];

        var enemy = UM.server_game_equal.enemy;
        if(enemy.pkdata)
        {
            for(var i=0;i<arr.length;i++)
            {
                var data = arr[i];
                if(data.sp.gameid == enemy.userinfo.gameid && enemy.pkdata.list.join(',') == data.team2Base.list.join(','))
                    list.push(data)
            }
        }
        if(list.length > 5)
            list.length = 5;
        this.historyList.dataProvider = new eui.ArrayCollection(list);
    }

    private onChoose(){
        //this.hide();
        PKDressUI.getInstance().show({pktype:'server_game_equal',data:UM.pk_common.my_card,enemy:this.enemyArray,isEqual:true})
    }

}