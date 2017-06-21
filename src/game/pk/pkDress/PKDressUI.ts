class PKDressUI extends game.BaseUI {
    private static instance:PKDressUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKDressUI();
        return this.instance;
    }




    private topUI: TopUI;
    private coinText: eui.Label;
    private forceText: eui.Label;
    private upBtnGroup: eui.Group;
    private changeBtn: eui.Button;
    private viewBtn: eui.Button;
    private helpBtn: eui.Group;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private pkDressChooseUI: PKDressChooseUI;
    private taskGroup: eui.Group;
    private taskText: eui.Label;
    private taskRateText: eui.Label;
    private list: eui.List;
    private monsterInfo: MonsterInfoBase;
    private topGroup: eui.Group;
    private simpleList: eui.List;
    private topBtn: eui.Button;
    private enemyGroup: eui.Group;
    private enemyList: eui.List;
    private enemyScrollerGroup: eui.Group;
    private monsterScroller: eui.Scroller;
    private enemyMonsterInfo: MonsterInfoBase;













    public monsterList = [];
    public chooseList = [];

    public history = {};//历史记录


    public isEqual = false;
    public specialData = {isEqual:false,hard:0};
    public dataIn;
    public orginData; //卡组的原始数据
    public pkType; //PK类型
    public index = 0;

    public chooseMonster;
    public historyKey;

    public atkData:any = {};

    private renewListTimer = 0;
    public taskMid = 0;


    private isRemoveHistory = false
    public constructor() {
        super();
        this.skinName = "PKDressUISkin";


    }

    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('布阵');
        this.topUI.addEventListener('hide', this.hide, this);


        this.addBtnEvent(this.viewBtn, this.onView);
        //this.addBtnEvent(this.forceText, this.onForceText);
        this.addBtnEvent(this.topBtn, this.scrollToTop);
        this.addBtnEvent(this.changeBtn, this.changeCardIndex);
        this.addBtnEvent(this.taskGroup, this.onTask);

        this.taskGroup.touchChildren = false


        this.list.itemRenderer = PKDressChooseListItem;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;


        this.enemyList.itemRenderer = PKDressEnemyItem;
        this.simpleList.itemRenderer = PKDressSimpleItem;

        this.pkDressChooseUI.addEventListener('change', this.onChooseChange, this)
        this.pkDressChooseUI.addEventListener('chooseItem', this.onChooseItem, this)
        this.pkDressChooseUI.addEventListener('random', this.onRandom, this)
        this.pkDressChooseUI.addEventListener('reset', this.onReset, this)
        this.pkDressChooseUI.addEventListener('sort', this.onSort, this)
        this.simpleList.addEventListener('selectIndex', this.onClickSimpleList, this)
        this.pkDressChooseUI.specialData = this.specialData;

        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
        this.scroller.bounces = false;

        this.addEventListener('before_drag',this.onDragBefore,this);
        this.addEventListener('after_drag',this.onDragAfter,this);

        this.addBtnEvent(this.helpBtn,this.onHelp);
    }

    public showEnemyInfo(list,index){
        if(list)
        {
            this.enemyScrollerGroup.visible = true;
            var data = list[index];
             this.enemyMonsterInfo.renew(data.id,data.specialData);
            this.monsterScroller.stopAnimation();
            this.monsterScroller.viewport.scrollV = 0
            for(var i=0;i<this.enemyList.numChildren;i++)
            {
                var item:any = this.enemyList.getChildAt(i)
                item.setChoose(index == i);
            }
        }
        else
        {
            this.enemyScrollerGroup.visible = false;
        }
    }

    private onTask(){
        MyCardTaskUI.getInstance().show();
    }

    private onRandom(){
        this.changeChooseList(PKManager.getInstance().getRandomCard(this.monsterList,this.isEqual));
    }
    private onReset(){
         this.changeChooseList([]);
    }
    private onSort(){
         this.renewList();
        GuideManager.getInstance().showGuide(this);
    }

    private onClickSimpleList(e){
        this.scroller.stopAnimation();
        this.pkDressChooseUI.selectMCByIndex(e.data || 0)
        this.validateNow();
        MyTool.resetScrollV(this.scroller);
    }

    private changeChooseList(list){
        this.chooseList = list
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
    private changeCardIndex(){
        this.index ++;
        if(this.index >= this.dataIn.data.length)
            this.index = 0;
        this.initUserData();
        this.validateNow();
        MyTool.resetScrollV(this.scroller);
        this.onScroll();
    }


    public show(data?){
        this.dataIn = data
        this.pkType = data.pktype;
        this.index = data.index || 0
        this.isEqual = data.isEqual || false;
        this.specialData.isEqual = this.isEqual;
        this.specialData.hard = data.hard;




        super.show();
    }

    public onShow(){
        GuideManager.getInstance().enableScrollV(this.scroller);
        this.history = SharedObjectManager.instance.getMyValue('dress_history') || {}
        this.renewTask();
        this.removeOldHistory();
        this.reInitData();
        this.pkDressChooseUI.resetSort();
        this.addPanelOpenEvent(GameEvent.client.main_kill,this.mainGameChange)




        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.onMonsterLevel);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewListEvent);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewListEvent);
        //this.addPanelOpenEvent(GameEvent.client.force_change,this.renewList)


        GuideManager.getInstance().showGuide(this);
    }

    private renewTask(){
        this.taskMid = null
        if(this.pkType == 'day_game')
        {
            MyTool.removeMC(this.taskGroup)
            return
        }
        var myCard = UM.getMyCard();
        var task = myCard.task
        if(!task || task.current >= task.num)
        {
            MyTool.removeMC(this.taskGroup)
            return;
        }
        this.scrollerGroup.addChild(this.taskGroup)
        //if(myCard.num < task.num - task.current) //不可能完成了
        //{
        //    this.taskRateText.textColor = 0xFF0000;
        //}
        //else
        //{
        //    this.taskRateText.textColor = 0xCCB48E;
        //}
        this.taskRateText.text = Math.min(task.current,task.num)+'/'+task.num;


        this.taskMid = task.mid;
        var numStr = '['+task.num+']';
        var str = '[卡组任务：]使用['+MonsterVO.getObject(task.mid).name+']'
        switch(task.type)
        {
            case 1:
                str += ('取得我方的' +numStr +'次首杀');
                break;
            case 2:
                str += ('取得' +numStr +'次双杀');
                break;
            case 3:
                str += ('取得' +numStr +'次三杀');
                break;
            case 4:
                str += ('胜利终结比赛' +numStr +'次');
                break;
            case 5:
                str += ('消灭' +numStr +'个敌人');
                break;
            case 6:
                str += ( '赢得' +numStr +'次胜利');
                break;
        }
        MyTool.setColorText(this.taskText,str);
    }

    private renewListEvent(){
        if(egret.getTimer() - this.renewListTimer<5)
            return;
        this.renewListTimer = egret.getTimer();
        this.renewList();
    }

    private onMonsterLevel(){
        this.renewListTimer = egret.getTimer();
        this.renewList();
        this.pkDressChooseUI.justRenewList();
    }

    private mainGameChange(){
        this.dataIn.enemy = MainGameUI.getInstance().renewEnemy();
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
                    Confirm('还能继续上阵卡兵,确定就这样出战？',function(type){
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
             case PKManager.PKType.MAP:
                 MapGameUI.getInstance().hide();
                 break
             case PKManager.PKType.PVE:
                 TeamDungeonGameUI.getInstance().hide();
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
        MyTool.resetScrollV(this.scroller)
        this.onScroll();
    }

    public addMonster(mid){
        if(this.chooseList.length >= 6)
        {
            Alert('每次战斗最多可出战6位卡兵');
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
        if(e.data)
        {
            for(var i=0;i<this.list.numChildren;i++)
            {
                infoStr = (<any>this.list.getChildAt(i)).setChoose(e.data.id) || infoStr;
            }
            this.pkDressChooseUI.setDesText(infoStr);

            this.monsterInfo.renew(e.data.id,e.data.specialData);
            MyTool.removeMC(this.list);
            this.scrollerGroup.addChild(this.monsterInfo)
        }
        else
        {
            MyTool.removeMC(this.monsterInfo);
            this.scrollerGroup.addChild(this.list)
        }

        if(this.taskGroup.parent)
            this.taskGroup.parent.addChild(this.taskGroup)

        for(var i=0;i<this.simpleList.numChildren;i++)
        {
            (<any>this.simpleList.getChildAt(i)).setChoose(e.data);
        }
    }

    private renewSimpleList(){
        var arr = this.pkDressChooseUI.getChooseList(this.pkDressChooseUI)();
        for(var i=arr.length;i<6;i++)
        {
            arr.push(null);
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
        this.history[this.historyKey] = {key:this.historyKey,list:this.chooseList,time:TM.now()};
        SharedObjectManager.instance.setMyValue('dress_history',this.history);
    }

    private removeOldHistory(){
        if(this.isRemoveHistory)
            return
        this.isRemoveHistory = true;
         var arr = ObjectUtil.objToArray(this.history)
        if(arr.length > 50)
        {
            ArrayUtil.sortByField(arr,['time'],[1]);
            for(var i=30;i<arr.length;i++)
            {
                 delete this.history[arr[i].key]
            }
        }
    }


    //得到当前用剩的资源
    public getCurrentResource(){
        var oo = {
            coin:PKManager.PKCost - PKManager.getInstance().getCost(this.chooseList)
        }
        return oo;
    }

    public reInitData(){
        this.currentState = 'normal'
        this.initUserData();
        this.renewEnemy();

        this.topGroup.visible = false;
        this.scroller.viewport.scrollV = 0;
    }

    private initUserData(){
        this.orginData = this.dataIn.data[this.index];
        this.monsterList = this.orginData.list;


        var temp =  this.orginData.list.concat();
        temp.sort();
        this.historyKey = temp.join(',');

        if(!this.history[this.historyKey])
            this.history[this.historyKey] = {list:[],time:TM.now()};
        var data = this.history[this.historyKey];
        this.chooseList = data.list;
        if(GuideManager.getInstance().isGuiding)
            this.chooseList.length = 0;


        this.list.selectedIndex = -1;
        this.chooseMonster = null;



        this.renewList();
        this.renew();
        this.pkDressChooseUI.renew(this.chooseList);
        this.renewSimpleList();


        this.upBtnGroup.removeChildren()

        if(this.dataIn.data.length > 1)
        {
            var nextIndex = this.index+1;
            if(nextIndex >= this.dataIn.data.length)
                nextIndex = 0;
            this.topUI.setTitle('布阵-卡组' + (this.index + 1) + '');
            this.upBtnGroup.addChild(this.changeBtn);
            this.changeBtn.label = '切换卡组' + (nextIndex + 1);
        }
        else
        {
            this.topUI.setTitle('布阵');
        }
        if(this.dataIn.enemy)
            this.upBtnGroup.addChild(this.viewBtn);


        MyTool.removeMC(this.monsterInfo);
        this.scrollerGroup.addChild(this.list)
        if(this.taskGroup.parent)
            this.taskGroup.parent.addChild(this.taskGroup)
    }

    private renewEnemy(){
        this.enemyScrollerGroup.visible = false;
        if(this.dataIn.enemy)
        {
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
        this.atkData = {};
        this.atkData.atk = []
        this.atkData.hp = []
        this.atkData.speed = []

        var ro = this.getCurrentResource();
        for(var i=0;i<this.monsterList.length;i++)
        {
             var oo:any = {};
            var vo = MonsterVO.getObject(this.monsterList[i]);

            oo.vo = vo;
            oo.id = vo.id;
            oo.specialData =  this.specialData;
            //oo.num = this.getMonsterNum(vo.id);

            oo.list = arr;
            oo.chooseList = this.chooseList;
            arr.push(oo);




            var fightData;
            if(this.specialData.isEqual)
            {
                fightData = {atk:Config.equalValue,hp:Config.equalValue,speed:0};
            }
            else  //我自己
            {
                var force = (UM.award_force + UM.tec_force);
                var levelLimit = 999;
                if(this.specialData.hard)//带难度的
                {
                    var hardData = TeamDungeonManager.getInstance().hardData[this.specialData.hard - 1];
                    levelLimit = hardData.level;
                    force = Math.min(hardData.force,force);
                }
                fightData = UM.getTecMonsterAdd(vo.id,levelLimit);
                fightData.atk += force;
                fightData.hp += force;
            }
            var temp:any = this.atkData[vo.id] = {};
            temp.hp =  Math.round(vo.hp * (1+fightData.hp/100));
            temp.atk =  Math.round(vo.atk * (1+fightData.atk/100));
            temp.speed =  Math.round(vo.speed * (1+fightData.speed/100));
            this.atkData.hp.push(temp.hp);
            this.atkData.atk.push(temp.atk);
            this.atkData.speed.push(temp.speed);


            oo.cost = vo.cost
            oo.hp = vo.hp
            oo.atk = vo.atk
            oo.speed = vo.speed
        }

        var sortNumber = function(a,b)
        {
            return b - a;
        }
        this.atkData.hp.sort(sortNumber);
        this.atkData.atk.sort(sortNumber);
        this.atkData.speed.sort(sortNumber);

        if(this.pkDressChooseUI.sortIndex == 0)
            ArrayUtil.sortByField(arr,['cost','id'],[0,0]);
        else if(this.pkDressChooseUI.sortIndex == 1)
            ArrayUtil.sortByField(arr,['hp','id'],[1,0]);
        else if(this.pkDressChooseUI.sortIndex == 2)
            ArrayUtil.sortByField(arr,['atk','id'],[1,0]);
        else if(this.pkDressChooseUI.sortIndex == 3)
            ArrayUtil.sortByField(arr,['speed','id'],[1,0]);

        for(var i=0;i<arr.length;i++)
        {
            arr[i].index = i;
        }

        this.list.dataProvider = new eui.ArrayCollection(arr);
    }

    private sortMonster(arr){

    }


    public renew(){
        var oo = this.getCurrentResource();
        //资源
        this.setHtml(this.coinText,this.createHtml('剩余卡符：',0xE0A44A) + oo.coin + '');
        this.forceText.text = '';

    }

}