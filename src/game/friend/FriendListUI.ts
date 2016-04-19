class FriendListUI extends game.BaseUI {
    private static instance:FriendListUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendListUI();
        return this.instance;
    }

    private topUI: TopUI;
    private tab: eui.TabBar;
    private scroller: eui.Scroller;
    private list: eui.List;
    private searchBtn: eui.Button;





    private  selectIndex;

    public constructor() {
        super();
        this.skinName = "FriendListUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        super.childrenCreated();
        this.topUI.setTitle('好友')
        this.topUI.addEventListener('hide',this.hide,this);

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.typeBarClick, this);
        this.tab.selectedIndex = 0;

        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

        this.addBtnEvent(this.searchBtn, this.onSearch);
    }

    private onSearch(){
        FriendSearchUI.getInstance().show();
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
            this.tab.selectedIndex = this.selectIndex - 1;
        }
        this.renew();
    }

    public renew(){
        var FM = FriendManager.getInstance();
        var self = this;
        this.list.dataProvider = new eui.ArrayCollection([]);
        if(this.tab.selectedIndex == 0)//好友列表
        {
            FM.getList(function(){
                self.renewFriend()
            })

        }
        else if(this.tab.selectedIndex == 1)//好友日志
        {
            FM.getLog(function(){
                self.renewLog()
            })
        }
        else if(this.tab.selectedIndex == 2)//最近PK
        {
            FM.getLog(function(){
                self.renewPK()
            })
        }
    }

    private renewFriend(){
        var FM = FriendManager.getInstance();
        this.list.itemRenderer = FriendListItem;
        this.list.dataProvider = new eui.ArrayCollection(FM.friendList)
    }

    private renewLog(){
        var FM = FriendManager.getInstance();
        this.list.itemRenderer = FriendLogItem;
        this.list.dataProvider = new eui.ArrayCollection(FM.logList)
    }

    private renewPK(){
        var FM = FriendManager.getInstance();
        this.list.itemRenderer = FriendPKItem;
        this.list.dataProvider = new eui.ArrayCollection(FM.getPKArray())

    }

}