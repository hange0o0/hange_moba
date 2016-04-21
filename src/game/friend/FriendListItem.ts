class FriendListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendListItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private forceText: eui.Label;
    private talkBtn: eui.Button;
    private pkBtn: eui.Button;




    public index;

    public childrenCreated(){
         super.childrenCreated()
        this.addBtnEvent(this.talkBtn,this.onTalk)
        this.addBtnEvent(this.pkBtn,this.onPK)
    }

    private onTalk(){
        FriendTalkUI.getInstance().show(this.data)
    }

    private onPK(){
         FriendManager.getInstance().showPKUI(this.data)
    }

    public dataChanged(){
        var data = FriendManager.getInstance().friendData[this.data].info;
        this.headMC.source = MyTool.getHeadUrl(data.head);
        this.nameText.text = data.nick;
        this.levelText.text = data.level;
        this.forceText.text = data.force;
    }
}