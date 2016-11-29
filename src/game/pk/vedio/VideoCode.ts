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
    public skillEffectStart;
    public skillData;

    public playerObject = {}; //所有单位的集合

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
            if(i==0)
            {
                player.isPKing = true;
                this.player1 = player;
            }

            player.teamID = 1;
            this.playerObject[player.id] = player
            player.displayMC = VideoUI.getInstance().getRelateMC(1,i)
            player.displayMC.playerData = player;
        }
        for(var i=0;i<roundData.player2.length;i++)
        {
            var player = new PlayerVO(roundData.player2[i],roundData.team2base);
            if(i==0)
            {
                player.isPKing = true;
                this.player2 = player;
            }
            player.teamID = 2;
            this.playerObject[player.id] = player
            player.displayMC = VideoUI.getInstance().getRelateMC(2,i)

            player.displayMC.playerData = player;
        }
        //召唤师
        this.playerObject[1] = new PlayerVO();
        this.playerObject[1].id = 1;
        this.playerObject[1].displayMC = VideoUI.getInstance().getRelateMC(1,3);
        this.playerObject[1].teamID = 1;

        this.playerObject[2] = new PlayerVO();
        this.playerObject[2].id = 2;
        this.playerObject[2].displayMC = VideoUI.getInstance().getRelateMC(2,3);
        this.playerObject[2].teamID = 1;

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
        this.skillEffectStart = false;
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
        this.skillEffectStart = false;

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
            this.onGameOver();
            return
        }

        if(arr[this.index2])//处理本次行为
        {
            this.decodeAndPlay(arr[this.index2++]);
        }
        else //回合结束
        {
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
                if(this.skillEffectStart)
                    this.defenderMV(this.defender);
                this.stepOne();
                break;
            }
            case 3: //技能效果开始（去除了前置的加怒气）
            {
                this.skillEffectStart = true
                this.stepOne();
                break;
            }
            case 4:   //改变攻击者的buffer(tag)
            {
                this.getPlayerByID(this.atker).tag =  action.tag;
                this.stepOne();
                break;
            }
            case 5:   //攻击者行动计数
            {
                this.getPlayerByID(this.atker).actionCount =  action.times;
                this.stepOne();
                break;
            }
            case 7:   //技能开始
            {
                this.skillStart = true;
                this.skillData = {index:this.index,atker:this.atker,skillID:action.skillID,defender:{},diePlayer:[]};
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
                if(ObjectUtil.objLength(this.skillData.defender) == 0)
                {
                    this.defenderMV(this.defender);
                }
                this.skillStart = false;
                this.skillEffectStart = false;
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
            default :
            {
                this.stepOne();
            }
        }
    }

    public onMovieOver(){
        this.stepOne();
    }

    private defenderMV(defender,key?,value?,isArr?){
        if(!this.skillEffectStart)
            return;
        if(!this.skillData.defender[defender])
            this.skillData.defender[defender] = {};
        if(key) {
            if (isArr)
            {
                if(!this.skillData.defender[defender][key])
                    this.skillData.defender[defender][key] = [];
                this.skillData.defender[defender][key].push(value);
            }
            else
                this.skillData.defender[defender][key] = (this.skillData.defender[defender][key] || 0) + value;
        }

    }

    //计算技能数值得
    public onSkillValue(value){
        var player = this.getPlayerByID(this.defender);

        switch(value.sType)
        {
            case '1'://"HP"=>'1',
            {
                this.defenderMV(this.defender,'hp',value.value)
                player.addHp(value.value);
                if(value.value < 0 && player.hp <= 0)
                {
                    this.skillData.diePlayer.push(player.id);
                }

                break;
            }
            case '2'://    "SPD"=>'2',,
            {
                this.defenderMV(this.defender,'spd',value.value)
                player.addSpeed(value.value);
                break;
            }
            case '3'://    "ATK"=>'3',
            {
                this.defenderMV(this.defender,'atk',value.value)
                player.addAtk(value.value);
                break;
            }
            case '4'://    "MHP"=>'4',
            {
                this.defenderMV(this.defender,'mhp',value.value)
                player.addMaxHp(value.value);
                break;
            }
            case '5'://    "MP"=>'5',
            {
                this.defenderMV(this.defender,'mp',value.value)
                player.addMp(value.value);
                break;
            }
            case '6'://    "MV"=>'6',
            {
                this.defenderMV(this.defender,'mv',value.value)
                break;
            }
            case '7':
            {
                this.defenderMV(this.defender,'miss',1)
                break;
            }
            case '8':
            {
                this.defenderMV(this.defender,'nohurt',value.value)
                break;
            }
            case '9':       //mmp
            {
                this.defenderMV(this.defender,'mmp',value.value)
                player.maxMp += (value.value);
                break;
            }
            case 'a':       //stat
            {
                this.defenderMV(this.defender,'stat',value.value,true)
                break;
            }
        }
    }
}
