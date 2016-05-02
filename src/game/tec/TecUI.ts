class TecUI extends game.BaseUI {
    private static instance:TecUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TecUI();
        return this.instance;
    }
    private infoGroup: eui.Group;
    private levelUpGroup: eui.Group;
    private levelUpBtn: eui.Button;
    private coinText: eui.Label;
    private propGroup1: eui.Group;
    private propText1: eui.Label;
    private propMC1: eui.Image;
    private propGroup2: eui.Group;
    private propText2: eui.Label;
    private propMC2: eui.Image;
    private itemMC: TecItem;
    private desText: eui.Label;
    private maxText: eui.Label;
    private monsterGroup: eui.Group;
    private atkText: eui.Label;
    private infoBtn: eui.Button;
    private hpText: eui.Label;
    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private coinGroup: eui.Group;
    private myCoinText: eui.Label;
    private fillAllGroup: eui.Group;
    private fillBtn: eui.Image;
    private fillText: eui.Label;
    private fillGroup: eui.Group;
    private fillList: eui.List;



    private needCoin
    private needProp1
    private needProp2
    private needPropNum1
    private needPropNum2

    private fillMonster = 0;
    
    public constructor() {
        super();
        this.skinName = "TecUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('科技升级')
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.levelUpBtn, this.onLevelUp);
        this.addBtnEvent(this.infoBtn, this.onInfo);

        this.list.itemRenderer = TecItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.list.addEventListener(egret.Event.CHANGE,this.onSelect,this)

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);
        this.tab.selectedIndex = 0;

        this.addBtnEvent(this.fillBtn,this.onFill);
        this.addBtnEvent(this.fillText,this.onFill);
        EM.addEvent(GameEvent.client.coin_change,this.renewCoin,this);
        this.fillList.selectedIndex = 0;
        this.fillList.addEventListener(egret.Event.CHANGE,this.onSelectFill,this)
    }

    private onSelectFill(){
       this.fillMonster = this.fillList.selectedItem.id
        this.renewList();
    }
    private onFill(){
        GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.onHideFill,this);
        this.fillGroup.visible = true;
        var arr = [{id:0,label:'全部属性'}];
        var mdata = CM.table[MonsterKindVO.dataKey];
        for(var s in mdata)
        {
            var vo = mdata[s];
            if(vo.level<= UM.level)
                arr.push({
                    id:vo.id,
                    label:'【'+vo.word+'】属性'
                });
        }
        this.fillList.dataProvider = new eui.ArrayCollection(arr)
    }

    private onHideFill(){
        this.fillGroup.visible = false;
    }

    private onLevelUp(){
        //if(this.needCoin > UM.coin)
        //{
        //    Alert('金币不足')
        //    return;
        //}
        //if(this.needProp1 > UM.getPropNum(this.needProp1))
        //{
        //    Alert(PropVO.getObject(this.needProp1).propname + '数量不足')
        //    return;
        //}
        //if(this.needProp2 > UM.getPropNum(this.needProp2))
        //{
        //    Alert(PropVO.getObject(this.needProp2).propname + '数量不足')
        //    return;
        //}
        var data = this.list.selectedItem;
        var self = this;
        TecManager.getInstance().levelUp(data.tecType,data.id,function(){
            self.onSelect();
            (<any>self.list.dataProvider).itemUpdated(data);
        });
    }

    private onInfo(){
        MonsterList.getInstance().show([{id:this.list.selectedItem.id}]);
    }

    private onSelect():void {
        this.scroller.top =  390;
        this.infoGroup.visible = true;
        var data = this.list.selectedItem;

        var TCM = TecManager.getInstance();
        var level,des
        this.itemMC.data = data;
        this.monsterGroup.visible = false
        if(data.tecType == 1)//主
        {
            level = UM.tec.main[data.id] || 0;
            if(level >= TCM.maxLevel)
            {
                this.desText.text = data.des.replace(/\$\$/g,UM.getTecAdd('main',level))
            }
            else
            {
                this.desText.text = data.des.replace(/\$\$/g,'('+UM.getTecAdd('main',level) + ' → ' + UM.getTecAdd('main',level+1)+')')
            }
        }
        else if(data.tecType == 2)//技
        {
            level = UM.tec.ring[data.id] || 0;
            if(level >= TCM.maxLevel)
            {
                this.desText.text = data.des.replace(/\$\$/g,data.getRingAdd(level));
            }
            else
            {
                this.desText.text = data.des.replace(/\$\$/g,'('+data.getRingAdd(level) + ' → ' + data.getRingAdd(level+1)+')')
            }
        }
        else//怪
        {
            level = UM.tec.monster[data.id] || 0;
            this.monsterGroup.visible = true;
            this.desText.text = '';
            if(level >= TCM.maxLevel)
            {
                this.atkText.text = '攻击加成：' + UM.getTecAdd('monster',level) +'%';
                this.hpText.text = '生命加成：' + UM.getTecAdd('monster',level) +'%';
            }
            else
            {
                this.atkText.text = '攻击加成：' + UM.getTecAdd('monster',level)+ '% → (' + UM.getTecAdd('monster',level+1)+'%)'
                this.hpText.text = '生命加成：' + UM.getTecAdd('monster',level) + '% → (' + UM.getTecAdd('monster',level+1)+'%)'

            }
        }

        if(level >= TCM.maxLevel)
        {
            this.levelUpGroup.visible = false;
            this.maxText.visible = true;
            return;
        }

        this.levelUpBtn.visible = true;
        this.levelUpGroup.visible = true;
        this.maxText.visible = false;

        level ++;
        this.needCoin = TCM.needCoin(level);
        this.needProp1 = TCM.prop1ID(data.tecType)
        this.needProp2 = TCM.prop2ID(data.tecType)
        this.needPropNum1 = TCM.propNum1(level);
        this.needPropNum2 = TCM.propNum1(level);

        this.coinText.text = this.needCoin;
        if(this.needCoin > UM.coin)
        {
            this.coinText.textColor = 0xFF0000;
            this.levelUpBtn.visible = false;
        }
        else
            this.coinText.textColor = 0xCCB48E;


        if(this.needPropNum1)
        {
            this.propGroup1.visible = true;
            this.propMC1.source = PropVO.getObject(this.needProp1).thumb;
            this.propText1.text = this.needPropNum1;
            if(this.needProp1 > UM.getPropNum(this.needProp1))
            {
                this.propText1.textColor = 0xFF0000;
                this.levelUpBtn.visible = false;
            }
            else
                this.propText1.textColor = 0xCCB48E;
        }
        else
            this.propGroup1.visible = false;

        if(this.needPropNum2)
        {
            this.propGroup2.visible = true;
            this.propMC2.source = PropVO.getObject(this.needProp2).thumb;
            this.propText2.text = this.needPropNum2;
            if(this.needProp2 > UM.getPropNum(this.needProp2))
            {
                this.propText2.textColor = 0xFF0000;
                this.levelUpBtn.visible = false;
            }
            else
                this.propText2.textColor = 0xCCB48E;
        }
        else
            this.propGroup2.visible = false;

    }
    private typeBarClick(event:eui.ItemTapEvent):void {
        this.renewList();
    }

    public onShow(){
         this.renewCoin();
         this.renewList();
    }

    public renewCoin(){
        if(!this.stage)
            return;
        this.myCoinText.text = NumberUtil.addNumSeparator(UM.coin);
    }
    public renewList(){
        var TCM = TecManager.getInstance();
        this.list.selectedIndex = -1;
        var arr;
        this.fillAllGroup.visible = false;
        this.coinGroup.visible = true;
        switch(this.tab.selectedIndex)
        {
            case 0:
                arr = TCM.getList1();
                break;
            case 1:
                arr = TCM.getList2();
                break;
            case 2:
                arr = TCM.getList3(this.fillMonster);
                this.fillAllGroup.visible = true;
                this.fillGroup.visible = false;
                if(this.fillMonster == 0)
                    this.fillText.text = '全部'
                else
                    this.fillText.text = this.fillList.selectedItem.label;
                this.coinGroup.visible = false;

                break;
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);

        this.scroller.top =  145;
        this.infoGroup.visible = false;
    }


}