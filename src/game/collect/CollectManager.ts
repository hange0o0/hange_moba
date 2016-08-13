class CollectManager{
    private static _instance:CollectManager;
    public static getInstance():CollectManager {
        if (!this._instance)
            this._instance = new CollectManager();
        return this._instance;
    }

    public drawNeed = 5; //每次抽奖要精华
    public splitNum = 3;  //每个碎片分解出的精华

    public constructor(){

    }

    //升级所需碎片
    public getLevelUpNeed(level){
        if(level == 1)
            return 30;
        if(level == 2)
            return 50;
        if(level == 3)
            return 80;
        return 120;
    }

    public getList(fillMonster){
        var arr = [];
        var mdata = CM.table[MonsterVO.dataKey];
        for(var s in mdata)
        {
            var vo = mdata[s];
            if(fillMonster && vo.type != fillMonster)
                continue;
            arr.push(vo);
        }
        ArrayUtil.sortByField(arr,['id'],[0]);
        return arr;
    }

    //public isLock(id){
    //    return UM.collect.lock.indexOf(id) != -1;
    //}

    public getCollectNum(id){
        return  UM.collect.num[id] || 0
    }

    //取更详细的碎片数据
    public getCollectMore(fun?){
        if(UM.collect.num)
        {
            if(fun)
                fun();
            return;
        }
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.collect.collect_more,oo,function(data){
            var msg = data.msg;
            UM.collect.num = msg.collect_num;
            if(fun)
                fun();
        });
    }

    //抽奖
    public draw(times,fun?){
        var self = this;
        var oo:any = {};
        oo.times = times;
        Net.addUser(oo);
        Net.send(GameEvent.collect.collect_draw,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('元素数量不足');
                return;
            }

            var arr = []
            for(var s in msg.award)
            {
                var num = msg.award[s];
                while(num--)
                {
                    arr.push(MonsterVO.getObject(s));
                }
            }

            EM.dispatchEventWith(GameEvent.client.collect_change)

            if(times == 1)
                CollectDrawResultUI.getInstance().show(arr[0]);
            else
                CollectDraw10ResultUI.getInstance().show(arr);


            if(fun)
                fun();
        });
    }

    public levelUp(id,fun?){
        var self = this;
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.collect.collect_up,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('该怪物已达最大等级');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('升级所需数量不对');
                return;
            }

            //EM.dispatchEventWith(GameEvent.client.collect_change)
            if(fun)
                fun();
        });
    }

    //{id:num}
    public split(ids,fun?){
        var self = this;
        var oo:any = {};
        oo.ids = ids;
        Net.addUser(oo);
        Net.send(GameEvent.collect.collect_split,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('碎片数量不对');
                return;
            }

            //EM.dispatchEventWith(GameEvent.client.collect_change)

            if(fun)
                fun(msg.num);
        });
    }

    //
    public lock(id,isLock,fun?){
        var self = this;
        var oo:any = {};
        oo.id = id;
        oo.islock = isLock;
        Net.addUser(oo);
        Net.send(GameEvent.collect.collect_lock,oo,function(data){
            var msg = data.msg;

            var index = UM.collect.lock.indexOf(id);
            if(isLock && index == -1)
            {
                UM.collect.lock.push(id)
            }
            else if(!isLock && index != -1)
            {
                UM.collect.lock.splice(index,1);
            }

            //EM.dispatchEventWith(GameEvent.client.collect_change)
            if(fun)
                fun();
        });
    }


}
