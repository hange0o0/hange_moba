class MapManager{
    private static _instance:MapManager;
    public static getInstance():MapManager {
        if (!this._instance)
            this._instance = new MapManager();
        return this._instance;
    }

    public constructor() {
    }

    public lastPKData;
    public maxLevel = 600;

    public logList
    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_map_log') || [];
    }
    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 0;
        SharedObjectManager.instance.setMyValue('pk_map_log',list);
    }

    ////打开PK对战内容的表现
    public openPKView(fun?){
        if(UM.getEnergy()<1)
        {
            Alert('体力不足1点，无法进行挑战');
            return;
        }
        MapGameUI.getInstance().show();
        fun && fun();
    }


    //choose :{list[],ring}   choose_index
    public pk(choose,fun?){
        var self = this;
        var oo:any = {};
        if(!UM.testEnergy(1))
        {
            return;
        }
        oo.choose = choose;
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.pk_map,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;

            UM.addHistory(choose.list.join(','));
            self.lastPKData = msg;
            msg.info.type = PKManager.PKType.MAP;
            for(var i=0;i<msg.team2base.list.length;i++){
                if(!msg.team2base.list[i])
                {
                    msg.team2base.list.splice(i,1);
                    i--;
                }
            }

            PKManager.getInstance().onPK(PKManager.PKType.MAP,msg);
            self.addLogList(PKManager.getInstance().getLogData({round:UM.pk_common.map.level,type:PKManager.PKType.MAP}));
            if(fun)
                fun();
        });
    }



    //取商店列表
    public getMapList(level,fun?){
        var self = this;
        var oo:any = {};
        oo.level = level;
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.get_map_enemy,oo,function(data){
            var msg = data.msg;
            if(fun)
                fun();
        });
    }

    //取商店列表
    public shopList(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.shop_list,oo,function(data){
            var msg = data.msg;
            if(fun)
                fun();
        });
    }

    //
    public shopBuy(id,fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mapGame.shop_buy,oo,function(data){
            var msg = data.msg;
            if(fun)
                fun();
        });
    }


}
