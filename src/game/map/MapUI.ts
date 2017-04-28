class MapUI extends game.BaseUI {
    private static instance:MapUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapUISkin";
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private energyGroup: eui.Group;
    private energyText: eui.Label;
    private diamondGroup: eui.Group;
    private diamondText: eui.Label;
    private valueText: eui.Label;
    private bottomGroup: eui.Group;
    private closeBtn: eui.Button;
    private shopBtn: eui.Button;



    private indexIn


    public childrenCreated() {
        super.childrenCreated();

        this.list.itemRenderer = MapItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

        this.addBtnEvent(this.shopBtn, this.onShop);
        this.addBtnEvent(this.closeBtn, this.hide);
        this.addBtnEvent(this.energyGroup, this.onEnergy);
        this.addBtnEvent(this.diamondGroup, this.onDiamond);
    }

    private onEnergy(){

    }
    private onDiamond(){

    }
    private onLeft(){

    }

    private onRight(){

    }

    public beforeHide(){
        this.clearList([this.list])
    }

    public onShop(){
        MapExchangeUI.getInstance().show();
    }

    public show(rankType = 1){
        var self = this;
        self.superShow();
    }

    private superShow(){
        super.show();
        this.addPanelOpenEvent(GameEvent.client.energy_change,this.onEnergyChange)
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.onDiamondChange)
    }

    private onEnergyChange(){
        this.energyText.text = UM.getEnergy()
    }

    private onDiamondChange(){
        this.diamondText.text = UM.getDiamond();
    }
    private onValueChange(){
        this.valueText.text = '积分：' + 100
    }

    public onShow(){
        this.onEnergyChange();
        this.onDiamondChange();
        this.renewList();
    }

    public renewList(){
        var arr = [10,9,8,7,6,5,4,3,2,1];
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }

    private onClick(){

    }
}