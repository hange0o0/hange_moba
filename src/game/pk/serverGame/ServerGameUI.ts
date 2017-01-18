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
    private levelText: eui.Label;
    private winText: eui.Label;
    private forceText: eui.Label;
    private nameText: eui.Label;
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
        var data = UM.server_game;
        this.chooseInex = 0;
        this.chooseMC.x = -3;

        //更新敌人
        var enemyList = this.enemyArray = [];
        if(!data.enemy.userinfo || data.enemy.userinfo.gameid == UM.gameid)
            data.enemy.userinfo = {head:'???',nick:Base64.encode('神秘人'),level:'???',force:'???',win:'???',total:'???','exp':"???"}

        var specialData:any = {
            isBase:true
        };
        for(var i=0;i<data.enemy.base.list.length;i++)
        {
            var id = data.enemy.base.list[i];
            enemyList.push({
                vo: MonsterVO.getObject(id),
                type:1,

                id: id,
                specialData: specialData,

                index: i,
                list:enemyList
            });
        }
        this.enemyList.dataProvider = new eui.ArrayCollection(enemyList);
        var uf = data.enemy.userinfo;
        this.nameText.text = Base64.decode(uf.nick);
        this.levelText.text = uf.level;
        this.winText.text = uf.win;
        //this.rankText.text = uf.exp;
        this.forceText.text = uf.force;
        this.headMC.source = MyTool.getHeadUrl(uf.head);

        this.renewChoose();


        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewChoose)
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
            this.cardTitle.text = '卡组1'
            //this.card1Btn.skinName = 'Btn_r2Skin'
            //this.card2Btn.skinName = 'Btn_b2Skin'
            tw.to({x:this.card1Btn.x-3},100)
        }
        else
        {
            this.cardTitle.text = '卡组2'
            //this.card2Btn.skinName = 'Btn_r2Skin'
            //this.card1Btn.skinName = 'Btn_b2Skin'
            tw.to({x:this.card2Btn.x-3},100)
        }
    }

    private onChoose(){
        PKDressUI.getInstance().show({pktype:'server_game',data:UM.server_game.choose[this.chooseInex],enemy:this.enemyArray,index:this.chooseInex})
    }
}