class FriendAddItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendAddItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private forceText: eui.Label;
    private addBtn: eui.Button;






    public index;

    public childrenCreated(){
        super.childrenCreated()
        this.addBtnEvent(this.addBtn,this.onAddFriend)
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data.openid)
    }

    private onAddFriend(e){   //
        e.stopImmediatePropagation();
        var self = this;
        FriendManager.getInstance().apply(this.data.openid,function(){
            self.data.send = true;
            self.addBtn.visible = false;
        })
    }
    public dataChanged(){
        var data = this.data;
        this.headMC.source = MyTool.getHeadUrl(data.head);
        this.nameText.text = data.nick;
        this.levelText.text = 'LV.' + data.level;
        this.forceText.text = '战力：' + data.force;
        this.addBtn.visible = !data.send;
    }
}