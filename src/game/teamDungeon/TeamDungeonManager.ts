class TeamDungeonManager {
    private static _instance:TeamDungeonManager;
    public static getInstance():TeamDungeonManager {
        if (!this._instance)
            this._instance = new TeamDungeonManager();
        return this._instance;
    }

    public hardData = [
        {lv:1,force:100,level:3,enemyForce:100},
        {lv:2,force:1000,level:6,enemyForce:1200},
        {lv:3,force:2000,level:10,enemyForce:2500},
        {lv:4,force:4000,level:15,enemyForce:5000},
        {lv:5,force:7000,level:20,enemyForce:8500},
        {lv:6,force:10000,level:25,enemyForce:13000},
    ];

    public invideList = {
        'pve':{}
    }


    public constructor(){
        var temp = ['初级','中级','高级','困难','地狱','天堂'];
        for(var i=0;i<this.hardData.length;i++)
        {
            var oo:any = this.hardData[i];
            oo.label = temp[i] + ' [战力上限：' + oo.force + ']'
        }
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

    public createTeam(name,hard,type,fun?){
        var self = this;
        var oo:any = {};
        oo.name = name;
        oo.hard = hard;
        oo.type = type;
        Net.addUser(oo);
        Net.send(GameEvent.team.team_create,oo,function(data){
            var msg = data.msg;
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
                TeamPVEManager.getInstance().data = data;

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
        oo.otherid = data.otherid;

        Net.addUser(oo);
        Net.send(GameEvent.team.team_invite,oo,function(data){
            var msg = data.msg;
            self.invideList[type][otherid] = TM.now();
            if(fun)
                fun();
        });
    }

    public agreeTeam(logid,fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.team.team_agree,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到日志');
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

            var FM = FriendManager.getInstance();
            var logData = FM.removeLog(logid);
            FM.saveToLocal();
            EM.dispatchEventWith(GameEvent.client.friend_list_change);


            if(msg.team)
            {
                if(logData.type == 11)
                    TeamPVEManager.getInstance().renewData(msg.team)
            }
            if(fun)
                fun();
        });
    }

    public refuseTeam(logid,fun?){
        var self = this;
        var oo:any = {};
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