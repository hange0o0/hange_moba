class MapManager{
    private static _instance:MapManager;
    public static getInstance():MapManager {
        if (!this._instance)
            this._instance = new MapManager();
        return this._instance;
    }

    public constructor() {
        EM.addEventListener(GameEvent.client.pass_day,this.passDay,this);
    }


    public logList
    public value;
    public lasttime;
    public level;  //正在进行的关卡
    public step;  //完成关卡进度
    public pkLevel;
    public sweepData;
    public enemy;

    public getLevelMap(level){
        var mUI = MapUI.getInstance();
        var yy = mUI.itemPos[level-1].y;
        for(var i=6;i>=0;i--)
        {
            var y = mUI['bgGroup'].getChildAt(i).y
            if(yy > y)   //在这个地图上
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
                        return 'pk_bg16_jpg';
                    case 6:
                        return 'pk_bg12_jpg';
                }
                break;
            }
        }
         //9,3,4,10,8,16,12
    }

     public passDay(){
         this.sweepData = {};
     }

    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_map_log') || [];

        var data = UM.pk_common.map || {};
        this.value = data.value || 0;
        this.level = data.level || 1;
        this.step = data.step || 0;
        this.lasttime = data.lasttime || 0;
        this.sweepData = data.sweep || {};
        if(!DateUtil.isSameDay(this.lasttime ))
        {
            this.sweepData = {};
        }

    }

    public getRate(level){
        if(this.level == level)
        {
            return this.step;
        }
        else
        {
            return this.getSweepNum(level)
        }
    }

    public getSweepNum(id){
        return this.sweepData[id] || 0

    }
    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 0;
        SharedObjectManager.instance.setMyValue('pk_map_log',list);
    }

    public addValue(v){
        if(!v)
            return;
        this.value += v;
        EM.dispatchEventWith(GameEvent.client.map_value_change)
    }

    public getExCoin(v){
        return Math.floor(v*10);
    }

    public getExCard(v){
        return Math.floor(v/10);
    }

    public getExCardNeed(v){
        return Math.floor(v*10);
    }

    ////打开PK对战内容的表现
    public pkAgain(fun?){
        if(!UM.testEnergy(1))
        {
            return;
        }
        var self = this;
        var oo:any = {};
        oo.level = this.pkLevel;
        Net.addUser(oo)
        Net.send(GameEvent.mapGame.pk_map_again,oo,function(data){
            var msg = data.msg;
            MapGameUI.getInstance().show();
            if(fun)
                fun();
        });
    }



    public getEnemy(level,fun?){
        var self = this;
        var oo:any = {};
        if(!UM.testEnergy(1))
        {
            return;
        }
        oo.level = level;
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.get_map_enemy,oo,function(data){
            var msg = data.msg;
            self.pkLevel = level;
            self.enemy = msg.data;
            if(fun)
                fun();
        });
    }

    //choose :{list[],ring}   choose_index
    public pk(choose,fun?){
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

            UM.addHistory(choose.list.join(','));
            if(!msg.info)
                msg.info = {};
            msg.info.type = PKManager.PKType.MAP;
            self.addValue(msg.award.g_exp)

            PKManager.getInstance().onPK(PKManager.PKType.MAP,msg);
            self.addLogList(PKManager.getInstance().getLogData({round:self.pkLevel,type:PKManager.PKType.MAP}));

            if(PKManager.getInstance().isWin)
            {
                if(self.pkLevel == self.level)
                {
                    self.step ++;
                    if(self.step >= 10)
                    {
                        self.sweepData[self.level] = 10;
                        self.level ++;
                        self.step = 0;
                        PKManager.getInstance().pkAward.passMap = true
                    }
                }
                else
                {
                    if(!self.sweepData[self.pkLevel])
                        self.sweepData[self.pkLevel] = 1;
                    else
                        self.sweepData[self.pkLevel] ++;
                }
                EM.dispatchEventWith(GameEvent.client.map_change)
            }



            self.lasttime = TM.now();
            if(fun)
                fun();
        });
    }

    //扫荡
    public sweep(level,fun?) {
        var self = this;
        var oo:any = {};
        oo.level = level;
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.sweep, oo, function (data) {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('还没通关，无法进行扫荡');
                self.level = msg.level;
                MapInfoUI.getInstance().hide();
                EM.dispatchEventWith(GameEvent.client.map_change)
                return;
            }
            if(msg.fail == 2)
            {
                Alert('扫荡已完成');
                self.sweepData[level] =10
                MapInfoUI.getInstance().hide();
                EM.dispatchEventWith(GameEvent.client.map_change)
                return;
            }
            if(msg.fail == 3)
            {
                Alert('钻石不足');
                return;
            }
            self.addValue(msg.value);
            AwardUI.getInstance().show({g_exp:msg.value});
            self.sweepData[level] = 10;
            EM.dispatchEventWith(GameEvent.client.map_change)
            if (fun)
                fun();
        });
    }

    //兑换
    public exchange(type,value,fun?) {
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
                    self.value = msg.value;
                    EM.dispatchEventWith(GameEvent.client.map_value_change)
                }
                return;
            }
            self.addValue(-value);
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
