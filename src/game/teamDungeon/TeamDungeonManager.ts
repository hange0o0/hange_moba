class TeamDungeonManager {
    private static _instance:TeamDungeonManager;
    public static getInstance():TeamDungeonManager {
        if (!this._instance)
            this._instance = new TeamDungeonManager();
        return this._instance;
    }
    public static DungeonName = {
        'pve':'亡者墓园',
        'pvp':'幻蓝森林'
    }

    public hardData = [
        {lv:1,force:100,level:4,label:''},
        {lv:2,force:1000,level:10,label:''}
        //{lv:3,force:3000,level:15,,label:''},
        //{lv:4,force:6000,level:20,label:''},
        //{lv:5,force:10000,level:25,label:''},
        //{lv:6,force:15000,level:30,label:''},
    ];


    public invideList = {
        'pve':{}
    }


    public constructor(){
        var temp = ['初级','中级','高级','困难','地狱','天堂'];
        for(var i=0;i<this.hardData.length;i++)
        {
            var oo:any = this.hardData[i];
            oo.label = temp[i] + ' [战力上限:' + oo.force + ']';
            oo.name = temp[i];
        }
    }

    public getEnemyForce(hard,index){
        return this.hardData[hard-1].force + Math.floor((Math.pow(hard,2)-0.5)*(index - 1));
    }

    public resetData(data){
        if(data.player1)
        {
            data.player1 = JSON.parse(data.player1);
            data.player1.nick = Base64.decode(data.player1.nick)
            data.player1.index = 1;
        }
        if(data.player2)
        {
            data.player2 = JSON.parse(data.player2);
            data.player2.nick = Base64.decode(data.player2.nick)
            data.player2.index = 2;
        }
        if(data.player3)
        {
            data.player3 = JSON.parse(data.player3);
            data.player3.nick = Base64.decode(data.player3.nick)
            data.player3.index = 3;
        }
        data.game_data = JSON.parse(data.game_data);
    }

    public info(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.team.team_dungeon_info,oo,function(data){
            var msg = data.msg;

            if(fun)
                fun();
        });
    }

    public teamInfo(teamid,fun?){
        var self = this;
        var oo:any = {};
        oo.teamid = teamid;
        Net.send(GameEvent.team.team_info,oo,function(data){
            var msg = data.msg;
            self.resetData(msg.data);
            if(fun)
                fun(msg.data);
        });
    }

    public createTeam(name,hard,type,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        oo.hard = hard;
        oo.type = type;
        Net.addUser(oo);
        Net.send(GameEvent.team.team_create,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('你已经拥有一个队伍了')
                return;
            }
            if(msg.fail == 2)
            {
                Alert('该队伍名字已被使用了')
                return;
            }

            var team = msg.data.id;
            var data:any = {
                id:team,
                nick:name,
                player1:{
                    head:UM.head,
                    nick:UM.nick,
                    gameid:UM.head,
                    pk_time:0,
                    buy_time:0,
                    award:[]
                },
                game_data:{
                    hard:hard,
                    finish:{},
                }
            }

            if(type == 'pve')
            {
                TeamPVEManager.getInstance().data = data;
                UM.active.team_pve.team = team;
                UM.active.team_pve.lasttime = TM.now();
            }
            SharedObjectManager.instance.setValue('team_name',name)
            if(fun)
                fun();
        });
    }

    public inviteTeam(type,otherid,fun?){
        var self = this;
        var oo:any = {};
        var data;
        if(type == 'pve')
        {
            data = TeamPVEManager.getInstance().data;
            oo.type = 11;
        }

        oo.team = data.id
        oo.team_name = data.nick
        oo.hard = data.game_data.hard;
        oo.otherid = otherid;

        Net.addUser(oo);
        Net.send(GameEvent.team.team_invite,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到目标玩家')
                return;
            }
            if(msg.fail == 2)
            {
                Alert('邀请失败')
                return;
            }


            self.invideList[type][otherid] = TM.now();
            if(fun)
                fun();
        });
    }

    public agreeTeam(logid,fun?){
        var self = this;
        var oo:any = {};
        oo.logid = logid;
        Net.addUser(oo);
        Net.send(GameEvent.team.team_agree,oo,function(data){
            var msg = data.msg;
            var FM = FriendManager.getInstance();
            if(msg.fail == 1)
            {
                Alert('找不到日志');
                var logData = FM.removeLog(logid);
                FM.saveToLocal();
                return
            }
            if(msg.fail == 2)
            {
                Alert('找不到指定队伍');
                return
            }
            if(msg.fail == 3)
            {
                Alert('队伍人数已满');
            }
            if(msg.fail == 4)
            {
                Alert('无法加入该队伍');
            }
            if(msg.fail == 6)
            {
                Alert('你已经拥有一个队伍了');
            }


            var logData = FM.removeLog(logid);
            FM.saveToLocal();
            EM.dispatchEventWith(GameEvent.client.friend_list_change);


            if(msg.team)
            {
                if(logData.type == 11)
                {
                    TeamPVEManager.getInstance().renewData(msg.team)
                    UM.active.team_pve.team = msg.team.id;
                    UM.active.team_pve.lasttime = TM.now();
                }
            }
            if(fun)
                fun();
        });
    }

    public refuseTeam(logid,fun?){
        var self = this;
        var oo:any = {};
        oo.logid = logid;
        Net.addUser(oo);
        Net.send(GameEvent.team.team_refuse,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                //找不到日志
            }
            var FM = FriendManager.getInstance();
            FM.removeLog(logid);
            FM.saveToLocal();
            if(fun)
                fun();
        });
    }


}