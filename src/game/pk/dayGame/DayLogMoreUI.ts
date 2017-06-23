class DayLogMoreUI extends game.BaseUI {
    private static instance:DayLogMoreUI;

    public static getInstance() {
        if (!this.instance) this.instance = new DayLogMoreUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private pkResultGroup: PKResultGroup;



    private dataIn;

    public constructor() {
        super();
        this.skinName = "DayLogMoreSkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('对战详情')
        this.topUI.addEventListener('hide', this.hide, this);


        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

    }

    public beforeHide(){
        this.pkResultGroup.beforeHide();
    }

    public hide(){
        super.hide();
    }

    public show(v?){
        this.dataIn = v;
        super.show();
    }


    public onShow(){
        this.scroller.viewport.scrollV - 0;
          this.pkResultGroup.renew()
    }



}

