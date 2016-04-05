class PKResultUI extends game.BaseUI {
    private static instance:PKResultUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKResultUI();
        return this.instance;
    }
    
    private scrollGroup: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;


    public constructor() {
        super();
        this.skinName = "PKResultUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);

        this.list.itemRenderer = PKResultItem2;
    }

    private onClick(){

    }


    public show(){
        super.show();
    }

    public onShow() {
        this.scroller.visible = false;
        this.scroller.viewport.scrollV = 0;
        MyTool.removeMC(PKWinUI.getInstance());
        MyTool.removeMC(PKFailUI.getInstance());

        if(PKManager.getInstance().pkResult.result)
        {
            this.addChild(PKWinUI.getInstance());
            PKWinUI.getInstance().renew();
        }
        else
        {
            this.addChild(PKFailUI.getInstance());
            PKFailUI.getInstance().renew();
        }
    }

    public showMore(item){
        this.scrollGroup.addChildAt(item,0);
        this.scroller.visible = true;
        this.list.dataProvider = new eui.ArrayCollection(PKManager.getInstance().pkList);
    }
}