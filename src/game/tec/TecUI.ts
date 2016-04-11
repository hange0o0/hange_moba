class TecUI extends game.BaseUI {
    private static instance:TecUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TecUI();
        return this.instance;
    }

    private infoGroup: eui.Group;
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
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private myCoinText: eui.Label;


    private needCoin
    private needProp1
    private needProp2
    private needPropNum1
    private needPropNum2


    public constructor() {
        super();
        this.skinName = "TecUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.levelUpBtn, this.onLevelUp);

        this.list.itemRenderer = TecItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.list.addEventListener(egret.Event.CHANGE,this.onSelect,this)

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);
        this.tab.selectedIndex = 0;

        EM.addEvent(GameEvent.client.coin_change,this.renewCoin,this);
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
        });

    }

    private onSelect():void {
        this.scroller.top =  390;
        this.infoGroup.visible = true;
        var data = this.list.selectedItem;

        var TCM = TecManager.getInstance();
        var level,des
        this.itemMC.data = data;
        if(data.tecType == 1)//主
        {
            level = UM.tec.main[data.id];
            if(level >= TCM.maxLevel)
            {
                this.desText.text = data.des.replace(/\$\$/g,UM.getTecAdd('main',level))
            }
            else
            {
                this.desText.text = data.des.replace(/\$\$/g,UM.getTecAdd('main',level) + '(->' + UM.getTecAdd('main',level+1)+')')
            }
        }
        else if(data.tecType == 2)//技
        {
            level = UM.tec.ring[data.id];
            if(level >= TCM.maxLevel)
            {
                this.desText.text = data.des.replace(/\$\$/g,data.getRingAdd(level));
            }
            else
            {
                this.desText.text = data.des.replace(/\$\$/g,data.getRingAdd(level) + '(->' + data.getRingAdd(level+1)+')')
            }
        }
        else//怪
        {
            level = UM.tec.monster[data.id];
            if(level >= TCM.maxLevel)
            {

            }
            else
            {

            }
        }

        if(level >= TCM.maxLevel)
        {
            return;
        }

        this.needCoin = TCM.needCoin(level);
        this.needProp1 = TCM.prop1ID(data.tecType)
        this.needProp2 = TCM.prop2ID(data.tecType)
        this.needPropNum1 = TCM.propNum1(level);
        this.needPropNum2 = TCM.propNum1(level);

        this.coinText.text = this.needCoin;
        if(this.needCoin > UM.coin)
            this.coinText.textColor = 0xFF0000;
        else
            this.coinText.textColor = 0xCC9900;


        if(this.needPropNum1)
        {
            this.propGroup1.visible = true;
            this.propMC1.source = PropVO.getObject(this.needProp1).thumb;
            this.propText1.text = this.needPropNum1;
            if(this.needProp1 > UM.getPropNum(this.needProp1))
                this.propText1.textColor = 0xFF0000;
            else
                this.propText1.textColor = 0xCC9900;
        }
        else
            this.propGroup1.visible = false;

        if(this.needPropNum2)
        {
            this.propGroup2.visible = true;
            this.propMC2.source = PropVO.getObject(this.needProp2).thumb;
            this.propText2.text = this.needPropNum2;
            if(this.needProp2 > UM.getPropNum(this.needProp2))
                this.propText2.textColor = 0xFF0000;
            else
                this.propText2.textColor = 0xCC9900;
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

        switch(this.tab.selectedIndex)
        {
            case 0:
                arr = TCM.getList1();
                break;
            case 1:
                arr = TCM.getList2();
                break;
            case 2:
                arr = TCM.getList3();
                break;
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);

        this.scroller.top =  145;
        this.infoGroup.visible = false;
    }


}