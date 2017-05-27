class TeamPVEManager {
    private static _instance:TeamPVEManager;
    public static getInstance():TeamPVEManager {
        if (!this._instance)
            this._instance = new TeamPVEManager();
        return this._instance;
    }

    public data;
    public listData;

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
        return Math.ceil(Math.pow(1+hard/2,2+index/2));
    }
    public getAwardCoin(hard,index){
        return Math.ceil(Math.pow(1+hard/2,2+index/2))*50;
    }

    private initPlayer(data){
        for(var i=1;i<=3;i++)
        {
            var player = data['player' + i];
            if(player)
            {
                player.index = i;
            }
        }
    }

    //完成关卡数
    public getFinishNum(data?){
        data = data || this.data;
        var count = 0;
        for(var s in data.finish)
        {
            if(data.finis[s])
                count ++;
        }
        return count;
    }

    public getPlayerFinish(index,data?){
        data = data || this.data;
        var count = 0;
        for(var s in data.finish)
        {
            if(data.finis[s] == index)
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
        if(data.player1)
            data.player1 = JSON.parse(data.player1);
        if(data.player2)
            data.player2 = JSON.parse(data.player2);
        if(data.player3)
            data.player3 = JSON.parse(data.player3);
        data.game_data = JSON.parse(data.game_data);
    }

    public info(fun?,force?){
        var self = this;
        var oo:any = {};
        if(!force)
        {
            if(self.data && TM.now() - self.data.time<10)   //10S内不会取数据
            {
                if(fun)
                    fun();
            }
        }
        Net.addUser(oo);
        Net.send(GameEvent.team.team_pve_info,oo,function(data){
            var msg = data.msg;
            self.renewData(msg.pve);
            if(fun)
                fun();
        });
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
        Net.addUser(oo);
        Net.send(GameEvent.tec.levelup_tec,oo,function(data){
            var msg = data.msg;
            self.listData = JSON.parse(msg.content);
            if(fun)
                fun();
        });
    }


}