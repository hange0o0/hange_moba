class HonorManager{
    private static _instance:HonorManager;
    public static getInstance():HonorManager {
        if (!this._instance)
            this._instance = new HonorManager();
        return this._instance;
    }

    public awardBase = {}
    public constructor() {
        this.awardBase = {
            1:{num:10,diamond:10},
            2:{num:100,diamond:50},
            3:{num:1000,diamond:200},
            4:{num:5000,diamond:400},
            5:{num:10000,diamond:500},
        }
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


            if(fun)
                fun();
        });
    }
}
