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
        if(!this.h1.value)
            return;
        var MM = MapManager.getInstance();
        var self = this;
        MM.exchange(1,this.h1.value,function(){
            self.renew();
        })
    }

    public onCard(){
        if(!this.h2.value)
            return;
        var MM = MapManager.getInstance();
        var self = this;
        MM.exchange(2,MM.getExCardNeed(this.h2.value),function(){
            self.renew();
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renew();
    }

    private renewCoin(){
        this.setText(this.leaveText1,'[剩余积分：]'+ (this.h1.maximum - this.h1.value))
        this.setText(this.coinText,'[兑换金币：]'+ MapManager.getInstance().getExCoin(this.h1.value))
    }

    private renewCard(){
        var MM = MapManager.getInstance();
        this.setText(this.leaveText2,'[剩余积分：]'+ (MM.value - MapManager.getInstance().getExCardNeed(this.h2.value)))
        this.setText(this.cardText,'[兑换碎片：]'+ this.h2.value)
    }

    public renew(){
        var MM = MapManager.getInstance();
        var v = MM.value
        this.h1.minimum = 0
        this.h1.maximum = v
        this.h1.value = Math.floor(v/2)

        v = MM.getExCard(v);
        this.h2.minimum = 0
        this.h2.maximum = v
        this.h2.value = Math.floor(v/2)

        this.renewCoin();
        this.renewCard();
    }

    private setText(text,str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(text, str);
    }
}