class FriendManager{
    private static _instance:FriendManager;
    public static getInstance():FriendManager {
        if (!this._instance)
            this._instance = new FriendManager();
        return this._instance;
    }

    public maxFriendNum = 30;
    public maxTalk = 100;
    public maxPK = 10;
    public lastGetFriend = 0;
    public lastGetLog = 0
    public friendList;
    public friendData = {};
    public logList = []
    public pkObject = {};

    public otherInfo = {};
    public otherInfoNick = {};
    public errorOpenID = {};

    public shareCreateDate = 0; //shareObject里面的数据只保存一天

    public talkSave = {};//最近的记录历史聊天到本地

    private getCD//取消息中


    public missArray = [];
    public missTime = 0;

    private logOpenTime
    private pkOpenTime

    public constructor() {
        var oo = SharedObjectManager.instance.getMyValue('friendData');
        if(oo)
        {
            this.shareCreateDate = oo.shareCreateDate;
            if(Math.abs(TM.now() - this.shareCreateDate) < 24*3600)
            {
                this.lastGetFriend = oo.lastGetFriend
                this.lastGetLog = oo.lastGetLog
                this.friendList = oo.friendList
                this.friendData = oo.friendData
                this.logList = oo.logList
                this.pkObject = oo.pkObject
            }
            else
            {
                this.shareCreateDate = 0;
            }
        }

        var oo2 = SharedObjectManager.instance.getMyValue('friendRedData');
        if(oo2)
        {
            this.logOpenTime = oo2.logOpenTime;
            this.pkOpenTime = oo2.pkOpenTime;
        }
        else
        {
            this.logOpenTime = 0;
            this.pkOpenTime = 0;
        }
    }

    public friendRed(){
        if(UM.level < Config.friendLevel)
        {
            return false;
        }
         return  Math.max(this.logOpenTime,this.pkOpenTime) <UM.friendtime || this.logRed() || this.pkRed();
    }

    public logRed(){
        if(this.logList[0])
        {
             return this.logOpenTime < this.logList[0].time;
        }
        return false
    }
    public pkRed(){
        var arr = this.getPKArray();
        if(arr[0])
        {
             return this.pkOpenTime < arr[0].time;
        }
        return false
    }

    public setOpen(type,stopSend = false){
        if(type == 'log')
        {
            if(this.logList[0])
            {
                this.logOpenTime = this.logList[0].time;
                SharedObjectManager.instance.setMyValue('friendRedData',{logOpenTime:this.logOpenTime,pkOpenTime:this.pkOpenTime});
            }
        }
        else if(type == 'pk')
        {
            var arr = this.getPKArray();
            if(arr[0])
            {
                this.pkOpenTime = arr[0].time;
                SharedObjectManager.instance.setMyValue('friendRedData',{logOpenTime:this.logOpenTime,pkOpenTime:this.pkOpenTime});
            }
        }
        if(!stopSend)
            EM.dispatchEventWith(GameEvent.client.friend_red_change)
    }

