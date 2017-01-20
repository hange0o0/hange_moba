class FriendPKViewUI extends game.BaseUI {
    private static instance:FriendPKViewUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendPKViewUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private enemyGroup0: eui.Group;
    private pkTypeText: eui.Label;
    private timeText: eui.Label;
    private myGroup0: eui.Group;
    private bg0: eui.Group;
    private myList0: eui.List;
    private myChooseGroup: eui.Group;
    private myList2: eui.List;
    private myGroup1: eui.Group;
    private bg1: eui.Group;
    private myList1: eui.List;






    private data;
    private specialData;
    public constructor() {
        super();
        this.skinName = "FriendPKViewUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('等待好友应战')
        this.topUI.addEventListener('hide',this.hide,this);
        //this.addBtnEvent(this, this.onClick);

        //this.inputText.addEventListener(egret.Event.CHANGE,this.onTextChange)

        this.myList0.itemRenderer =  MyHeadItem;
        this.myList1.itemRenderer =  MyHeadItem;
        this.myList2.itemRenderer =  EnemyHeadItem;

        this.scroller.bounces = false;
    }

    public beforeHide(){
        this.clearList([this.myList0,this.myList1,this.myList2])
    }

    private onTimer(){
        if(!this.stage)
            return;
        this.timeText.text = 'PK有效时间：'+ DateUtil.getStringBySecond(Math.max(0,this.data.time+3600*24*3 - TM.now()));
    }


    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        if(this.data.content.isequal)
            this.pkTypeText.text = '使用规则：修正场规则';
        else
            this.pkTypeText.text = '使用规则：竞技场规则';
        this.onTimer();

        var data = this.data.content.from_list;
        var specialData:any = this.specialData = {};
        if(this.data.content.isequal)
        {
            specialData.isEqual = true;
        }
        PKManager.getInstance().sortMonster(data[0].list);
        PKManager.getInstance().sortMonster(data[1].list);
        //更新卡组1
        var chooseList1 = [];
        for(var i=0;i<data[0].list.length;i++)
        {
            var id = data[0].list[i]
            chooseList1.push({
                vo: MonsterVO.getObject(id),
                type:1,

                stopRed:true,

                id: id,
                specialData: specialData,

                index: i,
                list:chooseList1
            });
        }
        this.myList0.dataProvider = new eui.ArrayCollection(chooseList1);


        //更新卡组2
        var chooseList2 = [];
        for(var i=0;i<data[1].list.length;i++)
        {
            var id = data[1].list[i]
            chooseList2.push({
                vo: MonsterVO.getObject(id),
                type:1,

                stopRed:true,

                id: id,
                specialData: specialData,

                index: i,
                list:chooseList2
            });
        }
        this.myList1.dataProvider = new eui.ArrayCollection(chooseList2);

         //我选中的卡组
        var myChoose = this.data.content.ask_choose;
        var index = myChoose.index || 0;
        //var ringIndex = 0;
        MyTool.removeMC(this.myChooseGroup)
        this.scrollerGroup.addChildAt(this.myChooseGroup,2 + index);
        this.bg0.visible = false;
        this.bg1.visible = false;
        if(index == 0)
        {
            this.bg0.visible = true;
            //if(myChoose.ring.id == data[0].ring[1])
            //    ringIndex = 1
        }
        else
        {
            this.bg1.visible = true;
            //if(myChoose.ring.id == data[1].ring[1])
            //    ringIndex = 1
        }

        var chooseList3 = [];
        for(var i=0;i<myChoose.list.length;i++)
        {
            var id = myChoose.list[i]
            chooseList3.push({
                vo: MonsterVO.getObject(id),
                isTeam:true,

                id: id,
                specialData: specialData,

                index: i,
                list:chooseList3
            });
        }
        this.myList2.dataProvider = new eui.ArrayCollection(chooseList3);

        if(chooseList3.length <4)
        {
            (<eui.TileLayout>this.myList2.layout).requestedColumnCount = 0;
            (<eui.TileLayout>this.myList2.layout).requestedRowCount = 1
        }
        else
        {
            (<eui.TileLayout>this.myList2.layout).requestedRowCount = 2;
            if(chooseList3.length ==4)
                (<eui.TileLayout>this.myList2.layout).requestedColumnCount = 2
            else
                (<eui.TileLayout>this.myList2.layout).requestedColumnCount = 3
        }
        //this.chooseMC.x = 200 + ringIndex * 300;

        this.addPanelOpenEvent(egret.TimerEvent.TIMER,this.onTimer)
    }
}