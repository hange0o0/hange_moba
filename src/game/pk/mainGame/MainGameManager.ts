class MainGameManager{
    private static _instance:MainGameManager;
    public static getInstance():MainGameManager {
        if (!this._instance)
            this._instance = new MainGameManager();
        return this._instance;
    }

    public constructor() {
    }

    public lastPKData;

    //杀一个敌人的花费
    public getKillCost(){
        var level = UM.main_game.level;
        return level*200*(UM.main_game.kill.length+1);
    }

    //该位置是否被杀了
    public isKill(index){
        return UM.main_game.kill.indexOf(index) != -1;
    }

    //打开PK对战内容的表现
    public openPKView(fun?){
        var mainData = UM.main_game;
        if(!mainData.choose)//无卡牌数据
        {
            this.getCard(onGetCard);
        }
        else//已有卡版数据
        {
            onGetCard();
        }


        function onGetCard(){
            MainGameUI.getInstance().show();
            if(fun)
                fun();
        }
    }

    public getCard(fun?){
        if(UM.main_game.choose)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.get_main_card,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 4)
            {
                Alert('体力不足');
                return;
            }

            UM.main_game.choose = msg.choose;

            if(fun)
                fun();
        });
    }

    //choose :{list[],ring}   choose_index
    public pk(choose,fun?){
        var self = this;
        var oo:any = {};
        oo.choose = choose;
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.pk_main,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;

            UM.addHistory(choose.list.join(','));
            self.lastPKData = msg;
            PKManager.getInstance().onPK(PKManager.PKType.MAIN,msg);

            if(fun)
                fun();
        });
    }

    //杀死第几个怪
    public kill(kill,fun?){
        var self = this;
        var oo:any = {};
        oo.kill = kill;
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.main_kill,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('没有对应卡牌数据');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('该单位已被杀死');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('金币不足');
                return;
            }
            if(fun)
                fun();
        });
    }

    //领取奖励
    public getAward(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.main_award,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('今天已领过奖了');
                return;
            }
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
        if(UM.main_game.pkdata)
        {
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.MAIN,function(data){
                self.lastPKData = data;
                if(fun)
                    fun();
            })
        }
    }


}
