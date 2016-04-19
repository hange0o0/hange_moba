class FriendTalkItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendTalkItemSkin";
    }

    private headMC: eui.Image;
    private talkText: eui.Label;
    private dayText: eui.Label;
    private moreBtn: eui.Button;



    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.moreBtn,this.onMore);
    }

    private onMore(){

    }

    public dataChanged(){
        if(this.data == 'longer')
        {
            this.currentState = 'longer'
        }
        else if(this.data.stat == 1) //自己
        {
            this.currentState = 'self';
            this.headMC.source = MyTool.getHeadUrl(UM.head);
        }
        else
        {
            this.currentState = 'other';
            this.headMC.source = MyTool.getHeadUrl(FriendTalkUI.getInstance().otherHead);
        }

        this.talkText.text = this.data.talk;
        this.dayText.text = DateUtil.formatDate('yyyy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time));
    }
}