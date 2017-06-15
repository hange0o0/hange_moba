class TeamInfoUI extends game.BaseWindow {
    private static instance:TeamInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new TeamInfoUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "TeamInfoSkin";
    }

    private titleText: eui.Label;
    private hardText: eui.Label;
    private forceText: eui.Label;
    private levelText: eui.Label;
    private nameText: eui.Label;
    private btnGroup: eui.Group;
    private cancleBtn: eui.Button;
    private okBtn: eui.Button;
    private player0: eui.Group;
    private headMC0: eui.Image;
    private nick0: eui.Label;
    private player1: eui.Group;
    private headMC1: eui.Image;
    private nick1: eui.Label;
    private player2: eui.Group;
    private headMC2: eui.Image;
    private nick2: eui.Label;
    private closeBtn: eui.Button;



    private data
    private teamData
    private relateItem

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn, this.hide);
        this.addBtnEvent(this.cancleBtn, this.onRefuse);
        this.addBtnEvent(this.okBtn, this.onOK);

        for(var i=0;i<3;i++)
        {
            var player = this['player' + i];
            player.touchChildren = false;
            player.index = i+1;
            this.addBtnEvent(player,this.onPlayerClick)
        }
    }

    private onPlayerClick(e){
        var data = this.teamData['player' + e.currentTarget.index];
        if(data && data.gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(data.gameid)
    }

    private onRefuse(){
        var self = this;
        TeamDungeonManager.getInstance().refuseTeam(this.data.id,function(){
            self.relateItem.btnGroup.visible = false;
            self.hide();
        })
    }



    private onOK(){
        var self = this;
        TeamDungeonManager.getInstance().agreeTeam(this.data.id,function(){
            FriendListUI.getInstance().hide();
            TeamDungeonMain.getInstance().show();
            //self.relateItem.btnGroup.visible = false;
            self.hide();
        })
    }


    public hide(){
        super.hide();
    }



    public show(data?,item?){
        var self = this;
        this.data = data;
        this.relateItem = item;
        TeamDungeonManager.getInstance().teamInfo(this.data.content.team,function(data){
            self.teamData = data;
            self.superShow();
        })

    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renewSelect();
    }

    private renewSelect(){
        var data = this.teamData;
        var hardData:any = TeamDungeonManager.getInstance().hardData[data.game_data.hard-1];
        this.setHtml(this.hardText,this.createHtml('选择难度：',0xE0A44A) + hardData.label);
        this.setHtml(this.forceText,this.createHtml('卡士战力上限：',0xE0A44A) + hardData.force);
        this.setHtml(this.levelText,this.createHtml('卡兵等级上限：',0xE0A44A) + hardData.level + '级');

        this.setHtml(this.nameText,this.createHtml('队伍名称：',0xE0A44A) + data.nick);


        for(var i=0;i<3;i++)
        {
            var player = data['player' + (i+1)];
            if(player)
            {
                this['player' + i].visible = true;
                this['headMC' + i].source = MyTool.getHeadUrl(player.head,true);
                this['nick' + i].text = player.nick;
            }
            else
            {
                this['player' + i].visible = false;
            }
        }
    }
}