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

            {id:11,word:'试练宝箱',type:'free',cost:60},    //相当于当前试练关卡的奖劢
            {id:12,word:'中试练宝箱',type:'diamond',cost:520},//*9
            {id:13,word:'大试练宝箱',type:'diamond',cost:2880},//*50

            {id:21,word:'小卡包',type:'free',cost:60},   //
            {id:22,word:'中卡包',type:'diamond',cost:520},
            {id:23,word:'大卡包',type:'diamond',cost:2880},

            {id:31,word:'修正场门票',type:'free',cost:60}, //5张
            {id:32,word:'修正场门票包',type:'diamond',cost:1050}, //88张

            {id:101,word:'60钻石',type:'rmb',cost:6},
            {id:102,word:'305钻石',type:'rmb',cost:30},
            {id:103,word:'520钻石',type:'rmb',cost:50},
            {id:104,word:'1050钻石',type:'rmb',cost:100},
            {id:105,word:'3200钻石',type:'rmb',cost:300}

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
