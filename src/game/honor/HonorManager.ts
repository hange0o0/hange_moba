class HonorManager{
    private static _instance:HonorManager;
    public static getInstance():HonorManager {
        if (!this._instance)
            this._instance = new HonorManager();
        return this._instance;
    }

    public awardBase = {}
    private list2;
    public constructor() {
        this.awardBase = {
            1:{num:10,diamond:10},
            2:{num:100,diamond:50},
            3:{num:1000,diamond:200},
            4:{num:5000,diamond:400},
            5:{num:10000,diamond:500},
        }

        //this.list2 = ObjectUtil.objToArray(CM.table[RingVO.dataKey]);
    }

    public getList1(){
        var arr = [];
        var mdata = CM.table[MonsterVO.dataKey];
        var index = 0
        for(var s in mdata)
        {
            var vo = mdata[s];
            //var kindVO = MonsterKindVO.getObject(vo.type);
            if(vo.level<= UM.level)
                arr.push(this.fillAwardStat({
                    id:vo.id,
                    userLevel:vo.level,
                    index:index++,
                    honorType:1
                }));
        }
        ArrayUtil.sortByField(arr,['id'],[0]);
        for(var i=0;i<arr.length;i++)
        {
            arr[i].index = i;
        }
        return arr;
    }

    public getList2(){
        var arr = [];
        var index = 0
        for(var i=0;i<this.list2.length;i++)
        {
            var oo = this.list2[i];
            if(i>=12)
            {
                arr.push(this.fillAwardStat({
                    id:oo.id,
                    index:index++,
                    honorType:2
                }));
                continue;
            }

            //var vo = MonsterKindVO.getObject(oo.id)
            //if(!vo || vo.level > UM.level)
            //    continue;
            arr.push(this.fillAwardStat({
                id:oo.id,
                index:index++,
                honorType:2
            }));
        }
        return arr;
    }

    //是否可以领奖
    public fillAwardStat(data){
        var oo;
        if(data.honorType == 1)
            oo = UM.honor.monster[data.id];
        else
            oo = UM.honor.ring[data.id];
        oo = oo ||  {t:0,w:0}
        var awardLevel = oo.a || 0; //已领奖的等级
        data.w = oo.w;
        data.t = oo.t;
        if(oo.t)
            data.r = oo.w/oo.t;
        else
            data.r = 0;

        data.level = awardLevel;
        if(awardLevel == 5)
        {
            data.award = false;
            data.awardV = -1;
            return data;
        }
        var num = this.awardBase[awardLevel + 1].num
        if(oo.w >= num)
        {
            data.award = true;
            data.awardV = awardLevel + 100000;
        }
        else
        {
            data.award = false;
            data.awardV = 100000 - (num - oo.w);
        }
        return data;
    }


    //取更详细的碎片数据
    public getHonorMore(fun?){
        if(UM.honor.monster)
        {
            if(fun)
                fun();
            return;
        }
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.honor.honor_more,oo,function(data){
            var msg = data.msg;
            UM.honor = msg.honor;
            EM.dispatch(GameEvent.client.honor_change);
            if(fun)
                fun();
        });
    }

    //领奖
    public award(type,id,step,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;
        oo.id = id;
        oo.step = step;
        Net.addUser(oo);
        Net.send(GameEvent.honor.honor_award,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到成就数据');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('该成就已领奖');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('该成就不可领');
                return;
            }

            AwardUI.getInstance().show(msg);
            if(fun)
                fun();
        });
    }
}
