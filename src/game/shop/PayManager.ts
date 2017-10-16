class PayManager{
    private static _instance:PayManager;
    public static getInstance():PayManager {
        if (!this._instance)
            this._instance = new PayManager();
        return this._instance;
    }

    public shopItem;
    public shopItemObj;

    public getDrawTimes(){
        if(UM.isVip(202))
            return 5;
        return 3;
    }

    public constructor() {
        if(FromManager.getInstance().isTapTap)
        {
            this.shopItem = [
                {id:2,word:'30点体力',type:'diamond',cost:60,shopType:'energy',img:'shop_energy_png'},

                {id:11,word:'小量金币',type:'diamond',cost:60,rate:1,shopType:'coin',img:'shop_money_png'},    //相当于当前试练关卡的奖劢
                {id:12,word:'大量金币',type:'diamond',cost:300,rate:6,shopType:'coin',img:'shop_money_png'},//*5

                {id:21,word:'小量卡片',type:'diamond',cost:60,rate:1,shopType:'card',img:'shop_card_png'},   //
                {id:22,word:'大量卡片',type:'diamond',cost:300,rate:6,shopType:'card',img:'shop_card_png'},

                {id:31,word:'修正币',type:'diamond',cost:60,rate:5,shopType:'ticket',img:'shop_ticket_png'}, //5张
                {id:32,word:'修正币包',type:'diamond',cost:300,rate:30,shopType:'ticket',img:'shop_ticket_png'}, //30张
            ];
        }
        else
        {
            this.shopItem = [

                {id:201,word:'体力恢复快20%，8折买体力',name:'体力VIP',type:'rmb',cost:12,shopType:'vip',img:'pay_energy_png'},
                {id:202,word:'每天可额外多抽2次钻石',name:'钻石VIP',type:'rmb',cost:12,shopType:'vip',img:'pay_energy_png'},
                {id:203,word:'PK跳过免费',name:'PK_VIP',type:'rmb',cost:12,shopType:'vip',img:'pay_energy_png'},


                {id:2,word:'30点体力',type:'diamond',cost:60,shopType:'energy',img:'shop_energy_png'},

                {id:11,word:'小量金币',type:'diamond',cost:60,rate:1,shopType:'coin',img:'shop_money_png'},    //相当于当前试练关卡的奖劢
                {id:12,word:'大量金币',type:'diamond',cost:300,rate:6,shopType:'coin',img:'shop_money_png'},//*5
                {id:13,word:'无数金币',type:'diamond',cost:1500,rate:31,shopType:'coin',img:'shop_money_png'},//*30

                {id:21,word:'小量卡片',type:'diamond',cost:60,rate:1,shopType:'card',img:'shop_card_png'},   //
                {id:22,word:'大量卡片',type:'diamond',cost:300,rate:6,shopType:'card',img:'shop_card_png'},
                {id:23,word:'无数卡片',type:'diamond',cost:1500,rate:31,shopType:'card',img:'shop_card_png'},

                {id:31,word:'修正币',type:'diamond',cost:60,rate:5,shopType:'ticket',img:'shop_ticket_png'}, //5张
                {id:32,word:'修正币包',type:'diamond',cost:300,rate:30,shopType:'ticket',img:'shop_ticket_png'}, //30张


                {id:101,word:'100钻石',type:'rmb',cost:6,shopType:'diamond',img:'box0_png',value:100},
                {id:102,word:'520钻石',type:'rmb',cost:30,shopType:'diamond',img:'box1_png',value:520},
                {id:103,word:'2650钻石',type:'rmb',cost:150,shopType:'diamond',img:'box2_png',value:2650},
                {id:104,word:'10650钻石',type:'rmb',cost:600,shopType:'diamond',img:'box3_png',value:10650},
                {id:105,word:'test',type:'rmb',cost:1,shopType:'diamond',img:'box0_png',value:1},




            ];
        }


        this.shopItemObj = ObjectUtil.arrayToObj(this.shopItem,'id','@whole')
    }

    public getCoin(id)
    {
        var level = UM.level+4;
        var rate = this.shopItemObj[id].rate
        return Math.round(Math.pow(1.2,level)*1000*rate);
    }

    public getCard(id)
    {
        var level = UM.level+3;
        var rate = this.shopItemObj[id].rate
        return Math.round(Math.pow(1.2,level)*10*rate);
    }

    public buy(id,fun){
        if(id == 104 || this.shopItemObj[id].type == 'rmb')
        {
            //if(Config.platform == 'egret')
            //    EgretManager.getInstance().pay(id,fun);
            //else
            if(FromManager.getInstance().h5Form)
                FromManager.getInstance().pay(id,fun);
            else
                this.rmbBuy(id,fun);
        }
        else
       {
           this.localBuy(id,fun);
       }
    }

    public diamondDraw(fun){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.active.diamond_draw,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('时间未到');
                DrawUI.getInstance().hide();
                return;
            }
            if(msg.fail == 2)
            {
                Alert('次数已用完');
                DrawUI.getInstance().hide();
                return;
            }
            if(fun)
                fun(msg.cardid);
        });
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
        if(!Config.isDebug)
        {
            Alert('暂未开放')
            return;
        }
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

            if(id > 200)
            {
                UM.tec.vip.push(id);
                EM.dispatch(GameEvent.client.energy_change);
            }

            if(fun)
                fun();
        });
    }

    public onBuyFinish(goodsid,fun){
        if(goodsid > 200)
        {
            UM.tec.vip.push(goodsid);
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

    public pay_confirm(order,goodsid,fun?){
        var self = this;
        var oo:any = {};
        oo.order = order;
        Net.addUser(oo);
        Net.send(GameEvent.pay.pay_confirm,oo,function(data){
            var msg = data.msg;
            if(msg.fail)
            {
                Alert('未找到订单记录');
                return;
            }
            self.onBuyFinish(goodsid,fun);

            //if(fun)
            //    fun();
        });
    }

}
