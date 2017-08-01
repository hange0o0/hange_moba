class PKResultUI extends game.BaseUI {
    private static instance:PKResultUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKResultUI();
        return this.instance;
    }

    private bg: eui.Rect;
    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private pkResultGroup: PKResultGroup;
    private topBtn: eui.Group;












    public showCardTask = false
    public openNewLevel = false

    public constructor() {
        super();
        this.skinName = "PKResultUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.topBtn, this.onTop);

        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
    }


    private onScroll(){
        var scrollV = this.scroller.viewport.scrollV;
        if(scrollV > 350)
            this.topBtn.visible = true;
        else
            this.topBtn.visible = false;
    }

    private onTop(){
        this.scroller.stopAnimation();
        var tw = egret.Tween.get(this.scroller.viewport);
        tw.to({scrollV:0},300);
        this.topBtn.visible = false;
    }

    public guideScroll(){      //13
        this.scroller.stopAnimation();
        egret.Tween.removeTweens(this.scroller.viewport);
        var tw = egret.Tween.get(this.scroller.viewport);
        tw.to({scrollV:1200},300).call(function(){
            GuideManager.getInstance().showGuide(PKResultUI.getInstance())
        },this);
    }


    public beforeHide(){
        this.pkResultGroup.beforeHide();
    }

    private onClick(){

    }

    public show(){
        super.show();
    }

    public onShow() {
        this.showCardTask = false;
        this.openNewLevel = false;
        GuideManager.getInstance().enableScrollV(this.scroller);
        PKResultUI.getInstance().initMore()
        PopUpManager.removeShape();
        this.scroller.visible = false;
        this.scroller.viewport.scrollV = 0;
        this.topBtn.visible = false;

        this.bg.visible = false;
        this.height = Math.min(GameManager.stage.stageHeight,960)
        this.y =  (GameManager.stage.stageHeight - this.height)/2


        MyTool.removeMC(PKWinUI.getInstance());
        MyTool.removeMC(PKFailUI.getInstance());
        var PKM = PKManager.getInstance();

        if(PKM.isWin)
        {
            this.addChild(PKWinUI.getInstance());
            PKWinUI.getInstance().renew();
            SoundManager.getInstance().playEffect(SoundConfig.pk_win);
        }
        else
        {
            this.addChild(PKFailUI.getInstance());
            PKFailUI.getInstance().renew();
            SoundManager.getInstance().playEffect(SoundConfig.pk_loss);
        }

        SoundManager.getInstance().playSound(SoundConfig.bg_pk_view);
    }

    public showBG(){
        this.bg.visible = true;
        this.bg.alpha = 0;
        var tw:egret.Tween = egret.Tween.get(this.bg);
        tw.to({alpha:0.7},500);

    }

    //public tempHide(){
    //    MyTool.removeMC(PKMainUI.getInstance())
    //    MyTool.removeMC(this)
    //}
    public reShow(){
        var index = GameManager.container.getChildIndex(this)
        GameManager.container.addChildAt(PKMainUI.getInstance(),index);
        //this.visible = true;
        //GameManager.container.addChild(this);
    }

    public hide(){
        super.hide();
        MainPageUI.getInstance().renewTask();
        SoundManager.getInstance().playSound(SoundConfig.bg);
        PKMainUI.getInstance().hide();
        if(this.showCardTask)
            MyCardTaskUI.getInstance().testShow();
    }

    public initMore(){
       this.pkResultGroup.renew()
    }

    public showMore(item){

        this.scrollGroup.addChildAt(item,0);
        this.scroller.visible = true;



        GuideManager.getInstance().showGuide(this);
        //this.moreGroup.alpha = 0;

        this.pkResultGroup.showMore();

    }
}