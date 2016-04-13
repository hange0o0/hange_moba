class BagUI extends game.BaseUI {
    private static instance:BagUI;
    public static getInstance() {
        if (!this.instance) this.instance = new BagUI();
        return this.instance;
    }
    
    private infoGroup: eui.Group;
    private itemMC: BagItem;
    private desText: eui.Label;
    private infoBtn: eui.Button;
    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;


    public constructor() {
        super();
        this.skinName = "BagUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('道具列表')
        this.topUI.addEventListener('hide',this.hide,this);


        this.addBtnEvent(this.infoBtn, this.onInfo);

        this.list.itemRenderer = BagItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.list.addEventListener(egret.Event.CHANGE,this.onSelect,this)
    }

    private onInfo(){

    }

    private onSelect():void {
        this.scroller.top =  280;
        this.infoGroup.visible = true;
        var data = this.list.selectedItem;

        this.itemMC.data = data;
        this.desText.text = PropVO.getObject(data.id).propdes;


        this.infoBtn.visible = false;


    }

    public onShow(){
        this.renew();
    }

    private onClick(){

    }

    private renew(){
        this.scroller.top =  80;
        this.infoGroup.visible = false;
        this.list.selectedIndex = -1;
        this.list.dataProvider = new eui.ArrayCollection(PropManager.getInstance().getBagList());

    }
}