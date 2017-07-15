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
    //public value;
    //public lasttime;
    //public level;  //正在进行的关卡
    //public step;  //完成关卡进度
    //public pkLevel;
    //public sweepData;
    //public enemy;

    public getMaxPKNum(level){
        return Math.min(10,level+2);
    }

    public getLevelMap(level){
        var arr = [2, 11, 20, 29, 38, 46, 53, 74]
        for(var i=0;i<arr.length;i++)
        {
            if(level-1 <= arr[i])   //在这个地图上
            {
                switch(i)
                {
                    case 0:
                        return 'pk_bg9_jpg';
                    case 1:
                        return 'pk_bg3_jpg';
                    case 2:
                        return 'pk_bg4_jpg';
                    case 3:
                        return 'pk_bg10_jpg';
                    case 4:
                        return 'pk_bg8_jpg';
                    case 5:
                        return 'pk_bg13_jpg';
                    case 6:
                        return 'pk_bg16_jpg';
                    case 7:
                        return 'pk_bg12_jpg';
                }
                break;
            }
        }

    }

     //public passDay(){
     //    this.sweepData = {};
     //}

    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_map_log') || [];
        MapData.getInstance().initData()

        //var data = UM.pk_common.map || {};
        //this.value = data.value || 0;
        //this.level = data.level || 1;
        //this.step = data.step || 0;
        //this.lasttime = data.lasttime || 0;
        //this.sweepData = data.sweep || {};
        //this.enemy = data.enemy
        //if(this.enemy)
        //    this.pkLevel = this.enemy.level;
        //if(!DateUtil.isSameDay(this.lasttime ))
        //{
        //    this.sweepData = {};
        //}

    }

    //public getRate(level){
    //    if(this.level == level)
    //    {
    //        return this.step;
    //    }
    //    else
    //    {
    //        return this.getSweepNum(level)
    //    }
    //}
    //
    //public getSweepNum(id){
    //    return this.sweepData[id] || 0
    //
    //}
    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 0;
        SharedObjectManager.instance.setMyValue('pk_map_log',list);
    }

    //public addValue(v){
    //    if(!v)
    //        return;
    //    this.value += v;
    //    EM.dispatchEventWith(GameEvent.client.map_value_change)
    //}
    //
    //public getExCoin(v){
    //    return Math.floor(v*10);
    //}
    //
    //public getExCard(v){
    //    return Math.floor(v/10);
    //}
    //
    //public getExCardNeed(v){
    //    return Math.floor(v*10);
    //}

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
            MD.addValue(msg.award.g_exp)

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
