class FriendListUI extends game.BaseUI {
    private static instance:FriendListUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendListUI();
        return this.instance;
    }

    private infoText: eui.Label;
    private topUI: TopUI;
    private tab: eui.TabBar;
    private scroller: eui.Scroller;
    private list: eui.List;
    private emptyText: eui.Label;
    private red1: eui.Image;
    private red2: eui.Image;








    private  selectIndex;

    private infoCount
    private infoType

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

        //this.addBtnEvent(this.searchBtn, this.onSearch);

    }

    private renewRed(){
        var FM = FriendManager.getInstance();
        this.red1.visible = FM.logRed();
        this.red2.visible = FM.pkRed();
    }

    public beforeHide(){
        this.clearList([this.list])
    }

    private renewListE(){
        if(this.tab.selectedIndex == 0)
            this.renewFriend()
        //this.renewInfo();
    }
    private renewLogE(){
        if(this.tab.selectedIndex == 1)
            this.renewLog()
        //this.renewInfo();
    }
    private renewPKE(){
        if(this.tab.selectedIndex == 2)
            this.renewPK()
        //this.renewInfo();
    }

    //private onTimer(){
    //    if(!this.stage)
    //        return;
    //    this.infoCount --;
    //    if(this.infoCount <=0)
    //    {
    //        this.infoCount = 5;
    //        this.infoType ++;
    //        if(this.infoType > 1)
    //            this.infoType = 0
    //        this.renewInfo();
    //    }
    //}

    //private renewInfo(){
    //    var FM = FriendManager.getInstance();
    //    if(this.infoType == 0)
    //    {
    //        this.infoText.text = '好友数量：' + FM.friendList.length + '/' + FM.maxFriendNum;
    //    }
    //    else
    //    {
    //        this.infoText.text = '今日PK：' + UM.getFriendPKTimes() + '/' + FM.maxPK;
    //    }
    //}

    private onSearch(){
        FriendSearchUI.getInstance().show();
    }

    private typeBarClick(){
        if(this.tab.selectedIndex == 3)
        {
            this.tab.selectedIndex = this.selectIndex;
            this.onSearch();
            return;
        }
        var FM = FriendManager.getInstance();
        if(this.tab.selectedIndex == 1)
            FM.setOpen('log');
        else if(this.tab.selectedIndex == 2)
            FM.setOpen('pk');
        this.selectIndex = this.tab.selectedIndex;
        this.renew();
    }

    public show(index?){
        if(UM.level < Config.friendLevel)
        {
            Alert('好友系统'+Config.friendLevel+'级开放')
            return;
        }
        this.selectIndex = index;

        var self = this;
        var FM = FriendManager.getInstance();
        FM.getList(function(){
            FM.getLog(function(){
                self.superShow()
            })
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        if(this.selectIndex)
        {
            this.tab.selectedIndex = this.selectIndex - 1;
        }

        this.infoCount = 5;
        this.infoType = 0
        this.renew();
        this.renewRed();
        //EM.dispatchEventWith(GameEvent.client.friend_red_change)
        //this.addPanelOpenEvent(egret.TimerEvent.TIMER,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.friend_log_change,this.renewLogE)
        this.addPanelOpenEvent(GameEvent.client.friend_pk_change,this.renewPKE)
        this.addPanelOpenEvent(GameEvent.client.friend_list_change,this.renewListE)
        this.addPanelOpenEvent(GameEvent.client.friend_red_change,this.renewRed)


    }

    public renew(){
        var FM = FriendManager.getInstance();
        var self = this;
        this.list.dataProvider = new eui.ArrayCollection([]);
        //this.renewInfo();
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

        var list = FM.friendList.concat();
        if(FM.friendList.length < FM.maxFriendNum)
        {
            list.unshift({showFriend:true});
        }
        this.list.dataProvider = new eui.ArrayCollection(list)
        this.emptyText.visible = false;
    }

    private renewLog(){

        var FM = FriendManager.getInstance();
        this.list.itemRenderer = FriendLogItem;
        FM.removeTimeOut(FM.logList);
        this.list.dataProvider = new eui.ArrayCollection(FM.logList)
        this.emptyText.visible = FM.logList.length == 0;
    }

    private renewPK(){

        var FM = FriendManager.getInstance();
        this.list.itemRenderer = FriendPKItem;
        var pkArr = FM.getPKArray();
        this.list.dataProvider = new eui.ArrayCollection(pkArr)
        this.emptyText.visible = pkArr.length == 0;

    }

}