    //把过期的消息去掉
    public removeTimeOut(arr){
        var endTime = TM.now() - 24*3600*3
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i].time < endTime)
            {
                arr.splice(i,1);
                i--;
            }
        }
    }

    public showPKUI(id){
        var self = this;
        var FPKM = FriendPKManager.getInstance();
        FPKM.getCard(id,function(){
            var oo = {
                otherid:id,
                othernick:self.friendData[id].info.nick,
                otherhead:self.friendData[id].info.head,
                content:{
                    from_list:FPKM.cardObject[id]
                }
            };

            FriendPKAskUI.getInstance().show(oo);
        })
    }

    public getPKArray(){
        var arr = ObjectUtil.objToArray(this.pkObject);
        ArrayUtil.sortByField(arr,['id'],[1])
        this.removeTimeOut(arr);
        return  arr;
    }

    //取聊天记录
    public getTalkList(gameid){
        if(this.talkSave[gameid])
        {
            return this.talkSave[gameid].list;
        }
        this.initTalkSave(gameid);
        return this.talkSave[gameid].list
    }

    public getTalkInfo(gameid){
        if(this.talkSave[gameid])
        {
            return this.talkSave[gameid];
        }
        this.initTalkSave(gameid);
        return this.talkSave[gameid]
    }

    //初始化聊天记录
    private initTalkSave(gameid){
        if(this.talkSave[gameid])
            return;
        this.talkSave[gameid] = SharedObjectManager.instance.getMyValue('talkData_'+gameid) || {list:[],lastID:0};
    }

    //设置已查看过该玩家的聊天
    private saveTalkView(gameid){
        this.initTalkSave(gameid);
        var talkSave = this.talkSave[gameid];
        if(talkSave.list.length > 0)
        {
            talkSave.lastID = talkSave.list[talkSave.list.length-1].id;
            SharedObjectManager.instance.setMyValue('talkData_' + gameid,talkSave);
        }
    }

    //得到未查看消息的数量
    public getNotSeeNum(gameid){
        this.initTalkSave(gameid);
        var talkSave = this.talkSave[gameid];
        var count = 0;
        for(var i = talkSave.list.length-1;i>=0;i--)
        {
             if(talkSave.lastID < talkSave.list[i].id)
                count ++;
            else
                break;
        }
        return 0;
    }

    //保存到聊天记录
    private saveTalk(talkData)
    {
        if(talkData.from_gameid == UM.gameid)
            var gameid = talkData.to_gameid;
        else
            var gameid = talkData.from_gameid;

        //if(!this.talkSave[gameid])
        //{
        //    this.talkSave[gameid] = {};
        //    this.talkUser[gameid] = 1;
        //    SharedObjectManager.instance.setMyValue('talkUser',this.talkUser);
        //}

        this.initTalkSave(gameid);
        var talkSave = this.talkSave[gameid];
        var arr = talkSave.list;

        for(var i=0;i<arr.length;i++)
        {
            if(arr[i].id == talkData.id)  //已记录过了
                return;
        }


        talkSave.nick = talkData.content.nick;
        talkSave.head = talkData.content.head;
        var oo:any = {};
        oo.id = talkData.id;
        oo.time = talkData.time
        oo.talk = talkData.content.talk;
        if(talkData.to_gameid == UM.gameid)
            oo.stat = 1;
        arr.push(oo);
        ArrayUtil.sortByField(arr,['id'],[0]);
        while(arr.length > 50)//过长的丢弃
        {
            arr.shift();
        }
        SharedObjectManager.instance.setMyValue('talkData_' + gameid,talkSave);

        EM.dispatchEventWith(GameEvent.client.talk_change)

    }

    //保存到本地
    private saveToLocal(){
       var oo:any = {};
        oo.lastGetFriend = this.lastGetFriend
        oo.lastGetLog = this.lastGetLog
        oo.friendList = this.friendList
        oo.friendData = this.friendData
        oo.logList = this.logList
        oo.pkObject = this.pkObject
        oo.shareCreateDate = this.shareCreateDate || TM.now()
        SharedObjectManager.instance.setMyValue('friendData',oo);

    }

    private removeLog(id){
         if(this.logList)
         {
             for(var i=0;i<this.logList.length;i++)
             {
                 if(this.logList[i].id == id)
                 {
                     this.logList.splice(i,1);
                     return;
                 }
             }
         }
    }

    private getLogByID(id){
         if(this.logList)
         {
             for(var i=0;i<this.logList.length;i++)
             {
                 if(this.logList[i].id == id)
                 {
                     return this.logList[i];
                 }
             }
         }
        return null
    }

    public addFriend(data){
        if(!this.friendList)
            return;
        if(data.nick)
            data.nick = Base64.decode(data.nick);
        if(this.friendList.indexOf(data.gameid) == -1)
        {
            this.friendList.push(data.gameid);
        }
        if(!this.friendData[data.gameid])
            this.friendData[data.gameid] = {};
        this.friendData[data.gameid].info = data;
    }

    public deleteFriend(otherid){
        var index =  this.friendList.indexOf(otherid);
        if(index != -1)
        {
            this.friendList.splice(index,1);
        }
        delete this.friendData[otherid]
    }

    public getList(fun?){
        if(this.friendList && TM.now() - this.lastGetFriend < 60)//1分钟CD     5*60
        {
            if(fun)
                fun();
            return;
        }
        var self = this;
        var oo:any = {};
        oo.lasttime = this.lastGetFriend;
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_list,oo,function(data){
            var msg = data.msg;  //serverfriends,friendinfo,friendpk
            self.lastGetFriend = TM.now();
            self.friendList = msg.serverfriends;
            for(var s in msg.friendinfo)
            {
                if(!self.friendData[s])
                    self.friendData[s] = {};
                self.friendData[s].info = msg.friendinfo[s];
                if(msg.friendinfo[s].nick)
                    msg.friendinfo[s].nick = Base64.decode(msg.friendinfo[s].nick);
            }
            for(var s in msg.friendpk)
            {
                if(!self.friendData[s])
                    self.friendData[s] = {};
                self.friendData[s].pk = msg.friendpk[s];
            }
            self.saveToLocal();
            if(fun)
                fun();
        });
    }

    //请求
    public apply(otherid,fun?){
        if(this.friendList.length >= this.maxFriendNum)
        {
            ShowTips('好友数量已达最大值');
            return;
        }
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        //oo.des = des;
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_apply,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 3)
            {
               Alert('不能向自己请求');
                return;
            }
            if(msg.fail == 1)
            {
               Alert('对方不存在');
                return;
            }
            if(msg.fail == 2)
            {
               Alert('请求失败');
                return;
            }
            if(msg.fail == 4)
            {
               Alert('我的好友数量已达最大值');
                return;
            }
            if(msg.fail == 5)
            {
               Alert('对方好友数量已达最大值');
                return;
            }
            ShowTips('请求已发送')
            if(fun)
                fun();
        });
    }
    //talk
    public talk(otherid,talk,fun?){
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        oo.talk = talk
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_talk,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 3)
            {
               Alert('不能向自己请求');
                return;
            }
            if(msg.fail == 1)
            {
               Alert('对方不存在');
                return;
            }
            if(msg.fail == 2)
            {
               Alert('请求失败');
                return;
            }
            if(msg.fail == 4)
            {
               Alert('没有聊天符了');
                return;
            }
            FriendManager.getInstance().getLog(fun,'log');
            if(fun)
                fun();
        });
    }


    public refuse(logid,fun?){
        var self = this;
        var oo:any = {};
        oo.logid = logid;
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_refuse,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                //找不到日志
            }
            self.removeLog(logid);
            self.saveToLocal();
            if(fun)
                fun();
        });
    }

    public friend_miss(fun?){
        var self = this;
        if(TM.now()  - this.missTime < 60){
            if(fun)
                fun();
            return;
        }
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_miss,oo,function(data){
            var msg = data.msg;
            self.missTime = TM.now();
            self.missArray = msg.list;
            if(fun)
                fun();
        });
    }


    public agree(logid,fun?){
        if(this.friendList.length >= this.maxFriendNum)
        {
            ShowTips('好友数量已达最大值');
            return;
        }
        var self = this;
        var oo:any = {};
        oo.logid = logid;
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_agree,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到日志');
                return
            }
            if(msg.fail == 2)
            {
                Alert('更新日志失败');
                return
            }
            if(msg.fail == 3)
            {
                Alert('无法添加好友');
                return
            }
            if(msg.fail == 4)
            {
                //插不到对方数据
            }
            if(msg.fail == 5)
            {
                Alert('我的好友数量已达最大值');
                return;
            }
            if(msg.fail == 6)
            {
                Alert('对方好友数量已达最大值');
                return;
            }
            if(msg.fail == 7)
            {
                Alert('找不到对方数据');
                return;
            }
            self.removeLog(logid);
            self.addFriend(msg.otherinfo);
            self.saveToLocal();
            EM.dispatchEventWith(GameEvent.client.friend_list_change);
            if(fun)
                fun();
        });
    }
    public getLog(fun?,force=null){

        if(!force && this.logList && TM.now() - this.lastGetLog < 30)//30S CD             10
        {
            if(fun)
                fun();
            return;
        }
        if(!force && TM.now() - this.getCD<3)// 3S内不会重复发消息
            return;
        var self = this;
        var oo:any = {};
        oo.lasttime = this.lastGetLog;
        this.getCD = TM.now();
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_log,oo,function(data){
            var msg = data.msg;
            self.lastGetLog = TM.now();
            if(!self.logList)
                self.logList = [];
            var now = TM.now();
            var logChange = 0;
            var pkChange = 0;
            for(var i=0;i<msg.list.length;i++)          //type 1:news 2pk 3talk
            {
                msg.list[i].id = Math.floor(msg.list[i].id);
                msg.list[i].time = Math.floor(msg.list[i].time);
                if(msg.list[i].content)
                {
                    if(msg.list[i].content.nick)
                        msg.list[i].content.nick = Base64.decode(msg.list[i].content.nick);
                    if(msg.list[i].content.talk)
                        msg.list[i].content.talk = Base64.decode(msg.list[i].content.talk);
                    if(msg.list[i].content.from_nick)
                        msg.list[i].content.from_nick = Base64.decode(msg.list[i].content.from_nick);
                    if(msg.list[i].content.to_nick)
                        msg.list[i].content.to_nick = Base64.decode(msg.list[i].content.to_nick);
                }
                if(msg.list[i].type != 2)
                {
                    self.removeLog(msg.list[i].id);
                    if(msg.list[i].to_gameid == UM.gameid)//只有对方发我的才显示在日志中
                        self.logList.push(msg.list[i]);
                    else if(msg.list[i].type == 3 && self.friendData[msg.list[i].to_gameid])//聊天的话就都显示
                        self.logList.push(msg.list[i]);

                    if(msg.list[i].type == 3)
                        self.saveTalk(msg.list[i]);
                    logChange++;
                }
                else
                {
                   self.pkObject[msg.list[i].id] = msg.list[i];
                    pkChange++;
                }

                //if(FriendListUI.getInstance().stage && FriendListUI.getInstance()['tab'].selectedIndex == 1) //不显示红点
                //{
                //    self.setOpen('log',true);
                //}
            }
            if(logChange)
            {
                ArrayUtil.sortByField(self.logList,['id'],[1]);
                //把后面重复的聊天去掉
                var talkPlayer = {};
                for(var i=0;i<self.logList.length;i++)
                {
                     var oo = self.logList[i];
                    if(oo.type != 3)
                        continue;
                    var id = oo.to_gameid == UM.gameid?oo.from_gameid:oo.to_gameid;
                    if(talkPlayer[id])
                    {
                        self.logList.splice(i,1);
                        i--;
                    }
                    talkPlayer[id] = true;
                }
                if(FriendListUI.getInstance().stage && FriendListUI.getInstance()['tab'].selectedIndex == 1) //不显示红点
                {
                    self.setOpen('log',true);
                }
                else{
                    if(force && force=='log')
                        logChange --;
                    if(!logChange)
                        self.setOpen('log',true);
                }

                EM.dispatchEventWith(GameEvent.client.friend_log_change)
            }
            if(pkChange)
            {
                if(FriendListUI.getInstance().stage && FriendListUI.getInstance()['tab'].selectedIndex == 2) //不显示红点
                {
                    self.setOpen('pk',true);
                }
                else{
                    if(force && force=='pk')
                        pkChange --;
                    if(!pkChange)
                        self.setOpen('pk',true);
                }
                EM.dispatchEventWith(GameEvent.client.friend_pk_change)
            }

            self.setOpen('red');
            self.saveToLocal();
            if(fun)
                fun();
        });
    }

    //删除好友
    public delete(otherid,fun?){
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        Net.addUser(oo);
        Net.send(GameEvent.friend.friend_delete,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('删除好友失败');
                return
            }
            if(msg.fail == 2)
            {
               //删除对方失败
            }

            self.deleteFriend(otherid);
            self.saveToLocal();
            EM.dispatchEventWith(GameEvent.client.friend_list_change)
            if(fun)
                fun();
        });
    }

    //查看他人详情   otherid,othernick只用传其中一个
    public getOtherInfoByID(otherid,fun?,stopAlert?){
        if(this.otherInfo[otherid] && TM.now() - this.otherInfo[otherid].getTime <  60)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        if(self.errorOpenID[otherid]){
            Alert(stopAlert || '该用户不存在')
            return;
        }
        var oo:any = {};
        oo.otherid = otherid;
        //oo.serverid =  LoginManager.getInstance().lastServer;
        Net.send(GameEvent.user.get_other_info,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                self.errorOpenID[otherid] = true;
                Alert(stopAlert || '该用户不存在')
                return;
            }
            var info = msg.info;
            info.getTime = TM.now();
            self.otherInfo[info.gameid] = info;
            self.otherInfoNick[info.nick] = info;

            if(self.friendData[info.gameid])
                self.friendData[info.gameid].info = info;

            if(fun)
                fun();
        });
    }

    //查看他人详情   otherid,othernick只用传其中一个
    public getOtherInfoByNick(othernick,fun?){
        if(othernick && this.otherInfoNick[othernick] && TM.now() - this.otherInfoNick[othernick].getTime <  60)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        var oo:any = {};
        oo.othernick = othernick;
        //oo.serverid =  LoginManager.getInstance().lastServer;
        Net.send(GameEvent.user.get_other_info,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('该用户不存在')
                return;
            }
            var info = msg.info;
            info.getTime = TM.now();
            self.otherInfo[info.gameid] = info;
            self.otherInfoNick[info.nick] = info;

            if(fun)
                fun();
        });
    }

    //改头像
    public changeHead(headid,fun?){

        var self = this;
        var oo:any = {};
        oo.headid = headid;
        Net.addUser(oo);
        Net.send(GameEvent.user.change_head,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('头像没改变');
                UM.head = headid;
                EM.dispatch(GameEvent.client.change_head);
                return;
            }
            if(msg.fail == 2)
            {
                Alert('钻石不足！')
                return;
            }
            UM.head = headid;
            EM.dispatch(GameEvent.client.change_head);

            if(fun)
                fun();
        });
    }

    //改宣言
    public changeWord(word,fun?){

        var self = this;
        var oo:any = {};
        oo.word = word;
        Net.addUser(oo);
        Net.send(GameEvent.user.change_word,oo,function(data){
            var msg = data.msg;
            UM.word = word;
            EM.dispatch(GameEvent.client.word_change);
            if(fun)
                fun();
        });
    }

}
