class PKManager {
    private static _instance:PKManager;
    public static PKType = {
        MAIN:'main_game',
        MAP:'map_game',
        SERVER:'server_game',
        SERVER_EQUAL:'server_game_equal',
        DAY:'day_game',
        REPLAY:'replay',
        FRIEND:'friend',  //包括ask 和 answer
        FRIEND_ASK:'friend_ask',
        FRIEND_ANSWER:'friend_answer'
    };
    public static PKCost = 88;
    public static ApMax = 20;

    public static getInstance():PKManager {
        if (!this._instance)
            this._instance = new PKManager();
        return this._instance;
    }

    public constructor() {
        //this.onPK('test',null);
        this.pkJump = SharedObjectManager.instance.getValue('pkJump') || false

    }

    public pkWord = {
        win:['win'],
        win3:['win3'],
        loss:['loss'],
        pking:['pking'],
        win_view:['win_view'],
        loss_view:['loss_view'],
        view:['view1','view2']
    }
    public pkEmo = {
        win:[4,7,9,12,14],
        win3:[4,12,14],
        loss:[1,2,5,6,15,16,19,20],
        pking:[4,17,7],
        win_view:[8,9,10,4,14],
        loss_view:[3,5,11,19,18,16],
        view:[1,3,7,13,17,18,19]
    }

    public pkResult;
    public pkAward;
    public pkType;
    //public videoType;
    public pkData;
    public team1Base;
    public team2Base;
    public pkList = [];
    public mainVideoList = [];

    public team1Head
    public team1Nick
    public team1Ring

    public team2Head
    public team2Nick
    public team2Ring

    public winCount//胜利的次数
    public action//是否有出战
    public die//是否失败
    public winnerRate//胜利者剩余血量百分比
    public isWin//胜利

    public teamChange = false//队伍ID发生过转换

    public pkJump;
    public pkLog = {};

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

    public reChooseMyCard(){
        var self = this;
        var cost = UM.getMyCard().num;
        Confirm('当前卡组剩余使用次数：'+cost+'\n确定消耗 '+MyTool.createHtml(cost,0xE0A44A)+' 钻石选择新的卡组吗？',function(v){
            if(v == 1)
            {
                if(!UM.testDiamond(cost))
                {
                    return;
                }
                self.getMyCard()
            }
        })
    }

    //num :第1个时，num = 0;
    public getCostByNum(id,num){
        var vo = MonsterVO.getObject(id);
        var lastCost = vo.cost;
        //var count = lastCost;
        for(var i=0;i<num;i++)
        {
            lastCost = Math.ceil(lastCost*1.1);
            //count += lastCost;
        }
        return lastCost;
    }

