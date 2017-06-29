class TeamDungeonItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TeamDungeonItemSkin";
    }


    private bg: eui.Image;
    private helpBtn: eui.Group;
    private btn: eui.Button;
    private titleText: eui.Label;
    private desText: eui.Label;
    private cdText: eui.Label;





    public childrenCreated() {
        this.addBtnEvent(this.btn,this.onClick)
        this.addBtnEvent(this.helpBtn,this.onHelp)
    }

    private onHelp(){
        if(this.data == 'pve')
        {
             HelpManager.getInstance().pveHelp();
        }
    }
    private onClick(){
        if(this.data == 'pve')
        {
             switch(this.btn.label)
             {
                 case '邀请好友':
                     InviteTeamUI.getInstance().show(this.data);
                     break;
                 case '进入':
                     TeamPVEMain.getInstance().show();
                     break;
                 case '创建队伍':
                     CreateTeamUI.getInstance().show(this.data);
                     break;
             }
        }
    }

    public dataChanged() {
        this.btn.visible = true;
        if(this.data == 'pve')
        {
            this.renewPVE();
        }
        else if(this.data == 'pvp')
        {
            this.renewPVP();
        }

        this.onTimer();
    }

    public onTimer(){
        if(this.data == 'pve')
        {
            this.pveTimer();
        }
        else if(this.data == 'pvp')
        {
            this.pvpTimer();
        }
    }

    private pvpTimer(){

    }

    private pveTimer(){
        var PM = TeamPVEManager.getInstance();
        if(PM.isInOpenTime())
        {
            var cd = PM.getEndTime();
            MyTool.setColorText(this.cdText,'[离结束还有：]'+ DateUtil.getStringBySecond(cd));
            if(UM.active.team_pve.team)
            {
                 var teamData = TeamPVEManager.getInstance().data;
                if(!teamData)
                {
                    return;
                }
                if(!teamData.player3)
                {
                    TeamPVEManager.getInstance().info();
                    this.btn.label = '邀请好友';
                }
                else
                {
                    this.btn.label = '进入';
                }

                var arr = [];
                arr.push('[战队名称：]' + teamData.nick);
                arr.push('[挑战难度：]' + TeamDungeonManager.getInstance().hardData[teamData.game_data.hard-1]['name']);
                for(var i=1;i<=3;i++)
                {
                    var player = teamData['player' + i];
                    if(player)
                    {
                        if(i == 1)
                            arr.push('[队长：]' + player.nick);
                        else
                            arr.push('[成员：]' + player.nick);
                    }
                    else
                        arr.push('[成员：]等待加入...');
                }
                this.desText.textAlign = 'left'
                this.desText.lineSpacing = 5
                MyTool.setColorText(this.desText,arr.join('\n'));
            }
            else
            {
                this.desText.textAlign = 'center'
                this.desText.lineSpacing = 10
                this.desText.text = '邀请你的好友\n组成战队一起来挑战吧';
                this.btn.label = '创建队伍'
            }
        }
        else
        {
            var cd = PM.getNextOpenTime();
            this.desText.textAlign = 'center'
            this.desText.lineSpacing = 10
            this.desText.text = '邀请你的好友\n组成战队一起来挑战吧';
            this.cdText.text = '离开始还有：'+ DateUtil.getStringBySecond(cd);
            this.btn.visible = false;
        }
    }

    private renewPVE(){
        this.bg.source = 'team1_jpg';
        MyTool.changeGray(this.bg,false)
        this.titleText.text = TeamDungeonManager.DungeonName.pve;
    }

    private renewPVP(){
        this.bg.source = 'team2_jpg';
        MyTool.changeGray(this.bg,true);
        this.titleText.text = TeamDungeonManager.DungeonName.pvp;

        this.desText.textAlign = 'center'
        this.desText.lineSpacing = 10
        this.desText.text = '即将开放\n敬请期待';
        this.cdText.text = '';
        this.btn.visible = false;
        this.helpBtn.visible = false;
    }
}