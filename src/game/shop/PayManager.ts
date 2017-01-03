class PayManager{
    private static _instance:PayManager;
    public static getInstance():PayManager {
        if (!this._instance)
            this._instance = new PayManager();
        return this._instance;
    }

    public shopItem;
    public shopItemObj;

    public constructor() {
        this.shopItem = [
            {id:1,word:'每天自动回复体力+50%（永久）',type:'rmb',cost:12,shopType:'energy'},
            {id:2,word:'48点体力',type:'diamond',cost:60,shopType:'energy'},

            {id:11,word:'一袋金币',type:'diamond',cost:60,rate:1,shopType:'coin'},    //相当于当前试练关卡的奖劢
            {id:12,word:'一箱金币',type:'diamond',cost:300,rate:5.1,shopType:'coin'},//*5
            {id:13,word:'一大堆金币',type:'diamond',cost:1500,rate:31,shopType:'coin'},//*30

            {id:21,word:'小量卡片',type:'diamond',cost:60,rate:1,shopType:'card'},   //
            {id:22,word:'大量卡片',type:'diamond',cost:300,rate:5.1,shopType:'card'},
            {id:23,word:'极多卡片',type:'diamond',cost:1500,rate:31,shopType:'card'},

            {id:31,word:'修正场门票',type:'diamond',cost:60,shopType:'ticket'}, //5张
            {id:32,word:'修正场门票包',type:'diamond',cost:300,shopType:'ticket'}, //30张

            {id:101,word:'60钻石',type:'rmb',cost:6,shopType:'diamond'},
            {id:102,word:'305钻石',type:'rmb',cost:30,shopType:'diamond'},
            {id:103,word:'1530钻石',type:'rmb',cost:150,shopType:'diamond'},
            {id:104,word:'6200钻石',type:'rmb',cost:600,shopType:'diamond'}

        ];

        this.shopItemObj = ObjectUtil.arrayToObj(this.shopItem,'id','@whole')
    }

    public getCoin(id)
    {
        var level = UM.level;
        var rate = this.shopItemObj[id].rate
        return Math.round(Math.pow(1.2,level)*1000*rate);
    }

    public getCard(id)
    {
        var level = UM.level;
        var rate = this.shopItemObj[id].rate
        return Math.round(Math.pow(1.2,level)*10*rate);
    }

    public buy(id,fun){
       if(this.shopItemObj[id].type == 'rmb')
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
