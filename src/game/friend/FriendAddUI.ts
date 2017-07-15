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

    private refreshBtn: eui.Button;
    private closeBtn: eui.Button;
    private list: eui.List;
    private emptyText: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn, this.hide);
        this.addBtnEvent(this.refreshBtn, this.onSearch);
        this.setTitle('添加好友')

        this.list.itemRenderer = FriendAddItem;
    }
    public beforeHide(){
        this.clearList([this.list])
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

        if(TaskManager.getInstance().nowAction == 'friend')
        {
            this.list.validateNow()
            TaskManager.getInstance().showGuideMC(this.list.getChildAt(0)['addBtn'])
        }
    }

    public renew(){
        var FM = FriendManager.getInstance();
        this.onTimer();
        var stat =  UM.active.stat || {};
        if(!stat['friend'])
        {
            var arr = FM.missArray
            arr.unshift({
                openid:'npc',
                nick:Base64.encode('卡卡'),
                head:'5',
                level:'1',
                force:'1'
            })
            if(arr.length > 5)
                arr.length  = 5;
            this.list.dataProvider = new eui.ArrayCollection(arr);
        }
        else
        {
            this.list.dataProvider = new eui.ArrayCollection(FM.missArray);
        }

        this.emptyText.visible = FM.missArray.length == 0;
    }
}