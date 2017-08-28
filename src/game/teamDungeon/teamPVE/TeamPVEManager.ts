class TeamPVEManager {
    private static _instance:TeamPVEManager;
    public static getInstance():TeamPVEManager {
        if (!this._instance)
            this._instance = new TeamPVEManager();
        return this._instance;
    }

    public data;
    public listData;
    public pkLevelData;
    public logList


    public passDay(){
        this.data = null;
        this.listData = null;
        this.pkLevelData = null;
        TeamDungeonManager.getInstance().invideList['pve'] = {};
        if(TeamPVEMain.getInstance().stage)
        {
            TeamPVEMain.getInstance().hide();
            if(PKDressUI.getInstance().stage && PKDressUI.getInstance().pkType == 'pve_game')
                PKDressUI.getInstance().hide();
            if(TeamDungeonGameUI.getInstance().stage)
                TeamDungeonGameUI.getInstance().hide();
        }
    }

    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_pve_log') || [];
    }

    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 20;
        SharedObjectManager.instance.setMyValue('pk_pve_log',list);
    }


    public isInOpenTime(){
        return true;
        var d = TM.chineseDate();
        return d.getHours() >=12
    }

    public getEndTime(){
        var d = TM.chineseDate();
        d.setHours(24);
        d.setMinutes(0);
        d.setSeconds(0);
        return Math.floor(d.getTime()/1000) - TM.now();
    }

    public getNextOpenTime(){
        var d = TM.chineseDate();
        d.setHours(12);
        d.setMinutes(0);
        d.setSeconds(0);

        return Math.floor(d.getTime()/1000) - TM.now();
    }

    public getAwardCard(hard,index){
        return Math.ceil(Math.pow(1.5+hard/2,1.6+index/2));
    }
    public getAwardCoin(hard,index){
        return this.getAwardCard(hard,index)*100;
    }

    //完成关卡数
    public getFinishNum(data?){
        data = data || this.data;
        var count = 0;
        for(var s in data.game_data.finish)
        {
            if(data.game_data.finish[s])
                count ++;
        }
        return count;
    }

    public getPlayerFinish(index,data?){
        data = data || this.data;
        var count = 0;
        for(var s in data.game_data.finish)
        {
            if(data.game_data.finish[s] == index)
                count ++;
        }
        return count;
    }

    //取我的数据
    public getPlayerByGameid(gameid,data?){
        data = data || this.data;
       for(var i=1;i<=3;i++)
       {
           var player = data['player' + i];
           if(player && player.gameid == gameid)
           {
               return player;
           }
       }
        return null;
    }
    //取我的数据
    public getMyData(data?){
        return this.getPlayerByGameid(UM.gameid,data);
    }

    public renewData(data){
         this.data = data;
        this.data.getTime = TM.now();
        TeamDungeonManager.getInstance().resetData(data);
        var invideList = TeamDungeonManager.getInstance().invideList['pve'];
        invideList[this.data.player1.gameid] = Number.MAX_VALUE
        if(this.data.player2)
            invideList[this.data.player2.gameid] = Number.MAX_VALUE
        if(this.data.player3)
            invideList[this.data.player3.gameid] = Number.MAX_VALUE

    }

    public pkAgain(){
        TeamDungeonGameUI.getInstance().show(this.pkLevelData,'pve')
    }

    public canPK(){
        if(!this.data)
            return;
        var finishNum = this.getFinishNum()
        if(finishNum >= 25)
            return false;
        var player = this.getMyData();
        var current = player.pk_time;
        var max = player.buy_time*5 + 10
        return  current < max;
    }

    public info(fun?,force?){
        var self = this;
        var oo:any = {};
        if(!force)
        {
            if(self.data && TM.now() - self.data.getTime<10)   //10S内不会取数据
            {
                if(fun)
                    fun();
                return;
            }
        }
        if(this.data)
            this.data.getTime = TM.now();
        Net.addUser(oo);
        Net.send(GameEvent.team.team_pve_info,oo,function(data){
            var msg = data.msg;
            self.renewData(msg.pve);
            if(fun)
                fun();
        },force);
    }

    public list(fun?){
        if(this.listData)
        {
            if(fun)
                fun();
            return;
        }
        var self = this;
        var oo:any = {};
        oo.hard = this.data.game_data.hard;
        Net.addUser(oo);
        Net.send(GameEvent.team.team_pve_list,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('无法找到关卡数据')
                return;
            }
            self.listData = JSON.parse(msg.content).levels;
            if(fun)
                fun();
        });
    }

    public addTimes(fun?){
        if(!UM.testDiamond(100))
            return;
        var self = this;
        var oo:any = {};
        var myData = self.getMyData();
        oo.player_index = myData.index;
        Net.addUser(oo);
        Net.send(GameEvent.team.team_pve_add,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到用户')
                return;
            }
            self.getMyData().buy_time ++;
            if(fun)
                fun();
        });
    }

    public pk(choose,fun?){
        var self = this;
        var oo:any = {};
        if(!UM.testEnergy(1))
        {
            return;
        }
        var myData = self.getMyData();

        oo.choose = choose;
        oo.level = this.pkLevelData.index;
        oo.player_index = myData.index;
        Net.addUser(oo);
        Net.send(GameEvent.team.team_pve_pk,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;
            if(msg.fail == 1)
            {
                Alert('找不到用户')
                return;
            }
            else if(msg.fail == 2)
            {
                Alert('挑战次数已用完')
                TeamDungeonGameUI.getInstance().hide();
                PKDressUI.getInstance().hide();
                return;
            }
            else if(msg.fail == 3)
            {
                Alert('该关卡已被挑战成功');
                self.data.game_data = msg.pve_data;
                EM.dispatchEventWith(GameEvent.client.PVE_CHANGE)
                TeamDungeonGameUI.getInstance().hide();
                PKDressUI.getInstance().hide();
                return;
            }
            else if(msg.fail)
            {
                return;
            }
            myData.pk_time ++;
            UM.addHistory(choose.list.join(','));
            if(!msg.info)
                msg.info = {};
            msg.info.type = PKManager.PKType.PVE;

            PKManager.getInstance().onPK(PKManager.PKType.PVE,msg);
            self.addLogList(PKManager.getInstance().getLogData({round:oo.level,type:PKManager.PKType.PVE}));

            self.data.game_data = msg.pve_data;
            EM.dispatchEventWith(GameEvent.client.PVE_CHANGE)
            if(fun)
                fun();
        });
    }

    public award(index,fun?){
        var self = this;
        var oo:any = {};
        var myData = self.getMyData();
        oo.award_index = index;
        oo.player_index = myData.index;
        Net.addUser(oo);
        Net.send(GameEvent.team.team_pve_award,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到用户')
                return;
            }
            else if(msg.fail == 2)
            {
                Alert('奖励已领取')
            }
            else if(msg.fail == 3)
            {
                Alert('该奖励还不能被领取')
                self.data.game_data = msg.pve_data;
                EM.dispatchEventWith(GameEvent.client.PVE_CHANGE)
                return;
            }
            myData.award[index] = 1;
            if(msg.award)
            {
                AwardUI.getInstance().show(msg.award);
            }
            if(fun)
                fun();
        });
    }


}