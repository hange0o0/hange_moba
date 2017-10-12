class PayingUI extends game.BaseWindow {
    private static instance:PayingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PayingUI();
        return this.instance;
    }

    private backBtn: eui.Button;
    private okBtn: eui.Button;


    private localOrder;
    private goodsid;
    public constructor() {
        super();
        this.skinName = "PayingUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onClick);
    }

    private onClick(){
        PayManager.getInstance().pay_confirm(this.localOrder,this.goodsid,()=>{this.hide()})
    }


    public show(localOrder?,goodsid?){
        this.localOrder = localOrder;
        this.goodsid = goodsid;
        super.show();
    }

    public onShow(){

    }



}