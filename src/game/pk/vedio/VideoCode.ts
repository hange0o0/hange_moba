class VideoCode{
    //管理动画播放
    private static instance: VideoCode;
    public static getInstance() {
        if(!this.instance) this.instance = new VideoCode();
        return this.instance;
    }

    public player1;//场上玩家1
    public player2; //场上玩家2

    public atker;
    public defender;

    //public record = [];
    public index = 0;
    public index2 = 0;
    //public targetIndex = 999999;
    public stopMV = false;//停止动画表现
    public playFlag = false;//是否继续播放
    public isDebug = false;//

    public currentAction;
    public skillStart;
    public skillData;

    public playerObject = {}; //所有单位的集合

    private orginHP

    private actionCountSkillData//发生多次回合计数

    public constructor() {
        //this.player1 = new PlayerVO();
        //this.player2 = new PlayerVO();
    }

    public initData(roundData){
        var PKM = PKManager.getInstance();
        this.playerObject = {};
        for(var i=0;i<roundData.player1.length;i++)
        {
            var player = new PlayerVO(roundData.player1[i],roundData.team1base);
            player.index = i
            if(i==0)
            {
                player.isPKing = true;
                this.player1 = player;
            }

            player.teamID = 1;
            this.playerObject[player.id] = player
            //player.displayMC = VideoUI.getInstance().getRelateMC(1,i)
            //player.displayMC.playerData = player;
        }
        for(var i=0;i<roundData.player2.length;i++)
        {
            var player = new PlayerVO(roundData.player2[i],roundData.team2base);
            player.index = i
            if(i==0)
            {
                player.isPKing = true;
                this.player2 = player;
            }
            player.teamID = 2;
            this.playerObject[player.id] = player
            //player.displayMC = VideoUI.getInstance().getRelateMC(2,i)
            //
            //player.displayMC.playerData = player;
        }
        //召唤师
        this.playerObject[1] = new PlayerVO();
        this.playerObject[1].id = 1;
        //this.playerObject[1].displayMC = VideoUI.getInstance().getRelateMC(1,3);
        this.playerObject[1].teamID = 1;
        this.playerObject[1].index = -1;

        this.playerObject[2] = new PlayerVO();
        this.playerObject[2].id = 2;
        //this.playerObject[2].displayMC = VideoUI.getInstance().getRelateMC(2,3);
        this.playerObject[2].teamID = 1;
        this.playerObject[2].index = -1;

        if(PKM.teamChange)
        {
            this.playerObject[1].id = 2;
            this.playerObject[2].id = 1;
        }


        this.index = 0;
        this.index2 = 0;
        //this.targetIndex = 999999;

        this.stopMV = false;
        this.skillStart = false;

        this.actionCountSkillData = null

        this.setOrginHp();
    }

    private setOrginHp(){
        this.orginHP = {hp1:this.player1.hp,hp2:this.player2.hp,mhp1:this.player1.maxHp,mhp2:this.player2.maxHp}
    }

    public getPlayerByID(id){
        return this.playerObject[id]
    }

    public play(isDebug?)
    {
        this.isDebug = isDebug;
        if(isDebug)
        {
            this.stopMV = false;
        }
        //this.targetIndex = 999999;
        this.playFlag = true;
        this.stepOne();
    }

    public stop()
    {
        this.playFlag = false;
    }

    //运行到指定的位置(index所在的要执行完)
    public run(index){
        this.stopMV = true;
        this.playFlag = true;
        this.skillStart = false;


        //this.targetIndex = index;
        this.stepOne();
    }

    //执行一步
    public stepOne(){
        if(!this.playFlag)
            return;
        var data = VideoManager.getInstance().dataArray;
        var arr = data[this.index];
        if(!arr)
        {
            //this.onGameOver();
            return
        }

        if(arr[this.index2])//处理本次行为
        {
            this.decodeAndPlay(arr[this.index2++]);
        }
        else //回合结束
        {
            this.actionCountSkillData = this.skillData;
            this.onRoundOver();
            this.setOrginHp();
            this.index2 = 0;
            this.index ++;

            if(this.index >= data.length)//游戏结束
            {
                 this.onGameOver();
            }
            else
            {
                if(this.stopMV)//只计算值，不表现动画
                {
                    this.stepOne();
                }
                else
                {
                    VideoUI.getInstance().roundOver();
                }
            }
        }

        //if(this.playFlag)
        //{
        //    this.stepOne()
        //}

    }

    private onGameOver(){
         console.log('finish');

        VideoUI.getInstance().onOver();
    }

    //处理一个行为，完成后回调
    public decodeAndPlay(action)
    {
        this.currentAction = action;
        switch(action.type)
        {
            case 1:  //改变技能发起者
            {
                this.atker = action.id;
                this.stepOne();
                break;
            }
            case 2:   //改变目标
            {
                this.defender = action.id;
                this.stepOne();
                break;
            }
            //case 3: //技能效果开始（去除了前置的加怒气）
            //{
            //    this.stepOne();
            //    break;
            //}
            case 4:   //改变攻击者的buffer(tag)
            {
                this.getPlayerByID(this.atker).tag =  action.tag;
                this.stepOne();
                break;
            }
            case 5:   //攻击者行动计数
            {
                this.getPlayerByID(this.atker).onAction();
                this.getPlayerByID(this.atker).actionCount =  action.times;

                if(this.actionCountSkillData && this.actionCountSkillData == this.skillData)    //主要是因为会跳过     && this.atker >= 10
                {
                    this.skillData = {index:this.index,atker:this.atker,skillID:-1,defender:[]};
                    if(this.atker >= 10)
                    {
                        this.actionCountSkillData = this.skillData;
                        VideoUI.getInstance().playSkill(this.skillData);
                        break;
                    }

                }
                //this.actionCountSkillData = this.skillData;
                this.stepOne();
                break;
            }
            case 6:   //玩家回合结束
            {
                //this.onRoundOver();
                //console.log(this.player1.buffList)
                //console.log(this.player2.buffList)
                this.stepOne();
                break;
            }
            case 7:   //技能开始
            {
                this.skillStart = true;
                this.skillData = {index:this.index,atker:this.atker,skillID:action.skillID,defender:[]};
                this.stepOne();
                break;
            }
            case 8:   //技能过程
            {
                this.onSkillValue(action);
                this.stepOne();
                break;
            }
            case 9:   //技能结果
            {
                //if(ObjectUtil.objLength(this.skillData.defender) == 0)
                //{
                //    this.defenderMV(this.defender);
                //}
                this.skillStart = false;
                if(this.stopMV)//只计算值，不表现动画
                {
                    this.onMovieOver();
                }
                else
                {
                    VideoUI.getInstance().playSkill(this.skillData);
                }
                break;
            }
            //case 11: //清除效果
            //    this.getPlayerByID(this.defender).cleanBuff(action.id,action.cd);
            //    this.defenderMV('clean',action.id);
            //    this.stepOne();
            //    break
            //case 12: //单位死亡
            //    this.getPlayerByID(this.defender).buffList.length = 0;
            //    this.defenderMV('die',1);
            //    this.stepOne();
            //    break;
            default :
            {
                this.stepOne();
            }
        }
    }

    private onRoundOver(){
        if(!this.skillData)
            return;
        var oo:any = this.skillData.result = {player1:{},player2:{}};
        oo.player1.lhp = this.orginHP.hp1;
        oo.player1.lmhp = this.orginHP.mhp1;
        oo.player1.hp = this.player1.hp;
        oo.player1.mp = this.player1.mp;
        oo.player1.ap = this.player1.actionCount;
        oo.player1.maxHp = this.player1.maxHp;
        oo.player1.maxMp = this.player1.maxMp;
        oo.player1.buffList = JSON.stringify(this.player1.buffList);

        oo.player2.lhp = this.orginHP.hp2;
        oo.player2.lmhp = this.orginHP.mhp2;
        oo.player2.hp = this.player2.hp;
        oo.player2.mp = this.player2.mp;
        oo.player2.ap = this.player2.actionCount;
        oo.player2.maxHp = this.player2.maxHp;
        oo.player2.maxMp = this.player2.maxMp;
        oo.player2.buffList = JSON.stringify(this.player2.buffList);

        oo.otherBuff = {};
        for(var s in this.playerObject)
        {
            if(s == this.player1.id || s == this.player2.id)
                continue;
            var player = this.playerObject[s]
            if(player.buffList)
                oo.otherBuff[player.id] = JSON.stringify(player.buffList);
        }
    }

    public onMovieOver(){
        this.stepOne();
    }

    private defenderMV(key,value){
        var oo = {key:key,value:value,defender:this.defender};
        var id = this.atker + '_' + this.defender;
        var last = this.skillData.defender[ this.skillData.defender.length - 1] || {};
        if(last.key != id)
        {
            last = {key:id,atker:this.atker,defender:this.defender,list:[]};
            this.skillData.defender.push(last);
        }
        last.list.push(oo);
            //if (isArr)
            //{
            //    if(!this.skillData.defender[defender][key])
            //        this.skillData.defender[defender][key] = [];
            //    this.skillData.defender[defender][key].push(value);
            //}
            //else
            //    this.skillData.defender[defender][key] = (this.skillData.defender[defender][key] || 0) + value;

    }

    //计算技能数值得
    public onSkillValue(value){
        var player = this.getPlayerByID(this.defender);

        switch(value.sType)
        {
            case '1'://"HP"=>'1',
            {
                var atker = this.getPlayerByID(this.atker);
                var last = player.hp
                player.addHp(value.value);
                if(player.teamID != atker.teamID && value.value < 0)
                    atker.atkerHP(value.value);
                else if(player.teamID == atker.teamID && value.value > 0)
                    atker.atkerHP(value.value);
                this.defenderMV('hp',{value:value.value,last:last,max:player.maxHp,current:player.hp,isNegative:value.isNegative})
                //if(value.value < 0 && player.hp <= 0)
                //{
                //    this.skillData.diePlayer.push(player.id);
                //}

                break;
            }
            case '2'://    "HMP"=>'2',,
            {
                //this.defenderMV('spd',value.value)
                player.addMp(value.value);
                break;
            }
            case '3': //清除效果
                player.cleanBuff(value.value.id,value.value.cd,value.value.value);
                this.defenderMV('clean',value.value);
                break;
            //case '3'://    "ATK"=>'3',
            //{
            //    this.defenderMV('atk',value.value)
            //    player.addAtk(value.value);
            //    break;
            //}
            case '4'://    "MHP"=>'4',
            {
                //this.defenderMV('mhp',value.value)
                player.addMaxHp(value.value);
                if(value.value > 0)
                    player.buffList.push({id:5,value:value.value})
                else if(value.value < 0)
                    player.buffList.push({id:15,value:value.value})
                break;
            }
            case '5'://    "MP"=>'5',
            {
                this.defenderMV('mp',value.value)
                player.addMp(value.value);
                break;
            }
            case '6'://    "MV"=>'6',
            {
                this.defenderMV('mv',value.value)
                break;
            }
            case '7':
            {
                this.defenderMV('miss',1)
                break;
            }
            case '8':
            {
                this.defenderMV('nohurt',value.value)
                break;
            }
            case '9':       //mmp
            {
                this.defenderMV('mmp',value.value)
                player.maxMp += (value.value);
                break;
            }
            case 'a':       //stat
            {
                this.defenderMV('stat',value.value)
                this.getPlayerByID(this.defender).addBuff(value.value,this.atker);
                break;
            }
            case 'b'://单位死亡
            {
                player.onDie();
                this.defenderMV('die',1);
                this.stepOne();
                break;
            }
            case 'c':       //stat
            {
                this.defenderMV('stat',value.value)
                this.getPlayerByID(this.defender).addBuff(value.value,this.atker);
                break;
            }
        }
    }
}
