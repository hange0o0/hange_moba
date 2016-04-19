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
        FriendTalkUI.getInstance().show(this.data.id)
    }

    private onPK(){

    }

    public dataChanged(){
        this.headMC.source = MyTool.getHeadUrl(this.data.head);
        this.nameText.text = this.data.nick;
        this.levelText.text = this.data.level;
        this.forceText.text = this.data.force;
    }
}