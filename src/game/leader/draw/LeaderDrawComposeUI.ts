class LeaderDrawComposeUI extends game.BaseWindow {
    private static instance:LeaderDrawComposeUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LeaderDrawComposeUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "LeaderDrawComposeUISkin";
    }

    private backBtn: eui.Button;
    private okBtn: eui.Button;
    private desText: eui.Label;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onPK);


    }

    public onPK(){
         LeaderManager.getInstance().skillCompose(()=>{this.hide()})
    }


    public onShow(){
        this.renew();
    }

    public renew(){
        var num = UM.getPropNum(42);
         this.desText.text = '拥有命运石碎片：' + num+
                 '\n可合成命运石：' + Math.floor(num/10)
        if(num < 10)
        {
            this.okBtn.touchEnabled = false;
            this.okBtn.skinName = 'Btn_d2Skin';
        }
        else
        {
            this.okBtn.touchEnabled = true;
            this.okBtn.skinName = 'Btn_r2Skin';
        }

    }
}