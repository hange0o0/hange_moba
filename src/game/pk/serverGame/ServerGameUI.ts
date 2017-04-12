class ServerGameUI extends game.BaseUI {
    private static instance:ServerGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ServerGameUI();
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
    private levelText: eui.Label;
    private helpBtn: eui.Group;
    private headMC: eui.Image;
    private enemyList: eui.List;
    private myGroup: eui.Group;
    private myList: eui.List;
    private cardTitle: eui.Label;
    private chooseMC: eui.Rect;
    private card1Btn: eui.Button;
    private card2Btn: eui.Button;
    private chooseBtn: eui.Button;









    private enemyArray
    private chooseInex

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
        this.addBtnEvent(this.card1Btn, this.onCard1);
        this.addBtnEvent(this.card2Btn, this.onCard2);

        this.enemyList.itemRenderer =  EnemyHeadItem;
        this.myList.itemRenderer =  MyHeadItem;


        this.scroller.bounces = false;
        //this.enemyList.add
        this.addBtnEvent(this.helpBtn,this.onHelp);
    }

    private onHelp(){
        HelpManager.getInstance().serverHelp();
    }


    public beforeHide(){
        this.clearList([this.myList,this.enemyList])
    }

    private onOtherInfo(){
        var gameid = UM.server_game.enemy.userinfo.gameid;
        if(gameid && gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(gameid);
    }

    private onCard1(){
        this.chooseInex = 0;
        this.renewChoose();
    }
    private onCard2(){
        this.chooseInex = 1;
        this.renewChoose();
    }

    public onShow(){
        SoundManager.getInstance().playEffect(SoundConfig.effect_button);
        var data = UM.server_game;
        this.chooseInex = 0;
        this.chooseMC.x = -3;

        //更新敌人
        var enemyList = this.enemyArray = [];
        if(!data.enemy.userinfo || data.enemy.userinfo.gameid == UM.gameid)
            data.enemy.userinfo = {head:0,nick:Base64.encode('神秘人'),level:'??',force:'???',win:'???',total:'???','exp':"???"}

        var specialData:any = {
            isBase:true
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
        this.headMC.source = MyTool.getHeadUrl(uf.head);

        this.renewChoose();


        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewChoose)
        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.renewChoose);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewChoose);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewChoose);
    }

    private renewChoose(){
        var data = UM.server_game;
        if(!data.choose || !data.choose[0])
            return;
        var specialData = {};
        //更新卡组1
        var chooseList1 = [];
        PKManager.getInstance().sortMonster(data.choose[this.chooseInex].list);
        for(var i=0;i<data.choose[this.chooseInex].list.length;i++)
        {
            var id = data.choose[this.chooseInex].list[i]
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
        var tw:egret.Tween = egret.Tween.get(this.chooseMC);

        if(this.chooseInex == 0)
        {
            this.cardTitle.text = 'PK卡组1'
            this.card1Btn.skinName = 'Btn_b2Skin'
            this.card2Btn.skinName = 'Btn_d2Skin'
            tw.to({x:this.card1Btn.x-3},100)
        }
        else
        {
            this.cardTitle.text = 'PK卡组2'
            this.card2Btn.skinName = 'Btn_b2Skin'
            this.card1Btn.skinName = 'Btn_d2Skin'
            tw.to({x:this.card2Btn.x-3},100)
        }
    }

    private onChoose(){
        PKDressUI.getInstance().show({pktype:'server_game',data:UM.server_game.choose,enemy:this.enemyArray,index:this.chooseInex})
    }
}