class PayManager{
    private static _instance:PayManager;
    public static getInstance():PayManager {
        if (!this._instance)
            this._instance = new PayManager();
        return this._instance;
    }


    public constructor() {


    }


    //买体力
    public buyEnergy(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.pay.buy_energy,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('钻石不够');
                return;
            }

            if(fun)
                fun();
        });
    }

}
