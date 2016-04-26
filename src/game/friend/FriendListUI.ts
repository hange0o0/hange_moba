class FriendListUI extends game.BaseUI {
    private static instance:FriendListUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendListUI();
        return this.instance;
    }

    private infoText: eui.Label;
    private topUI: TopUI;
    private searchBtn: eui.Button;
    private tab: eui.TabBar;
    private scroller: eui.Scroller;
    private list: eui.List;






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

        this.addBtnEvent(this.searchBtn, this.onSearch);
        EM.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this)
        EM.addEventListener(GameEvent.client.friend_log_change,this.renewLogE,this)
        EM.addEventListener(GameEvent.client.friend_pk_change,this.renewPKE,this)
    }

    private renewLogE(){
        this.renewLog()
        this.renewInfo();
    }
    private renewPKE(){
        this.renewPK()
        this.renewInfo();
    }

    private onTimer(){
        if(!this.stage)
            return;
        this.infoCount --;
        if(this.infoCount <=0)
        {
            this.infoCount = 5;
            this.infoType ++;
            if(this.infoType > 1)
                this.infoType = 0
            this.renewInfo();
        }
    }

    private renewInfo(){
        var FM = FriendManager.getInstance();
        if(this.infoType == 0)
        {
            this.infoText.text = '好友数量：' + FM.friendList.length + '/' + FM.maxFriendNum;
        }
        else
        {
            this.infoText.text = '今日PK：' + UM.getFriendPKTimes() + '/' + FM.maxPK;
        }
    }

    private onSearch(){
        FriendSearchUI.getInstance().show();
    }

    private typeBarClick(){
        this.renew();
    }

    public show(index?){
        this.selectIndex = index;

        var self = this;
        FriendManager.getInstance().getList(function(){
            self.superShow()
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
    }

    public renew(){
        var FM = FriendManager.getInstance();
        var self = this;
        this.list.dataProvider = new eui.ArrayCollection([]);
        this.renewInfo();
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