class ServerGameEqualManager{
    private static _instance:ServerGameEqualManager;
    public static getInstance():ServerGameEqualManager {
        if (!this._instance)
            this._instance = new ServerGameEqualManager();
        return this._instance;
    }

    public constructor() {
    }

    public lastPKData;

    //根据经验，返回所在等级
    public  getPKTableLevel(exp){
        var level = 1;
        for(var i=0;i<=20;i++)
        {
            if(exp >= Math.pow(2,i)*100)
                level ++;
            else
                break;
        }
        return level;
    }

    public getCard(isagain,fun?){
        if(UM.server_game_equal.choose && UM.server_game_equal.pk==0)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        var oo:any = {};
        oo.isagain = isagain
        Net.addUser(oo);
        Net.send(GameEvent.serverGameEqual.get_server_equal_card,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('道具不足');
                return;
            }

            UM.server_game_equal.choose = msg.choose;
            UM.server_game_equal.enemy = msg.enemy;
            if(fun)
                fun();
        });
    }

    //choose :{list[],ring,index}   choose_index
    public pk(choose,fun?){
        var self = this;
        var oo:any = {};
        oo.choose = choose;
        Net.addUser(oo);
        Net.send(GameEvent.serverGameEqual.pk_server_equal,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;
            if(msg.fail)
            {
                Alert('PK出错');
                return;
            }

            self.lastPKData = msg;
            PKManager.getInstance().onPK(PKManager.PKType.SERVER_EQUAL,msg);

            if(fun)
                fun();
        });
    }


    public playBack(fun?){
        if(this.lastPKData)
        {
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.lastPKData);
            if(fun)
                fun();
            return;
        }
        if(UM.server_game_equal.pkdata)
        {
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.SERVER_EQUAL,function(data){
                self.lastPKData = data;
                if(fun)
                    fun();
            })
        }
    }
}
