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

    public stepName = ['青铜','生铁','黑铁','白银','黄金','白金','紫金','赤金','钻石'];
    public getStepName(exp){
        var level = this.getPKTableLevel(exp)
        return this.getStepNameByLevel(level)
    }

    public getStepNameByLevel(level){
        var step = level%3 || 3
        level = Math.floor((level - 1)/3)
        return this.stepName[level] + StringUtil.numToStr(step)+'段';
    }


    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_server_log') || [];
    }
    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 20;
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
    public getCurrentLevel(){
        return this.getPKTableLevel(UM.server_game.exp)
    }

    //根据经验，返回所在等级
    public  getPKTableLevel(exp){
        return PKTool.getPKTableLevel(exp,100);
    }
    public  getPKTableExp(lv){
        return PKTool.getPKTableExp(lv,100);
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
            if(msg.fail == 21)
            {
                Alert('无法匹配到合适的对手');
                return
            }
            if(msg.fail)
            {
                Alert('匹配对手失败',LoginManager.getInstance().relogin);
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
        oo.data_key = md5.incode(JSON.stringify(choose)).substr(-16);
        Net.addUser(oo);

       //要先记录，PK后可能就没数据了
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




            self.addLogList(PKManager.getInstance().getLogData({nick:nick,head:head,gameid:gameid,type:PKManager.PKType.SERVER}));

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

        if(UM.server_game.pkdata)
        {
            if(UM.server_game.pkdata.version != Config.pk_version)
            {
                this.lastPKData = true;
                if(fun)
                    fun();
                return;
            }
            var logData = this.logList[0]
            if(logData && (logData.time - (UM.server_game.pkdata.time || 0) > -5)) //5S内都算已有
            {
                this.lastPKData = true;
                if(fun)
                    fun();
                return;
            }
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.SERVER,function(data){
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
                self.addLogList(PKManager.getInstance().getLogData({nick:nick,head:head,gameid:gameid,type:PKManager.PKType.SERVER},UM.server_game.pkdata.time));
                if(fun)
                    fun();
            })
        }
    }

    //
    //public playBack(fun?){
    //    if(this.lastPKData)
    //    {
    //        PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.lastPKData);
    //        PKMainUI.getInstance().show();
    //        if(fun)
    //            fun();
    //        return;
    //    }
    //    if(UM.server_game.pkdata)
    //    {
    //        if(UM.server_game.pkdata != Config.pk_version)
    //        {
    //            Alert('录像已过期');
    //            return;
    //        }
    //        var self = this;
    //        PKManager.getInstance().getReplayByType(PKManager.PKType.SERVER,function(data){
    //            self.lastPKData = data;
    //            self.playBack(fun)
    //        })
    //    }
    //}
}
