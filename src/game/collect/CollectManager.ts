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

    public getList(){
        var arr = [];
        var mdata = CM.table[MonsterKindVO.dataKey];
        for(var s in mdata)
        {

        }
        for(var s in UM.collect.num)
        {

        }
        return arr;
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

            msg.award//得到的碎片

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

            if(fun)
                fun();
        });
    }


}
