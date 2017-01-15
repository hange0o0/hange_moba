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

    //打开PK对战内容的表现
    public openPKView(fun?){
        var serverData = UM.server_game_equal;
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
            ServerGameEqualUI.getInstance().show();
            if(fun)
                fun();
        }
    }

    //根据经验，返回所在等级
    public  getPKTableLevel(exp){
        return PKTool.getPKTableLevel(exp,100);
    }
    public  getPKTableExp(lv){
        return PKTool.getPKTableExp(lv,100);
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
        if(UM.getPropNum(21) < 1)
        {
            Confirm('入场券数量不足！\n在竞技场、每日任务中，都有机会获得入场券\n是否先购买几张玩玩？',function(v){
                if(v == 1)
                {
                    ShopUI.getInstance().show('ticket');
                }
            },['知道了','购买'])
            return;
        }
        //if(isagain && UM.getPropNum(21) < 2)
        //{
        //    Alert('无法再次挑战\n入场券数量不足2张！\n在竞技场PK，有机会获得入场券');
        //    return;
        //}
        oo.isagain = isagain
        Net.addUser(oo);
        Net.send(GameEvent.serverGameEqual.get_server_equal_card,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('道具不足');
                return;
            }

            UM.server_game_equal.pk = 0;
            UM.server_game_equal.choose = msg.choose;
            UM.server_game_equal.enemy = msg.enemy;
            EM.dispatch(GameEvent.client.get_card)
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

            UM.addHistory(choose.list.join(','));
            self.lastPKData = msg;
            msg.info.type = PKManager.PKType.SERVER_EQUAL;
            PKManager.getInstance().onPK(PKManager.PKType.SERVER_EQUAL,msg);

            if(fun)
                fun();
        });
    }


    public playBack(fun?){
        if(this.lastPKData)
        {
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.lastPKData);
            PKMainUI.getInstance().show();
            if(fun)
                fun();
            return;
        }
        if(UM.server_game_equal.pkdata)
        {
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.SERVER_EQUAL,function(data){
                self.lastPKData = data;
                self.playBack(fun);
            })
        }
    }
}
