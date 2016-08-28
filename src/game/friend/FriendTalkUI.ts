class FriendTalkUI extends game.BaseUI {
    private static instance:FriendTalkUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendTalkUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private sendBtn: eui.Button;


    public gameid;
    public otherHead;
    public otherNick;

    public constructor() {
        super();
        this.skinName = "FriendTalkUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.list.itemRenderer = FriendTalkItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;


        this.topUI.addEventListener('hide',this.hide,this);


        this.addBtnEvent(this.sendBtn, this.onClick);


    }

    private onTimer(){
        if(!this.stage)
            return;
        FriendManager.getInstance().getLog();  //底层有30S取一次的限制
    }
    private onClick(){
        var FM = FriendManager.getInstance();
        if(UM.getFriendTalk() <= 0)
        {
            Alert('今天的聊天次数已用完')
            return;
        }
        SendTalkUI.getInstance().show(this.gameid);
    }

    public hide(){
        super.hide();
    }

    public show(id?){
        this.gameid = id;
        var self = this;
        FriendManager.getInstance().getLog(function(){
            self.superShow()
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        var FM = FriendManager.getInstance();

        if(FM.friendData[this.gameid])
        {
            var info = FM.friendData[this.gameid].info;
            this.otherHead = info.head;
            this.otherNick = info.nick;
        }
        else
        {
            var info = FM.getTalkInfo(this.gameid);
            this.otherHead = info.head;
            this.otherNick = info.nick;
        }

        this.topUI.setTitle('私聊-'+this.otherNick);
        this.renew();

        this.addPanelOpenEvent(GameEvent.client.talk_change,this.renew)
        this.addPanelOpenEvent(egret.TimerEvent.TIMER,this.onTimer)
    }

    private renew(){
        if(!this.stage)
            return;

        var FM = FriendManager.getInstance();
        var arr = FM.getTalkList(this.gameid);
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.once(egret.Event.RENDER,function(){
            this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
            console.log(this.scroller.viewport.scrollV)
        },this)

        if(FM.friendData[this.gameid])
        {
            this.sendBtn.visible = true;
            this.sendBtn.label = '发送（'+UM.getFriendTalk() + '/'+FM.maxTalk+'）'
        }
        else
        {
            this.sendBtn.visible = false;
        }


    }
}