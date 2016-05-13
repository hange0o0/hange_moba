class PKManager {
    private static _instance:PKManager;
    public static PKType = {
        MAIN:'main_game',
        SERVER:'server_game',
        SERVER_EQUAL:'server_game_equal',
        DAY:'day_game',
        REPLAY:'replay',
        FRIEND:'friend',  //包括ask 和 answer
        FRIEND_ASK:'friend_ask',
        FRIEND_ANSWER:'friend_answer'
    };

    public static getInstance():PKManager {
        if (!this._instance)
            this._instance = new PKManager();
        return this._instance;
    }

    public constructor() {
        //this.onPK('test',null);

    }

    public pkResult;
    public pkAward;
    public pkType;
    public pkData;
    public team1Base;
    public team2Base;
    public pkList = [];

    public team1Head
    public team1Nick
    public team1Ring

    public team2Head
    public team2Nick
    public team2Ring

    public teamChange = false//队伍ID发生过转换

    ////不同位置的加成值和比例
    //public indexAdd(index)
    //{
    //    index = index%4;
    //    if(index == 0)
    //        return {type:'hp',value:10};
    //    else if(index == 1)
    //        return {type:'atk',value:5};
    //    else if(index == 2)
    //        return {type:'speed',value:5};
    //    return null;
    //}


    public getPKBG(type){
        var sceneID = 1;
        switch(type)
        {
            case PKManager.PKType.MAIN:
                sceneID = 1;
                break;
            case PKManager.PKType.DAY:
                sceneID = 2;
                break;
            case PKManager.PKType.SERVER:
                sceneID = 3;
                break;
            case PKManager.PKType.SERVER_EQUAL:
                sceneID = 4;
                break;
            default:
                sceneID = 1 + Math.floor(Math.random()*4);
                break;
        }

        return 'pk_bg'+sceneID+'_jpg';
    }

    //PK通用报错处理
    public pkError(oo){
        if(oo.fail == 101)//没这个令牌
        {
            Alert('选中的技能非法.');
            return true;
        }
        if(oo.fail == 102)//数量过了3个
        {
            Alert('选择的单位非法(同种数量>3)');
            return true;
        }
        if(oo.fail == 103)//超过可出战的碎片宠物
        {
            Alert('选择的单位非法(等级不对)');
            return true;
        }
        if(oo.fail == 104)//钱不对
        {
            Alert('4选择的单位非法（钱不对）');
            return true;
        }
        if(oo.fail == 105)//木头不对
        {
            Alert('5选择的单位非法（木不对）');
            return true;
        }
        if(oo.fail == 106)//没这个宠物
        {
            Alert('6选择的单位非法（没这个宠物）');
            return true;
        }
        if(oo.fail == 110)
        {
            Alert('没找到卡组数据');
            return true;
        }
        if(oo.fail == 111)
        {
            Alert('没有选择任何卡牌');
            return true;
        }
        return false;
    }

    //PK的统一入口
    public startPK(type,choose,fun?){
        switch(type)
        {
            case PKManager.PKType.MAIN:
                MainGameManager.getInstance().pk(choose,fun);
                break
            case PKManager.PKType.SERVER:
                ServerGameManager.getInstance().pk(choose,fun);
                break
            case PKManager.PKType.SERVER_EQUAL:
                ServerGameEqualManager.getInstance().pk(choose,fun);
                break
            case PKManager.PKType.DAY:
                DayGameManager.getInstance().pk(choose,fun);
                break
            case PKManager.PKType.FRIEND_ASK:
                FriendPKManager.getInstance().ask(choose,fun);
                break
            case PKManager.PKType.FRIEND_ANSWER:
                FriendPKManager.getInstance().answer(choose,fun);
                break
        }

        //{"head":"friend_log","msg":{"list":[{"id":"20","from_gameid":"1_10011","to_gameid":"1_10015","type":"2","content":{"talk":null,"from_list":[{"list":[302,104,206,508],"ring":[5,19]},{"list":[208,308,305,103],"ring":[4,18]}],"ask_choose":{"list":[302],"ring":{"id":5,"level":0},"fight":-8,"force":9,"stec":{},"tec":{"302":{"hp":11,"atk":11,"spd":0}}},"isequal":null,"fromnick":"n572397","tonick":"n682787"},"time":"1461294012"}]},"runtime":0.000785827636719,"debug":[],"server_time":1461294012}   1461294012

    }

    //PK回放的统一入口
    public playBack(type){
        switch(type)
        {
            case PKManager.PKType.MAIN:
                MainGameManager.getInstance().playBack();
                break;
            case PKManager.PKType.SERVER:
                ServerGameManager.getInstance().playBack()
                break;
            case PKManager.PKType.SERVER_EQUAL:
                ServerGameEqualManager.getInstance().playBack()
                break;
            case PKManager.PKType.DAY:
                DayGameManager.getInstance().playBack()
                break;
        }
    }

    //取PK回放
    public getReplayByType(type,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;
        Net.addUser(oo);
        Net.send(GameEvent.pkCore.pk_result_type,oo,function(data){
            var msg = data.msg;
            msg.info.type = type;
            self.onPK(PKManager.PKType.REPLAY,msg);
            if(fun)
                fun(msg);
        });
    }

    //设双方的用户信息(用于展示)
    public setUserInfo(data){
        var info = data.info;
        var type = info.type;
        this.teamChange = false;
        var self = this;
        this.team1Head = UM.head
        this.team1Nick = UM.nick
        if(type == PKManager.PKType.FRIEND)
        {
            if(info.fromgameid == UM.gameid)//我是被打
            {
                this.teamChange = true;
                this.team2Head = info.tohead
                this.team2Nick = info.tonick
            }
            else
            {
                this.team2Head = info.fromhead
                this.team2Nick = info.fromnick
            }
        }
        else if(type == PKManager.PKType.MAIN)
        {
            this.team2Head = MainGameManager.getInstance().getHeadByLevel(info.level);
            this.team2Nick = MainGameManager.getInstance().getNickByLevel(info.level);
        }
        else if(type == PKManager.PKType.SERVER || type == PKManager.PKType.SERVER_EQUAL)
        {
            this.team2Head = info.head || '???';
            this.team2Nick = info.nick || '???';
        }
        else if(type == PKManager.PKType.DAY)
        {
            this.team2Head = DayGameManager.getInstance().getHeadByLevel(info.level);
            this.team2Nick = DayGameManager.getInstance().getNickByLevel(info.level);
        }
        else
        {
            this.team1Head = 1;
            this.team1Nick = 'team1Head';
            this.team2Head = 2;
            this.team2Nick = 'team2Head';
        }

    }

    public onPK(type,data){
        var self = this;
        data = data || {"pkdata":[{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":1},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":1},"player1":[{"hp":100,"id":10,"mid":101},{"hp":100,"id":11,"mid":102},{"hp":100,"id":12,"mid":103}],"player2":[{"hp":100,"id":30,"mid":101},{"hp":100,"id":31,"mid":102},{"hp":100,"id":32,"mid":103}],"result":{"w":1,"hp":5}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":1},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":2},"player1":[{"hp":5,"id":10,"mid":101},{"hp":100,"id":11,"mid":102},{"hp":100,"id":12,"mid":103}],"player2":[{"hp":100,"id":31,"mid":102},{"hp":100,"id":32,"mid":103},{"hp":100,"id":33,"mid":104}],"result":{"w":2,"hp":91}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":3},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":2},"player1":[{"hp":100,"id":11,"mid":102},{"hp":100,"id":12,"mid":103},{"hp":100,"id":13,"mid":104}],"player2":[{"hp":91,"id":31,"mid":102},{"hp":100,"id":32,"mid":103},{"hp":100,"id":33,"mid":104}],"result":{"w":1,"hp":21}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":3},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":4},"player1":[{"hp":21,"id":11,"mid":102},{"hp":100,"id":12,"mid":103},{"hp":100,"id":13,"mid":104}],"player2":[{"hp":100,"id":32,"mid":103},{"hp":100,"id":33,"mid":104},{"hp":100,"id":34,"mid":105}],"result":{"w":2,"hp":74}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":5},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":4},"player1":[{"hp":100,"id":12,"mid":103},{"hp":100,"id":13,"mid":104},{"hp":100,"id":14,"mid":105}],"player2":[{"hp":74,"id":32,"mid":103},{"hp":100,"id":33,"mid":104},{"hp":100,"id":34,"mid":105}],"result":{"w":1,"hp":60}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":5},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":6},"player1":[{"hp":60,"id":12,"mid":103},{"hp":100,"id":13,"mid":104},{"hp":100,"id":14,"mid":105}],"player2":[{"hp":100,"id":33,"mid":104},{"hp":100,"id":34,"mid":105},{"hp":100,"id":35,"mid":106}],"result":{"w":2,"hp":39}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":7},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":6},"player1":[{"hp":100,"id":13,"mid":104},{"hp":100,"id":14,"mid":105},{"hp":100,"id":15,"mid":106}],"player2":[{"hp":39,"id":33,"mid":104},{"hp":100,"id":34,"mid":105},{"hp":100,"id":35,"mid":106}],"result":{"w":1,"hp":54}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":7},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":8},"player1":[{"hp":54,"id":13,"mid":104},{"hp":100,"id":14,"mid":105},{"hp":100,"id":15,"mid":106}],"player2":[{"hp":100,"id":34,"mid":105},{"hp":100,"id":35,"mid":106},{"hp":100,"id":36,"mid":107}],"result":{"w":2,"hp":61}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":9},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":8},"player1":[{"hp":100,"id":14,"mid":105},{"hp":100,"id":15,"mid":106},{"hp":100,"id":16,"mid":107}],"player2":[{"hp":61,"id":34,"mid":105},{"hp":100,"id":35,"mid":106},{"hp":100,"id":36,"mid":107}],"result":{"w":1,"hp":42}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":9},"team2":{"ac":["sm_101_f1","sm_106_f1","sm_105_d1"],"jr":10},"player1":[{"hp":42,"id":14,"mid":105},{"hp":100,"id":15,"mid":106},{"hp":100,"id":16,"mid":107}],"player2":[{"hp":100,"id":35,"mid":106},{"hp":100,"id":36,"mid":107},{"hp":100,"id":37,"mid":108}],"result":{"w":2,"hp":100}},{"team1":{"ac":["sm_101_f1","sm_106_f1","sm_105_d1"],"jr":11},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":10},"player1":[{"hp":100,"id":15,"mid":106},{"hp":100,"id":16,"mid":107},{"hp":100,"id":17,"mid":108}],"player2":[{"hp":100,"id":35,"mid":106,"add_speed":15},{"hp":100,"id":36,"mid":107},{"hp":100,"id":37,"mid":108}],"result":{"w":1,"hp":8}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":11},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":12},"player1":[{"hp":8,"id":15,"mid":106,"add_speed":15},{"hp":100,"id":16,"mid":107},{"hp":100,"id":17,"mid":108}],"player2":[{"hp":100,"id":36,"mid":107},{"hp":100,"id":37,"mid":108},{"hp":100,"id":38,"mid":101}],"result":{"w":2,"hp":25}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":13},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":12},"player1":[{"hp":100,"id":16,"mid":107},{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101}],"player2":[{"hp":25,"id":36,"mid":107},{"hp":100,"id":37,"mid":108},{"hp":100,"id":38,"mid":101}],"result":{"w":1,"hp":89}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":13},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":14},"player1":[{"hp":89,"id":16,"mid":107},{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101}],"player2":[{"hp":100,"id":37,"mid":108},{"hp":100,"id":38,"mid":101},{"hp":100,"id":39,"mid":101}],"result":{"w":1,"hp":35}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":13},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":15},"player1":[{"hp":35,"id":16,"mid":107},{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101}],"player2":[{"hp":100,"id":38,"mid":101},{"hp":100,"id":39,"mid":101}],"result":{"w":2,"hp":69}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":16},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":15},"player1":[{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101},{"hp":100,"id":19,"mid":101}],"player2":[{"hp":69,"id":38,"mid":101},{"hp":100,"id":39,"mid":101}],"result":{"w":1,"hp":35}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":16},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":17},"player1":[{"hp":35,"id":17,"mid":108},{"hp":100,"id":18,"mid":101},{"hp":100,"id":19,"mid":101}],"player2":[{"hp":100,"id":39,"mid":101}],"result":{"w":2,"hp":56}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":18},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":17},"player1":[{"hp":100,"id":18,"mid":101},{"hp":100,"id":19,"mid":101}],"player2":[{"hp":56,"id":39,"mid":101}],"result":{"w":1,"hp":63}}],"result":1,"team1base":{"rl":0,"r":1,"tl":null,"list":[101,102,103,104,105,106,107,108,101,101],"mb":{"101":{"hp":100,"atk":10,"speed":50},"102":{"hp":100,"atk":10,"speed":50},"103":{"hp":100,"atk":10,"speed":50},"104":{"hp":100,"atk":10,"speed":50},"105":{"hp":100,"atk":10,"speed":50},"106":{"hp":100,"atk":10,"speed":50},"107":{"hp":100,"atk":10,"speed":50},"108":{"hp":100,"atk":10,"speed":50}}},"team2base":{"rl":0,"r":1,"tl":null,"list":[101,102,103,104,105,106,107,108,101,101],"mb":{"101":{"hp":100,"atk":10,"speed":50},"102":{"hp":100,"atk":10,"speed":50},"103":{"hp":100,"atk":10,"speed":50},"104":{"hp":100,"atk":10,"speed":50},"105":{"hp":100,"atk":10,"speed":50},"106":{"hp":100,"atk":10,"speed":50},"107":{"hp":100,"atk":10,"speed":50},"108":{"hp":100,"atk":10,"speed":50}}}}

        this.setUserInfo(data);
        this.pkType = type
        this.pkResult = data
        this.pkData = data.pkdata;
        this.team1Base = data.team1base;
        this.team2Base = data.team2base;

        if(this.teamChange)
        {
            this.team1Ring = this.team2Base.r;
            this.team2Ring = this.team1Base.r;
        }
        else
        {
            this.team1Ring = this.team1Base.r;
            this.team2Ring = this.team2Base.r;
        }

        this.pkAward = {
            levelUp:false,
            newTask:false,
            finishTask:false,
            forceUp:false,
            prop:[]
        }
        var award = data.award || {};
        if(award.coin)
            this.pkAward.prop.push({type:'coin',des:'×' + award.coin})
        if(award.exp)
            this.pkAward.prop.push({type:'exp',des:'×' + award.exp})
        for(var s in award.prop)
        {
            this.pkAward.prop.push({type:'prop',des:'×' + award.prop[s],id:s})
        }

        if(data.sync_level)
            this.pkAward.levelUp = true;
        if(data.sync_tec_force || data.sync_award_force)
            this.pkAward.forceUp = true;
        if(data.finish_task)
            this.pkAward.finishTask = true;
        if(data.new_task)
            this.pkAward.newTask = true;

        VideoManager.getInstance().cleanVideo(type);

        //表现动画，结果的数据
        var winCount = {};
        this.pkList.length = 0;
        for(var i=0;i<data.pkdata.length;i++)
        {
            var oo:any = {};
            if(self.teamChange)
            {
                oo.player1 = getPlayer(2,i,1);
                oo.player2 = getPlayer(1,i,2);
            }
            else
            {
                oo.player1 = getPlayer(1,i,1);
                oo.player2 = getPlayer(2,i,2);
            }
            oo.index = i+1;
            this.pkList.push(oo);
        }

        function getPlayer(team,index,displayTeam){
            var p = data.pkdata[index]['player' + team][0];
            var base = data['team'+team+'base'].mb[p.mid];
            var nextP;
            if(data.pkdata[i+1])
                nextP = data.pkdata[index]['player' + team][0];
            var result = data.pkdata[index].result;
            var oo:any = {};
            oo.team = displayTeam;
            if(self.teamChange)
                oo.team = team == 1?2:1;

            oo.index = p.id%10;
            oo.mid = p.mid;
            oo.beforeMax = base.hp + (p.add_hp || 0);
            oo.before = p.hp;
            if(result.w == team)
            {
                oo.after = result.hp;
                winCount[p.id] = (winCount[p.id] || 0) + 1
                oo.isWin = true;
            }
            else
                oo.after = 0;
            oo.afterMax = oo.beforeMax;
            if(nextP && nextP.id == p.id)
            {
                oo.afterMax = base.hp + (nextP.add_hp || 0);
            }
            oo.winCount = winCount[p.id] || 0;
            return oo;
        }
    }

    public getVedioBase(index){
        var oo = this.pkData[index];
        if(!oo)
            return null;
        if(oo.team1base)
        {
            return oo;
        }
        oo.index = index;//从0开始
        oo.team1base = dealData(this.team1Base,oo.player1);
        oo.team2base = dealData(this.team2Base,oo.player2);
        return oo;


        function dealData(data,base)
        {
            var o = {};
            for(var s in data)
            {
                if(s == 'list')
                    continue;
                if(s == 'mb')
                {
                    o['mb'] = {};
                    for(var i=0;i<base.length;i++)
                    {
                        o['mb'][base[i].mid] = data['mb'][base[i].mid];
                    }
                    continue;
                }
                o[s] = data[s];
            }
            return o;
        }
    }
}