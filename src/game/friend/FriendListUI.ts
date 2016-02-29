class FriendListUI extends game.BaseUI {
    private static instance:FriendListUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendListUI();
        return this.instance;
    }

    private  typeTab: eui.TabBar;




    private  selectIndex;

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.typeTab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

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
        if(this.typeTab.selectedIndex == 0)//好友列表
        {
            this.renewFriend()
        }
        else if(this.typeTab.selectedIndex == 1)//好友日志
        {
            this.renewLog();
        }
        else if(this.typeTab.selectedIndex == 2)//最近PK
        {
            this.renewPK();
        }
    }

    private renewFriend(){

    }

    private renewLog(){

    }

    private renewPK(){

    }

}