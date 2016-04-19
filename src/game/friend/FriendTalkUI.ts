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


    public openid;
    public otherHead;
    public otherNick;
    public talkData;

    private timer;

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

        this.timer = new egret.Timer(1000);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer)
    }

    private onTimer(){
        FriendManager.getInstance().getLog();  //底层有30S取一次的限制
    }
    private onClick(){
        var FM = FriendManager.getInstance();
        if(UM.getFriendTalk()  >= FM.maxTalk)
        {
            Alert('今天的聊天次数已用完')
            return;
        }
        SendTalkUI.getInstance().show(this.openid);
    }

    public hide(){
        this.timer.stop();
        super.hide();
    }

    public show(id?){
        this.openid = id;
        super.show();
    }

    public onShow(){
        this.timer.start();
        var FM = FriendManager.getInstance();
        var data = this.talkData = FM.getTalkList(this.openid);
        this.otherHead = data.head;
        this.otherNick = data.nick;

        this.topUI.setTitle('私聊-'+this.otherNick);
        this.renew();
    }



    private renew(){
        var FM = FriendManager.getInstance();
        var arr = this.talkData.list;
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.once(egret.Event.RENDER,function(){
            this.scroller.viewport.scrollV = Math.min(0,this.scroller.viewport.contentHeight - this.scroller.height);
        },this)

        this.sendBtn.label = '发送（'+UM.getFriendTalk() + '/'+FM.maxTalk+'）'

    }
}