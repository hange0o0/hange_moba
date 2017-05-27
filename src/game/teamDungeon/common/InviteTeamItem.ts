class InviteTeamItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "InviteTeamItemSkin";
    }


    private headMC: eui.Image;
    private nameText: eui.Label;
    private forceText: eui.Label;
    private levelText: eui.Label;
    private inviteBtn: eui.Button;




    public childrenCreated() {
        this.addBtnEvent(this.inviteBtn,this.onInvite)
        this.addBtnEvent(this.headMC,this.onClick)
    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data)
    }

    private onInvite(){   //
        this.inviteBtn.visible = false;
        var type = InviteTeamUI.getInstance().data;
        TeamDungeonManager.getInstance().inviteTeam(type,this.data)
    }

    public dataChanged(){
        var FM = FriendManager.getInstance();
        var data = FM.friendData[this.data].info;
        this.headMC.source = MyTool.getHeadUrl(data.head);
        this.nameText.text = data.nick;
        this.setText(this.levelText, '[等级：]' + data.level);
        this.setText(this.forceText,'[战力：]' + data.force);
        var lastInvite = TeamDungeonManager.getInstance().invideList[InviteTeamUI.getInstance().data][this.data]
        this.inviteBtn.visible = !(lastInvite && TM.now() - lastInvite < 60); //60秒内不能再次请求
    }
    private setText(text,str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(text,str);
    }


}