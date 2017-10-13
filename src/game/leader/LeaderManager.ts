class LeaderManager {
    private static _instance:LeaderManager;

    public static getInstance():LeaderManager {
        if (!this._instance)
            this._instance = new LeaderManager();
        return this._instance;
    }

    public skillViewListData = {};
    public skillTotal = {time:0};

    public getSkillLog(id){
        return this.skillViewListData[id].list
    }
    public getAddExpByType(type){
        if(type == 1)
            return 50;
        if(type == 2)
            return 150;
        return 200;
    }

    //测试已配技能是否正常
    public testLeaderSkill(){
        var skillID = UM.tec.use_skill;
        if(skillID)
        {
            if(UM.tec.skill.indexOf(skillID) != -1)   //有这个技能
                return true
            if(!UM.tec.copy_skill[skillID] || UM.tec.copy_skill[skillID] < TM.now())
            {
                delete UM.tec.copy_skill[skillID];
                return false
            }
        }
        return true
    }

    //取分身技能
    public getCopySkillList(){
        var t = TM.now();
        var arr = [];
        var deleteArr = [];
        for(var s in UM.tec.copy_skill)
        {
            var skillID = parseInt(s);
            if(t > UM.tec.copy_skill[skillID] || UM.tec.skill.indexOf(skillID) != -1)   //有这个技能
            {
                deleteArr.push(skillID)
            }
            else
            {
                arr.push({id:skillID,t:UM.tec.copy_skill[s]})
            }
        }
        ArrayUtil.sortByField(arr,['t'],[0])
        for(var i=0;i<arr.length;i++)
            arr[i] = arr[i].id;
        while(deleteArr.length > 0)
        {
            delete UM.tec.copy_skill[deleteArr.pop()];
        }
        return arr;
    }

    //技能无效
    public isSkillOverTime(skillID){
        if(UM.tec.skill.indexOf(skillID) != -1)
            return false;
        if(!UM.tec.copy_skill[skillID])
            return true
        if(TM.now() > UM.tec.copy_skill[skillID])
            return true
        return false;
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
            if(msg.fail == 1)
            {
                Alert('命运石不足')
                return;
            }
            if(msg.fail == 2)
            {
                Alert('钻石不足')
                return;
            }
            var award = msg.award;
            for(var i=0;i<award.length;i++)
            {
                var oo = award[i];
                if(oo.type == 'skill')
                {
                    UM.tec.skill.push(oo.id);

                    self.skillTotal[oo.id] = (self.skillTotal[oo.id] || 0) + 1
                    if(self.skillViewListData[0])
                        self.skillViewListData[0].time = 0
                    if(self.skillViewListData[oo.id])
                        self.skillViewListData[oo.id].time = 0
                }
            }
            if(fun)
                fun(award);
        });
    }

    public skillDrawLog(fun?){
        var self = this;
        if(this.skillViewListData[0] && TM.now() - this.skillViewListData[0].time < 60*5)
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
            for(var i=0;i<msg.list.length;i++)
            {
                msg.list[i].time = parseInt(msg.list[i].time);
            }
            ArrayUtil.sortByField(msg.list,['time'],[1])
            console.log(msg.list)
            if(fun)
                fun();
        });
    }

    public skillSet(skillid,fun?){
        var self = this;
        var oo:any = {};
        if(skillid && this.isSkillOverTime(skillid))
        {
            Alert('技能分身已失效')
            return;
        }
        oo.skillid = skillid;
        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_skill_set,oo,function(data){
            var msg = data.msg;
            if(msg.fail)
            {
                Alert('设置技能失败')
                return;
            }
            UM.tec.use_skill = skillid;
            EM.dispatchEventWith(GameEvent.client.leader_skill_change)
            if(fun)
                fun();
        });
    }
    public skillCopy(logData,type,fun?){
        var self = this;
        var oo:any = {};
        oo.logid = logData.id;
        oo.type = type;
        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_skill_copy,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 2)
            {
                Alert('技能分身卷轴不足')
                return;
            }
            if(msg.fail == 1)
            {
                Alert('钻石不足')
                return;
            }
            if(msg.fail == 3)
            {
                Alert('找不到复制对象')
                return;
            }
            if(msg.fail == 4)
            {
                Alert('已被别人捷足先登了！')
                logData.copy_time = msg.copy_time;
                return;
            }
            UM.tec.copy_skill[logData.skillid] = msg.skillendtime;
            logData.copy_time  = msg.logendtime;
            EM.dispatchEventWith(GameEvent.client.leader_skill_copy)
            if(fun)
                fun();
        });
    }

    public skillCopyAward(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_skill_copy_award,oo,function(data){
            var msg = data.msg;
            if(msg.coin || msg.propnum)
            {
                var arr = []
                var oo:any = {};
                if(msg.coin)
                {
                    arr.push('卷轴分身：' + Math.round(msg.coin/100) + '次')
                    oo.coin = msg.coin;
                }
                if(msg.propnum)
                {
                    arr.push('钻石分身：' + msg.propnum + '次')
                    oo.prop = {};
                    oo.prop[42] = msg.propnum
                }
                oo.title = '获得分身收益'
                oo.des = arr.join('，')
                AwardUI.getInstance().show(oo);
            }
            else
            {
                Alert('暂无收益')
            }
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
            self.skillTotal = ObjectUtil.arrayToObj(msg.list,'id','num')
            self.skillTotal.time = TM.now();
            if(fun)
                fun();
        });
    }

    public skillViewList(skillid,fun?,cd=300){
        if(this.skillViewListData[skillid] && TM.now() - this.skillViewListData[skillid].time < cd)
        {
            if(fun)
                fun();
            return;
        }
        var self = this;
        var oo:any = {};
        oo.skillid = skillid;
        //Net.addUser(oo);
        Net.send(GameEvent.tec.leader_skill_view_list,oo,function(data){
            var msg = data.msg;
            self.skillViewListData[skillid] = {
                time:TM.now(),
                list:msg.list
            }
            for(var i=0;i<msg.list.length;i++)
            {
                msg.list[i].time = parseInt(msg.list[i].time);
            }
            ArrayUtil.sortByField(msg.list,['time'],[1])

            self.skillTotal[skillid] = msg.list.length;
            if(fun)
                fun();
        });
    }
}