class FriendPKManager{
    private static _instance:FriendPKManager;
    public static getInstance():FriendPKManager {
        if (!this._instance)
            this._instance = new FriendPKManager();
        return this._instance;
    }

    public constructor() {
    }

    //public pkObject = {};
    public cardObject = {};
    public lastPKData= {};  //用logid做Key

    public otherid;
    public othernick;
    public otherhead;
    public isequal;
    public logid;
    public talk;

    public getCard(otherid,fun?){
        if(this.cardObject[otherid])
        {
            if(fun)
                fun();
            return
        }


        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_pk_get_card,oo,function(data){
            var msg = data.msg;

            if(msg.fail == 2)
            {
                Alert('请求失败');
                return;
            }

            self.cardObject[otherid] = msg.choose;
            if(fun)
                fun();
        });
    }

    public ask(choose,fun?){
        if(UM.getFriendPKTimes() == 0)
        {
            ShowTips('今次请求PK的次数已用完')
            return;
        }

        var self = this;
        var oo:any = {};
        oo.choose = choose;
        oo.otherid = this.otherid;
        oo.othernick = this.othernick;
        oo.otherhead = this.otherhead;
        oo.isequal = this.isequal;
        oo.talk = this.talk;
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_pk_ask,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;

            if(msg.fail == 1)
            {
                Alert('找不到卡组数据');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('更新日志出错');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('更新玩家卡组数据出错');
                return;
            }
            if(msg.fail == 4)
            {
                Alert('今日次数已完');
                return;
            }
            self.cardObject[oo.otherid] = null
            UM.addHistory(choose.list.join(','));
            FriendManager.getInstance().getLog(fun,'pk');
            //self.pkObject[msg.data.id] = (msg.data);
            //
            //if(fun)
            //    fun();
        });
    }

    //choose :{list[],ring,index}   choose_index
    public answer(choose,fun?){
        var self = this;
        var oo:any = {};
        oo.logid = this.logid;
        oo.choose = choose;
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_pk_answer,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;
            if(msg.fail == 1)
            {
                Alert('对战请求已失效');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('请求无效');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('对战请求无效');
                return;
            }
            if(msg.fail == 4)
            {
                Alert('已挑战过了，无法重复挑战');
                return;
            }
            if(msg.fail == 5)
            {
                Alert('更新日志出错');
                return;
            }
            if(msg.fail == 6)
            {
                Alert('更新战绩出错');
            }

            UM.addHistory(choose.list.join(','));
            self.lastPKData[self.logid] = msg//.pkdata;
            FriendManager.getInstance().getLog(null,'pk');

            msg.info.type = PKManager.PKType.FRIEND;
            PKManager.getInstance().onPK(PKManager.PKType.FRIEND,msg);
            if(fun)
                fun();
        });
    }


    public playBack(logid,fun?){
        if(this.lastPKData[logid])
        {
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.lastPKData[logid]);
            if(fun)
                fun();
            return;
        }

        var self = this;
        var oo:any = {};
        var pkObject = FriendManager.getInstance().pkObject[logid];
        var content = pkObject.content
        oo.team1 = content.answer_choose;
        oo.team2 = content.ask_choose;
        oo.isequal = content.isequal;
        oo.pk_version = content.pk_version;

        if(Math.floor(content.pk_version) < Config.pk_version){
            Alert('录像已过期');
            return;
        }
        Net.send(GameEvent.pkCore.pk_result,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 2)
            {
                Config.pk_version = Math.floor(msg.pk_version);
                Alert('录像已过期');
                return;
            }
            self.lastPKData[logid] = msg//.pkdata;

            var info:any = msg.info = {};
            info.type = PKManager.PKType.FRIEND;
            info.fromnick = content.fromnick;
            info.fromhead = content.fromhead;
            info.fromgameid = pkObject['from_gameid'];
            info.tonick = content.tonick;
            info.tohead = content.tohead;
            info.togameid = pkObject['to_gameid'];

            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,msg);
            if(fun)
                fun();
        });
    }
}
