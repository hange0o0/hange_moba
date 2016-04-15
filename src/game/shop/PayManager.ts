class PayManager{
    private static _instance:PayManager;
    public static getInstance():PayManager {
        if (!this._instance)
            this._instance = new PayManager();
        return this._instance;
    }

    public shopItem;

    public constructor() {
        this.shopItem = [
            {id:1,word:'每天自动回复体力+50%（永久）',type:'diamond',cost:60},
            {id:2,word:'30点元体力',type:'free',cost:60},

            {id:11,word:'当前试练场等级对应奖励',type:'free',cost:60},
            {id:12,word:'当前试练场等级+10对应奖励',type:'diamond',cost:210},
            {id:13,word:'当前试练场等级+30对应奖励',type:'diamond',cost:600},
            {id:14,word:'当前试练场等级+60对应奖励',type:'diamond',cost:1500},

            {id:21,word:'60钻石',type:'rmb',cost:6},
            {id:22,word:'305钻石',type:'rmb',cost:30},
            {id:23,word:'520钻石',type:'rmb',cost:50},
            {id:24,word:'1050钻石',type:'rmb',cost:100},
            {id:25,word:'3200钻石',type:'rmb',cost:300}

        ];

    }

    public buy(id,fun){
       if(id > 20)
       {
           this.rmbBuy(id,fun);
       }
        else
       {
           this.localBuy(id,fun);
       }
    }

    public localBuy(id,fun){
        var self = this;
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.pay.buy_local,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('钻石不够');
                return;
            }
            if(msg.award)
                AwardUI.getInstance().show(msg.award);
            else
                ShowTips('购买成功!')

            if(fun)
                fun();
        });
    }

    public rmbBuy(id,fun){
        var self = this;
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.pay.buy_rmb,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('购买失败');
                return;
            }

            ShowTips('购买成功')


            if(fun)
                fun();
        });


    }

    ////买体力
    //public buyEnergy(fun?){
    //    var self = this;
    //    var oo:any = {};
    //    Net.addUser(oo);
    //    Net.send(GameEvent.pay.buy_energy,oo,function(data){
    //        var msg = data.msg;
    //        if(msg.fail == 1)
    //        {
    //            Alert('钻石不够');
    //            return;
    //        }
    //
    //        if(fun)
    //            fun();
    //    });
    //}

}
