class ServerGameManager{
    private static _instance:ServerGameManager;
    public static getInstance():ServerGameManager {
        if (!this._instance)
            this._instance = new ServerGameManager();
        return this._instance;
    }

    public constructor() {
    }

    public lastPKData;

    //打开PK对战内容的表现
    public openPKView(fun?){
        var serverData = UM.server_game;
        if(serverData.pk)//已PK过，不能再打
        {
            this.getCard(false,onGetCard);
        }
        else if(serverData.choose)//已有卡版数据
        {
            onGetCard();
        }
        else
        {
            this.getCard(false,onGetCard);
        }

        function onGetCard(){
            ServerGameUI.getInstance().show();
            if(fun)
                fun();
        }
    }

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
        if(UM.server_game.choose && UM.server_game.pk==0)
        {
            if(fun)
                fun();
            return
        }
        if(UM.getEnergy()<1)
        {
            Alert('体力不足1点，无法挑战');
            return;
        }
        if(isagain && UM.getEnergy()<2)
        {
            Alert('体力不足2点，无法再次挑战');
            return;
        }
        var self = this;
        var oo:any = {};
        oo.isagain = isagain
        Net.addUser(oo);
        Net.send(GameEvent.serverGame.get_server_card,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 4)
            {
                Alert('体力不足');
                return;
            }

            UM.server_game.choose = msg.choose;
            UM.server_game.enemy = msg.enemy;
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
        Net.send(GameEvent.serverGame.pk_server,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;
            if(msg.fail)
            {
                Alert('PK出错');
                return;
            }


            UM.addHistory(choose.list.join(','));
            self.lastPKData = msg;
            PKManager.getInstance().onPK(PKManager.PKType.SERVER,msg);

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
        if(UM.server_game.pkdata)
        {
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.SERVER,function(data){
                self.lastPKData = data;
                if(fun)
                    fun();
            })
        }
    }
}
