class MapExchangeUI extends game.BaseWindow {
    private static instance:MapExchangeUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapExchangeUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapExchangeUISkin";
    }

    private leaveText1: eui.Label;
    private coinText: eui.Label;
    private h1: eui.HSlider;
    private btn1: eui.Button;
    private leaveText2: eui.Label;
    private cardText: eui.Label;
    private h2: eui.HSlider;
    private btn2: eui.Button;
    private closeBtn: eui.Button;





    private indexIn


    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.closeBtn,this.hide)
        this.addBtnEvent(this.btn1,this.onCoin)
        this.addBtnEvent(this.btn2,this.onCard)

        this.h1.addEventListener(egret.Event.CHANGE,this.renewCoin,this)
        this.h2.addEventListener(egret.Event.CHANGE,this.renewCard,this)

    }

    public onCoin(){

    }

    public onCard(){

    }

    private superShow(){
        super.show();
    }

    public onShow(){
        var v = 100
        this.h1.minimum = 0
        this.h1.maximum = v
        this.h1.value = v/2

        this.h2.minimum = 0
        this.h2.maximum = v
        this.h2.value = v/2

        this.renew();
    }

    private renewCoin(){
        this.setText(this.leaveText1,'[剩余积分：]'+ (this.h1.maximum - this.h1.value))
        this.setText(this.coinText,'[兑换金币：]'+ MapManager.getInstance().getExCoin(this.h1.value))
    }

    private renewCard(){
        this.setText(this.leaveText2,'[剩余积分：]'+ (this.h2.maximum - this.h2.value))
        this.setText(this.cardText,'[兑换碎片：]'+ MapManager.getInstance().getExCard(this.h2.value))
    }

    public renew(){
        this.renewCoin();
        this.renewCard();
    }

    private setText(text,str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(text, str);
    }
}