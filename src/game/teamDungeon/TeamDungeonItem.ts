class TeamDungeonItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TeamDungeonItemSkin";
    }


    private btn: eui.Button;
    private titleText: eui.Label;
    private desText: eui.Label;
    private cdText: eui.Label;




    public childrenCreated() {
        this.addBtnEvent(this.btn,this.onClick)
    }

    private onClick(){
        if(this.data == 'pve')
        {
             switch(this.btn.label)
             {
                 case '邀请好友':
                     InviteTeamUI.getInstance().show();
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

        this.onTimer();
    }

    public onTimer(){
        if(this.data == 'pve')
        {
            this.pveTimer();
        }
    }

    private pveTimer(){
        var PM = TeamPVEManager.getInstance();
        if(PM.isInOpenTime())
        {
            var cd = PM.getEndTime();
           this.cdText.text = '离结束还有：'+ DateUtil.getStringBySecond(cd);
            if(UM.active.team_pve.team)
            {
                if(!TeamPVEManager.getInstance().data.player3)
                {
                    TeamPVEManager.getInstance().info();
                    this.btn.label = '邀请好友';
                }
                else
                {
                    this.btn.label = '进入';
                }
            }
            else
            {
                this.btn.label = '创建队伍'
            }
        }
        else
        {
            var cd = PM.getNextOpenTime();
            this.cdText.text = '离开始还有：'+ DateUtil.getStringBySecond(cd);
            this.btn.visible = false;
        }
    }

    private renewPVE(){
        this.titleText.text = '山山山';
        this.desText.text = '邀请你的好友，组成战队一起来挑战吧';
    }
}