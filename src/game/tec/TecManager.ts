class TecManager{
    private static _instance:TecManager;
    public static getInstance():TecManager {
        if (!this._instance)
            this._instance = new TecManager();
        return this._instance;
    }

    public maxLevel = 30;

    //level是指目标等级
    public needCoin(level){
        return Math.floor(Math.pow(level,1.5)*1000);
    }
    public propNum1(level){   //初级道具  升3级开始要
        if(level > 2)
            return level - 1;//首次2个
        return 0;
    }
    public propNum2(level){  //高级道具   升12级开始要
        if(level > 19)
            return level - 19;//首次1个
        return 0;
    }

    public prop1ID(type){
        if(type == 'main')
            return  1;
        else if(type == 'ring')
            return  2;
        else if(type == 'monster')
            return  3;
    }

    public prop2ID(type){
        if(type == 'main')
            return  11;
        else if(type == 'ring')
            return  12;
        else if(type == 'monster')
            return  13;
    }

    //取更详细的碎片数据
    public levelUp(type,id,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.tec.levelup_tec,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('钱不够');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('低级道具不够');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('高级道具不够');
                return;
            }
            if(msg.fail == 4)
            {
                Alert('已达最大升级等级');
                return;
            }
            if(fun)
                fun();
        });
    }

}
