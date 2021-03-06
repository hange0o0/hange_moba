class TaskVO {
    public static dataKey = 'task_base';
    public static key = 'id';
    public static getObject(id: number): TaskVO{
        return CM.table[this.dataKey][id];
    }
    public static lineData = {};
    public static initFinish(){
        var data = CM.table[this.dataKey];
        for(var s in data)
        {
            var vo = data[s];
            if(!this.lineData[vo.line])
                this.lineData[vo.line] = [];
            this.lineData[vo.line].push(vo);
        }

        for(var s in this.lineData)
        {
            ArrayUtil.sortByField(this.lineData[s],['index'],[0])
            //for(var i=0;i<this.lineData[s].length;i++)
            //{
            //    this.lineData[s][i].index = i;
            //}
        }
    }



    public id
    public line //arr
    public level
    public type
    public value1
    public value2
    public diamond
    public coin
    public card
    public energy
    public index;


    private currentValue;
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.id = data.id;
        this.line = data.line;
        this.type = data.type;

        this.level = Math.floor(data.level);
        this.index = Math.floor(data.index);
        this.value1 = Math.floor(data.value1);
        this.value2 = Math.floor(data.value2);
        this.diamond = Math.floor(data.diamond || 0);
        this.coin = Math.floor(data.coin || 0);
        this.card = Math.floor(data.card || 0);
        this.energy = Math.floor(data.energy || 0);

    }

    public getNextTaskVO(){
        var index = TaskVO.lineData[this.line].indexOf(this);
        return TaskVO.lineData[this.line][index + 1];
    }

    public isEnable(){
        //if(this.index > 0 && TaskManager.getInstance())
        if(this.line == 2)
        {
            if(this.level > UM.level)
                return false
        }
        if(this.line == 3)
        {
            if(this.level > UM.main_game.level)
                return false
        }
        if(this.type == 'map_game_pk')
        {
            var MD = MapData.getInstance();
            if(MD.step || MD.maxLevel>1 || MD.pkValue)
                return true
            MD.reInit();
            if(!MD.pkValue)
                return false;
        }
        else if(this.type == 'honor')
        {
            var mdata = CM.table[MonsterVO.dataKey];
            for(var s in mdata)
            {
                var vo = mdata[s];
                if(vo.level<= UM.level || (UM.honor.monster[s] && UM.honor.monster[s].w && UM.honor.monster[s].w >= HonorManager.getInstance().awardBase[0].num))
                   return true;
            }
            return false;
        }
        return true;
    }

    public isFinish(){
        var stat = UM.active.task.stat || {};
        var MD = MapData.getInstance();
        this.currentValue = 0;
        switch(this.type)
        {
            case 'draw':
                if(stat['draw'])
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'leader':
                if(ObjectUtil.objLength(UM.tec.leader) > 0)
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'guess':
                if(UM.active.guess.total)
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'main_game':
                this.currentValue = UM.main_game.level;
                return this.currentValue >= this.value1
                break;
            case 'force':
                this.currentValue = UM.getForce();
                return this.currentValue >= this.value1
                break;
            case 'map_game':
                if(MD.lastTime)
                {
                    this.currentValue = MD.maxLevel;
                    return this.currentValue >= this.value1;
                }
                return false;
                break;
            case 'main_award':
                if(stat['award'])
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'server_game':
                if(this.value1 < 0)
                {
                    return UM.server_game.pkdata
                }
                this.currentValue = ServerGameManager.getInstance().getCurrentLevel()
                return this.currentValue >= this.value1;
                break;
            case 'map_game_pk':
                this.currentValue = MD.step;
                if(MD.maxLevel> 1)
                    this.currentValue = 5;
                return this.currentValue >= this.value1
                break;
            case 'map_game_buy':
                if(stat['map_buy'])
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'map_game_next':
                if(MD.maxLevel> 1)
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'honor':
                if(HonorManager.getInstance().isHonor())
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'comment':
                if(stat['comment'])
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'buy_ticket':
                if(stat['ticket'])
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'server_equal_game':
                if(this.value1 < 0)
                {
                    return UM.server_game_equal.pkdata
                }
                this.currentValue = ServerGameEqualManager.getInstance().getCurrentLevel()
                return this.currentValue >= this.value1;
                break;
            case 'card':
                this.currentValue = UM.getMonsterLevel(this.value1)
                return this.currentValue >= this.value2;
                break;
            case 'day_game':
                if(this.value1 < 0)
                {
                    return UM.day_game.pkdata
                }
                else
                {
                    this.currentValue = UM.day_game.level
                    return this.currentValue >= this.value1;
                }
                break;
            case 'friend':
                if(stat['friend'])
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'friend_dungeon':
                if(stat['friend_dungeon'])
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
        }
    }
    //点击后的动作
    public onClick(){
        var TM = TaskManager.getInstance();
        TM.nowAction = null
        TM.actionStep = 0
        switch(this.type)
        {
            case 'draw':
                TM.showGuideMC(MainPageUI.getInstance()['diamonDrawBtn'])
                break;
            case 'guess':
                TM.showGuideMC(MainPageUI.getInstance()['guessBtn'])
                break;
            case 'main_game':
                TM.nowAction = this.type;
                if(MainPageUI.getInstance().currentPage == 0)
                    MainPageUI.getInstance()['mainGame'].onShow();
                else
                    TM.showGuideMC(MainPageUI.getInstance()['page0'])
                break;
            case 'force':
                TM.showGuideMC(MainPageUI.getInstance()['collectBtn'])
                //CollectUI.getInstance().show()
                break;
            case 'map_game':
                TM.nowAction = this.type;
                if(MainPageUI.getInstance().currentPage == 2)
                    MainPageUI.getInstance()['mapGame'].onShow();
                else
                    TM.showGuideMC(MainPageUI.getInstance()['page2'])
                break;
            case 'main_award':
                TM.nowAction = this.type;
                if(MainPageUI.getInstance().currentPage == 0)
                    MainPageUI.getInstance()['mainGame'].onShow();
                else
                    TM.showGuideMC(MainPageUI.getInstance()['page0'])
                break;
            case 'server_game':
                TM.nowAction = this.type;
                if(MainPageUI.getInstance().currentPage == 3)
                    MainPageUI.getInstance()['serverGame'].onShow();
                else
                    TM.showGuideMC(MainPageUI.getInstance()['page3'])
                break;
            case 'map_game_pk':
                TM.nowAction = this.type;
                MapMainUI.getInstance().show();
                break;
            case 'map_game_buy':
                TM.nowAction = this.type;
                MapMainUI.getInstance().show();
                break;
            case 'map_game_next':
                TM.nowAction = this.type;
                MapMainUI.getInstance().show();
                break;
            case 'honor':
                TM.nowAction = this.type;
                TM.showGuideMC(MainPageUI.getInstance()['headMC'])
                break;
            case 'comment':
                TM.nowAction = this.type;
                CollectUI.getInstance().show(HonorManager.getInstance().isHonor())
                //MonsterList.getInstance().showID(HonorManager.getInstance().isHonor())
                break;
            case 'buy_ticket':
                TM.nowAction = this.type;
                if(MainPageUI.getInstance().currentPage == 4)
                    MainPageUI.getInstance()['serverGameEqual'].onShow();
                else
                    TM.showGuideMC(MainPageUI.getInstance()['page4'])
                break;
            case 'server_equal_game':
                TM.nowAction = this.type;
                if(MainPageUI.getInstance().currentPage == 4)
                    MainPageUI.getInstance()['serverGameEqual'].onShow();
                else
                    TM.showGuideMC(MainPageUI.getInstance()['page4'])
                break;
            case 'card':
                CollectUI.getInstance().show(this.value1)
               // MonsterList.getInstance().showID(this.value1)
                break;
            case 'day_game':
                TM.nowAction = this.type;
                if(MainPageUI.getInstance().currentPage == 1)
                    MainPageUI.getInstance()['dayGame'].onShow();
                else
                    TM.showGuideMC(MainPageUI.getInstance()['page1'])
                break;
            case 'friend':
                TM.nowAction = this.type;
                TM.showGuideMC(MainPageUI.getInstance()['friendBtn'])
                break;
            case 'leader':
                TM.nowAction = this.type;
                TM.showGuideMC(MainPageUI.getInstance()['leaderBtn'])
                break;
            case 'friend_dungeon':
                TM.nowAction = this.type;
                TM.showGuideMC(MainPageUI.getInstance()['team'])
                break;
        }
    }

    //取描述
    public getDes(){
        switch(this.type)
        {
            case 'draw':
                return '抽取一次钻石'
                break;
            case 'leader':
                return '进行一次统帅学习'
                break;
            case 'guess':
                return '进行一次竞猜'
                break;
            case 'main_game':
                return '职业评分达到[' +this.value1 + ']'
                break;
            case 'force':
                return '战力达到[' +this.value1 + ']'
                break;
            case 'map_game':
                if(this.value1 < 0)
                    return '开始清剿野外势力'
                else
                    return '进入野外据点[' +this.value1 + ']'
                break;
            case 'main_award':
                return '领取卡士补助'
                break;
            case 'server_game':
                if(this.value1 < 0)
                    return '参加天梯竞技场'
                else
                    return '天梯竞技场达到[' +ServerGameManager.getInstance().getStepNameByLevel(this.value1)  + ']'
                break;
            case 'map_game_pk':
                return '挑战通辑令BOSS[' + this.value1 + '次]'
                break;
            case 'map_game_buy':
                return '使用积分兑换资源'
                break;
            case 'map_game_next':
                return '进入第[2]据点'
                break;
            case 'honor':
                return '领取成就奖励'
                break;
            case 'comment':
                return '对卡兵作出你的评价'
                break;
            case 'buy_ticket':
                return '在商城购买一次修正币'
                break;
            case 'server_equal_game':
                if(this.value1 < 0)
                    return '参加虚空修正场'
                else
                    return '虚空修正场达到[' +ServerGameEqualManager.getInstance().getStepNameByLevel(this.value1)  + ']'
                break;
            case 'card':
                return '把['+MonsterVO.getObject(this.value1).name+']升到['+this.value2+']级'
                break;
            case 'day_game':
                if(this.value1 < 0)
                    return '参加每日任务活动'
                else
                    return '每日任务中达到第[' +this.value1  + '题]'
                break;
            case 'friend':
                return '添加好友'
                break;
            case 'friend_dungeon':
                return '与好友组建战队'
                break;
        }
        return '??'
    }

    //取进度，前提是调用过 isFinish();
    public getRate(){
        switch(this.type)
        {
            case 'draw':
            case 'leader':
            case 'guess':
            case 'main_award':
            case 'map_game_buy':
            case 'map_game_next':
            case 'honor':
            case 'comment':
            case 'buy_ticket':
            case 'friend':
            case 'friend_dungeon':
                return this.currentValue + ' /1'
                break;
            case 'main_game':
            case 'force':
                if(this.value1 >= 1000)
                    return '差'+  (this.value1 - this.currentValue)
                return this.currentValue +  ' /' + this.value1;
                break;
            case 'map_game':
            case 'server_game':
            case 'server_equal_game':
            case 'day_game':
            case 'map_game_pk':
                if(this.value1 < 0)
                    return  this.currentValue + ' /1'
                return this.currentValue +  ' /' + this.value1;
                break;
            case 'card':
                return this.currentValue +  ' /' + this.value2
                break;
        }
        return '??'
    }


}