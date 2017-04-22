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
    public logList
    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_server_log') || [];
    }
    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 0;
        SharedObjectManager.instance.setMyValue('pk_server_log',list);
    }

    //打开PK对战内容的表现
    public openPKView(isAgain?,fun?){
        var serverData = UM.server_game;
        if(!serverData.pk && serverData.choose)//已选定对手
        {
            onGetCard();
        }
        else if(isAgain)//已PK过，再打会变贵
        {
            this.getCard(true,onGetCard);
        }
        else
        {
            this.getCard(false,onGetCard);
        }

        function onGetCard(){
            if(UM.getEnergy()<1)
            {
                Alert('体力不足1点，无法进行挑战');
                return;
            }
            ServerGameUI.getInstance().show();
            fun && fun();
        }
    }

    //根据经验，返回所在等级
    public  getPKTableLevel(exp){
        return PKTool.getPKTableLevel(exp,30);
    }
    public  getPKTableExp(lv){
        return PKTool.getPKTableExp(lv,30);
    }

    public getCard(isagain,fun?){
        if(UM.server_game.choose && UM.server_game.pk==0)
        {
            if(fun)
                fun();
            return
        }
        //if(UM.getEnergy()<2)
        //{
        //    Alert('体力不足2点，无法挑战');
        //    return;
        //}
        //if(isagain && UM.getEnergy()<2)
        //{
        //    Alert('体力不足2点，无法再次挑战');
        //    return;
        //}
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
            if(msg.fail)
            {
                Alert('获取卡牌失败',LoginManager.getInstance().relogin);
                return;
            }

            UM.server_game.pk = 0;
            UM.server_game.choose = msg.choose;
            UM.server_game.enemy = msg.enemy;
            EM.dispatch(GameEvent.client.get_card)
            if(fun)
                fun();
        });
    }

    //choose :{list[],ring,index}   choose_index
    public pk(choose,fun?){
        var self = this;
        var oo:any = {};
        if(!UM.testEnergy(1))
        {
            return;
        }
        oo.choose = choose;
        Net.addUser(oo);
        Net.send(GameEvent.serverGame.pk_server,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;
            if(msg.fail)
            {
                Alert('PK出错',LoginManager.getInstance().relogin);
                return;
            }


            UM.addHistory(choose.list.join(','));
            self.lastPKData = msg;
            msg.info.type = PKManager.PKType.SERVER;
            PKManager.getInstance().onPK(PKManager.PKType.SERVER,msg);
            UM.server_game.pkdata = Config.pk_version;



            var nick = '神秘人'
            var head = 0
            var gameid = 0
            var info = UM.server_game.enemy.userinfo;
            if(info && info.gameid != UM.gameid)
            {
                nick = Base64.decode(info.nick);
                head = info.head;
                gameid = info.gameid
            }
            self.addLogList(PKManager.getInstance().getLogData({nick:nick,head:head,gameid:gameid,type:PKManager.PKType.SERVER}));

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
        if(UM.server_game.pkdata)
        {
            if(UM.server_game.pkdata != Config.pk_version)
            {
                Alert('录像已过期');
                return;
            }
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.SERVER,function(data){
                self.lastPKData = data;
                self.playBack(fun)
            })
        }
    }
}
