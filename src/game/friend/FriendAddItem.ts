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
        if(this.data.openid == 'npc')
            return;
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
        this.nameText.text = Base64.decode(data.nick);
        this.setText(this.levelText, '[等级：]' + data.level);
        this.setText(this.forceText,'[战力：]' + data.force);
        this.addBtn.visible = !data.send;
    }

    private setText(text,str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(text,str);
    }
}