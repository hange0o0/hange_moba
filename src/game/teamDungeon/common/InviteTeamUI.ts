class InviteTeamUI extends game.BaseUI {
    private static instance:InviteTeamUI;
    public static getInstance() {
        if (!this.instance) this.instance = new InviteTeamUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "InviteTeamUISkin";
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;





    public data

    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('邀请好友')
        this.topUI.addEventListener('hide',this.hide,this);

        this.list.itemRenderer = InviteTeamItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }

    public hide(){
        super.hide();
    }

    public beforeHide(){
        this.clearList([this.list])
    }

    public show(data?){
        this.data = data;
        var self = this;
        var FM = FriendManager.getInstance();
        FM.getList(function(){
            self.superShow()
        })
    }

    private superShow(){
        super.show();


    }

    public onShow(){
        this.renewList();
        this.addPanelOpenEvent(GameEvent.client.friend_list_change,this.renewList)
    }

    private renewList(){
        var FM = FriendManager.getInstance();
        var list = FM.friendList.concat();
        if(FM.friendList.length < FM.maxFriendNum)
        {
            list.unshift({showFriend:true});
        }

        this.list.dataProvider = new eui.ArrayCollection(list);
    }
}