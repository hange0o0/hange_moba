class TeamPVEMainItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TeamPVEMainItemSkin";
    }
    private m0: EnemyHeadItem;
    private m1: EnemyHeadItem;
    private m2: EnemyHeadItem;
    private m3: EnemyHeadItem;
    private m4: EnemyHeadItem;
    private m5: EnemyHeadItem;
    private pkBtn: eui.Button;
    private finishMC: eui.Group;
    private headMC: eui.Image;
    private nameText: eui.Label;
    private roundText: eui.Label;


    public childrenCreated() {
        this.addBtnEvent(this.pkBtn,this.onPK);
        this.addBtnEvent(this.finishMC,this.onPlayer);
    }

    private onPlayer(){
        var PVEM = TeamPVEManager.getInstance();
        var finishData = PVEM.data.game_data.finish[this.data.index]
        var player = PVEM.data['player' + finishData]
        if(player.gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(player.gameid)
    }

    private onPK(){
        var PVEM = TeamPVEManager.getInstance();
        var player = PVEM.getMyData();
        var current = player.pk_time;
        var max = player.buy_time*5 + 10
        if(current >= max)
        {
            var self = this;
            Confirm('挑战机会已用完！\n是否花费100钻石增加5次挑战机会？',function(type){
                if(type == 1)
                {
                    TeamPVEManager.getInstance().addTimes(function(){
                        TeamPVEMain.getInstance().renewTimes()
                    });
                }
            });
            return;
        }
        TeamPVEManager.getInstance().pkLevelData = this.data;
        TeamDungeonGameUI.getInstance().show(this.data,'pve')
    }

    public dataChanged() {
        var PVEM = TeamPVEManager.getInstance();

        this.roundText.text = this.data.index;

        var enemyList = [];
        var fight = TeamDungeonManager.getInstance().getEnemyForce(PVEM.data.game_data.hard,this.data.index);
        var lv = MonsterManager.getInstance().getEnemyMonsterLevel(fight,PVEM.data.game_data.hard);
        var leader = MonsterManager.getInstance().getEnemyMonsterLeader(fight,PVEM.data.game_data.hard);
        var specialData = {isNPC:true,fight:fight,lv:lv,leader:leader}
        for(var i=0;i<this.data.list.length;i++)
        {
            var id = this.data.list[i];
            enemyList.push({
                vo: MonsterVO.getObject(id),
                isTeam:true,

                stopOffset:true,
                id: id,
                specialData: specialData,
                index: i,
                list:enemyList
            });
        }


        for(var i=0;i<6;i++)
        {
            var data = enemyList[i];
            var mc = this['m'+i];
            if(data)
            {
                mc.visible = true;
                mc.data = data;
            }
            else
            {
                mc.visible = false;
            }
        }

        this.renewInfo();
    }

    public renewInfo(){
        var PVEM = TeamPVEManager.getInstance();
        var finishData = PVEM.data.game_data.finish[this.data.index]
        if(finishData)//已完成
        {
            var player = PVEM.data['player' + finishData]
            this.finishMC.visible = true;
            this.pkBtn.visible = false;
            this.headMC.source = MyTool.getHeadUrl(player.head)
            this.nameText.text = player.nick
        }
        else
        {
            this.finishMC.visible = false;
            this.pkBtn.visible = true;
        }
    }


}