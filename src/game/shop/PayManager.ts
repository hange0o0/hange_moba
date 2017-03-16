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
            {id:1,word:'回复体力速度+20%（永久）',type:'rmb',cost:12,shopType:'energy',img:'pay_energy_png'},
            {id:2,word:'48点体力',type:'diamond',cost:60,shopType:'energy',img:'shop_energy_png'},

            {id:11,word:'小量金币',type:'diamond',cost:60,rate:1,shopType:'coin',img:'shop_money_png'},    //相当于当前试练关卡的奖劢
            {id:12,word:'大量金币',type:'diamond',cost:300,rate:6,shopType:'coin',img:'shop_money_png'},//*5
            {id:13,word:'无数金币',type:'diamond',cost:1500,rate:31,shopType:'coin',img:'shop_money_png'},//*30

            {id:21,word:'小量卡片',type:'diamond',cost:60,rate:1,shopType:'card',img:'shop_card_png'},   //
            {id:22,word:'大量卡片',type:'diamond',cost:300,rate:6,shopType:'card',img:'shop_card_png'},
            {id:23,word:'无数卡片',type:'diamond',cost:1500,rate:31,shopType:'card',img:'shop_card_png'},

            {id:31,word:'修正币',type:'diamond',cost:60,rate:5,shopType:'ticket',img:'shop_ticket_png'}, //5张
            {id:32,word:'修正币包',type:'diamond',cost:300,rate:30,shopType:'ticket',img:'shop_ticket_png'}, //30张

            {id:101,word:'60钻石',type:'rmb',cost:6,shopType:'diamond',img:'box0_png',value:60},
            {id:102,word:'305钻石',type:'rmb',cost:30,shopType:'diamond',img:'box1_png',value:305},
            {id:103,word:'1530钻石',type:'rmb',cost:150,shopType:'diamond',img:'box2_png',value:1530},
            {id:104,word:'6200钻石',type:'rmb',cost:600,shopType:'diamond',img:'box3_png',value:6200}

        ];

        this.shopItemObj = ObjectUtil.arrayToObj(this.shopItem,'id','@whole')
    }

    public getCoin(id)
    {
        var level = UM.level+5;
        var rate = this.shopItemObj[id].rate
        return Math.round(Math.pow(1.2,level)*1000*rate);
    }

    public getCard(id)
    {
        var level = UM.level+5;
        var rate = this.shopItemObj[id].rate
        return Math.round(Math.pow(1.2,level)*10*rate);
    }

    public buy(id,fun){
        if(this.shopItemObj[id].type == 'rmb')
        {
            if(Config.platform == 'egret')
                EgretManager.getInstance().pay(id,fun);
            else
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
            SoundManager.getInstance().playEffect(SoundConfig.effect_buy);
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
            SoundManager.getInstance().playEffect(SoundConfig.effect_buy);

            if(fun)
                fun();
        });
    }

    public onBuyFinish(goodsid,fun){
        if(goodsid == 1)
        {
            UM.energy.vip = 1;
            EM.dispatch(GameEvent.client.energy_change);
        }
        else
        {
             UM.addDiamond(this.shopItemObj[goodsid].value)
        }

        ShowTips('购买成功')
        SoundManager.getInstance().playEffect(SoundConfig.effect_buy);
        if(fun)
            fun();
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
