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
    }

    private onAgree(){
        var FM = FriendManager.getInstance();
        var self = this;
        FM.agree(this.data.id,function(){
             self.btnGroup.visible = false;
        })
    }

    private onRefuse(){
        var FM = FriendManager.getInstance();
        if(this.data.type == 3)  //聊天
        {
             FriendTalkUI.getInstance().show(this.data.from);
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
        this.headMC.source = MyTool.getHeadUrl(this.data.head);
        this.btnGroup.visible = true;
        this.nameText.text = this.data.content.nick;
        if(this.data.type == 3)  //聊天
        {
            this.currentState = 'talk';
            this.talkText.text =  StringUtil.getString(this.data.content.talk,this.talkText);
        }
        else
        {
            this.currentState = 'log';
            this.nameText.text = this.data.content.nick;
            this.levelText.text = this.data.content.level;
            this.forceText.text = this.data.content.force;

        }

        this.dateText.text = '' + DateUtil.formatDate('MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time));

    }
}