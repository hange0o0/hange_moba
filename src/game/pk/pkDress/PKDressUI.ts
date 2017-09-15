class PKDressUI extends game.BaseUI {
    private static instance:PKDressUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKDressUI();
        return this.instance;
    }




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
    private skillGroup: eui.Group;
    private skillIcon: eui.Image;
    private skillText: eui.Label;
    private noSkillText: eui.Label;
    private pkDressSettingUI: PKDressSettingUI;
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
    private topUI: TopUI;
















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

    private lastRandomMV = 0;

    private isRemoveHistory = false

    private clickTips = false
    private randomSetting
    public constructor() {
        super();
        this.skinName = "PKDressUISkin";
        this.hideVisible = true;

    }

    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('布阵');
        this.topUI.addEventListener('hide', this.onClose, this);


        this.addBtnEvent(this.viewBtn, this.onView);
        //this.addBtnEvent(this.forceText, this.onForceText);
        this.addBtnEvent(this.topBtn, this.scrollToTop);
        this.addBtnEvent(this.changeBtn, this.changeCardIndex);
        this.addBtnEvent(this.taskGroup, this.onTask);
        this.addBtnEvent(this.skillGroup, this.onSkill);

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

        this.pkDressSettingUI.addEventListener('dress_setting', this.onDressSetting, this)
        this.pkDressSettingUI.addEventListener('dress_setting_change', this.onDressSettingChange, this)
        this.pkDressSettingUI.addEventListener('dress_setting_choose', this.onDressSettingChoose, this)
    }

    private onDressSetting(e){
        this.randomSetting = e.data
        this.pkDressChooseUI.setRandomBG(this.randomSetting)
        this.onRandom();
        this.hideSetting();

        MyTool.removeMC(this.monsterInfo);
        this.scrollerGroup.addChild(this.list)
    }
    private onDressSettingChange(){
        var arr = this.pkDressSettingUI.getPKArr();
        this.setHtml(this.coinText,this.createHtml('剩余卡符：',0xE0A44A) + (PKManager.PKCost - PKManager.getInstance().getCost(arr)) + '');

    }
    private onDressSettingChoose(e){
        this.testAddSkill();
        if(this.taskGroup.parent)
            this.taskGroup.parent.addChild(this.taskGroup)
        if(e.data)
        {
            this.monsterInfo.renew(e.data,this.specialData);
            MyTool.removeMC(this.list);
            this.scrollerGroup.addChild(this.monsterInfo)
        }
        else
        {
            MyTool.removeMC(this.monsterInfo);
            this.scrollerGroup.addChild(this.list)
        }


    }

    public showSetting(){
        MyTool.removeMC(this.pkDressChooseUI);
        this.scrollerGroup.addChildAt(this.pkDressSettingUI,0);
        this.pkDressSettingUI.init(this.monsterList,this.randomSetting);
        this.onDressSettingChange();
    }
    private hideSetting(){
        MyTool.removeMC(this.pkDressSettingUI);
        this.scrollerGroup.addChildAt(this.pkDressChooseUI,0);
        this.renew();
    }

    private onClose(){
        if(this.enemyScrollerGroup.visible)
        {
            this.enemyScrollerGroup.visible = false;
            for(var i=0;i<this.enemyList.numChildren;i++)
            {
                var item:any = this.enemyList.getChildAt(i)
                item.setChoose(false);
            }
        }
        else
            this.hide()
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

    private renewSkill(){
        if(UM.tec.use_skill)
        {
            this.skillIcon.visible = true
            this.noSkillText.visible = false

            var skillVO = LeaderSkillVO.getObject(UM.tec.use_skill);
            this.skillIcon.source = skillVO.thumb;
            MyTool.setColorText(this.skillText,'['+skillVO.name+']:' + skillVO.getDes())
        }
        else
        {
            this.skillIcon.visible = false
            this.skillText.text = ''
            this.noSkillText.visible = true
        }
    }

    private onSkill(){
        LeaderSkillChangeUI.getInstance().show();
    }
    private onTask(){
        MyCardTaskUI.getInstance().show();
    }

    private onRandom(){
        this.changeChooseList(PKManager.getInstance().getRandomCard(this.monsterList,this.isEqual,this.randomSetting));
        GuideManager.getInstance().showGuide(PKDressUI.getInstance())
    }
    private onReset(){
         this.changeChooseList([]);
    }
    private onSort(){
         this.renewList();
        GuideManager.getInstance().showGuide(this);
    }

    private onClickSimpleList(e){
        this.hideSetting();
        this.scroller.stopAnimation();
        this.pkDressChooseUI.selectMCByIndex(e.data || 0)
        this.validateNow();
        MyTool.resetScrollV(this.scroller);
    }

    public changeChooseList(list){
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
        egret.Tween.removeTweens(this.changeBtn);
        this.clearList([this.list,this.simpleList,this.enemyList])
    }

    private onDragBefore(){
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
        //console.log('onDragBefore')
    }
    public onDragAfter(){
        if(GuideManager.getInstance().isGuiding)
            return;
        this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
        //console.log('onDragAfter')
    }

    public onTipsGet()
    {
        this.changeBtn.skinName = 'Btn_r2Skin'
    }
    private changeCardIndex(){
        if(this.changeBtn.label.indexOf('提示') != -1)
        {
            var self = this;

            this.clickTips = true;
            egret.Tween.removeTweens(this.changeBtn);
            this.changeBtn.alpha = 1;

            if(this.pkType == PKManager.PKType.MAIN)
            {
                if(UM.main_game.show_pass || MainGameManager.getInstance().freeShowPass())
                {
                    MainGameTipsUI.getInstance().show();
                    return;
                }
                var cost = MainGameManager.getInstance().getTipsCost();
                Confirm('确定消耗 '+MyTool.createHtml(cost,0xE0A44A)+' 钻石马上查看本关提示吗？',function(v){
                    if(v == 1)
                    {
                        if(!UM.testDiamond(cost))
                        {
                            return;
                        }
                        MainGameTipsUI.getInstance().show();
                    }
                })
            }
            else if(this.pkType == PKManager.PKType.DAY)
            {
                if(UM.day_game.show_pass)
                {
                    MainGameTipsUI.getInstance().show(true);
                    return;
                }
                var cost = DayGameManager.getInstance().getTipsCost();
                Confirm('确定消耗 '+MyTool.createHtml(cost,0xE0A44A)+' 钻石查看本关提示吗？',function(v){
                    if(v == 1)
                    {
                        if(!UM.testDiamond(cost))
                        {
                            return;
                        }
                        MainGameTipsUI.getInstance().show(true);
                    }
                })
            }

            return;
        }
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

        this.randomSetting = null;



        super.show();
    }

    public onShow(){
        this.clickTips = false
        this.touchChildren = this.touchEnabled = true;
        GuideManager.getInstance().enableScrollV(this.scroller);
        this.history = SharedObjectManager.instance.getMyValue('dress_history') || {}

        this.testAddSkill();
        this.renewSkill();
        this.renewTask();
        MyTool.removeMC(this.pkDressSettingUI);
        this.scrollerGroup.addChildAt(this.pkDressChooseUI,0);
        this.pkDressChooseUI.resetSort();

        this.removeOldHistory();
        this.reInitData();

        this.addPanelOpenEvent(GameEvent.client.main_kill,this.mainGameChange)
        this.addPanelOpenEvent(GameEvent.client.leader_skill_change,this.renewSkill)




        this.addPanelOpenEvent(GameEvent.client.monster_level_change,this.onMonsterLevel);
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewListEvent);
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewListEvent);
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)


        GuideManager.getInstance().showGuide(this);
    }

    private onTimer(){
        var t = egret.getTimer()
        if(t - GameManager.getInstance().lastTouchTime > 5000 && t - this.lastRandomMV > 5000)
        {
            var mc = this.pkDressChooseUI['randomIcon']
             var tw = egret.Tween.get(mc)
            mc.rotation = 0;
            tw.to({rotation:360},500)
            this.lastRandomMV = t;
        }
    }

    private renewTask(){
        this.taskMid = null
        if(this.pkType == 'day_game' || this.pkType == PKManager.PKType.FRIEND_ANSWER  || this.pkType == PKManager.PKType.FRIEND_ASK)
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
        this.scrollerGroup.addChildAt(this.taskGroup,0)
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
        var chooseData:any = {list:this.chooseList,index:this.index}
        if(this.dataIn.logData)
            chooseData.logData = this.dataIn.logData
        var self = this;
        PKManager.getInstance().startPK(PKDressUI.getInstance().pkType,chooseData,function(){
            //self.closeRelate();
            if(PKDressUI.getInstance().pkType == PKManager.PKType.FRIEND_ASK)
            {
                ShowTips('PK请求已发送');
                FriendPKAskUI.getInstance().hide()
                self.hide();
            }
            else
            {
                PKMainUI.getInstance().show();
                self.touchChildren = self.touchEnabled = false;
            }
            if(self.dataIn.fun)
            {
                self.dataIn.fun();
            }
        })
    }

    public closeRelate(){
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
        this.hideSetting();
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

    private testAddSkill(){
        if(!this.isEqual && UM.tec.skill.length > 0)
        {
            this.scrollerGroup.addChild(this.skillGroup)
        }
        else
        {
            MyTool.removeMC(this.skillGroup)
        }
    }

    private onChooseItem(e){
        e = e || {};
        var infoStr;

        this.testAddSkill();
        if(this.taskGroup.parent)
            this.taskGroup.parent.addChild(this.taskGroup)
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
        this.history[this.historyKey] = {key:this.historyKey,list:this.chooseList,time:TM.now(),randomSetting:this.randomSetting};
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
        this.randomSetting = data.randomSetting;
        if(GuideManager.getInstance().isGuiding)
        {
            this.chooseList.length = 0;
            this.randomSetting = null;
        }


        this.list.selectedIndex = -1;
        this.chooseMonster = null;



        this.renewList();
        this.renew();
        this.pkDressChooseUI.renew(this.chooseList);
        this.pkDressChooseUI.setRandomBG(this.randomSetting);
        this.renewSimpleList();


        this.upBtnGroup.removeChildren()

        this.changeBtn.skinName = 'Btn_b2Skin'
        egret.Tween.removeTweens(this.changeBtn);
        this.changeBtn.alpha = 1;
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
            if(this.pkType == PKManager.PKType.MAIN || this.pkType == PKManager.PKType.DAY)
            {
                this.upBtnGroup.addChild(this.changeBtn);
                this.changeBtn.label = '过关提示';
                if(this.pkType == PKManager.PKType.MAIN &&  UM.main_game.level < 100 &&
                    !(UM.main_game.show_pass || MainGameManager.getInstance().freeShowPass())
                )
                {
                    this.changeBtn.label = '提示 ('+((UM.main_game.fail || 0))+'/'+MainGameManager.getInstance().getFreeMax()+')';
                }


                if((this.pkType == PKManager.PKType.MAIN && (UM.main_game.show_pass || MainGameManager.getInstance().freeShowPass())) ||
                    (this.pkType == PKManager.PKType.DAY && UM.day_game.show_pass))
                {
                    this.changeBtn.skinName = 'Btn_r2Skin'
                    if(!this.clickTips)
                    {
                        var tw = egret.Tween.get(this.changeBtn,{loop:true});
                        tw.wait(5000).to({alpha:0.5},250).to({alpha:1},250).to({alpha:0.5},250).to({alpha:1},250).wait(5000)
                    }

                }

            }
        }
        if(this.dataIn.enemy)
            this.upBtnGroup.addChild(this.viewBtn);


        this.testAddSkill();
        if(this.taskGroup.parent)
            this.taskGroup.parent.addChild(this.taskGroup)
        MyTool.removeMC(this.monsterInfo);
        this.scrollerGroup.addChild(this.list)
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
        this.atkData.cost = []

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
            else
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
            temp.cost =  PKManager.getInstance().getCostByNum(vo.id,this.getMonsterNum(vo.id))
            temp.leader = UM.getMyLeaderLevel(vo.id,this.specialData.hard);

            this.atkData.hp.push(temp.hp);
            this.atkData.atk.push(temp.atk);
            this.atkData.speed.push(temp.speed);
            this.atkData.cost.push(temp.cost);


            oo.cost = temp.cost
            oo.hp = temp.hp
            oo.atk = temp.atk
            oo.speed = temp.speed
        }

        var sortNumber = function(a,b)
        {
            return b - a;
        }
        this.atkData.hp.sort(sortNumber);
        this.atkData.atk.sort(sortNumber);
        this.atkData.speed.sort(sortNumber);
        this.atkData.cost.sort(sortNumber);

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