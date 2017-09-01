class MapManager{
    private static _instance:MapManager;
    public static getInstance():MapManager {
        if (!this._instance)
            this._instance = new MapManager();
        return this._instance;
    }

    public constructor() {
        //EM.addEventListener(GameEvent.client.pass_day,this.passDay,this);
    }


    public logList
    public fightLogList
    public fightLogVideo = {};


    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_map_log') || [];
        this.fightLogList = SharedObjectManager.instance.getMyValue('pk_map_fight_log') || [];

        MapData.getInstance().initData()
    }

    public resetFightLogList(){
        var t = TM.now() - 3600*24*3;
        for(var i=0;i<this.fightLogList.length;i++)
        {
              if(this.fightLogList[i].time < t)
              {
                  this.fightLogList.splice(i,1);
                  i--;
              }
        }
    }


    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 20;
        SharedObjectManager.instance.setMyValue('pk_map_log',list);
    }

    ////打开PK对战内容的表现
    public pkAgain(fun?){
        if(!UM.testEnergy(1))
        {
            return;
        }
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        oo.level =MD.level;
        Net.addUser(oo)
        Net.send(GameEvent.mapGame.pk_map_again,oo,function(data){
            var msg = data.msg;
            MD.enemy.is_pk = false;
            PKResultUI.getInstance().hide();
            MapGameUI.getInstance().show();
            if(fun)
                fun();
        });
    }



    public getEnemy(fun?){
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        if(!MD.pkValue)
        {
            Alert('没有通辑令了')
            return;
        }
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.get_map_enemy,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('没有通辑令了')
                return;
            }
            MD.enemy = msg.data;
            MD.pkValue --;
            if(fun)
                fun();
        });
    }

    //开始挂机
    public start(fun?){
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.map_start,oo,function(data){
            var msg = data.msg;
             MD.fillData(msg.data);
            EM.dispatch(GameEvent.client.task_change);
            if(fun)
                fun();
        });
    }

    //转关卡
    public change_level(level,fun?){
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        oo.level = level
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.map_change_level,oo,function(data){
            var msg = data.msg;
            if(msg.fail)
            {
                Alert('无法切换关卡');
                return
            }
            MD.fillData(msg.data);
            EM.dispatch(GameEvent.client.task_change);
            if(fun)
                fun();
        });
    }

    //取奖励
    public get_award(fun?){
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.map_award,oo,function(data){
            var msg = data.msg;
            MD.fillData(msg.data);
            if(msg.fail)
            {
                Alert('你已被人抢光了资源')
            }
            if(fun)
                fun();
        });
    }

    //请求同步数据
    public MapSync(fun?){
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.map_sync,oo,function(data){
            var msg = data.msg;
            MD.fillData(msg.data);
            if(fun)
                fun();
        });
    }



    //choose :{list[],ring}   choose_index
    public pk(choose,fun?){
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        if(!UM.testEnergy(1))
        {
            return;
        }
        oo.choose = choose;
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.pk_map,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;
            if(msg.fail == 2)
            {
                Alert('体力不足');
                return;
            }
            if(msg.fail == 1 || msg.fail == 3)
            {
                MD.enemy = null;
                Alert('找不到敌人数据');
                PKDressUI.getInstance().hide();
                MapGameUI.getInstance().hide();
                return;
            }

            UM.addHistory(choose.list.join(','));
            if(!msg.info)
                msg.info = {};
            msg.info.type = PKManager.PKType.MAP;

            PKManager.getInstance().onPK(PKManager.PKType.MAP,msg);
            self.addLogList(PKManager.getInstance().getLogData({round:MD.level,type:PKManager.PKType.MAP}));

            if(PKManager.getInstance().isWin)
            {
                if(MD.step < MD.maxBossTimes)
                    MD.step ++;
            }

            MD.addValue(msg.award.g_exp)
            MD.enemy.is_pk = true;
            if(fun)
                fun();
        });
    }

    //扫荡
    public sweep(level,fun?) {
        //var self = this;
        //var oo:any = {};
        //oo.level = level;
        //Net.addUser(oo);
        //Net.send(GameEvent.mapGame.sweep, oo, function (data) {
        //    var msg = data.msg;
        //    if(msg.fail == 1)
        //    {
        //        Alert('还没通关，无法进行扫荡');
        //        self.level = msg.level;
        //        MapInfoUI.getInstance().hide();
        //        EM.dispatchEventWith(GameEvent.client.map_change)
        //        return;
        //    }
        //    if(msg.fail == 2)
        //    {
        //        Alert('扫荡已完成');
        //        self.sweepData[level] =self.getMaxPKNum(level);
        //        MapInfoUI.getInstance().hide();
        //        EM.dispatchEventWith(GameEvent.client.map_change)
        //        return;
        //    }
        //    if(msg.fail == 3)
        //    {
        //        Alert('钻石不足');
        //        return;
        //    }
        //    self.addValue(msg.value);
        //    AwardUI.getInstance().show({g_exp:msg.value});
        //    self.sweepData[level] = self.getMaxPKNum(level);
        //    EM.dispatchEventWith(GameEvent.client.map_change)
        //    if (fun)
        //        fun();
        //});
    }

    //兑换
    public exchange(type,value,fun?) {
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        oo.type = type;
        oo.value = value;
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.exchange, oo, function (data) {
            var msg = data.msg;
            if(msg.fail)
            {
                Alert('兑换失败')
                if(msg.fail == 1)
                {
                    MD.value = msg.value;
                    EM.dispatchEventWith(GameEvent.client.map_value_change)
                }
                return;
            }
            MD.addValue(-value);
            AwardUI.getInstance().show({coin:msg.coin,card:msg.card});
            if (fun)
                fun();
        });
    }




    //取掠夺对象
    public fightGet(fun?){
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.map_fight_get,oo,function(data){
            var msg = data.msg;
            MD.get_fight_enemy = msg.data;
            MD.get_fight_time = TM.now();
            if(fun)
                fun();
        });
    }
    //挑战掠夺对象
    public fightPK(choose,fun?){
        var MD = MapData.getInstance();
        var self = this;
        var oo:any = {};
        if(!UM.testEnergy(1))
        {
            return;
        }
        oo.choose = choose;
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.map_fight_pk,oo,function(data){
            var msg = data.msg;
            if(!self.onFightPK(msg,choose))
                return;
            MD.get_fight_enemy = null
            if(fun)
                fun();
        });
    }

    private onFightPK(msg,choose){
        var MD = MapData.getInstance();
        if(PKManager.getInstance().pkError(msg))
            return false;
        if(msg.fail == 2)
        {
            Alert('体力不足');
            return;
        }
        if(msg.fail == 5)
        {
            Alert('无法插入日志');
            return;
        }
        if(msg.fail == 1 || msg.fail == 3 || msg.fail == 4)
        {
            MD.enemy = null;
            Alert('找不到敌人数据' + msg.fail);
            PKDressUI.getInstance().hide();
            MapGameUI.getInstance().hide();
            return;
        }

        UM.addHistory(choose.list.join(','));
        if(!msg.info)
            msg.info = {};
        msg.info.type = PKManager.PKType.MAP_FIGHT;

        MD.addValue(msg.award.g_exp)


        MD.getFightTimes();
        MD.fight_times ++

        PKManager.getInstance().onPK(PKManager.PKType.MAP_FIGHT,msg);
        return true;
    }
    //反击
    public fightPKBack(logData,choose,fun?){
        var self = this;
        var oo:any = {};
        if(!UM.testEnergy(1))
        {
            return;
        }
        oo.logid = logData.id;
        oo.choose = choose;
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.map_fight_pk_back,oo,function(data){
            var msg = data.msg;
            if(!self.onFightPK(msg,choose))
                return;
            logData.type = 1;
            if(fun)
                fun();
        });
    }

    //日志
    public fightLog(fun?){
        var self = this;
        var oo:any = {};
        oo.logid = 0;
        if(this.fightLogList.length > 0)
            oo.logid = this.fightLogList[0].id;
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.map_fight_pk_log,oo,function(data){
            var msg = data.msg;
            if(msg.list.length > 0)
            {
                self.fightLogList = self.fightLogList.concat(msg.list);
                ArrayUtil.sortByField(self.fightLogList,['id'],[1])
                SharedObjectManager.instance.setMyValue('pk_map_fight_log',self.fightLogList)
            }
            if(fun)
                fun();
        });
        this.resetFightLogList();
    }

    public playBack(logData,fun?){
        if(this.fightLogVideo[logData.id])
        {
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.fightLogVideo[logData.id]);
            if(fun)
                fun();
            return;
        }

        var self = this;
        var oo:any = {};
        var content = JSON.parse(logData.content);
        oo.team1 = content.team1;
        oo.team2 = content.team2;
        oo.pk_version = content.pk_version;

        if(Math.floor(content.pk_version) < Config.pk_version){
            Alert('录像已过期');
            return;
        }
        Net.send(GameEvent.pkCore.pk_result,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 2)
            {
                Config.pk_version = Math.floor(msg.pk_version);
                Alert('录像已过期');
                return;
            }
            self.fightLogVideo[logData.id] = msg//.pkdata;

            var info:any = msg.info = {};
            info.type = PKManager.PKType.MAP_FIGHT;
            info.teamChange = logData.to_gameid == UM.gameid;

            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,msg);
            if(fun)
                fun();
        });
    }


    ////取商店列表
    //public getMapList(level,fun?){
    //    var self = this;
    //    var oo:any = {};
    //    oo.level = level;
    //    Net.addUser(oo);
    //    Net.send(GameEvent.mapGame.get_map_enemy,oo,function(data){
    //        var msg = data.msg;
    //        if(fun)
    //            fun();
    //    });
    //}
    //
    ////取商店列表
    //public shopList(fun?){
    //    var self = this;
    //    var oo:any = {};
    //    Net.addUser(oo);
    //    Net.send(GameEvent.mapGame.shop_list,oo,function(data){
    //        var msg = data.msg;
    //        if(fun)
    //            fun();
    //    });
    //}
    //
    ////
    //public shopBuy(id,fun?){
    //    var self = this;
    //    var oo:any = {};
    //    Net.addUser(oo);
    //    Net.send(GameEvent.mapGame.shop_buy,oo,function(data){
    //        var msg = data.msg;
    //        if(fun)
    //            fun();
    //    });
    //}


}
