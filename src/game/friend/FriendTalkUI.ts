class FriendTalkUI extends game.BaseUI {
    private static instance:FriendTalkUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendTalkUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private btnGroup: eui.Group;
    private closeBtn: eui.Button;
    private sendBtn: eui.Button;



    private vGroup = new VScrollerGroup();


    public gameid;
    public otherHead;
    public otherNick;

    public lastTalkArr

    public constructor() {
        super();
        this.skinName = "FriendTalkUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        //this.list.itemRenderer = FriendTalkItem;
        //this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;


        this.scrollGroup.addChild(this.vGroup)
        this.vGroup.itemRenderer = FriendTalkItem;
        this.vGroup.scroller = this.scroller;
        this.vGroup.margin = 20;
        this.vGroup.initScroller(this.scroller);

        this.topUI.addEventListener('hide',this.hide,this);


        this.addBtnEvent(this.sendBtn, this.onClick);
        this.addBtnEvent(this.closeBtn, this.hide);


    }

    public beforeHide(){
        this.vGroup.clean()
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

        this.addPanelOpenEvent(GameEvent.client.talk_change,this.onTalkChange)
        this.addPanelOpenEvent(egret.TimerEvent.TIMER,this.onTimer)
    }

    private onTalkChange(){
        var FM = FriendManager.getInstance();
        var arr = FM.getTalkList(this.gameid);

        var addList = [];
        for(var i=arr.length-1;i>=0;i--)
        {
            if(arr[i].id > this.lastTalkArr[i].id)
                addList.unshift(this.lastTalkArr[i]);
        }
        this.lastTalkArr = arr;

        for(var i=0;i<addList.length;i++)
        {
            this.vGroup.addItem(addList[i]);
        }


        if(FM.friendData[this.gameid])
        {
            this.btnGroup.addChild(this.sendBtn);
            this.sendBtn.label = '发送（'+UM.getFriendTalk() + '/'+FM.maxTalk+'）'
        }
        else
        {
            MyTool.removeMC(this.sendBtn);
        }
        this.vGroup.scrollToLast()
    }

    private renew(){
        if(!this.stage)
            return;

        var FM = FriendManager.getInstance();
        var arr = this.lastTalkArr = FM.getTalkList(this.gameid);
        this.vGroup.setData(arr);

        this.validateNow();
        this.vGroup.scrollToLast();
        //egret.setTimeout(function(){
        //    this.vGroup.scrollToLast();
        //},this,100)
        //this.once(egret.Event.ENTER_FRAME,function(){
        //    this.scroller.viewport.scrollV = Math.max(0,this.scroller.viewport.contentHeight - this.scroller.height);
        //    //console.log(this.scroller.viewport.scrollV)
        //},this)

        if(FM.friendData[this.gameid])
        {
            this.btnGroup.addChild(this.sendBtn);
            this.sendBtn.label = '发送（'+UM.getFriendTalk() + '/'+FM.maxTalk+'）'
        }
        else
        {
            MyTool.removeMC(this.sendBtn);
        }


    }
}