class LeaderManager {
    private static _instance:LeaderManager;

    public static getInstance():LeaderManager {
        if (!this._instance)
            this._instance = new LeaderManager();
        return this._instance;
    }

    public skillViewListData = {};
    public skillTotal = {time:0,list:[]};

    public getSkillLog(id){
        return this.skillViewListData[id].list
    }


    public leaderGet(type,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;

        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_get,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('时间未到');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('钻石不够');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('已有列表');
            }
            else if(msg.isFree)
            {
                UM.tec.leader.lasttime = TM.now();
                MainPageUI.getInstance().renewLeaderRed();
            }
            UM.tec.leader.list = msg.list;

            if(fun)
                fun();
        });
    }

    public leaderAward(ids,fun?){
        var self = this;
        var oo:any = {};
        oo.ids = ids;

        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_award,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到原始数据');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('选择数量不对');
                return;
            }
            UM.tec.leader.list = null;

            if(fun)
                fun();
        });
    }

    public skillCompose(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_skill_compose,oo,function(data){
            var msg = data.msg;
            var oo = {prop:{}};
            oo.prop[41] = msg.num;
            AwardUI.getInstance().show(oo)
            if(fun)
                fun();
        });
    }

    public skillDraw(num,diamond,fun?){
        var self = this;
        var oo:any = {};
        oo.num = num;
        oo.diamond = diamond
        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_skill_draw,oo,function(data){
            var msg = data.msg;
            var award = msg.award;
            for(var i=0;i<award.length;i++)
            {
                var oo = award[i];
                if(oo.type == 'skill')
                {
                    UM.tec.skill.push(oo.id);
                }
            }
            if(fun)
                fun(award);
        });
    }

    public skillDrawLog(fun?){
        var self = this;
        if(this.skillViewListData[0] && TM.now() - this.skillViewListData[0].time < 60)
        {
            if(fun)
                fun();
            return;
        }
        var oo:any = {};
        Net.send(GameEvent.tec.leader_skill_draw_log,oo,function(data){
            var msg = data.msg;
            self.skillViewListData[0] = {
                time:TM.now(),
                list:msg.list
            }
            if(fun)
                fun();
        });
    }

    public skillSet(skillid,fun?){
        var self = this;
        var oo:any = {};
        oo.skillid = skillid;
        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_skill_set,oo,function(data){
            var msg = data.msg;
            UM.tec.use_skill = skillid;
            if(fun)
                fun();
        });
    }

    public skillView(fun?){
        if(TM.now() - this.skillTotal.time < 60)
        {
            if(fun)
                fun();
            return;
        }
        var self = this;
        var oo:any = {};
        Net.send(GameEvent.tec.leader_skill_view,oo,function(data){
            var msg = data.msg;
            self.skillTotal.time = TM.now();
            self.skillTotal.list = msg.list;
            if(fun)
                fun();
        });
    }

    public skillViewList(skillid,fun?){
        if(this.skillViewListData[skillid] && TM.now() - this.skillViewListData[skillid].time < 60)
        {
            if(fun)
                fun();
            return;
        }
        var self = this;
        var oo:any = {};
        oo.skillid = skillid;
        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_skill_view_list,oo,function(data){
            var msg = data.msg;
            self.skillViewListData[skillid] = {
                time:TM.now(),
                list:msg.list
            }
            if(fun)
                fun();
        });
    }
}