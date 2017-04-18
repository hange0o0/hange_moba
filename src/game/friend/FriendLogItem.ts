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
        this.addBtnEvent(this.headMC,this.onClick)
        //this.addBtnEvent(this.headMC,this.onClick)
    }

    private onClick(){
        if(this.data.from_gameid == UM.gameid)//我请求的
            OtherInfoUI.getInstance().showID(this.data.to_gameid)
        else
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

        this.btnGroup.visible = true;
        if(this.data.type == 3)  //聊天
        {
            if(FM.friendData[this.data.from_gameid] || FM.friendData[this.data.to_gameid]) //是好友
                this.currentState = 'talk';
            else
                this.currentState = 'talk2';

            var gameid = UM.gameid == this.data.from_gameid?this.data.to_gameid:this.data.from_gameid
            if(FM.friendData[gameid])
            {
                var info = FM.friendData[gameid].info;
            }
            else
            {
                var info = FM.getTalkInfo(gameid);
            }

            var arr = FM.getTalkList(gameid);

            this.nameText.text = info.nick;
            this.headMC.source = MyTool.getHeadUrl(info.head);
            this.talkText.text =  StringUtil.getString(arr[arr.length-1].talk,this.talkText);
        }
        else
        {
            this.currentState = 'log';
            this.nameText.text = this.data.content.nick;
            this.setText(this.levelText, '[等级：]' + this.data.content.level);
            this.setText(this.forceText,'[战力：]' + this.data.content.force);
            this.headMC.source = MyTool.getHeadUrl(this.data.content.head);

            if(FM.friendData[this.data.from_gameid])
            {
                this.btnGroup.visible = false;
            }

        }

        this.dateText.text = '' + DateUtil.formatDate('MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time));

    }

    private setText(text,str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(text,str);
    }
}