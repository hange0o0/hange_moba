class FriendAddUI extends game.BaseWindow {
    private static instance:FriendAddUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendAddUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "FriendAddUISkin";
    }

    private titleText: eui.Label;
    private refreshBtn: eui.Button;
    private closeBtn: eui.Button;
    private list: eui.List;
    private emptyText: eui.Label;



    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn, this.hide);
        this.addBtnEvent(this.refreshBtn, this.onSearch);

        this.list.itemRenderer = FriendAddItem;
    }

    private onSearch(){
         if(this.refreshBtn.skinName == 'Btn_r2Skin')
         {
             var self = this;
             FriendManager.getInstance().friend_miss(function(){
                 self.renew();
             });
         }
    }
    private onTimer(){
        var FM = FriendManager.getInstance();
        var cd = 60 - (TM.now() - FM.missTime)
        if(cd < 0)
        {
            this.refreshBtn.label = '刷新';
            this.refreshBtn.skinName = 'Btn_r2Skin'
        }
        else
        {
            this.refreshBtn.label = '刷新（'+cd+')';
            this.refreshBtn.skinName = 'Btn_d2Skin'
        }
    }

    public show(){
        var self = this;
        FriendManager.getInstance().friend_miss(function(){
            self.superShow();
        });

    }

    private superShow(){
        super.show();

    }

    public onShow(){
         this.renew();
        this.addPanelOpenEvent('timer',this.onTimer)
    }

    public renew(){
        var FM = FriendManager.getInstance();
        this.onTimer();
        this.list.dataProvider = new eui.ArrayCollection(FM.missArray);
        this.emptyText.visible = FM.missArray.length == 0;
    }
}