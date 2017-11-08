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
    public logList
    public stepName = ['黄','玄','地','天','武','圣','尊','神'];
    public getStepName(exp){
        var level = this.getPKTableLevel(exp)
        return this.getStepNameByLevel(level)
    }

    public getStepNameByLevel(level){
        var step = level%3 || 3
        level = Math.floor((level - 1)/3)
        return this.stepName[level] + '级' + ['','下','中','上'][step]+'品';
    }
    getStepNameByLevel


    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_serverEqual_log') || [];
    }

    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 20;
        SharedObjectManager.instance.setMyValue('pk_serverEqual_log',list);
    }

    //打开PK对战内容的表现
    public openPKView(isAgain?,fun?){
        var serverData = UM.server_game_equal;
        if(!serverData.pk && serverData.choose)//已选定对手
        {
            onGetCard();
        }
        else if(isAgain)//已PK过
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
            ServerGameEqualUI.getInstance().show();
            if(fun)
                fun();
        }
    }

    public getCurrentLevel(){
        return this.getPKTableLevel(UM.server_game_equal.exp)
    }

    //根据经验，返回所在等级
    public  getPKTableLevel(exp){
        return PKTool.getPKTableLevel(exp,100);
    }
    public  getPKTableExp(lv){
        return PKTool.getPKTableExp(lv,100);
    }

    public getCard(isagain,fun?){
        var serverData = UM.server_game_equal;
        if(serverData.choose && serverData.pk==0)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        var oo:any = {};
        if(!serverData.open && UM.getPropNum(21) < 1)
        {
            Confirm('修正币数量不足！\n在天梯竞技场、每日任务中取得胜利，都有机会获得修正币\n你也可以通过使用钻石进行购买，是否前往？',function(v){
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
                Alert('修正币不足');
                return;
            }
            if(msg.fail == 21)
            {
                Alert('无法匹配到合适的对手');
                return
            }
            if(msg.fail)
            {
                Alert('获取卡兵失败',LoginManager.getInstance().relogin);
                return;
            }

            UM.server_game_equal.pk = 0;
            UM.server_game_equal.choose = msg.choose;
            UM.server_game_equal.enemy = msg.enemy;
            UM.server_game_equal.open = true;
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
        oo.data_key = md5.incode(JSON.stringify(choose)).substr(-16);
        Net.addUser(oo);

        //要先记录，PK后可能就没数据了
        var nick = '神秘人'
        var head = 0
        var gameid = 0
        var info = UM.server_game_equal.enemy.userinfo;
        if(info && info.gameid != UM.gameid)
        {
            nick = Base64.decode(info.nick);
            head = info.head;
            gameid = info.gameid
        }

        Net.send(GameEvent.serverGameEqual.pk_server_equal,oo,function(data){
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
            msg.info.type = PKManager.PKType.SERVER_EQUAL;
            PKManager.getInstance().onPK(PKManager.PKType.SERVER_EQUAL,msg);
            UM.server_game_equal.pkdata = Config.pk_version;


            self.addLogList(PKManager.getInstance().getLogData({nick:nick,head:head,gameid:gameid,type:PKManager.PKType.SERVER_EQUAL}));

            if(fun)
                fun();
        });
    }

    public playBack(fun?){
        if(this.lastPKData)
        {
            //PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.lastPKData);
            //PKMainUI.getInstance().show();
            if(fun)
                fun();
            return;
        }

        if(UM.server_game_equal.pkdata)
        {
            if(UM.server_game_equal.pkdata.version != Config.pk_version)
            {
                this.lastPKData = true;
                if(fun)
                    fun();
                return;
            }
            var logData = this.logList[0]
            if(logData && (logData.time - (UM.server_game_equal.pkdata.time || 0) > -5)) //5S内都算已有
            {
                this.lastPKData = true;
                if(fun)
                    fun();
                return;
            }
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.SERVER_EQUAL,function(data){
                self.lastPKData = data;
                PKManager.getInstance().onPK(PKManager.PKType.REPLAY,self.lastPKData);

                var nick = '神秘人'
                var head = 0
                var gameid = 0
                var info = data.info;
                if(info && info.gameid != UM.gameid)
                {
                    nick = Base64.decode(info.nick);
                    head = info.head;
                    gameid = info.gameid
                }
                self.addLogList(PKManager.getInstance().getLogData({nick:nick,head:head,gameid:gameid,type:PKManager.PKType.SERVER_EQUAL},UM.server_game_equal.pkdata.time));
                if(fun)
                    fun();
            })
        }
    }

    //public playBack(fun?){
    //    if(this.lastPKData)
    //    {
    //        PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.lastPKData);
    //        PKMainUI.getInstance().show();
    //        if(fun)
    //            fun();
    //        return;
    //    }
    //    if(UM.server_game_equal.pkdata)
    //    {
    //        if(UM.server_game_equal.pkdata != Config.pk_version)
    //        {
    //            Alert('录像已过期');
    //            return;
    //        }
    //
    //        var self = this;
    //        PKManager.getInstance().getReplayByType(PKManager.PKType.SERVER_EQUAL,function(data){
    //            self.lastPKData = data;
    //            self.playBack(fun);
    //        })
    //    }
    //}
}
