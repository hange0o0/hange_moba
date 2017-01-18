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



        var data:any = RES.getRes("ui_loading" +  "_json"); //qid
        var texture:egret.Texture = RES.getRes("ui_loading" + "_png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        this.loadingMC = new egret.MovieClip();
        this.loadingMC.scaleX = this.loadingMC.scaleY = 1.5
        this.addChild(this.loadingMC);
        this.loadingMC.movieClipData = mcFactory.generateMovieClipData('ui_loading');
        this.loadingMC.x = 290;

    }

    public show(){
        GameManager.container.addChild(this);

        this.width = 640;
        this.height = GameManager.stage.stageHeight;
        this.shape.height = GameManager.stage.stageHeight;
        this.loadingMC.gotoAndPlay(1,-1)
        this.loadingMC.y = this.height/2 - 100;

        this.visible = false;
        egret.clearTimeout(this.timer);
        this.timer = egret.setTimeout(function(){
            this.visible = true;
        },this,200)
    }


    public hide(){
        MyTool.removeMC(this);
        this.loadingMC.stop();
    }
}
