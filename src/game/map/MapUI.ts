class MapUI extends game.BaseUI {
    private static instance:MapUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapUI();
        return this.instance;
    }

    public constructor() {
        super();

        this.skinName = "MapUISkin";
        this.LoadFiles = ['map'];
        this.loadUI = PKLoadingUI.getInstance();
        this.loadData = {
            min:1000,
            source:'main1_png'
        }
    }

    private scroller: eui.Scroller;
    private mapGroup: eui.Group;
    private bgGroup: eui.Group;
    private itemGroup: eui.Group;
    private bottomGroup: eui.Group;
    private closeBtn: eui.Group;
    private logBtn: eui.Button;
    private shopBtn: eui.Button;
    private titleText: eui.Label;
    private helpBtn: eui.Group;
    private energyGroup: eui.Group;
    private energyText: eui.Label;
    private diamondGroup: eui.Group;
    private diamondText: eui.Label;
    private valueText: eui.Label;







    public itemPos = [{"x":454,"y":7083},{"x":297,"y":7074},{"x":147,"y":7026},{"x":75,"y":6914},{"x":165,"y":6795},{"x":313,"y":6737},{"x":453,"y":6682},{"x":565,"y":6594},{"x":524,"y":6467},{"x":359,"y":6428},{"x":210,"y":6400},{"x":95,"y":6346},{"x":101,"y":6200},{"x":233,"y":6131},{"x":390,"y":6091},{"x":538,"y":6034},{"x":570,"y":5906},{"x":448,"y":5830},{"x":315,"y":5790},{"x":179,"y":5753},{"x":83,"y":5673},{"x":95,"y":5530},{"x":221,"y":5462},{"x":374,"y":5420},{"x":512,"y":5374},{"x":576,"y":5250},{"x":464,"y":5161},{"x":312,"y":5120},{"x":163,"y":5072},{"x":69,"y":4969},{"x":136,"y":4827},{"x":280,"y":4773},{"x":426,"y":4735},{"x":554,"y":4672},{"x":561,"y":4546},{"x":422,"y":4475},{"x":229,"y":4425},{"x":104,"y":4355},{"x":77,"y":4224},{"x":187,"y":4128},{"x":345,"y":4084},{"x":502,"y":4036},{"x":579,"y":3908},{"x":461,"y":3816},{"x":304,"y":3774},{"x":154,"y":3723},{"x":71,"y":3608},{"x":135,"y":3484},{"x":288,"y":3424},{"x":444,"y":3384},{"x":570,"y":3307},{"x":540,"y":3181},{"x":399,"y":3125},{"x":251,"y":3086},{"x":70,"y":2937},{"x":138,"y":2810},{"x":288,"y":2755},{"x":449,"y":2713},{"x":575,"y":2627},{"x":511,"y":2490},{"x":357,"y":2442},{"x":204,"y":2397},{"x":83,"y":2312},{"x":91,"y":2181},{"x":218,"y":2101},{"x":366,"y":2063},{"x":520,"y":2009},{"x":580,"y":1894},{"x":464,"y":1800},{"x":308,"y":1758},{"x":160,"y":1708},{"x":69,"y":1598},{"x":133,"y":1470},{"x":296,"y":1407},{"x":457,"y":1365},{"x":578,"y":1272},{"x":511,"y":1138},{"x":330,"y":1081},{"x":193,"y":988},{"x":335,"y":946},{"x":469,"y":877},{"x":347,"y":817},{"x":226,"y":776},{"x":341,"y":697},{"x":444,"y":628},{"x":308,"y":581},{"x":220,"y":505},{"x":350,"y":432},{"x":314,"y":335}]
    //private itemPosKey = {};
    //private itemPool = [];
    private itemArray = [];


    private cloudTimer = 0;
    private cloudArr = [];
    public childrenCreated() {
        super.childrenCreated();

        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

        this.addBtnEvent(this.shopBtn, this.onShop);
        this.addBtnEvent(this.closeBtn, this.hide);
        this.addBtnEvent(this.energyGroup, this.onEnergy);
        this.addBtnEvent(this.diamondGroup, this.onDiamond);
        this.addBtnEvent(this.logBtn, this.onLog);
        this.addBtnEvent(this.helpBtn, this.onHelp);

        this.addChild(MapInfoUI.getInstance())
        MapInfoUI.getInstance().hide();

        this.addChild(MapExchangeUI.getInstance())
        MapExchangeUI.getInstance().hide();

        //for(var i=0;i<this.itemPos.length;i++){
        //
        //}

        //this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
    }

    private onLog(){
        DayLogUI.getInstance().show(MapManager.getInstance().logList,'挑战日志');
    }
    private onHelp(){
        HelpManager.getInstance().mapHelp();
    }

    //private getItem(){
    //    var item = this.itemPool.pop();
    //    if(!item)
    //        item = new MapItem()
    //    this.itemArray.push(item);
    //    return item;
    //}
    //private freeItem(item){
    //    var index = this.itemArray.indexOf(item);
    //    if(index != -1)
    //        this.itemArray.splice(index,1);
    //    index = this.itemPool.indexOf(item);
    //    if(index == -1)
    //        this.itemPool.push(item);
    //}
    //
    //private onScroll(){
    //    //先去掉不显示的
    //    var begin = -this.mapGroup.y + this.scroller.viewport.scrollV - 50;
    //    var end = begin + this.scroller.height + 50;
    //    var removeArr = [];
    //    for(var i=0;i<this.itemArray.length;i++)
    //    {
    //        var item = this.itemArray[i];
    //        if(item.y < begin || item.y > end)
    //            removeArr.push(item);
    //    }
    //
    //    for(var i=0;i<removeArr.length;i++)
    //    {
    //        this.freeItem(removeArr[i]);
    //    }
    //}

    private onEnergy(){
        ShopUI.getInstance().show('energy');
    }
    private onDiamond(){
        ShopUI.getInstance().show('diamond');
    }

    public beforeHide(){
        //this.clearList([this.list])
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
        this.addPanelOpenEvent(GameEvent.client.map_value_change,this.onValueChange)
        this.addPanelOpenEvent(GameEvent.client.map_change,this.renewList)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)

    }



    private onEnergyChange(){
        this.energyText.text = UM.getEnergy()
    }

    private onDiamondChange(){
        this.diamondText.text = UM.getDiamond();
    }
    private onValueChange(){
        this.valueText.text = '积分：' + MapManager.getInstance().value;
    }

    public hide(){
        super.hide();
        while(this.cloudArr.length > 0)
        {
            var mc = this.cloudArr.pop();
            MyTool.removeMC(mc);
            egret.Tween.removeTweens(mc);
        }
    }

    public onShow(){
        this.onEnergyChange();
        this.onDiamondChange();
        this.onValueChange();
        this.renewList();
        this.renewScrollRect();
        PKLoadingUI.getInstance().realHide();
        this.showCound(true)
        this.showCound(true)

        var enemy =  MapManager.getInstance().enemy
        if(enemy && !enemy.is_pk)
        {
            MapGameUI.getInstance().show();
        }
    }

    private onTimer(){
        if(this.visible && egret.getTimer() - this.cloudTimer > 1000*10)
            this.showCound();
    }

    private showCound(b?){
        var rect = {
            x:0,
            y:-this.mapGroup.y + this.scroller.viewport.scrollV,
            width:640,
            height:GameManager.stage.stageHeight - 160
        }
        var mc = AniManager.getInstance().showCloud(this.mapGroup,rect,b)


        this.cloudArr.push(mc)
        this.cloudTimer  = egret.getTimer();
    }

    private renewScrollRect(){
        var h = GameManager.stage.stageHeight - 160;
        var bgH = this.bgGroup.height;
        var minY = this.itemArray[this.itemArray.length - 1].y;
        this.mapGroup.y = Math.max( bgH - minY + 300,h) - bgH;
    }

    public renewList(){
        var currentLevel = MapManager.getInstance().level;
        this.titleText.text = '据点 ' + currentLevel;
        var createLength = this.itemArray.length;
        for(var i=createLength;i<currentLevel;i++)
        {
            var item = new MapItem();
            this.itemGroup.addChild(item);
            item.data = i + 1;
            item.x = this.itemPos[i].x;
            item.y = this.itemPos[i].y;
            this.itemArray.push(item);
        }

        for(var i=0;i<createLength;i++)
        {
            this.itemArray[i].dataChanged();
        }
    }

    private onClick(){

    }
}