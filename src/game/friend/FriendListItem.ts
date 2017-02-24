class FriendListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendListItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private forceText: eui.Label;
    private moreBtn: eui.Button;
    private friendText: eui.Label;
    private addFriendBtn: eui.Button;





    public index;

    public childrenCreated(){
         super.childrenCreated()

        //this.addBtnEvent(this.moreBtn,this.onMore)
        this.addBtnEvent(this.addFriendBtn,this.onAddFriend)
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.currentState == 'friend')
            OtherInfoUI.getInstance().showID(this.data)
    }

    private onAddFriend(){   //
        FriendAddUI.getInstance().show();
    }

    //private onMore(e){
    //    e.stopImmediatePropagation()
    //    OtherInfoUI.getInstance().showID(this.data)
    //}
    //
    //private onPK(e){
    //    e.stopImmediatePropagation()
    //     FriendManager.getInstance().showPKUI(this.data)
    //}

    public dataChanged(){
        var FM = FriendManager.getInstance();
        if(this.data.showFriend)
        {
            this.currentState = 'add';
            this.friendText.text = '好友数量：' + FM.friendList.length + '/' + FM.maxFriendNum;
            return;
        }

        this.currentState = 'friend';
        var data = FM.friendData[this.data].info;
        this.headMC.source = MyTool.getHeadUrl(data.head);
        this.nameText.text = data.nick;
        this.setText(this.levelText, '[等级：]' + data.level);
        this.setText(this.forceText,'[战力：]' + data.force);
    }
    private setText(text,str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(text,str);
    }
}