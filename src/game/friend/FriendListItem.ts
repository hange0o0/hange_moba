class FriendListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendListItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private forceText: eui.Label;
    private pkBtn: eui.Button;
    private moreBtn: eui.Button;




    public index;

    public childrenCreated(){
         super.childrenCreated()

        this.addBtnEvent(this.moreBtn,this.onMore)
        this.addBtnEvent(this.pkBtn,this.onPK)
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data)
    }

    private onMore(e){
        e.stopImmediatePropagation()
        OtherInfoUI.getInstance().showID(this.data)
    }

    private onPK(e){
        e.stopImmediatePropagation()
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