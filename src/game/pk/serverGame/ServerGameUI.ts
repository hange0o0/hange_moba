class ServerGameUI extends game.BaseUI {
    private static instance:ServerGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ServerGameUI();
        return this.instance;
    }

    private topUI: TopUI;
    private helpBtn: eui.Group;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup: eui.Group;
    private infoGroup: eui.Group;
    private winText: eui.Label;
    private rankText: eui.Label;
    private forceText: eui.Label;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private headMC: eui.Image;
    private enemyList: eui.List;
    private openGroup: eui.Group;
    private btnGroup: eui.Group;
    private retryBtn: eui.Button;
    private startBtn: eui.Button;
    private desText: eui.Label;
    private myCardGroup: MyCardGroupUI;
    private historyList: eui.List;
    private historyBtn: eui.Group;
    private historyText: eui.Label;
    private resetBtn: eui.Button;
    private chooseBtn: eui.Button;













    private enemyArray

    public constructor() {
        super();
        this.skinName = "ServerGameUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('竞技场PK');
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.chooseBtn, this.onChoose);
        this.addBtnEvent(this.headMC, this.onOtherInfo);

        this.addBtnEvent(this.retryBtn, this.onRetry);
        this.addBtnEvent(this.startBtn, this.onStart);

        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.historyList.itemRenderer =  DayLogItem2;


        this.scroller.bounces = false;
        //this.enemyList.add
        this.addBtnEvent(this.helpBtn,this.onHelp);
        this.addBtnEvent(this.resetBtn, this.onReset);
        //this.addBtnEvent(this.logBtn, this.onLog);
        this.historyList.addEventListener('use_card',this.onUseHistory,this)
        this.addBtnEvent(this.historyBtn,this.onHistory);
    }

    private onHistory(){
        if(this.historyList.parent)
        {
            var toV = (this.scroller.viewport.contentHeight - this.historyList.height) -this.scroller.viewport.height
            MyTool.removeMC(this.historyList)
            this.historyText.text = '挑战记录'
            this.scroller.viewport.scrollV = toV;
        }
        else
        {

            this.scrollerGroup.addChild(this.historyList)
            this.historyText.text = '收起记录'

        }
    }

    private onUseHistory(e){
        var list = e.data
        this.onChoose();
        PKDressUI.getInstance().changeChooseList(list)
    }



    public hide(){
        TaskManager.getInstance().cleanNowAcrion('server_game');
        super.hide();
    }

    private onRetry(){
        var self = this;
        ServerGameManager.getInstance().getCard(true,function(){
            self.renew();
        });
    }
    private onStart(){
        var self = this;
        ServerGameManager.getInstance().getCard(false,function(){
            ShowTips('已为你匹配到新的对手');
            self.renew();
        });
    }

    //private onLog(){
    //    DayLogUI.getInstance().show(ServerGameManager.getInstance().logList,'竞技挑战日志');
    //}

    private onReset(){
        PKManager.getInstance().reChooseMyCard()
    }

    private onHelp(){
        HelpManager.getInstance().serverHelp();
    }


    public beforeHide(){
        this.clearList([this.enemyList])
    }

    private onOtherInfo(){
        var gameid = UM.server_game.enemy.userinfo.gameid;
        if(gameid && gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(gameid);
    }

    public show(){
        var data = UM.server_game;
        var haveData = data.pk || data.choose
        if(!haveData)//未PK过
        {
            ServerGameManager.getInstance().openPKView();
            return;
        }
        super.show();
    }


    public onShow(){
        this.scroller.viewport.scrollV = 0;
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);



        this.renew();
        this.renewSelf();
        this.renewHistory();


        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewSelf)
        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewSelf);
        this.addPanelOpenEvent(GameEvent.client.my_card_change,this.renewSelf);

        if(TaskManager.getInstance().nowAction == 'server_game')
        {
            TaskManager.getInstance().showGuideMC(this.chooseBtn)
        }
    }

    private renew(){
        this.renewEnemy();
        this.renewInfo();
    }

    private renewInfo(){
        var data = UM.server_game;

        if(!data.pk && data.choose)
        {
            this.openGroup.visible = false;
            this.chooseBtn.touchEnabled = true;
            this.chooseBtn.skinName = 'Btn_r2Skin';
            return;
        }

        this.openGroup.visible = true;
        this.chooseBtn.touchEnabled = false;
        this.chooseBtn.skinName = 'Btn_d2Skin';


        MyTool.setColorText(this.desText,'你可以选择继续挑战[同一玩家]\n或重新匹配[新的玩家]作为对手');
        this.btnGroup.addChildAt(this.retryBtn,0);
        this.startBtn.label = '重新匹配'
    }

    private renewEnemy(){
        var data = UM.server_game;

        var haveData = data.pk || data.choose
        if(!haveData)//已PK过
        {
            this.infoGroup.visible = false;
            return;
        }

        this.infoGroup.visible = true;
        //更新敌人
        var enemyList = this.enemyArray = [];
        if(!data.enemy.userinfo || data.enemy.userinfo.gameid == UM.gameid)
            data.enemy.userinfo = {head:0,nick:Base64.encode('神秘人'),level:'??',force:'???',win:'???',total:'???','exp':"???"}

        var specialData:any = {
            isBase:true,
            isOther:true
        };
        var isTeam = false;
        var arr = data.enemy.base.list;
        var pkData = data.enemy.pkdata;
        if(pkData)
        {

            arr = pkData.list;
            isTeam = true;
        }
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i];
            if(isTeam)
            {
                var fight = pkData.fight;
                if(pkData.tec && pkData.tec[id])
                    fight += pkData.tec[id];
                var lv = 0;
                if(pkData.mlevel && pkData.mlevel[id])
                    lv = pkData.mlevel[id];
                specialData = PKManager.getInstance().createMonsterFight(id,fight,lv);
            }
            enemyList.push({
                vo: MonsterVO.getObject(id),
                isTeam:isTeam,
                //type:1,

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
        if(uf.level == '??')
            this.levelText.text = '';
        else
            this.levelText.text = '(LV.'+uf.level+')';

        var winStr
        if(uf.win == '???')
            winStr = '??';
        else
        {
            if(uf.win == 0)
                winStr = '0%';
            else
                winStr = MyTool.toFixed(uf.win/uf.total*100,1) + '%';
        }
        MyTool.setColorText(this.winText,'[胜率：]'+ winStr);
        MyTool.setColorText(this.rankText,'[积分：]'+ uf.exp);
        MyTool.setColorText(this.forceText,'[战力：]'+ uf.force);
        this.headMC.source = MyTool.getHeadUrl(uf.head);
    }

    private renewSelf(){
        this.myCardGroup.renew();
    }
    private renewHistory(){
        var arr = ServerGameManager.getInstance().logList;
        var list = [];

        var enemy = UM.server_game.enemy;
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

        if(list.length)
        {
            this.scrollerGroup.addChild(this.historyBtn)
        }
        else
            MyTool.removeMC(this.historyBtn)
        MyTool.removeMC(this.historyList)
        this.historyText.text = '挑战记录'
    }

    public onChoose(){
        //this.hide();
        PKDressUI.getInstance().show({pktype:'server_game',data:UM.pk_common.my_card,enemy:this.enemyArray})
    }
}