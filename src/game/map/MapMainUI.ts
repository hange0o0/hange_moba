class MapMainUI extends game.BaseUI {
    private static instance:MapMainUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapMainUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapMainUISkin";
    }

    private bg: eui.Image;
    private con: eui.Group;
    private topUI: TopUI;
    private helpBtn: eui.Group;
    private hpGroup: eui.Group;
    private bb: eui.Rect;
    private bf: eui.Rect;
    private tb: eui.Rect;
    private tf: eui.Rect;
    private leftBtn: eui.Group;
    private la: eui.Image;
    private lt: eui.Label;
    private rightBtn: eui.Group;
    private ra: eui.Image;
    private rt: eui.Label;
    private desText: eui.Label;
    private awardText: eui.Label;
    private getBtn: eui.Button;
    private valueText: eui.Label;
    private exchangeBtn: eui.Button;
    private pkText: eui.Label;
    private pkBtn: eui.Button;
    private videoBtn: eui.Group;







    public data
    public itemArray = [];

    public childrenCreated() {
        super.childrenCreated();
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.rightBtn,this.onRight)
        this.addBtnEvent(this.helpBtn,this.onHelp)
        this.addBtnEvent(this.exchangeBtn,this.onExchange)
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.getBtn,this.onGet)
        this.addBtnEvent(this.videoBtn,this.onVideo)

    }

    private onLeft(){

    }
    private onRight(){

    }
    private onHelp(){

    }
    private onExchange(){

    }
    private onPK(){

    }
    private onGet(){

    }
    private onVideo(){
        DayLogUI.getInstance().show(MapManager.getInstance().logList,'挑战日志');
    }

    public hide(){
        super.hide();
    }

    public show(data?){
        this.data = data;
        var self = this;
        self.superShow()
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renew();
    }

    private renew(){
        this.topUI.setTitle('第X据点')
    }
}