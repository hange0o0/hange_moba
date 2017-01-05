class FriendLogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendLogItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private infoGroup: eui.Group;
    private levelText: eui.Label;
    private forceText: eui.Label;
    private btnGroup: eui.Group;
    private agreeBtn: eui.Button;
    private refuseBtn: eui.Button;
    private talkText: eui.Label;
    private dateText: eui.Label;




    public index;

    public childrenCreated(){
        super.childrenCreated()
        this.addBtnEvent(this.agreeBtn,this.onAgree)
        this.addBtnEvent(this.refuseBtn,this.onRefuse)
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data.from_gameid)
    }

    private onAgree(e){
            e.stopImmediatePropagation()
        var FM = FriendManager.getInstance();
        var self = this;
        FM.agree(this.data.id,function(){
             self.btnGroup.visible = false;
        })
    }

    private onRefuse(e){
        e.stopImmediatePropagation()
        var FM = FriendManager.getInstance();
        if(this.data.type == 3)  //聊天
        {
            if(UM.gameid == this.data.from_gameid)
                 FriendTalkUI.getInstance().show(this.data.to_gameid);
            else
                 FriendTalkUI.getInstance().show(this.data.from_gameid);
        }
        else
        {
            var self = this;
            FM.refuse(this.data.id,function(){
                self.btnGroup.visible = false;
            })
        }
    }

    public dataChanged(){
        var FM = FriendManager.getInstance();
        this.headMC.source = MyTool.getHeadUrl(this.data.head);
        this.btnGroup.visible = true;
        this.nameText.text = this.data.content.nick;
        if(this.data.type == 3)  //聊天
        {

            this.talkText.text =  StringUtil.getString(this.data.content.talk,this.talkText);
            if(FM.friendData[this.data.from_gameid]) //是好友
                this.currentState = 'talk';
            else
                this.currentState = 'talk2';
        }
        else
        {
            this.currentState = 'log';
            this.nameText.text = this.data.content.nick;
            this.levelText.text = 'LV.' + this.data.content.level;
            this.forceText.text = '战力：' + this.data.content.force;

        }

        this.dateText.text = '' + DateUtil.formatDate('MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time));

    }
}