class MapExchangeUI extends game.BaseContainer {
    private static instance:MapExchangeUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapExchangeUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapExchangeUISkin";
    }

    private coinText: eui.Label;
    private h1: eui.HSlider;
    private btn1: eui.Button;
    private cardText: eui.Label;
    private h2: eui.HSlider;
    private btn2: eui.Button;
    private closeBtn: eui.Button;






    private indexIn


    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.closeBtn,this.mvHide)
        this.addBtnEvent(this.btn1,this.onCoin)
        this.addBtnEvent(this.btn2,this.onCard)

        this.h1.addEventListener(egret.Event.CHANGE,this.renewCoin,this)
        this.h2.addEventListener(egret.Event.CHANGE,this.renewCard,this)


    }

    public mvHide(){
        var tw = egret.Tween.get(this);
        tw.to({bottom:-440},200).call(function(){
            this.visible = false
        },this)
    }
    public hide(){
        this.visible = false
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
        MM.exchange(2,MapData.getInstance().getExCardNeed(this.h2.value),function(){
            self.renew();
        })
    }

    public show(){
        this.visible = true;
        this.bottom = -440;
        egret.Tween.removeTweens(this);
        var tw = egret.Tween.get(this);
        tw.to({bottom:10},200).to({bottom:0},200)
        this.onShow();

        if(TaskManager.getInstance().nowAction == 'map_game_buy')
        {
            TaskManager.getInstance().showGuideMC(this.btn1)
        }
    }

    public onShow(){
        this.renew();
    }

    private renewCoin(){
        this.coinText.text = '×' + MapData.getInstance().getExCoin(this.h1.value) + ''
    }

    private renewCard(){
        var MM = MapManager.getInstance();
        this.cardText.text = '×' + this.h2.value + '';
    }

    public renew(){
        var MD = MapData.getInstance();
        var v = MD.value
        this.h1.minimum = 0
        this.h1.maximum = v
        this.h1.value = Math.floor(v)

        v = MD.getExCard(v);
        this.h2.minimum = 0
        this.h2.maximum = v
        this.h2.value = Math.floor(v)

        this.renewCoin();
        this.renewCard();
    }

    private setText(text,str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(text, str);
    }
}