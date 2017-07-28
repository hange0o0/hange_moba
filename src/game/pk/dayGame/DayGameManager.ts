class DayGameManager{
    private static _instance:DayGameManager;
    public static getInstance():DayGameManager {
        if (!this._instance)
            this._instance = new DayGameManager();
        return this._instance;
    }

    public constructor() {

    }
    public logList
    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_day_log') || [];
    }

    public data;
    public dataTime = 0;
    public lastPKData;



    public getHeadByLevel(level){
        return level%50 + 1;
    }
    public getNickByLevel(level){
        return '守卫' + level;
    }

    public isRed(){
        return !UM.day_game.level && (this.logList.length == 0 || !DateUtil.isSameDay(this.logList[0].time))
    }

    public passDay(){
        DayGameManager.getInstance().resetDay();
        if(DayGameUI.getInstance().stage)
            DayGameUI.getInstance().hide();
        if(PKDressUI.getInstance().stage && PKDressUI.getInstance().pkType == 'day_game')
            PKDressUI.getInstance().hide();
    }

    public resetDay(){
        if(!DateUtil.isSameDay(UM.day_game.lasttime))
        {
            UM.day_game.lasttime = TM.now()
            UM.day_game.level = 0;
        }
    }

    //public getLogList(){
    //     //for(var i=0;i<this.logList.length;i++)
    //     //{
    //     //    if(!DateUtil.isSameDay(this.logList[i].time))
    //     //    {
    //     //        this.logList.length = i;
    //     //        break;
    //     //    }
    //     //}
    //    return this.logList;
    //}

    public addLogList(data){
         var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 0;
        SharedObjectManager.instance.setMyValue('pk_day_log',list);
    }

    public getCard(fun?){
        //if(UM.server_game.choose)
        //{
        //    if(fun)
        //        fun();
        //    return
        //}
        //PKManager.getInstance().getCard(PKManager.PKType.DAY,function(choose){
        //    UM.day_game.choose = choose;
        //    if(fun)
        //        fun();
        //})
    }


    //choose :{list[],ring,index}
    public pk(choose,fun?){

        if(UM.getEnergy()<1)
        {
            Alert('体力不足1点，无法挑战');
            return;
        }

        var self = this;
        var oo:any = {};
        oo.level = UM.day_game.level + 1;
        oo.choose = choose;
        Net.addUser(oo);
        Net.send(GameEvent.dayGame.pk_day_game,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;

            if(msg.fail == 50)//文件未生成
            {
                self.data = null;
                self.getDayGame(function(){
                    Alert('今日数据已更新');

                })
                return;
            }
            if(msg.fail == 51)
            {
                Alert('不是打这关');
                return;
            }
            if(msg.fail == 52)
            {
                Alert('已完成今日任务');
                return;
            }
            if(msg.fail == 53)
            {
                Alert('体力不够');
                return;
            }

            self.lastPKData = msg;
            msg.info.type = PKManager.PKType.DAY;
            PKManager.getInstance().onPK(PKManager.PKType.DAY,msg);
            UM.day_game.pkdata = Config.pk_version;
            self.addLogList(PKManager.getInstance().getLogData({round:oo.level,type:PKManager.PKType.DAY}));
            if(fun)
                fun();
        });
    }

    public getDayGame(fun?){
        if(this.data && DateUtil.isSameDay(this.dataTime))
        {
            if(fun)
                fun();
            return;
        }
        var self = this;
        var oo:any = {};
        var serverData = UM.server_game_equal;
        oo.level = ServerGameEqualManager.getInstance().getPKTableLevel(serverData.exp);
        oo.user_level = UM.level;
        //oo.serverid = LoginManager.getInstance().lastServer;
        //Net.addUser(oo);
        Net.send(GameEvent.dayGame.get_day_game,oo,function(data){
            var msg = data.msg;
            if(msg.fail)//文件未生成
            {
                Alert(' 无法找到今日数据');
                return;
            }

            self.data = JSON.parse(msg.content);
            //for(var i=0;i<self.data.levels.length;i++)
            //{
            //    self.data.levels[i].game_data = JSON.parse(self.data.levels[i].game_data);
            //}
            self.dataTime = TM.now();

            if(fun)
                fun();
        });
    }

    public playBack(fun?){
        if(this.lastPKData)
        {
            //PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.lastPKData);
            //PKMainUI.getInstance().show();
            if(fun)
                fun();
            return;
        }

        if(UM.day_game.pkdata)
        {
            if(UM.day_game.pkdata.version != Config.pk_version)
            {
                this.lastPKData = true;
                if(fun)
                    fun();
                return;;
            }
            var logData = this.logList[0]
            if(logData && (logData.time - (UM.day_game.pkdata.time || 0) > -5)) //5S内都算已有
            {
                this.lastPKData = true;
                if(fun)
                    fun();
                return;
            }
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.DAY,function(data){
                self.lastPKData = data;
                PKManager.getInstance().onPK(PKManager.PKType.REPLAY,self.lastPKData);
                var level = data.info.level;
                self.addLogList(PKManager.getInstance().getLogData({round:level || '??',type:PKManager.PKType.DAY},UM.day_game.pkdata.time));
                if(fun)
                    fun();
            })
        }
    }

    //public playBack(fun?){
    //    if(this.lastPKData)
    //    {
    //        PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.lastPKData);
    //        PKMainUI.getInstance().show();
    //        if(fun)
    //            fun();
    //        return;
    //    }
    //    if(UM.day_game.pkdata)
    //    {
    //        if(UM.day_game.pkdata != Config.pk_version)
    //        {
    //            Alert('录像已过期');
    //            return;
    //        }
    //        var self = this;
    //        PKManager.getInstance().getReplayByType(PKManager.PKType.DAY,function(data){
    //            self.lastPKData = data;
    //            self.playBack(fun);
    //        })
    //    }
    //}
}
