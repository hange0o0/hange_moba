class CollectUI extends game.BaseUI {
    private static instance:CollectUI;
    public static getInstance() {
        if (!this.instance) this.instance = new CollectUI();
        return this.instance;
    }

    private  typeTab: eui.TabBar;

    private selectIndex;
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);

        this.typeTab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);
    }

    private typeBarClick(){
        this.renew();
    }

    public show(index?){
        this.selectIndex = index
        super.show();
    }

    public onShow(){
        if(this.selectIndex)
        {
            this.typeTab.selectedIndex = this.selectIndex - 1;
        }
        this.renew();
    }

    public renew(){
        if(this.typeTab.selectedIndex == 0)//碎片列表  （升级，分解）
        {
            this.renewList();
        }
        else if(this.typeTab.selectedIndex == 1)//抽奖
        {
            this.renewDraw();
        }
    }

    public renewList(){

    }

    public renewDraw(){

    }
}