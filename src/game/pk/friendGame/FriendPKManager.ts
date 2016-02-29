class FriendPKManager{
    private static _instance:FriendPKManager;
    public static getInstance():FriendPKManager {
        if (!this._instance)
            this._instance = new FriendPKManager();
        return this._instance;
    }

    public constructor() {
    }

    //public pkArray = {};
    public cardObject = {};
    public lastPKData= {};  //用logid做Key

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

    public ask(otherid,choose,isequal,fun?){
        var self = this;
        var oo:any = {};
        oo.choose = choose;
        oo.otherid = otherid;
        oo.isequal = isequal;
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
                Alert('今日次数已完');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('更新日志出错');
                return;
            }
            if(msg.fail == 4)
            {
                Alert('清除数据出错');
                return;
            }
            FriendManager.getInstance().getLog(fun,true);
            //self.pkArray[msg.data.id] = (msg.data);
            //
            //if(fun)
            //    fun();
        });
    }

    //choose :{list[],ring,index}   choose_index
    public answer(logid,choose,fun?){
        var self = this;
        var oo:any = {};
        oo.logid = logid;
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

            self.lastPKData[logid] = msg.pkdata;
            FriendManager.getInstance().getLog(null,true);
            //self.pkArray[logid].content.ask_choose = msg.ask_choose;
            //self.pkArray[logid].content.answer_choose = choose;
            //self.pkArray[logid].content.result = msg.result;
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
        var pkArray = FriendManager.getInstance().pkArray
        oo.team1 = pkArray[logid].content.answer_choose;
        oo.team2 = pkArray[logid].content.ask_choose;
        oo.isequal = pkArray[logid].content.isequal;
        Net.send(GameEvent.pkCore.pk_result,oo,function(data){
            var msg = data.msg;
            self.lastPKData[logid] = msg.pkdata;
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,msg);
            if(fun)
                fun();
        });
    }
}
