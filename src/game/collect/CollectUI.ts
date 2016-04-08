class CollectUI extends game.BaseUI {
    private static instance:CollectUI;
    public static getInstance() {
        if (!this.instance) this.instance = new CollectUI();
        return this.instance;
    }

    private  list: eui.List;
    private  scroller: eui.Scroller;

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);

        this.list.itemRenderer = CollectItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }

    private typeBarClick(){
        this.renew();
    }

    public show(){
        var self = this;
        CollectManager.getInstance().getCollectMore(function(){
            self.superShow();
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renew();
    }

    public renew(){
        this.renewList();
        this.renewDraw();
    }

    public renewList(){
        this.list.dataProvider = new eui.ArrayCollection(CollectManager.getInstance().getList())
    }

    public renewDraw(){

    }
}