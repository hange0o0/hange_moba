class FriendTalkItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendTalkItemSkin";
    }

    private headMC: eui.Image;
    private talkText: eui.Label;
    private dayText: eui.Label;



    public index;

    public childrenCreated(){
        super.childrenCreated();
    }

    public dataChanged(){
        if(this.data.stat == 1) //自己
        {
            this.currentState = 'other';
            this.headMC.source = MyTool.getHeadUrl(FriendTalkUI.getInstance().otherHead);
        }
        else
        {
            this.currentState = 'self';
            this.headMC.source = MyTool.getHeadUrl(UM.head);
        }

        this.talkText.text = this.data.talk;
        this.dayText.text = DateUtil.formatDate('yyyy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time));
    }
}