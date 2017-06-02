class InviteTeamUI extends game.BaseWindow {
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
        var list = FriendManager.getInstance().friendList;
        this.list.dataProvider = new eui.ArrayCollection(list);
    }
}