class MonsterManager{
    private static _instance:MonsterManager;
    public static getInstance():MonsterManager {
        if (!this._instance)
            this._instance = new MonsterManager();
        return this._instance;
    }

    public talkData = {};
    public commentData = {};
    public constructor() {
        this.commentData = SharedObjectManager.instance.getMyValue('monster_talk_comment') || {};
        var deleteKey = [];
        for(var s in this.commentData){
             if(TM.now() - this.commentData[s] > 7*24*3600)
             {
                 deleteKey.push(s);
             }
        }
        if(deleteKey.length)
        {
            for(var i=0;i<deleteKey.length;i++)
            {
                delete this.commentData[deleteKey[i]]
            }
            SharedObjectManager.instance.setMyValue('monster_talk_comment',this.commentData);
        }
    }

    public testComment(data){
        var key = data.monsterID + '_'+data.id + '_' + data.talk_key
        return this.commentData[key];
    }
    public setComment(data,v){
        var key = data.monsterID + '_'+data.id + '_' + data.talk_key
        this.commentData[key] = {t:TM.now(),v:v};
        SharedObjectManager.instance.setMyValue('monster_talk_comment',this.commentData);
    }

    public getTalkList(monsterID){
         if(!this.talkData[monsterID])
            return [];
        var arr = ObjectUtil.objToArray(this.talkData[monsterID].talk);
        ArrayUtil.sortByField(arr,['time','id'],[1,0]);
        return arr;
    }

    public getTalk(monsterID,fun?){
        var base = this.talkData[monsterID];
        if(base && TM.now() - base.time < 60)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        var oo:any = {};
        oo.monster = monsterID;
        if(base)
            oo.time = base.time - 1;
        else
            oo.time = 0;
        Net.addUser(oo);
        //oo.serverid =  LoginManager.getInstance().lastServer;
        Net.send(GameEvent.monster_talk.get,oo,function(data){
            var msg = data.msg;
            if(!self.talkData[monsterID])
                self.talkData[monsterID] = {talk:{}};
            self.talkData[monsterID].time = TM.now();
            self.talkData[monsterID].star  = msg.star;


            for(var i=1;i<=5;i++)
                msg.star['s' + i] = Math.floor(msg.star['s' + i])
            for(var s in msg.talk)
            {
                self.talkData[monsterID].talk[msg.talk[s].id] = msg.talk[s];
                msg.talk[s].monsterID = monsterID;
            }
            if(fun)
                fun();
        },false);
    }

    public sendStar(monsterID,star,fun?){

        var self = this;
        var oo:any = {};
        oo.monster = monsterID;
        oo.star = star;
        //Net.addUser(oo);
        Net.send(GameEvent.monster_talk.star,oo,function(data){
            var msg = data.msg;
            self.talkData[monsterID].star['s' + star]  += 1;
            if(fun)
                fun();
        },false);
    }

    public sendTalk(monsterID,talk,fun?){

        var self = this;
        var oo:any = {};
        oo.monster = monsterID;
        oo.talk = talk;
        Net.addUser(oo);
        Net.send(GameEvent.monster_talk.add,oo,function(data){
            var msg = data.msg;
            self.talkData[monsterID].talk[msg.id] = {
                id:msg.id,
                talk_key:msg.talk_key,
                bad:0,
                time:TM.now(),
                good:0,
                monsterID:monsterID,
                talk:JSON.stringify({
                    head:UM.head,
                    gameid:UM.gameid,
                    serverid:Net.getInstance().serverID,
                    nick:Base64.encode(UM.nick),
                    talk:Base64.encode(talk)
                })
            };

            if(fun)
                fun();
        },false);
    }

    public sendComment(monsterID,id,isgood,fun?){
        var self = this;
        var oo:any = {};
        oo.monster = monsterID;
        oo.id = id;
        oo.talk_key = self.talkData[monsterID].talk[id].talk_key;
        oo.isgood = isgood;
        //Net.addUser(oo);
        Net.send(GameEvent.monster_talk.comment,oo,function(data){
            var msg = data.msg;
            if(isgood)
                self.talkData[monsterID].talk[id].good  = Math.floor(self.talkData[monsterID].talk[id].good) + 1;
            else
                self.talkData[monsterID].talk[id].bad  = Math.floor(self.talkData[monsterID].talk[id].bad) + 1;
            self.setComment(self.talkData[monsterID].talk[id],isgood)
            if(fun)
                fun();
        },false);
    }
}
