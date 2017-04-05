class PKLoadingUI extends game.BaseUI {
    private static instance:PKLoadingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKLoadingUI();
        return this.instance;
    }

    private mc: eui.Image;
    private desText: eui.Label;
    private barMC: eui.Rect;
    private rateText: eui.Label;


    public dateIn
    public lastRate;
    public constructor() {
        super();
        this.skinName = "PKLoadingUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
    }



    public show(v?){
        this.dateIn = v;
        var self = this;
        self.superShow();
    }

    public superShow(){
        super.show();
    }

    public hide(){

    }

    public realHide(){
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this)
         super.hide();
    }



    public onShow(){
        MyTool.setHtml(this.desText,HelpManager.getInstance().getInfoText());
        if(this.desText.numLines > 1)
            this.desText.textAlign = 'left'
        else
            this.desText.textAlign = 'center'
        this.mc.source = this.dateIn.source;//'main4_png';
        this.addEventListener(egret.Event.ENTER_FRAME,this.onE,this)

        this.mc.y = -600;
        egret.Tween.removeTweens(this.mc);
        var tw:egret.Tween = egret.Tween.get(this.mc);
        tw.to({y:100},300).to({y:50},100);
    }

    private onE(){
         this.setProgress(1,1);
    }

    public setProgress(current, total):void {
        var loadPass = egret.getTimer() - this.dateIn.start
        var rate = Math.min(current / total,loadPass/this.dateIn.min)
        this.barMC.width =  rate*640
        this.rateText.text = Math.floor(rate*100) + '%';
    }


}