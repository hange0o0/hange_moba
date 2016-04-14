class BuyEnergyUI  extends game.BaseWindow {
    private static instance:BuyEnergyUI;
    public static getInstance() {
        if (!this.instance) this.instance = new BuyEnergyUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "BuyEnergyUISkin";
    }

    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private freeText: eui.Label;
    private diamondText: eui.Label;
    private addBtn: eui.Group;


    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onClick);
        this.addBtnEvent(this.addBtn, this.onAdd);
    }

    private onAdd(){

    }
    private onClick(){
        if(UM.getDiamond() < 60)
        {
            Alert('钻石不足！')
            return;
        }
        var self = this;
        PayManager.getInstance().buyEnergy(function(){
            self.hide();
            ShowTips('购买成功')
        })
    }

    public onShow()
    {
         this.freeText.text = UM.diamond.free;
         this.diamondText.text = UM.diamond.rmb;
    }

}
