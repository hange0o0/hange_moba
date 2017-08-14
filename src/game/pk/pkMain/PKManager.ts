class PKManager {
    private static _instance:PKManager;
    public static PKType = {
        MAIN:'main_game',
        MAP:'map_game',
        PVE:'pve_game',
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


    }

    public initData(){
        this.pkJump = (SharedObjectManager.instance.getMyValue('pkJump') || false) && Config.isDebug;
    }

    public pkWord = {
        win:['求一败','抬走，下一个','来个强点的','对面没人了吗','来让我战个痛快吧','哈哈哈','我的目标是要3胜','胜利是属于我的','你睡着了吗','你分心了','别小看我!','游戏结束了','满足了吗','到现在才来求饶吗',
            '浪费时间!!','想逃吗!真无聊!','你可别小看我啊!','你还未够资格','别惹我....!','任务完成','赢的人，\n是我','你太脆弱了','哦，是的！\n我胜利了','抱歉','打得不错','发生这种事我很抱歉','对此我很抱歉','你敢盯着我看'],
        win3:['我还想继续呢','就没强一点的吗','我还能再打三个','对面怎么这么弱啊','一打三啊\n真简单啊','本场的MVP我拿定了','3胜！3胜！3胜！','靠我一个就足够了','我说过，\n别惹我','我就是一个传说','我很可怕吗',
            '安乐地去死吧!','历史已经改变了','一打三是高手的日常啊','愉快的一天啊','快来阻止我的得瑟','三胜有这么难吗','三胜不是很简单吗','采访下我的三胜感受吧','感谢组织对我的培养','我还没使用洪荒之力呢',
            '啊？完了？\n我还没爽够','虐菜真无聊','唉！\n又拿三星了','今个儿真啊真高兴','我可没时间陪你玩游戏'],
        loss:['就差一点','不开心','不高兴','只是运气比我好而已','我就是打酱油的','兄弟们为我报仇啊','赢得太多了\n我来放放水','我们还是有机会的','他其实也快死了',
            '别灰心\n还能打','呜呜呜~','就这样输了不甘心啊','能再给我一次机会吗','我只是被克制了','刚才大意了','谁都有失手的时候','吸取教训\n超越自我','我会变强的','我已经尽力了',
            '难受，想哭','哪里跌倒\n哪里爬起','失败是成功他妈','你还没有被干掉吗', '到此为止了','别烦我!','还没有结束的～', '有点本事啊','刚才到底哪里出错了呢,', '我绝不认输',
            '我想再比试一次','我只是变的更坚强了','我和你没完','我会继续努力的','主要是饿了\n要不不会输','早说了今天不宜动武','我渴望复仇','对不起\n我搞砸了','小心我咬你','和我的计划有出入',
            '这不是我想要的结果','真是失误','我犯了个错误','(╯﹏╰）','我感觉很难受','呃啊！医生！','不胜利毋宁死','我选择死亡','死亡，没什么好怕的','我还会回来的!','这次是你赢了','我感觉有点不舒服'],
        pking:['投降，或者死亡','来战个痛快','小心你的背后','这招看你怎么躲','我要认真了','你就只会这几招吗','我要出大招了','我会赐予你死亡','你究竟想怎样...','我的魔法会撕碎你','我已饥渴难耐','你会记住我的名字的',
            '品尝我的愤怒吧','你死期将至！','我要粉碎你！','你是我的猎物','尝尝我的厉害吧', '你会后悔对上我的' ,'希望你能多坚持一会吧','不要输得太难看哦','对面上来的是什么啊','我允许你认输','唯有一战了','胜利属于我们的',
            '我们来做个了结吧','你的身体有破绽','你空门大开啊','尝尝这个吧','接下...\n这一招吧','用这招....\n来决胜负吧', '马上将你解决掉', '就用你的死来结束吧','别罗嗦了...来吧','来啊!\n互相相害啊'],
        win_view:['太牛B了','好样的','我爱你！','爱死你了','对面太弱了','不错不错','威武','有希望了','好强哦~','想输都难','赢得漂亮','距离胜利又近一步了','看来我不用出手了','燃烧吧！\n小宇宙！',
            '加油，再赢一场','队友强\n我躺赢','这就是王者之气啊','刚才你们说什么来着','看到我们队有多强了吧','等会去哪庆功好呢','留几个给我杀啊','放轻点，别把对面吓跑了','蠢材！','让我来干掉你....',
            '我要打呵欠了','让我好好抱抱你！','我准备好了','我已经等不及了'],
        loss_view:['你们别高兴得太早','等下我一挑你们仨','这只是让你们的','我们的高手还在后面呢','有输有赢的游戏才好玩','你让得也太明显了吧','我们输得起','这只是练兵而已',
            '我会为你报仇的','王者荣耀，我来守护','有黑幕吧？','怎么会这样。。','输得太难看了','这太欺负人了','你已经尽力了','无眼睇','这样下去我们会输了','你轻敌了','要来个士力架吗','再接再厉','你们真差劲！',
            '你们的战斗真是差劲','我的怒火\n会毁灭一切','太假了吧\n这都能输','噢，亲爱的\n要坚持住','你死定了','你们这是自寻死路','品尝我的愤怒吧','你死期将至！','我要粉碎你！','你是我的猎物','你对力量一无所知'],
        view:['加油','干死他','打啊，别光跑','有破绽','小心后面','哎呀','就差一下了','对，就这样干','看来准备赢了','小心，别大意','我会让你后悔来到世上','严肃点，\n这是比赛','啦啦啦啦~',
            '我的魔法会撕碎你','我已饥渴难耐','你会记住我的名字的','祈祷别对上我吧'],
        map:['中午不睡\n下午崩溃',  '你若不举\n便是晴天',
            '我不下地狱\n谁爱下谁下','漫漫人生路\n总会错几步','行到水穷处\n，口渴','坐看云起时\n，头晕','执子之手\n方知子丑','人不犯我\n我不犯人','人若犯我\n斩草除根','水能载舟\n亦能煮粥'
            ,'空口无凭\n吃饭为据','别紧张,我不是好人','光阴似面\n日月如锅','放自己的屁\n让别人闻去','钱不是问题\n问题是没钱','有钱男子汉\n没钱汉子难','走牛B的路\n让傻B去说吧',
            '只要你敢死\n我就敢埋','要在江湖混\n最好是光棍','一觉醒来\n天都黑了','祖传牛皮癣\n专治老中医','比赛第一\n友谊第二','我一直忙着无聊','听君一席话\n省我十本书','摇啊摇，摇到奈何桥'
            ,'给点阳光\n我就腐烂','心里有座坟\n葬着未亡人','要么忍，\n要么残忍','逃课，是一个人的狂欢','上课，是一群人的孤单','出其不意\n攻其后背','锻炼肌肉\n防止挨揍','无理取闹\n必有所图',
            '打死你我也不会说','有事勿找\n没事勿扰','好好吃饭\n体重向上','世界那么乱\n装纯给谁看','站的高\n尿的远','名花已有主\n锄头却无情','水浅王八多\n遍地是大哥','逃得了和尚\n逃不了方丈','人不损\n不标准',
            '嘴里很享受\n心里很想瘦','早起的虫儿被鸟吃','不是路不平\n而是你不行','跟哥斗，哥逗死你','想多了头疼\n想通了心疼','躲得过初一\n躲不过高三','你就是个井\n横竖都是二','人不要脸\n天下无敌','百度没有你\n只因在搜狗',
            '不是不小心\n而是我故意','在哪跌倒\n哪里砸个坑','无钱就头痕\n有钱就身痕','老友握手\n梗有人走','眼大无神\n鼻大吸尘','→_→','@_@','( ¯ □ ¯ )','（╯＾╰）','>_<','(╯▔▽▔)╯','(╬▔皿▔)凸',
            '别人手牵手\n我牵我的狗','不迷信\n只迷人','明天的事，\n后天就知道','好好学习\n天天睡觉','我拿青春堵明天','工作无贵贱\n工资有高低','人不饭我\n我不饭人','赢了笑嘻嘻\n输了妈卖批','。。。','你是疯儿\n我不傻',
           '嘻嘻嘻嘻嘻嘻\n哈哈哈哈哈','床前明月光\n凝似地上霜','在哪跌倒\n在哪里躺着']
    }
    public pkEmo = {
        win:[4,7,9,12,14],
        win3:[4,12,14],
        loss:[1,2,5,6,15,16,19,20],
        pking:[4,17,7],
        win_view:[8,9,10,4,14],
        loss_view:[3,5,11,19,18,16],
        view:[1,3,7,13,17,18,19],
        map:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    }

    public pkResult;
    public pkAward;
    public pkStartTime;
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

    public mvpList//MVP数据列表
    public winCount//胜利的次数
    public action//是否有出战
    public kill//杀对方的ID列表
    public die//是否失败
    public winnerRate//胜利者剩余血量百分比
    public isWin//胜利

    public pkJump//胜利

    public teamChange = false//队伍ID发生过转换
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
        var myCard = UM.getMyCard();
        var task = myCard.task;
        var cost = myCard.num;
        if(task && task.current >= task.num)
        {
            Confirm('当前卡组剩余使用次数：'+cost+'\n确定 '+MyTool.createHtml('马上',0xE0A44A)+' 更换新的卡组吗？',function(v){
                if(v == 1)
                {
                    self.getMyCard()
                }
            })
            return;
        }


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
    public getRandomCard(list,isEqual,data?){
        var GM = GuideManager.getInstance();
        if(GM.isGuiding)
        {
            switch(GM.guideRandom)
            {
                case 0:
                    GM.guideRandom ++;
                    return [15, 53, 53, 7, 56, 56];
                case 1:
                    GM.guideRandom ++;
                    return [15, 56, 56, 15, 1];
                case 2:
                    GM.guideRandom ++;
                    return [5, 1, 56, 56, 7, 5]
                case 3:
                    GM.guideRandom ++;
                    return [1, 5,53,5,56, 5]
            }
        }
        data = data || {};
        list = list.concat();
        var index = 0;
        var history = {};
        var total = 88;

        if(data.dis && data.dis.length > 0)
        {
             for(var i=0;i<data.dis.length;i++)
             {
                 index = list.indexOf(data.dis[i]);
                 if(index != -1)
                 {
                     list.splice(index,1);
                 }
             }
            //while(list.length <8)
            //    list = list.concat(list);
        }

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
            list = list.concat(list)
            for(var s in levelObj)
            {
                if(levelObj[s] >= level)
                    list.push(parseInt(s));
            }
            list = list.concat(list);
        }
        else
        {
            list = list.concat(list);
            list = list.concat(list).concat(list)
        }
        if(data.need)
        {
            for(var i=0;i<data.need.length;i++)
            {
                index = list.indexOf(data.need[i]);
                list.splice(index,1);
            }
        }


        index = 0;
        while(true)
        {
            var returnArr = [];
            if(data.need)
                returnArr = data.need.concat();
            if(returnArr.length >= 6)
            {
                ArrayUtil.random(returnArr,3);
                return returnArr;
            }
            var newList = list.concat();
            var num = (6-returnArr.length)+3
            for(var i=0;i<num;i++)
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
            if(index >= 3)
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
        ArrayUtil.random(returnArr,3);
        return returnArr;
    }


    public getPKBG(type,rd){
        var sceneID = 1;
        var size = 3;
        if(type == PKManager.PKType.REPLAY)
            type = this.pkResult.info.type;
        switch(type)
        {
            case PKManager.PKType.MAP:
                var MD = MapData.getInstance();
                sceneID =  (MD.level %20) || 20;
                break;
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
            case PKManager.PKType.MAP:
                sceneID = 5;
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
            Alert('没有选择任何卡兵');
            return true;
        }
        return false;
    }

    //PK的统一入口
    public startPK(type,choose,myFun?){
        var self = this;
        this.pkStartTime = egret.getTimer();
        var fun = function(){
            self.pkStartTime = 0;
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
            case PKManager.PKType.PVE:
                TeamPVEManager.getInstance().pk(choose,fun);
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

    public buyPKJump(num,fun?){
        var self = this;
        var oo:any = {};
        oo.num = num;
        Net.addUser(oo);
        Net.send(GameEvent.pkCore.buy_pk_jump,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('钻石不足');
                return;
            }
            UM.pk_common.pk_jump = (UM.pk_common.pk_jump || 0) + num*20;
            if(fun)
                fun(msg);
        });
    }
    public PKJumpAction(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.pkCore.pk_jump,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                UM.pk_common.pk_jump = 0;
            }
            else
                UM.pk_common.pk_jump --;
            if(fun)
                fun();
        },false);
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
            MyCardTaskUI.getInstance().testShow();
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

    private addMVPList(player)
    {
        var rate = (this.pkResult.isequal?1:Math.min(1,(Config.equalValue/(this.team1Base.f || (Config.equalValue)))))*10
        var mvp = this.pkResult.mvp[player.id].split('|')
        var hp:any = parseInt(mvp[0]);
        var atk:any = parseInt(mvp[1]);
        var help:any  = parseInt(mvp[2]) + parseInt(mvp[3]);
        var mvp:any = Math.round((hp + atk + help)/MonsterVO.getObject(player.mid).cost/rate)
        var oo = {
            id:player.id,
            mid:player.mid,
            team:player.team,
            hp:hp,
            atk:atk,
            help:help,
            mvp:mvp
        }
        if(hp > this.mvpList.hp)
            this.mvpList.hp = hp;
        if(atk > this.mvpList.atk)
            this.mvpList.atk = atk;
        if(help > this.mvpList.help)
            this.mvpList.help = help;
        if(mvp > this.mvpList.mvp)
            this.mvpList.mvp = mvp;

        this.mvpList.list.push(oo);
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


        this.pkAward = null;
        if(!data.dealAward)
        {
            this.pkAward = {
                levelUp:false,
                gLevelUp:0,
                newTask:false,
                finishTask:false,
                forceUp:false,
                getNewCard:false,
                passMap:false,
                desArr:[],
                prop:[]
            }

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
                this.pkAward.finishTask = data.finish_task;
            if(data.new_task)
                this.pkAward.newTask = true;
            if(data.g_level_up)
                this.pkAward.gLevelUp = data.g_level_up;
            if(data.day_award)
                this.pkAward.dayAward = true;
            if(data.get_new_card && UM.level > 1)
                this.pkAward.getNewCard = true;
            if(data.passMap)
                this.pkAward.passMap = true;

            if(data.main_award)
            {
                this.pkAward.desArr.push('低战通关战力+' + data.main_award)
            }

            if(this.pkType == PKManager.PKType.MAP && data.result)
            {
                var MD = MapData.getInstance();
                if(MD.level == MD.maxLevel && MD.step < MD.maxBossTimes)
                {
                    this.pkAward.desArr.push('据点进度：' + (MD.step + 1) + '/' + MD.maxBossTimes)
                }
            }

            if(!data.g_level_up && data.result)
            {
                if(this.pkType == PKManager.PKType.MAIN)
                    this.pkAward.desArr.push('职业评分升至：' + UM.main_game.level)
                else if(this.pkType == PKManager.PKType.DAY)
                    this.pkAward.desArr.push('今日研究进度：' + UM.day_game.level + '/10')
                else if(this.pkType == PKManager.PKType.SERVER)
                {
                    var level = ServerGameManager.getInstance().getPKTableLevel(UM.server_game.exp)
                    var nowExp = ServerGameManager.getInstance().getPKTableExp(level)
                    var nextExp = ServerGameManager.getInstance().getPKTableExp(level + 1)
                    var des = (nextExp - nowExp) - Math.max(0,UM.server_game.exp - nowExp)
                    this.pkAward.desArr.push('竞技场积分：' + UM.server_game.exp + '\n离下一段位还差：'+ des)
                }
                else if(this.pkType == PKManager.PKType.SERVER_EQUAL)
                {
                    var level = ServerGameManager.getInstance().getPKTableLevel(UM.server_game_equal.exp)
                    var nowExp = ServerGameManager.getInstance().getPKTableExp(level)
                    var nextExp = ServerGameManager.getInstance().getPKTableExp(level + 1)
                    var des = (nextExp - nowExp) - Math.max(0,UM.server_game_equal.exp - nowExp)
                    this.pkAward.desArr.push('修正场积分：' + UM.server_game_equal.exp + '\n离下一称号还差：'+ des)
                }
            }
        }


        data.dealAward = true;

        VideoManager.getInstance().cleanVideo(type);

        //表现动画，结果的数据
        var winCount = this.winCount = {};
        this.mvpList = {list:[],hp:0,atk:0,help:0,mvp:0};
        if(!this.pkResult.mvp)
            this.mvpList = null;
        var action = this.action = {};
        this.kill = {};
        var die = this.die = {};
        this.pkList.length = 0;
        var mvpDeal = {};
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

            if(this.mvpList)
            {
                if(!mvpDeal[oo.player1.id])
                {
                    this.addMVPList(oo.player1)
                    mvpDeal[oo.player1.id] = true;
                }

                if(!mvpDeal[oo.player2.id])
                {
                    this.addMVPList(oo.player2)
                    mvpDeal[oo.player2.id] = true;
                }
            }


            oo.index = i+1;
            this.pkList.push(oo);
        }

        //把没出战的也放进去
        if(this.mvpList)
        {
            var list1 = []
            var team = data.team1base.list
            for(var i=0;i<team.length;i++)
            {
                if(!mvpDeal[10+i])
                {
                    list1.push({
                        id:10+i,
                        mid:team[i],
                        team:self.teamChange?2:1
                    })
                }
            }
            var list2 = []
            var team = data.team2base.list
            for(var i=0;i<team.length;i++)
            {
                if(!mvpDeal[30+i])
                {
                    list2.push({
                        id:30+i,
                        mid:team[i],
                        team:self.teamChange?1:2
                    })
                }
            }

            for(var i=0;i<6;i++)
            {
                 if(list1[i])
                    this.addMVPList(list1[i])
                 if(list2[i])
                    this.addMVPList(list2[i])
            }
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
            var enemy = data.pkdata[index]['player' + (team == 1?2:1)][0];
            var enemyIndex = enemy.id%10 + 1;
            var base = data['team'+team+'base'].mb[p.mid];
            var nextP;
            if(data.pkdata[index+1])
                nextP = data.pkdata[index + 1]['player' + team][0];
            var result = data.pkdata[index].result;
            var oo:any = {};
            oo.team = displayTeam;
            if(self.teamChange)
                oo.team = team == 1?2:1;

            if(!self.kill[p.id])
                self.kill[p.id] = [];

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
                self.kill[p.id].push(enemyIndex)
            }
            else
            {
                oo.after = 0;
                die[p.id] = enemyIndex;
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
                die: this.die[i+team1ID],
                kill:this.kill[i+team1ID]
            }
            info1.push(oo)
        }
        for(var i=0;i<team2Base.list.length;i++)
        {
            var mid = team2Base.list[i]
            var oo = {
                //id:mid,
                win: this.winCount[i+team2ID] || 0,
                die: this.die[i+team2ID],
                kill:this.kill[i+team2ID]
            }
            info2.push(oo)
        }
        team1Base.team = 1;
        team2Base.team = 2;

        //var videoData = {
        //    team1:{
        //        list:this.team1Base.list,
        //        fight:this.team1Base.f || 0
        //    },
        //    team2:{
        //        list:this.team2Base.list,
        //        fight:this.team2Base.f || 0
        //    },
        //    isequal:this.pkResult.isequal,
        //    pk_version:Config.pk_version
        //}

        var videoData = ObjectUtil.clone(this.pkResult);
        for(var s in this.pkResult)
        {
            var ss = s.toLowerCase();
            if(ss.indexOf('award') != -1 || ss.indexOf('sync_') != -1)
                delete videoData[s];
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
            if(!mid)
            {
                teamBase.list.splice(i,1);
                i--;
                console.log(999999999999)
                continue;
            }
            var specialData = teamBase.mb[mid];
            specialData.isOther = teamBase.team == 2;
            var oo = {
                id:mid,
                list:infoArr,
                specialData:specialData,
                index:i,
                teamID:teamBase.team,

                level:teamBase.mb[mid].lv,
                win: infoData[i].win,
                die: infoData[i].die,
                kill: infoData[i].kill,
            }
            infoArr.push(oo)
        }
        return infoArr
    }

    ////重置数据
    //public resetInfoData(team1,team2){
    //    var rArr1 = []
    //    var rArr2 = []
    //    for(var i=0;i<team1.length;i++)
    //    {
    //        var oo = team1[i];
    //        var win = oo.win;
    //        while(win)
    //        {
    //            rArr2.push(i)
    //            win --;
    //        }
    //    }
    //
    //    for(var i=0;i<team2.length;i++)
    //    {
    //        var oo = team2[i];
    //        var win = oo.win;
    //        while(win)
    //        {
    //            rArr1.push(i)
    //            win --;
    //        }
    //    }
    //
    //    oo.kill = [];
    //    oo.beKill = 0;
    //}

}