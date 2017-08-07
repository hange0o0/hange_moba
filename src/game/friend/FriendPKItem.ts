class FriendPKItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendPKItemSkin";
    }



    private headMC: eui.Image;
    private nameText: eui.Label;
    private icon: eui.Image;
    private btnGroup: eui.Group;
    private refuseBtn: eui.Button;
    private talkText: eui.Label;
    private dateText: eui.Label;


    private state = 0;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.refuseBtn,this.onClickBtn)
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.data.from_gameid == UM.gameid)//我请求的
            OtherInfoUI.getInstance().showID(this.data.to_gameid)
        else
            OtherInfoUI.getInstance().showID(this.data.from_gameid)
    }

    private onClickBtn(e){
        e.stopImmediatePropagation()
        var FPKM = FriendPKManager.getInstance();
        if(this.state == 3)//看录像
        {
            FPKM.playBack(this.data.id,function(){
                PKMainUI.getInstance().show(null,true);
            });
        }
        else if(this.state == 2) //应战
        {
            FriendPKAskUI.getInstance().show(this.data,true);
        }
        else //等待
        {
            FriendPKViewUI.getInstance().show(this.data);
        }
    }

    public dataChanged(){

        var FM = FriendManager.getInstance();
        var fromNick = this.getNick(this.data.from_gameid,this.data.content.fromnick);
        var toNick = this.getNick(this.data.to_gameid,this.data.content.tonick);
        var fromHead = this.getHead(this.data.from_gameid,this.data.content.fromhead);
        var toHead = this.getHead(this.data.to_gameid,this.data.content.tohead);
        this.dateText.text = '失效时间：' + DateUtil.getStringBySecond(Math.max(0,this.data.time+3600*24*3 - TM.now()));
        this.icon.visible = true;
        this.talkText.x = 170
        this.refuseBtn.skinName = 'Btn_r1Skin'

        if(this.data.from_gameid == UM.gameid)//我请求的
        {
            this.headMC.source = MyTool.getHeadUrl(toHead);
            this.setHtml(this.nameText, '<font color="#CCB48E">' + toNick + ' </font>(应战方)');
            this.nameText.textColor = 0x485EA8;
            if(this.data.content.answer_choose)//对方已应战
            {
                if(this.data.content.result)//对方胜
                {
                    this.talkText.textColor = 0x75BCFF;
                    this.talkText.text = '你被打败了。。';
                    this.icon.source = 'lose_icon_png';
                }
                else
                {
                    this.talkText.textColor = 0xFFEE66;
                    this.talkText.text = '你取得了胜利！';
                    this.icon.source = 'win_icon_png';
                }
                this.refuseBtn.label = '录像'
                this.refuseBtn.skinName = 'Btn_b1Skin'
                this.state = 3;
            }
            else
            {
                this.icon.visible = false;
                this.talkText.text = '等待对方应战中。。。'
                this.refuseBtn.label = '查看'
                this.talkText.textColor = 0xCCB48E;
                this.state = 1;
            }
        }
        else    //对方请求
        {
            this.headMC.source = MyTool.getHeadUrl(fromHead);
            this.setHtml(this.nameText,'<font color="#CCB48E">' + fromNick + ' </font>(挑战方)');
            this.nameText.textColor = 0x9F3E3E;
            if(this.data.content.answer_choose)//对方已应战
            {
                if(this.data.content.result)//我方胜
                {
                    this.talkText.textColor = 0xFFEE66;
                    this.talkText.text = '你取得了胜利！';
                    this.icon.source = 'win_icon_png';
                }
                else
                {
                    this.talkText.textColor = 0x75BCFF;
                    this.talkText.text = '你被打败了。。';
                    this.icon.source = 'lose_icon_png';
                }
                this.refuseBtn.label = '录像'
                this.refuseBtn.skinName = 'Btn_b1Skin'
                this.state = 3;
            }
            else
            {
                this.icon.visible = false;
                this.talkText.text = this.data.content.talk || '可敢与我一战！？'
                this.refuseBtn.label = '应战'
                this.state = 2;
            }
        }

        if(!this.icon.visible)
            this.talkText.x = 130
    }

    private getNick(gameid,nick){
        var FM = FriendManager.getInstance();
        if(FM.friendData[gameid] && FM.friendData[gameid].info)
            nick = FM.friendData[gameid].info.nick;

        return nick;
    }

    private getHead(gameid,head){
        var FM = FriendManager.getInstance();
        if(FM.friendData[gameid] && FM.friendData[gameid].info)
            head = FM.friendData[gameid].info.head;

        return head;
    }
}