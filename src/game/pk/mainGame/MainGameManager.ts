class MainGameManager{
    private static _instance:MainGameManager;
    public static getInstance():MainGameManager {
        if (!this._instance)
            this._instance = new MainGameManager();
        return this._instance;
    }

    public constructor() {
    }

    public lastPKData;
    public maxLevel = 600;

    public logList
    public mainPass;
    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_main_log') || [];
    }
    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 20;
        SharedObjectManager.instance.setMyValue('pk_main_log',list);
    }

    public loadCache(level,fun){
        var id = Math.ceil(level/100);
        CM.loadCache('main_game'+id+'_json',function(){
            fun()
        })
    }

    public stepName = ['卡士','卡使','卡将','卡帅','卡师','卡神','卡圣','卡皇','卡帝','卡君','卡尊','卡主','卡宗'];

    public getMainStep(lv = -1){
        if(lv == -1)
            lv = UM.main_game.level;
        return  Math.floor((lv+5)/10)
    }

    public getStepName(lv?){
        var step = this.getMainStep(lv);
        var index = Math.floor(step/10);
        var step2 = step%10
        if(step2==0)
            return this.stepName[index];
        return this.stepName[index] + StringUtil.numToStr(step2) + '阶';
    }

    public getStepLevel(step){
         return  Math.max(0,step*10 - 5);
    }

    //下一阶分数
    public getNextStep(lv = -1){
        if(lv == -1)
            lv = UM.main_game.level;
        return this.getStepLevel(this.getMainStep(lv) + 1)
    }

    public getHeadByLevel(level){
         return level%50 + 1;
    }
    public getNickByLevel(level){
         return '守卫' + level;
    }

    //精英限制
    public getHardValue(level?){
        level = level || UM.main_game.hlevel + 1;
        var oo:any = {};
        var fight = this.getMainForce(level);
        var lv = this.getMainMonsterLevel(level);
        var leader = MonsterManager.getInstance().getEnemyMonsterLeader(fight);
        oo.force = fight;
        oo.level = lv;
        oo.leader = Math.ceil(Math.pow(leader,0.9));
        return oo;
    }

    //杀一个敌人的花费
    public getKillCost(){
        var level = UM.main_game.level + 1;
        return level*300*(UM.main_game.kill.length+1);
    }

    public getLocalAward(lv = -1){
        if(lv == -1)
            lv = UM.main_game.level;
        return {coin:lv*300,card:Math.floor(lv/20+1)};
    }

    public getFreeMax(){
        return Math.ceil(UM.main_game.hlevel/5);
    }
    public freeShowPass(){
        return UM.main_game.hlevel < 5 || (UM.main_game.hlevel < 100 && (UM.main_game.fail || 0) >= this.getFreeMax())
    }
    public getTipsCost(level?){
        level = ((UM.main_game.hlevel || level) - 5 + 1)
        return Math.ceil(level/10);
    }

    //
    //public testMainAdd(addForce,str,fun){
    //    var myForce = UM.getForce();
    //    var enemyForce = MainGameManager.getInstance().getMainForce()
    //    if(myForce <= enemyForce && (myForce + addForce) > enemyForce)
    //    {
    //        var add = (myForce + addForce) - enemyForce
    //        Confirm(str + '，玩家战力将[超过]公会关卡战力(+'+add+')，[无法]获得关卡奖励战力，是否继续？',function(v){
    //            if(v == 1)
    //            {
    //                fun && fun();
    //            }
    //        },['取消','继续'])
    //        return true;
    //    }
    //    return false
    //}

    //该位置是否被杀了
    public isKill(index){
        return UM.main_game.kill.indexOf(index) != -1;
    }

    public getMainForce(level?){
        level = level || (UM.main_game.level + 1)
        var add = level;
        var index = 1;
        while(level > 10*index)
        {
            add += (level - 10*index);
            index ++;
        }
        return add;
    }

    public getMainMonsterLevel(level?){
        var force = this.getMainForce(level);
        return MonsterManager.getInstance().getEnemyMonsterLevel(force);
    }

    //只有50个技能
    public getMainSkill(level){
         if(level<=200)
            return 0;
        var dec = level - 200
        var maxSkill = 50;

        for(var i=0;i<10;i++)
        {
            var temp = 100 + i*100;
            var skillRate = Math.min(maxSkill,5 + i*5);
            if(dec <= temp)
                return dec%skillRate || skillRate
        }
        return dec%maxSkill || maxSkill;
    }




    public getAwardForce(level?){
        level = level || (UM.main_game.level + 1)
        return  Math.ceil((level + 100)/200);
    }

    ////打开PK对战内容的表现
    public openPKView(isHard?,fun?){
        if(UM.getEnergy()<1)
        {
            Alert('体力不足1点，无法进行挑战');
            return;
        }
        MainGameUI.getInstance().show(isHard);
        fun && fun();
    }

    //public getCard(fun?,force?){
    //    if(!force && UM.main_game.choose)
    //    {
    //        if(fun)
    //            fun();
    //        return
    //    }
    //    if(UM.getEnergy()<1)
    //    {
    //        Alert('体力不足1点，无法获取卡组');
    //        return;
    //    }
    //    var self = this;
    //    var oo:any = {force:force};
    //    Net.addUser(oo);
    //    Net.send(GameEvent.mainGame.get_main_card,oo,function(data){
    //        var msg = data.msg;
    //        if(msg.fail == 4)
    //        {
    //            Alert('体力不足');
    //            return;
    //        }
    //        if(msg.fail == 3)
    //        {
    //            Alert('获取卡组失败');
    //            return;
    //        }
    //
    //        UM.main_game.choose = msg.choose;
    //        EM.dispatch(GameEvent.client.get_card)
    //
    //        if(fun)
    //            fun();
    //    });
    //}

    //choose :{list[],ring}   choose_index
    public pk(choose,fun?){
        var self = this;
        var oo:any = {};
        if(!UM.testEnergy(1))
        {
            return;
        }
        var hard = choose.hard
        delete choose.hard;
        oo.choose = choose;
        oo.hard = hard;

        var nowLevel =  hard?UM.main_game.hlevel:UM.main_game.level;
        if(!hard && UM.main_game.level > 1 && UM.main_game.level < 50)
        {
            oo.data_key = md5.incode(JSON.stringify(choose)).substr(-16);
        }
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.pk_main,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;

            UM.addHistory(choose.list.join(','));
            self.lastPKData = msg;
            msg.info.type = PKManager.PKType.MAIN;


            if(hard)
            {
                msg.hard = hard
                if(nowLevel != UM.main_game.hlevel)
                    self.mainPass = null
            }
            else
            {
                for(var i=0;i<msg.team2base.list.length;i++){
                    if(!msg.team2base.list[i])
                    {
                        msg.team2base.list.splice(i,1);
                        i--;
                    }
                }
            }
            PKManager.getInstance().onPK(PKManager.PKType.MAIN,msg);
            UM.main_game.pkdata = Config.pk_version;
            self.addLogList(PKManager.getInstance().getLogData({round:nowLevel,type:PKManager.PKType.MAIN,hard:hard}));

            if(fun)
                fun();
        });
    }

    //杀死第几个怪
    public kill(kill,fun?){
        var self = this;
        var oo:any = {};
        oo.kill = kill;
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.main_kill,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('没有对应卡兵数据');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('该单位已被杀死');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('金币不足');
                return;
            }
            EM.dispatch(GameEvent.client.main_kill)
            if(fun)
                fun();
        });
    }

    //领取奖励
    public getAward(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.main_award,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('今天已领过奖了');
                return;
            }
            AwardUI.getInstance().show(msg.award);
            EM.dispatch(GameEvent.client.get_card)
            if(fun)
                fun();
        });
    }

    public getMainPass(fun?){
        var self = this;
        var oo:any = {};
        oo.level = PKDressUI.getInstance().dataIn.hard ? UM.main_game.hlevel+1 : UM.main_game.level+1
        if(this.mainPass && this.mainPass.level == oo.level && TM.now() - this.mainPass.time < 5*60)
        {
            fun && fun();
            return;
        }

        Net.addUser(oo);
        Net.send(GameEvent.mainGame.get_main_pass,oo,function(data){
            var msg = data.msg;
            if(msg.fail == -1)
            {
                if(self.freeShowPass())
                    Alert('暂时还没有收录');
                else
                    Alert('暂时还没有收录，赶快加油帮助后来者吧！\n(并没有扣除玩家钻石)');
                return;
            }
            if(msg.fail == 1)
            {
                Alert('钻石不足');
                return;
            }
            self.mainPass = {
                list:msg.list,
                level:oo.level,
                time:TM.now()
            }
            for(var i=0;i<msg.list.length;i++)
            {
                msg.list[i].score = parseInt(msg.list[i].score);
                msg.list[i].time = parseInt(msg.list[i].time);
            }
            ArrayUtil.sortByField(msg.list,['score','time'],[0,1])
            UM.main_game.show_pass = true
            PKDressUI.getInstance().onTipsGet();
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

        if(UM.main_game.pkdata)
        {
            if(UM.main_game.pkdata.version != Config.pk_version)
            {
                this.lastPKData = true;
                if(fun)
                    fun();
                return;;
            }
            var logData = this.logList[0]
            if(logData && (logData.time - (UM.main_game.pkdata.time || 0) > -5)) //5S内都算已有
            {
                this.lastPKData = true;
                if(fun)
                    fun();
                return;
            }
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.MAIN,function(data){
                self.lastPKData = data;
                PKManager.getInstance().onPK(PKManager.PKType.REPLAY,self.lastPKData);
                var level = data.info.level;
                self.addLogList(PKManager.getInstance().getLogData({round:level-1 || "??",type:PKManager.PKType.MAIN,hard:data.hard},UM.main_game.pkdata.time));
                if(fun)
                    fun();
            })
        }
    }



    private testCardObj = {};
    public findWinCard(){
        this.testCardObj = {}
        this.testOneCard();
    }

    private testOneCard(){
        var self = this;
        var card = this.getTestCard()
        if(card)
        {
            this.testCardNet(card,function(msg){
                if(msg.result)   //win
                {
                    PKDressUI.getInstance().changeChooseList(card)
                    Alert('Done!')
                }
                else
                {
                      self.testOneCard();
                }
            })
        }
        else
        {
            Alert('没找到')
        }
    }

    private getTestCard(){
        var index = 100;
        var myCard = UM.getMyCard();
        while(index--)
        {
            var card = PKManager.getInstance().getRandomCard(myCard.list,true)
            if(!this.testCardObj[card.join(',')])
            {
                this.testCardObj[card.join(',')] = true;
                return card;
            }
        }
        return null;
    }

    private testCardNet(myList,fun){
        var team1:any = {"list":myList,"fight":UM.getForce(),"tec":{}}
        var leaderData = {1:0,2:0,3:0}
        team1.leader = leaderData;
        team1.skill = UM.tec.use_skill;

        var hardData:any = {leader:99999,level:99999}
        if(PKDressUI.getInstance().dataIn.hard)  //有限制
        {
            hardData = this.getHardValue();
            if(team1.fight > hardData.force)
                team1.fight = hardData.force
            if(UM.main_game.hlevel < Config.leaderSkillLevel)
                team1.skill = 0;
        }


        for(var i=0;i<myList.length;i++)
        {
            var mid = myList[i];
            team1.tec[mid] = UM.getTecAdd('monster',Math.min(UM.getMonsterLevel(mid),hardData.level));

            var leaderLevel = Math.min(UM.getMyLeaderLevel(mid),hardData.leader);
            if(leaderLevel)
            {
                var mvo = MonsterVO.getObject(mid);
                leaderData[mvo.mtype] = Math.max(leaderData[mvo.mtype],leaderLevel);
            }
        }
        this.getPlayResult(team1,fun);
    }

    public getPlayResult(team1,fun){
        var dataIn:any = {};
        dataIn.team1 = team1;
        var level = 0;
        if(PKDressUI.getInstance().dataIn.hard)
            level = UM.main_game.hlevel+1;
        else
            level = UM.main_game.level+1;
        var arr = MainGameVO.getObject(level).list;
        var fight = this.getMainForce(level);
        var lv = this.getMainMonsterLevel(level);
        var leader = MonsterManager.getInstance().getEnemyMonsterLeader(fight);
        var lvAdd = UM.getTecAdd('monster',lv);
        dataIn.team2 = {"list":arr,"fight":fight,"tec":{}}
        if(leader)
            dataIn.team2.leader = {1:leader,2:leader,3:leader};
        for(var i=0;i<arr.length;i++)
        {
            var mid = arr[i];
            dataIn.team2.tec[mid] = lvAdd;
        }
        PKDressUI.getInstance()['coinText'].text = ('find...' + ObjectUtil.objLength(this.testCardObj))
        Net.send('test',dataIn,function(data) {
            var msg = data.msg;
            fun(msg);
        })
    }


}
