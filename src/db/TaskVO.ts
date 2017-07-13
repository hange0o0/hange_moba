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
            ArrayUtil.sortByField(this.lineData[s],['index1','index2'],[0,0])
            for(var i=0;i<this.lineData[s].length;i++)
            {
                this.lineData[s].index = i;
            }
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


    public index;
    private index1;
    private index2;
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
        this.value1 = Math.floor(data.value1);
        this.value2 = Math.floor(data.value2);
        this.diamond = Math.floor(data.diamond);
        this.coin = Math.floor(data.coin);
        this.card = Math.floor(data.card);

        var arr = (this.id + '').split(',')
        this.index1 = parseInt(arr[0])
        this.index2 = parseInt(arr[0]) || 0
    }

    public getNextTaskVO(){
        return TaskVO.lineData[this.line][this.index + 1];
    }

    public isEnable(){
        //if(this.index > 0 && TaskManager.getInstance())
        if(this.line == 2)
        {
            if(this.level > UM.level)
                return false
        }
        if(this.type == 'map_game_pk')
        {
            var MD = MapData.getInstance();
            if(MD.step || MD.maxLevel || MD.pkValue)
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
        var stat = UM.active.stat || {};
        var MD = MapData.getInstance();
        var level:any;
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
                this.currentValue = ServerGameManager.getInstance().getCurrentLevel()
                return this.currentValue >= this.value1;
                break;
            case 'map_game_pk':
                this.currentValue = MD.step;
                if(MD.maxLevel> 0)
                    this.currentValue = 10;
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
                if(MD.maxLevel> 0)
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
                this.currentValue = ServerGameEqualManager.getInstance().getCurrentLevel()
                return this.currentValue >= this.value1;
                break;
            case 'card':
                this.currentValue = UM.getMonsterLevel(this.value1)
                return this.currentValue >= this.value2;
                break;
            case 'day_game':
                this.currentValue = UM.day_game.level
                return this.currentValue >= this.value1;
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
                MainPageUI.getInstance()['topPlayerTips'].hide();
                TM.showGuideMC(MainPageUI.getInstance()['diamonDrawBtn'])
                break;
            case 'main_game':
                MainGameUI.getInstance().show();
                break;
            case 'force':
                CollectUI.getInstance().show()
                break;
            case 'map_game':
                if(this.value1 < 0)
                {
                    TM.nowAction = this.type;
                    MainPageUI.getInstance().currentPage = 2;
                    MainPageUI.getInstance().scrollToCurrentPage(true)
                    TM.showGuideMC(MainPageUI.getInstance()['mapGame']['startBtn'])
                }
                else
                {
                    MapGameUI.getInstance().show();
                }
                break;
            case 'main_award':
                MainPageUI.getInstance().currentPage = 0;
                MainPageUI.getInstance().scrollToCurrentPage(true)
                TM.showGuideMC(MainPageUI.getInstance()['mainGame']['awardBtn'])
                break;
            case 'server_game':
                if(this.value1 < 0)
                {
                    TM.nowAction = this.type;
                    MainPageUI.getInstance().currentPage = 3;
                    MainPageUI.getInstance().scrollToCurrentPage(true)
                    TM.showGuideMC(MainPageUI.getInstance()['serverGame']['startBtn'])
                }
                else
                {
                    ServerGameUI.getInstance().show();
                }
                break;
            case 'map_game_pk':
                TM.nowAction = this.type;
                MapGameUI.getInstance().show();
                break;
            case 'map_game_buy':
                TM.nowAction = this.type;
                MapGameUI.getInstance().show();
                break;
            case 'map_game_next':
                TM.nowAction = this.type;
                MapGameUI.getInstance().show();
                break;
            case 'honor':
                TM.nowAction = this.type;
                MyInfoUI.getInstance().show();
                break;
            case 'comment':
                TM.nowAction = this.type;
                MonsterList.getInstance().showID(HonorManager.getInstance().isHonor())
                break;
            case 'buy_ticket':
                TM.nowAction = this.type;
                MainPageUI.getInstance().currentPage = 4;
                MainPageUI.getInstance().scrollToCurrentPage(true)
                TM.showGuideMC(MainPageUI.getInstance()['serverGameEqual']['ticketGroup'])
                break;
            case 'server_equal_game':
                if(this.value1 < 0)
                {
                    TM.nowAction = this.type;
                    MainPageUI.getInstance().currentPage = 4;
                    MainPageUI.getInstance().scrollToCurrentPage(true)
                    TM.showGuideMC(MainPageUI.getInstance()['serverGameEqual']['startBtn'])
                }
                else
                {
                   ServerGameEqualUI.getInstance().show();
                }
                break;
            case 'card':
                MonsterList.getInstance().showID(this.value1)
                break;
            case 'day_game':
                if(this.value1 < 0)
                {
                    TM.nowAction = this.type;
                    MainPageUI.getInstance().currentPage = 1;
                    MainPageUI.getInstance().scrollToCurrentPage(true)
                    TM.showGuideMC(MainPageUI.getInstance()['dayGame']['startBtn'])
                }
                else
                {
                    DayGameUI.getInstance().show();
                }
                break;
            case 'friend':
                TM.nowAction = this.type;
                TM.showGuideMC(MainPageUI.getInstance()['friendBtn'])
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
                    return '清剿野外据点[' +this.value1 + ']'
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
                    return '参加究极研究院活动'
                else
                    return '本日在研究院攻克[' +ServerGameEqualManager.getInstance().getStepNameByLevel(this.value1)  + '题]'
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
            case 'main_award':
            case 'map_game_buy':
            case 'map_game_next':
            case 'honor':
            case 'comment':
            case 'buy_ticket':
            case 'friend':
            case 'friend_dungeon':
                return this.currentValue + '/1'
                break;
            case 'main_game':
            case 'force':
                if(this.value1 >= 1000)
                    return '差'+  (this.value1 - this.currentValue)
                return this.currentValue +  '/' + this.value1;
                break;
            case 'map_game':
            case 'server_game':
            case 'server_equal_game':
            case 'day_game':
                if(this.value1 < 0)
                    return  this.currentValue + '/1'
                return this.currentValue +  '/' + this.value1;
                break;
            case 'map_game_pk':
            case 'card':
                return this.currentValue +  '/' + this.value1
                break;
        }
        return '??'
    }


}