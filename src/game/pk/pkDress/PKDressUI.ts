class PKDressUI extends game.BaseUI {
    private static instance:PKDressUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKDressUI();
        return this.instance;
    }
    
    private topUI: TopUI;
    private simpleChoose: PKDressSimple;
    private pkChooseMC: PKDressChooseUI;
    private mainGroup: eui.Group;
    private d0: PKDressItem;
    private d1: PKDressItem;
    private d2: PKDressItem;
    private d3: PKDressItem;
    private d4: PKDressItem;
    private d5: PKDressItem;
    private d6: PKDressItem;
    private d7: PKDressItem;
    private d8: PKDressItem;
    private d9: PKDressItem;
    private upBtn: eui.Image;
    private scroller: eui.Scroller;
    private preBtn: eui.Group;
    private nextBtn: eui.Group;
    private chooseBtn: eui.Button;
    private coinText: eui.Label;
    private woodText: eui.Label;



    
    

    public chooseUI:PKDressChooseUI
    public infoUI:PKDressInfoUI

    private txt:eui.Label
    private img:eui.Image
    private list:eui.List
    private r1:eui.RadioButton
    private r2:eui.RadioButton
    private tab:eui.TabBar

    private ringInfo



    public selectMonster;//选中的怪物
    private totalWood = 1;
    private totalCoin = 100

    public monsterList = [];
    public ringList = [];
    public orginData; //卡组的原始数据
    public history = {};//历史记录

    private touchTimer

    public isEqual = false;
    public selectedIndex;//记录上一次选择的TAB

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    public show(v?){
        this.orginData = v;
        super.show();
    }

    public onShow(){
        this.r1.selected = true;
        this.selectedIndex = 1;
        this.tab.selectedIndex = 1;
        this.monsterList = this.orginData[this.tab.selectedIndex].list;
        this.ringList = this.orginData[this.tab.selectedIndex].ring;
        this.reInitData();
    }


    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = PKDressItem;

        this.addBtnEvent(this.img, this.onStart);
        this.list.addEventListener(egret.Event.CHANGE,this.onListChange,this)

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);
        this.r1.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onRing1Touch,this);
        this.r2.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onRing2Touch,this);
    }

    private onStart(){
         var list = this.chooseUI.getChooseList();
         var ring = this.r1.group.selectedValue;
    }

    private onListChange(){

        this.selectMonster = this.list.selectedItem;
        this.chooseUI.renewMonster();
        this.infoUI.renew();
    }

    private typeBarClick(){
        var list = this.chooseUI.getChooseList();
        var ring = this.r1.group.selectedValue;
        this.history[this.selectedIndex] = {list:list,ring:ring};

        this.selectedIndex = this.tab.selectedIndex;
        this.monsterList = this.orginData[this.tab.selectedIndex].list;
        this.ringList = this.orginData[this.tab.selectedIndex].ring;
        this.reInitData();

        var history = this.history[this.selectedIndex];
        if(history)
        {
            if(this.ringList.indexOf(history.ring) == 1)
                this.r2.selected = true;
            else
                this.r1.selected = true;

            for(var i=0;i<history.list;i++)
            {
                this.chooseUI.addOne(history.list[i]);
            }
        }
    }

    private onRing1Touch(){
        this.stage.once(egret.TouchEvent.TOUCH_END,this.onRingTouchEnd,this);
        this.touchTimer = egret.setTimeout(this.showRingInfo,this,500,this.ringList[0]);
    }
    private onRing2Touch(){
        this.stage.once(egret.TouchEvent.TOUCH_END,this.onRingTouchEnd,this);
        this.touchTimer = egret.setTimeout(this.showRingInfo,this,500,this.ringList[1]);
    }

    private showRingInfo(ringID){
        this.ringInfo.visible = true;
        if(this.isEqual)
            this.ringInfo.text = '' + RingVO.getObject(ringID).getLevelDes(RingVO.equalLevel);
        else
            this.ringInfo.text = '' + RingVO.getObject(ringID).getLevelDes(UM.getRingLevel(ringID));
    }

    private onRingTouchEnd(){
        egret.clearTimeout(this.touchTimer);
        this.ringInfo.visible = false;
    }

    //得到当前用剩的资源
    public getCurrentResource(){
        var oo = {coin:this.totalCoin,wood:this.totalCoin}
        var arr = this.chooseUI.chooseList;
        for(var i=0;i<arr.length;i++) {
            var vo = MonsterVO.getObject(arr[i].data);
            oo.coin -= vo.cost;
            oo.wood -= vo.wood;
        }
        return oo;
    }

    public reInitData(){
        this.r1.value = this.ringList[0]
        this.r2.value = this.ringList[1]
        this.r1.label =  RingVO.getObject(this.ringList[0]).name;
        this.r1.label =  RingVO.getObject(this.ringList[1]).name;

        this.selectMonster = this.monsterList[0];
        this.totalWood = 1;
        this.totalCoin = 100;
        this.chooseUI.cleanAll();
        this.infoUI.renew();

        this.list.dataProvider = new eui.ArrayCollection(this.monsterList);

        this.renew();
    }

    public renew(){
        var oo = this.getCurrentResource();
        //资源
        this.txt.text = oo.coin + '';
        this.txt.text = oo.wood + '';

        //战力加成相关
        var fight = 0;
        var list = this.chooseUI.getChooseList();
        var monsterRecord = {};
        var count = 0;
        for(var i=0;i<list.length;i++)
        {
            var monsterID = list[i];
            if(monsterRecord[monsterID])
                continue;
            monsterRecord[monsterID] = 1;
            count ++;
            if(UM.getMonsterCollect(monsterID) == 4)//4星对全体战力加成2%
            {
                fight += 2;
            }
        }
        if(count*2 > list.length) //过载
        {
            fight -= 8;
            this.txt.textColor = 0xFF0000;
        }
        else
        {
            this.txt.textColor = 0x000000;
        }
        this.txt.text = fight + ''

    }

}