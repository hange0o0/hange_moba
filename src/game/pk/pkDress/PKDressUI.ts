class PKDressUI extends game.BaseUI {
    private static instance:PKDressUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKDressUI();
        return this.instance;
    }




    private topUI: TopUI;
    private coinText: eui.Label;
    private forceText: eui.Label;
    private viewBtn: eui.Button;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private pkDressChooseUI: PKDressChooseUI;
    private list: eui.List;
    private topGroup: eui.Group;
    private simpleList: eui.List;
    private topBtn: eui.Button;
    private enemyList: eui.List;
    private helpBtn: eui.Group;







    public monsterList = [];
    public chooseList = [];

    public history = {};//历史记录


    public isEqual = false;
    public specialData = {isEqual:false};
    public dataIn;
    public orginData; //卡组的原始数据
    public pkType; //PK类型
    public key;//记录上一次选择的TAB

    public chooseMonster;


    public constructor() {
        super();
        this.skinName = "PKDressUISkin";

        this.history = SharedObjectManager.instance.getMyValue('dress_history') || {}
    }

    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('调整位置')
        this.topUI.addEventListener('hide', this.hide, this);


        this.addBtnEvent(this.viewBtn, this.onView);
        //this.addBtnEvent(this.forceText, this.onForceText);
        this.addBtnEvent(this.topBtn, this.scrollToTop);


        this.list.itemRenderer = PKDressChooseListItem;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;


        this.enemyList.itemRenderer = EnemyHeadItem;
        this.simpleList.itemRenderer = PKDressSimpleItem;

        this.pkDressChooseUI.addEventListener('change', this.onChooseChange, this)
        this.pkDressChooseUI.addEventListener('chooseItem', this.onChooseItem, this)
        this.pkDressChooseUI.addEventListener('random', this.onRandom, this)
        this.pkDressChooseUI.specialData = this.specialData;

        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
        this.scroller.bounces = false;

        this.addEventListener('before_drag',this.onDragBefore,this);
        this.addEventListener('after_drag',this.onDragAfter,this);

        this.addBtnEvent(this.helpBtn,this.onHelp);
    }

    private onRandom(){
        this.chooseList = PKManager.getInstance().getRandomCard(this.monsterList);
        this.pkDressChooseUI.renew(this.chooseList);
        this.saveHistory();
        this.renew();
        this.renewSimpleList();
        for(var i=0;i<this.list.numChildren;i++)
        {
            (<any>this.list.getChildAt(i)).dataChanged();
        }
    }

    private onHelp(){
        HelpManager.getInstance().pkPosHelp();
    }

    public beforeHide(){
        this.clearList([this.list,this.simpleList,this.enemyList])
    }

    private onDragBefore(){
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
    }
    private onDragAfter(){
        this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
    }


    public show(data?){
        this.dataIn = data
        this.pkType = data.pktype;
        this.orginData = data.data;
        this.isEqual = data.isEqual || false;
        this.specialData.isEqual = this.isEqual;

        this.key = this.orginData.list.join(',');


        super.show();
    }

    public onShow(){
        this.monsterList = this.orginData.list;
        PKManager.getInstance().sortMonster(this.monsterList);
        this.reInitData();
        this.addPanelOpenEvent(GameEvent.client.main_kill,this.mainGameChange)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewList)

        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.renewList);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewList);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewList);


        GuideManager.getInstance().showGuide(this);
    }

    private mainGameChange(){
        this.dataIn.enemy = MainGameUI.getInstance().enemyArray;
        this.renewEnemy()
    }


    private scrollToTop(){
        this.scroller.stopAnimation();
        this.scroller.viewport.scrollV = 0;
        this.topGroup.visible = false;
    }

    private onScroll(){
        var scrollV = this.scroller.viewport.scrollV;
        if(scrollV > 80)//this.pkDressChooseUI.y - this.topGroup.height)
            this.topGroup.visible = true;
        else
            this.topGroup.visible = false;
    }

    public onPKStart(confirm=false){
        var self = this;
        if(this.chooseList.length == 0)
        {
            Alert('请先选择出战单位');
            return;
        }
        if(!confirm && this.chooseList.length < 6  && !GuideManager.getInstance().isGuiding)
        {
            for(var i=0;i<this.monsterList.length;i++)
            {
                var arr = this.chooseList.concat(this.monsterList[i])
                if(PKManager.getInstance().getCost(arr) <= PKManager.PKCost)
                {
                    Confirm('还能继续上阵卡牌,确定就这样出战？',function(type){
                        if(type == 1)
                        {
                            self.onPKStart(true);
                        }
                    })
                    return;
                }
            }
        }
        var chooseData = {list:this.chooseList,index:this.dataIn.index}
        PKManager.getInstance().startPK(PKDressUI.getInstance().pkType,chooseData,function(){
            self.closeRelate();
            if(PKDressUI.getInstance().pkType == PKManager.PKType.FRIEND_ASK)
            {
                ShowTips('PK请求已发送');
            }
            else
            {
                PKMainUI.getInstance().show();
            }

        })
    }

    private closeRelate(){
        this.hide();
         switch(this.pkType)
         {
             case PKManager.PKType.MAIN:
                 MainGameUI.getInstance().hide();
                 break
             case PKManager.PKType.SERVER:
                 ServerGameUI.getInstance().hide();
                 break
             case PKManager.PKType.SERVER_EQUAL:
                 ServerGameEqualUI.getInstance().hide();
                 break
             case PKManager.PKType.DAY:
                 DayGameUI.getInstance().hide();
                 break
             case PKManager.PKType.FRIEND_ASK:
                 FriendPKAskUI.getInstance().hide();
                 break
             case PKManager.PKType.FRIEND_ANSWER:
                 FriendPKAskUI.getInstance().hide();
                 break
         }
        if(GuideManager.getInstance().isGuiding)
            GuideUI.getInstance().hide();
    }

    //private onForceText(){
    //      if(this.forceText.textColor == 0xFF0000)
    //      {
    //          Alert('当出战单位种类较为单一时，会产生过载，整体战力-8%');
    //      }
    //}

    private onView(){
        if(this.currentState == 'open')
        {
            this.currentState = 'normal'
        }
        else
            this.currentState = 'open'
        this.validateNow();
        if(this.scroller.viewport.scrollV + this.scroller.height > this.scroller.viewport.contentHeight)
            this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
        this.onScroll();
    }

    public addMonster(mid){
        if(this.chooseList.length >= 6)
        {
            Alert('每次战斗最多可出6张卡');
            return;
        }
        this.pkDressChooseUI.addItem(mid);
    }
    
    private onChooseChange(){
        this.chooseList = this.pkDressChooseUI.getList();
        this.saveHistory();
        this.renew();
        //this.renewList();
        this.renewSimpleList();

        for(var i=0;i<this.list.numChildren;i++)
        {
            (<any>this.list.getChildAt(i)).dataChanged();
        }

        GuideManager.getInstance().showGuide(this);
    }
    private onChooseItem(e){
        e = e || {};
        var infoStr;
        for(var i=0;i<this.list.numChildren;i++)
        {
            infoStr = (<any>this.list.getChildAt(i)).setChoose(e.data) || infoStr;
        }
        this.pkDressChooseUI.setDesText(infoStr);
    }

    private renewSimpleList(){
        var arr = [];
        for(var i=0;i<6;i++)
        {
            arr.push(this.chooseList[i]);
        }
        this.simpleList.dataProvider = new eui.ArrayCollection(arr)
    }

    //怪物被使用次数
    public getMonsterNum(mid){
        var count = 0;
        for(var i=0;i<this.chooseList.length;i++)
        {
            if(this.chooseList[i] == mid)
                count ++;
        }
        return count;
    }
    private saveHistory(){
        this.history[this.pkType] = {key:this.key,list:this.chooseList,time:TM.now()};
        SharedObjectManager.instance.setMyValue('dress_history',this.history);
    }


    //得到当前用剩的资源
    public getCurrentResource(){
        var oo = {
            coin:PKManager.PKCost - PKManager.getInstance().getCost(this.chooseList)
        }
        return oo;
    }

    public reInitData(){
        if(!this.history[this.pkType] || this.history[this.pkType].key != this.key)
            this.history[this.pkType] = {key:this.key,list:[],time:TM.now()};
        var data = this.history[this.pkType];

        this.chooseList = data.list;
        if(GuideManager.getInstance().isGuiding)
            this.chooseList.length = 0;


        this.list.selectedIndex = -1;
        this.chooseMonster = null;
        this.scroller.viewport.scrollV = 0;


        this.currentState = 'normal'
         this.renewEnemy();


        this.pkDressChooseUI.renew(this.chooseList);
        this.renewList();
        this.renew();
        this.renewSimpleList();

        this.topGroup.visible = false;
        this.scroller.viewport.scrollV = 0;
    }

    private renewEnemy(){
        if(!this.dataIn.enemy)
        {
            this.viewBtn.visible = false;
        }
        else
        {
            this.viewBtn.visible = true;
            this.enemyList.dataProvider = new eui.ArrayCollection(this.dataIn.enemy);
            if(this.dataIn.enemy.length <4)
            {
                (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 0;
                (<eui.TileLayout>this.enemyList.layout).requestedRowCount = 1
            }
            else
            {
                (<eui.TileLayout>this.enemyList.layout).requestedRowCount = 2;
                if(this.dataIn.enemy.length ==4)
                    (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 2
                else if(this.dataIn.enemy.length <=6)
                    (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 3
                else
                    (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 4
            }
        }
    }


    private renewList(){
        var arr = [];
        var selectVO = MonsterVO.getObject(this.chooseMonster);

        var ro = this.getCurrentResource();
        for(var i=0;i<this.monsterList.length;i++)
        {
             var oo:any = {};
            var vo = MonsterVO.getObject(this.monsterList[i]);

            oo.vo = vo;
            oo.id = vo.id;
            oo.specialData =  this.specialData;
            //oo.num = this.getMonsterNum(vo.id);
            oo.index = i;
            oo.list = arr;
            oo.chooseList = this.chooseList;
            arr.push(oo);
        }

        this.list.dataProvider = new eui.ArrayCollection(arr);
    }


    public renew(){
        var oo = this.getCurrentResource();
        //资源
        this.coinText.text = '剩余卡符：' + oo.coin + '';
        this.forceText.text = '';
        //this.woodText.text = oo.wood + '';
        //this.coinText0.text = oo.coin + '';
        //this.woodText0.text = oo.wood + '';

        //战力加成相关
        var fight = 0;
        var list = []//this.chooseUI.getChooseList();
        var monsterRecord = {};
        var count = 0;
        for(var i=0;i<list.length;i++)
        {
            var monsterID = list[i];
            if(monsterRecord[monsterID])
                continue;
            monsterRecord[monsterID] = 1;
            count ++;
            //if(UM.getMonsterCollect(monsterID) == 4)//4星对全体战力加成2%
            //{
                //if(MonsterVO.getObject(monsterID).wood)
                //    fight += 5;
                //else
                //    fight += 2;
            //}
        }
        //if(count*2 > list.length) //过载
        //{
        //    fight -= 8;
        //    this.forceText.textColor = 0xFF0000;
        //    if(fight < 0)
        //        this.forceText.text = '' + fight + '%' + '(过载)'
        //    else
        //        this.forceText.text = '+' + fight + '%' + '(过载)'
        //}
        //else if(fight > 0)
        //{
        //    this.forceText.textColor = 0x00FF00;
        //    this.forceText.text = '+' + fight + '%'
        //}
        //else
        //{
        //    this.forceText.text = '';
        //}
        //
        //this.forceText0.text = this.forceText.text;
        //this.forceText0.textColor = this.forceText.textColor;


    }

}