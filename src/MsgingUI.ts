class MsgingUI extends egret.Sprite {

    private static instance:MsgingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MsgingUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.createView();
    }

    private loadingMC
    private shape

    private timer

    private createView():void {

        this.shape = new eui.Rect();
        this.shape.width = 640;
        this.shape.fillColor = 0;
        this.shape.fillAlpha = 0.3;
        this.shape.touchEnabled = true;
        this.addChild(this.shape)




        this.loadingMC = new eui.Image();
        //this.loadingMC.scaleX = this.loadingMC.scaleY = 1.5
        this.loadingMC.source = 'ui_loading_png'
        this.addChild(this.loadingMC);
        this.loadingMC.x = 320;
        this.loadingMC.anchorOffsetX = 42
        this.loadingMC.anchorOffsetY = 38

    }

    public show(){
        GameManager.container.addChild(this);

        this.width = 640;
        this.height = GameManager.stage.stageHeight;
        this.shape.height = GameManager.stage.stageHeight;
        this.loadingMC.y = this.height/2 - 100;

        var tw = egret.Tween.get(this.loadingMC,{loop:true})
        tw.to({rotation:0}).to({rotation:-360},1000);

        this.visible = false;
        egret.clearTimeout(this.timer);
        this.timer = egret.setTimeout(function(){
            this.visible = true;
        },this,200)
    }


    public hide(){
        egret.Tween.removeTweens(this.loadingMC)
        MyTool.removeMC(this);
    }
}