    //取列表的花费
    public getCost(arr){
        var numObj = {};
        var count = 0;
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i];
            var num = numObj[id] || 0
            count += this.getCostByNum(id,num);
            numObj[id] = num + 1;
        }
        return count;
    }

    //构成怪物的战斗数据
    public createMonsterFight(mid,fight,lv?){
        var mvo = MonsterVO.getObject(mid)
         var oo = {atk:mvo.atk,hp:mvo.hp,speed:mvo.speed,lv:lv}
        oo.atk = Math.round(oo.atk * (1+fight/100));
        oo.hp = Math.round(oo.hp * (1+fight/100));
        return oo;
    }

    //取一个随机布局
    public getRandomCard(list,isEqual){
        list = list.concat();
        var index = 0;
        var history = {};
        var total = 88;

        if(!isEqual) //低于(平均等级-1)的只留一个(太差的才处理)
        {
            var level = 0;
            var levelObj = {};
            for(var i=0;i<list.length;i++)
            {
                var id = list[i];
                levelObj[id] = UM.getMonsterLevel(id);
                level += levelObj[id];
            }
            level = Math.floor(level/list.length) - 1;
            for(var s in levelObj)
            {
                if(levelObj[s] >= level)
                    list.push(parseInt(s));
            }
        }
        else
            list = list.concat(list);
        while(true)
        {
            var returnArr = [];
            var newList = list.concat();
            for(var i=0;i<30;i++)
            {
                if(newList.length == 0)
                    break;
                var id = ArrayUtil.randomOne(newList,true);
                returnArr.push(id);
                if(this.getCost(returnArr) > 88)
                {
                    returnArr.pop();
                }
                if(returnArr.length >= 6)
                    break;
            }
            var cost = this.getCost(returnArr);
            if(!history[cost])
                history[cost] = [];
            history[cost].push(returnArr);

            index ++;
            if(index >= 5)
            {
                index = 0;
                var arr = [];
                for(var i=88;i>=total;i--)
                {
                    var temp = history[i];
                    if(temp)
                        arr = arr.concat(temp);
                }
                if(arr.length > 0)
                {
                    break
                }
                total --
            }
        }
        returnArr = ArrayUtil.randomOne(arr);
        ArrayUtil.random(returnArr);
        return returnArr;
    }


    public getPKBG(type,rd){
        var sceneID = 1;
        var size = 3;
        if(type == PKManager.PKType.REPLAY)
            type = this.pkResult.info.type;
        switch(type)
        {
            case PKManager.PKType.MAIN:
                sceneID = (1 + Math.floor(rd*size)) + size * 0;
                break;
            case PKManager.PKType.DAY:
                sceneID = (1 + Math.floor(rd*size)) + size * 4;
                break;
            case PKManager.PKType.SERVER:
                sceneID = (1 + Math.floor(rd*size)) + size * 2;
                break;
            case PKManager.PKType.SERVER_EQUAL:
                sceneID = (1 + Math.floor(rd*size)) + size * 3;
                break;
            case PKManager.PKType.FRIEND:
                sceneID = (1 + Math.floor(rd*size)) + size * 1;
                break;
            default:
                sceneID = 1 + Math.floor(rd*15);
                break;
        }

        return 'pk_bg'+sceneID+'_jpg';
    }

    public getLoadingBG(type){
        var sceneID = 1;
        if(type == PKManager.PKType.REPLAY)
            type = this.pkResult.info.type;
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

        return 'main'+sceneID+'_png';
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
            Alert('5选择的单位非法');
            return true;
        }
        if(oo.fail == 106)//没这个宠物
        {
            Alert('6选择的单位非法');
            return true;
        }
        if(oo.fail == 110)
        {
            Alert('没找到卡组数据',LoginManager.getInstance().relogin);
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
    public startPK(type,choose,myFun?){
        var fun = function(){
            EM.dispatch(GameEvent.client.pk_start)
             if(myFun)
                 myFun();
        }
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
            case PKManager.PKType.MAP:
                MapManager.getInstance().pk(choose,fun);
                break
        }



        //{"head":"friend_log","msg":{"list":[{"id":"20","from_gameid":"1_10011","to_gameid":"1_10015","type":"2","content":{"talk":null,"from_list":[{"list":[302,104,206,508],"ring":[5,19]},{"list":[208,308,305,103],"ring":[4,18]}],"ask_choose":{"list":[302],"ring":{"id":5,"level":0},"fight":-8,"force":9,"stec":{},"tec":{"302":{"hp":11,"atk":11,"spd":0}}},"isequal":null,"fromnick":"n572397","tonick":"n682787"},"time":"1461294012"}]},"runtime":0.000785827636719,"debug":[],"server_time":1461294012}   1461294012

    }

    //PK回放的统一入口
    public playBack(type,fun?){
        switch(type)
        {
            case PKManager.PKType.MAIN:
                MainGameManager.getInstance().playBack(fun);
                break;
            case PKManager.PKType.SERVER:
                ServerGameManager.getInstance().playBack(fun)
                break;
            case PKManager.PKType.SERVER_EQUAL:
                ServerGameEqualManager.getInstance().playBack(fun)
                break;
            case PKManager.PKType.DAY:
                DayGameManager.getInstance().playBack(fun)
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
            if(msg.fail == 2)
            {
                Config.pk_version = Math.floor(msg.pk_version);
                Alert('录像已过期');
                return;
            }
            msg.info.type = type;
            self.onPK(PKManager.PKType.REPLAY,msg);
            if(fun)
                fun(msg);
        });
    }

    public getReplayByData(type,oo,fun?){
        var key = md5.incode(JSON.stringify(oo));
        if(this.pkLog[key])
        {
            this.onPK(PKManager.PKType.REPLAY,this.pkLog[key]);
            PKMainUI.getInstance().show();
            if(fun)
                fun();
            return
        }
        if(Math.floor(oo.pk_version) < Config.pk_version){
            Alert('录像已过期');
            return;
        }
        var self = this;
        Net.send(GameEvent.pkCore.pk_result,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 2)
            {
                Config.pk_version = Math.floor(msg.pk_version);
                Alert('录像已过期');
                return;
            }
            if(!msg.info)
                msg.info = {};
            msg.info.type = type;
            self.onPK(PKManager.PKType.REPLAY,msg);
            PKMainUI.getInstance().show();
            self.pkLog[key] = msg;
            if(fun)
                fun();
        });
    }

    public getMyCard(fun?){
        var self = this;
        var oo:any = {};
        oo.force = true;
        Net.addUser(oo);
        Net.send(GameEvent.pkCore.get_my_card,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 201)
            {
                Alert('钻石不足');
                return;
            }
            if(fun)
                fun();
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
            this.team2Head = info.head || 0;
            this.team2Nick = info.nick || 0;
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
        //data = data || {"pkdata":[{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":1},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":1},"player1":[{"hp":100,"id":10,"mid":101},{"hp":100,"id":11,"mid":102},{"hp":100,"id":12,"mid":103}],"player2":[{"hp":100,"id":30,"mid":101},{"hp":100,"id":31,"mid":102},{"hp":100,"id":32,"mid":103}],"result":{"w":1,"hp":5}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":1},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":2},"player1":[{"hp":5,"id":10,"mid":101},{"hp":100,"id":11,"mid":102},{"hp":100,"id":12,"mid":103}],"player2":[{"hp":100,"id":31,"mid":102},{"hp":100,"id":32,"mid":103},{"hp":100,"id":33,"mid":104}],"result":{"w":2,"hp":91}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":3},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":2},"player1":[{"hp":100,"id":11,"mid":102},{"hp":100,"id":12,"mid":103},{"hp":100,"id":13,"mid":104}],"player2":[{"hp":91,"id":31,"mid":102},{"hp":100,"id":32,"mid":103},{"hp":100,"id":33,"mid":104}],"result":{"w":1,"hp":21}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":3},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":4},"player1":[{"hp":21,"id":11,"mid":102},{"hp":100,"id":12,"mid":103},{"hp":100,"id":13,"mid":104}],"player2":[{"hp":100,"id":32,"mid":103},{"hp":100,"id":33,"mid":104},{"hp":100,"id":34,"mid":105}],"result":{"w":2,"hp":74}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":5},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":4},"player1":[{"hp":100,"id":12,"mid":103},{"hp":100,"id":13,"mid":104},{"hp":100,"id":14,"mid":105}],"player2":[{"hp":74,"id":32,"mid":103},{"hp":100,"id":33,"mid":104},{"hp":100,"id":34,"mid":105}],"result":{"w":1,"hp":60}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":5},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":6},"player1":[{"hp":60,"id":12,"mid":103},{"hp":100,"id":13,"mid":104},{"hp":100,"id":14,"mid":105}],"player2":[{"hp":100,"id":33,"mid":104},{"hp":100,"id":34,"mid":105},{"hp":100,"id":35,"mid":106}],"result":{"w":2,"hp":39}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":7},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":6},"player1":[{"hp":100,"id":13,"mid":104},{"hp":100,"id":14,"mid":105},{"hp":100,"id":15,"mid":106}],"player2":[{"hp":39,"id":33,"mid":104},{"hp":100,"id":34,"mid":105},{"hp":100,"id":35,"mid":106}],"result":{"w":1,"hp":54}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":7},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":8},"player1":[{"hp":54,"id":13,"mid":104},{"hp":100,"id":14,"mid":105},{"hp":100,"id":15,"mid":106}],"player2":[{"hp":100,"id":34,"mid":105},{"hp":100,"id":35,"mid":106},{"hp":100,"id":36,"mid":107}],"result":{"w":2,"hp":61}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":9},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":8},"player1":[{"hp":100,"id":14,"mid":105},{"hp":100,"id":15,"mid":106},{"hp":100,"id":16,"mid":107}],"player2":[{"hp":61,"id":34,"mid":105},{"hp":100,"id":35,"mid":106},{"hp":100,"id":36,"mid":107}],"result":{"w":1,"hp":42}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":9},"team2":{"ac":["sm_101_f1","sm_106_f1","sm_105_d1"],"jr":10},"player1":[{"hp":42,"id":14,"mid":105},{"hp":100,"id":15,"mid":106},{"hp":100,"id":16,"mid":107}],"player2":[{"hp":100,"id":35,"mid":106},{"hp":100,"id":36,"mid":107},{"hp":100,"id":37,"mid":108}],"result":{"w":2,"hp":100}},{"team1":{"ac":["sm_101_f1","sm_106_f1","sm_105_d1"],"jr":11},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":10},"player1":[{"hp":100,"id":15,"mid":106},{"hp":100,"id":16,"mid":107},{"hp":100,"id":17,"mid":108}],"player2":[{"hp":100,"id":35,"mid":106,"add_speed":15},{"hp":100,"id":36,"mid":107},{"hp":100,"id":37,"mid":108}],"result":{"w":1,"hp":8}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":11},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":12},"player1":[{"hp":8,"id":15,"mid":106,"add_speed":15},{"hp":100,"id":16,"mid":107},{"hp":100,"id":17,"mid":108}],"player2":[{"hp":100,"id":36,"mid":107},{"hp":100,"id":37,"mid":108},{"hp":100,"id":38,"mid":101}],"result":{"w":2,"hp":25}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":13},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":12},"player1":[{"hp":100,"id":16,"mid":107},{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101}],"player2":[{"hp":25,"id":36,"mid":107},{"hp":100,"id":37,"mid":108},{"hp":100,"id":38,"mid":101}],"result":{"w":1,"hp":89}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":13},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":14},"player1":[{"hp":89,"id":16,"mid":107},{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101}],"player2":[{"hp":100,"id":37,"mid":108},{"hp":100,"id":38,"mid":101},{"hp":100,"id":39,"mid":101}],"result":{"w":1,"hp":35}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":13},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":15},"player1":[{"hp":35,"id":16,"mid":107},{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101}],"player2":[{"hp":100,"id":38,"mid":101},{"hp":100,"id":39,"mid":101}],"result":{"w":2,"hp":69}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":16},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":15},"player1":[{"hp":100,"id":17,"mid":108},{"hp":100,"id":18,"mid":101},{"hp":100,"id":19,"mid":101}],"player2":[{"hp":69,"id":38,"mid":101},{"hp":100,"id":39,"mid":101}],"result":{"w":1,"hp":35}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":16},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":17},"player1":[{"hp":35,"id":17,"mid":108},{"hp":100,"id":18,"mid":101},{"hp":100,"id":19,"mid":101}],"player2":[{"hp":100,"id":39,"mid":101}],"result":{"w":2,"hp":56}},{"team1":{"ac":["sm_101_f1","sm_106_f1"],"jr":18},"team2":{"ac":["sm_101_f1","sm_106_f1"],"jr":17},"player1":[{"hp":100,"id":18,"mid":101},{"hp":100,"id":19,"mid":101}],"player2":[{"hp":56,"id":39,"mid":101}],"result":{"w":1,"hp":63}}],"result":1,"team1base":{"rl":0,"r":1,"tl":null,"list":[101,102,103,104,105,106,107,108,101,101],"mb":{"101":{"hp":100,"atk":10,"speed":50},"102":{"hp":100,"atk":10,"speed":50},"103":{"hp":100,"atk":10,"speed":50},"104":{"hp":100,"atk":10,"speed":50},"105":{"hp":100,"atk":10,"speed":50},"106":{"hp":100,"atk":10,"speed":50},"107":{"hp":100,"atk":10,"speed":50},"108":{"hp":100,"atk":10,"speed":50}}},"team2base":{"rl":0,"r":1,"tl":null,"list":[101,102,103,104,105,106,107,108,101,101],"mb":{"101":{"hp":100,"atk":10,"speed":50},"102":{"hp":100,"atk":10,"speed":50},"103":{"hp":100,"atk":10,"speed":50},"104":{"hp":100,"atk":10,"speed":50},"105":{"hp":100,"atk":10,"speed":50},"106":{"hp":100,"atk":10,"speed":50},"107":{"hp":100,"atk":10,"speed":50},"108":{"hp":100,"atk":10,"speed":50}}}}

        if(!data.info)
            data.info = {type:type};
        this.setUserInfo(data);
        this.pkType = type
        this.pkResult = data
        this.pkData = data.pkdata;
        this.team1Base = data.team1base;
        this.team2Base = data.team2base;
        if(data.pk_version)
            Config.pk_version = data.pk_version;

        //if(this.teamChange)
        //{
        //    this.team1Ring = this.team2Base.r;
        //    this.team2Ring = this.team1Base.r;
        //}
        //else
        //{
        //    this.team1Ring = this.team1Base.r;
        //    this.team2Ring = this.team2Base.r;
        //}

        this.pkAward = {
            levelUp:false,
            gLevelUp:0,
            newTask:false,
            finishTask:false,
            forceUp:false,
            getNewCard:false,
            passMap:false,
            prop:[]
        }

        if(!data.dealAward)
        {
            var award = data.award || {};
            if(award.coin)
                this.pkAward.prop.push({type:'coin',des:'×' + award.coin})
            if(award.exp)
                this.pkAward.prop.push({type:'exp',des:'×' + award.exp})
            if(award.collect)
                this.pkAward.prop.push({type:'card',des:'×' + award.collect})
            if(award.g_exp)
            {
                if(award.g_exp > 0)
                    this.pkAward.prop.push({type:'g_exp',des:'×' + award.g_exp})
                else
                    this.pkAward.prop.push({type:'g_exp',des: award.g_exp,color:'red'})
            }



            for(var s in award.prop)
            {
                this.pkAward.prop.push({type:'prop',des:'×' + award.prop[s],id:s})
            }

            if(data.sync_level)
            {
                this.pkAward.levelUp = true;
                var temp = MonsterVO.getListByLevel(UM.level,true);
                for(var i=0;i<temp.length;i++)
                {
                    this.pkAward.prop.push({type:'monster',id:temp[i].id})
                }
            }

            if(data.sync_tec_force || data.sync_award_force)
                this.pkAward.forceUp = true;
            if(data.finish_task)
                this.pkAward.finishTask = true;
            if(data.new_task)
                this.pkAward.newTask = true;
            if(data.g_level_up)
                this.pkAward.gLevelUp = data.g_level_up;
            if(data.day_award)
                this.pkAward.dayAward = true;
            if(data.get_new_card)
                this.pkAward.getNewCard = true;
            if(data.passMap)
                this.pkAward.passMap = true;
        }


        data.dealAward = true;

        VideoManager.getInstance().cleanVideo(type);

        //表现动画，结果的数据
        var winCount = this.winCount = {};
        var action = this.action = {};
        var die = this.die = {};
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
        //算胜者剩下血量
        var teamBase = data.team1base;
        var begin = 10;
        if(data.result != 1)
        {
            teamBase = data.team2base;
            begin = 30;
        }
        var total = 0;
        var current = 0;
        for(var i=0;i<teamBase.list.length;i++)
        {
            var mid = teamBase.list[i];
            var id = begin  + i
            total += teamBase.mb[mid].hp;
            if(this.action[id])
            {
                if(this.die[id] || this.winCount[id] == 3)
                    continue;
                current += data.pkdata[data.pkdata.length - 1].result.hp;
            }
            else
                current += teamBase.mb[mid].hp;
        }
        this.winnerRate = current/total;
        this.isWin = (this.pkResult.result && !this.teamChange) || (!this.pkResult.result && this.teamChange)

        //表现
        this.mainVideoList.length = 0;
        for(var i=0;i<this.pkList.length;i++)
        {
            var player1 = this.pkList[i].player1
            var player2 = this.pkList[i].player2
            var currentVideo:any = [];
            var listObj = {list:currentVideo,quick:false,next:false,p1:player1.index,p2:player2.index}
            this.mainVideoList.push(listObj);
            if(player1.speed == player2.speed)
            {
                var vo1 = MonsterVO.getObject(player1.mid);
                var vo2 = MonsterVO.getObject(player2.mid);
                var arr = [player1,player2]
                ArrayUtil.sortByField(arr,['index','mid','id'],[1,0,0]);
                currentVideo.push({type:'atk',value:arr[0].team})
            }
            else
            {
                var movePlayer = player1.speed > player2.speed ? player1:player2
                currentVideo.push({type:'atk',value:movePlayer.team});
            }
            //
            currentVideo.push({type:'hp',value:{
                player1:{rate1:player1.before/player1.beforeMax,rate2:player1.after/player1.afterMax,hp:player1.after-player1.before},
                player2:{rate1:player2.before/player2.beforeMax,rate2:player2.after/player2.afterMax,hp:player2.after-player2.before},
            }});

            if(!player1.isWin && !player2.isWin)
            {
                currentVideo.push({type:'die',value:1,star:player1.winCount});
                currentVideo.push({type:'die',value:2,star:player2.winCount});
            }
            else if(player1.isWin)
            {
                currentVideo.push({type:'lastAtk',value:1})
                currentVideo.push({type:'die',value:2,star:player2.winCount});
            }
            else
            {
                currentVideo.push({type:'lastAtk',value:2})
                currentVideo.push({type:'die',value:1,star:player1.winCount});
            }


            if(player1.winCount == 3)
                currentVideo.push({type:'win3',value:1});
            if(player2.winCount == 3)
                currentVideo.push({type:'win3',value:2});

            if(this.pkList[i+1])
            {
                listObj.next = true;
            }

        }

        function getPlayer(team,index,displayTeam){
            var p = data.pkdata[index]['player' + team][0];
            var base = data['team'+team+'base'].mb[p.mid];
            var nextP;
            if(data.pkdata[index+1])
                nextP = data.pkdata[index + 1]['player' + team][0];
            var result = data.pkdata[index].result;
            var oo:any = {};
            oo.team = displayTeam;
            if(self.teamChange)
                oo.team = team == 1?2:1;

            oo.id = p.id
            oo.speed = base.speed;
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
            {
                oo.after = 0;
                die[p.id] = true;
            }

            oo.afterMax = oo.beforeMax;
            if(nextP && nextP.id == p.id)
            {
                oo.afterMax = base.hp + (nextP.add_hp || 0);
            }
            oo.winCount = winCount[p.id] || 0;

            action[p.id] = true;
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
    
    public sortMonster(arrIn){
        for(var i=0;i<arrIn.length;i++)
        {
            arrIn[i] = (MonsterVO.getObject(arrIn[i]))
        }
        ArrayUtil.sortByField(arrIn,['cost','id'],[0,0]);
        for(var i=0;i<arrIn.length;i++)
        {
            arrIn[i] = (arrIn[i].id);
        }
        return arrIn;
    }

    //返回日志相关格式
    public getLogData(data,time?){
        if(this.teamChange)
        {
            var team1Base = this.team2Base
            var team2Base = this.team1Base
            var team1ID = 30
            var team2ID = 10
        }
        else
        {
            var team1Base = this.team1Base
            var team2Base = this.team2Base
            var team1ID = 10
            var team2ID = 30
        }


        var info1 = [];
        var info2 = [];

        for(var i=0;i<team1Base.list.length;i++)
        {
            var mid = team1Base.list[i]
            var oo = {
                //id:mid,
                win: this.winCount[i+team1ID] || 0,
                die: this.die[i+team1ID]
            }
            info1.push(oo)
        }
        for(var i=0;i<team2Base.list.length;i++)
        {
            var mid = team2Base.list[i]
            var oo = {
                //id:mid,
                win: this.winCount[i+team2ID] || 0,
                die: this.die[i+team2ID]
            }
            info2.push(oo)
        }

        var videoData = {
            team1:{
                list:this.team1Base.list,
                fight:this.team1Base.f || 0
            },
            team2:{
                list:this.team2Base.list,
                fight:this.team2Base.f || 0
            },
            isequal:this.pkResult.isequal,
            pk_version:Config.pk_version
        }

        return {
            sp:data,
            videoData:videoData,
            team1Base:team1Base,
            team2Base:team2Base,
            info1:info1,
            info2:info2,
            isWin:this.isWin,
            rate:this.winnerRate,
            time:time || TM.now()
        }
    }

    //把数据转成日志格式
    public getLogTeamData(teamBase,infoData){
        var infoArr = []
        for(var i=0;i<teamBase.list.length;i++)
        {
            var mid = teamBase.list[i]
            var specialData = teamBase.mb[mid];
            var oo = {
                id:mid,
                list:infoArr,
                specialData:specialData,
                index:i,

                level:teamBase.mb[mid].lv,
                win: infoData[i].win,
                die: infoData[i].die,
            }
            infoArr.push(oo)
        }
        return infoArr
    }

}