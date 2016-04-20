class FriendPKItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendPKItemSkin";
    }



    private headMC: eui.Image;
    private nameText: eui.Label;
    private btnGroup: eui.Group;
    private refuseBtn: eui.Button;
    private talkText: eui.Label;
    private dateText: eui.Label;

    private state = 0;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.refuseBtn,this.onClick)
    }

    private onClick(){
        var FPKM = FriendPKManager.getInstance();
        if(this.state == 3)//看录像
        {

        }
        else if(this.state == 2) //应战
        {

        }
        else //等待
        {

        }
    }

    public dataChanged(){
        this.headMC.source = MyTool.getHeadUrl(this.data.content.head);
        var FM = FriendManager.getInstance();
        var fromNick = this.getNick(this.data.from_gameid,this.data.content.fromnick);
        var toNick = this.getNick(this.data.to_gameid,this.data.content.tonick);
        this.dateText.text = '剩余时间：' + DateUtil.getStringBySecond(Math.max(0,this.data.time+3600*24*3 - TM.now()));
        if(this.data.from_gameid == UM.openid)//我请求的
        {
            this.nameText.text =  '你向【' + toNick + '】发出了挑战';
            if(this.data.content.answer_choose)//对方已应战
            {
                if(this.data.content.result)//对方胜
                    this.talkText.text = '你被打败了。。';
                else
                    this.talkText.text = '你取得了胜利！';
                this.refuseBtn.label = '录像'
                this.state = 3;
            }
            else
            {
                this.talkText.text = '等待对方应战中。。。'
                this.refuseBtn.label = '查看'
                this.state = 1;
            }
        }
        else    //对方请求
        {
            this.nameText.text =  '【' + fromNick + '】向你挑战';
            if(this.data.content.answer_choose)//对方已应战
            {
                if(this.data.content.result)//我方胜
                    this.talkText.text = '你取得了胜利！';
                else
                    this.talkText.text = '你被打败了。。';
                this.refuseBtn.label = '录像'
                this.state = 3;
            }
            else
            {
                this.talkText.text = this.data.content.talk || '可敢与我一战！？'
                this.refuseBtn.label = '应战'
                this.state = 2;
            }
        }
    }

    private getNick(gameid,nick){
        var FM = FriendManager.getInstance();
        if(FM.friendData[gameid] && FM.friendData[gameid].info)
            nick = FM.friendData[gameid].info.nick;

        return nick;
    }
}