class TeamPVEManager {
    private static _instance:TeamPVEManager;
    public static getInstance():TeamPVEManager {
        if (!this._instance)
            this._instance = new TeamPVEManager();
        return this._instance;
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
        return Math.ceil(Math.pow(1+hard/2,2+index/2));
    }
    public getAwardCoin(hard,index){
        return Math.ceil(Math.pow(1+hard/2,2+index/2))*50;
    }

    public list(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.tec.levelup_tec,oo,function(data){
            var msg = data.msg;

            if(fun)
                fun();
        });
    }

    public createTeam(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.tec.levelup_tec,oo,function(data){
            var msg = data.msg;

            if(fun)
                fun();
        });
    }

    public inviteTeam(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.tec.levelup_tec,oo,function(data){
            var msg = data.msg;

            if(fun)
                fun();
        });
    }

    public agreeTeam(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.tec.levelup_tec,oo,function(data){
            var msg = data.msg;

            if(fun)
                fun();
        });
    }
}