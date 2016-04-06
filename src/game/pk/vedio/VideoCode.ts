class VideoCode{
    private static instance: VideoCode;
    public static getInstance() {
        if(!this.instance) this.instance = new VideoCode();
        return this.instance;
    }

    public player1;//场上玩家1
    public player2; //场上玩家2

    public atker;
    public defender;

    public record = [];
    public index = 0;
    public index2 = 0;
    public targetIndex = 999999;
    public stopMV = false;//停止动画表现
    public playFlag = false;//是否继续播放
    public isDebug = false;//

    public currentAction;
    public skillStart;
    public skillArray;
    public skillData;

    public playerObject = {}; //所有单位的集合

    public constructor() {
        //this.player1 = new PlayerVO();
        //this.player2 = new PlayerVO();
    }

    public initData(roundData){
        this.playerObject = {};
        for(var i=0;i<roundData.player1.length;i++)
        {
            var player = new PlayerVO(roundData.player1[i],roundData.team1base);
            if(i==0)
            {
                player.isPKing = true;
                this.player1 = player;
            }

            this.playerObject[player.id] = player
            player.displayMC = VideoUI.getInstance().getRelateMC(1,i)
        }
        for(var i=0;i<roundData.player2.length;i++)
        {
            var player = new PlayerVO(roundData.player2[i],roundData.team2base);
            if(i==0)
            {
                player.isPKing = true;
                this.player2 = player;
            }

            this.playerObject[player.id] = player
            player.displayMC = VideoUI.getInstance().getRelateMC(2,i)
        }
        //召唤师
        this.playerObject[1] = new PlayerVO();
        this.playerObject[1].id = 1;
        this.playerObject[1].displayMC = VideoUI.getInstance().getRelateMC(1,3);

        this.playerObject[2] = new PlayerVO();
        this.playerObject[2].id = 2;
        this.playerObject[2].displayMC = VideoUI.getInstance().getRelateMC(2,3);


        this.index = 0;
        this.index2 = 0;
        this.targetIndex = 999999;
        this.record.length = 0;

        this.stopMV = false;
        this.skillStart = false;
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
        this.targetIndex = 999999;
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
        if(this.record[index])//已有播放纪录
        {
            this.index = index;
            var oo = this.record[index]
            this.player1.fromSave(oo.myData);
            this.player2.fromSave(oo.otherData);
            console.log(this);
            VideoUI.getInstance().renewView();
        }
        else
        {
            this.targetIndex = index;
            this.stepOne();
        }
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
            var oo:any = {};
            oo.myData = this.player1.getSave();
            oo.otherData = this.player2.getSave();
            this.record[this.index] = oo;

            if(this.index >= this.targetIndex)//已播放到指定位置
            {
                console.log(this)
                VideoUI.getInstance().renewView();
                return;
            }

            this.index2 = 0;
            this.index ++;

            if(this.index >= data.length)//游戏结束
            {
                 this.onGameOver();
            }
            else
            {
                this.stepOne();
            }
        }

        //if(this.playFlag)
        //{
        //    this.stepOne()
        //}

    }

    private onGameOver(){
         console.log('finish');
    }

    //处理一个行为，完成后回调
    public decodeAndPlay(action)
    {
        this.currentAction = action;
        switch(action.type)
        {
            case 1:
            {
                this.atker = action.id;
                this.stepOne();
                break;
            }
            case 2:
            {
                this.defender = action.id;
                this.stepOne();
                break;
            }
            //case 3:
            //{
            //    if(this.stopMV)//只计算值，不表现动画
            //    {
            //        this.onMovieOver();
            //    }
            //    else
            //    {
            //        //表现动画,会通调用stepOne回来
            //         VideoUI.getInstance().playSkill();
            //    }
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
                this.getPlayerByID(this.atker).actionCount =  action.actionCount;
                this.stepOne();
                break;
            }
            case 7:   //技能开始
            {
                this.skillStart = true;
                this.skillData = {atker:this.atker,skillID:action.skillID,defender:[]};
                this.skillArray = [this.skillData];
                this.stepOne();
                break;
            }
            case 8:   //技能过程
            {
                if(this.skillData.defender.indexOf(this.defender) == -1)
                {
                    this.skillData.defender.push(this.defender);
                }
                this.onSkillValue(action);
                this.stepOne();
                break;
            }
            case 9:   //技能结果
            {
                this.skillStart = false;
                if(this.stopMV)//只计算值，不表现动画
                {
                    this.onMovieOver();
                }
                else
                {
                    VideoUI.getInstance().playSkill(this.skillArray);
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

    //计算技能数值得
    public onSkillValue(value){
        var player = this.getPlayerByID(this.defender);
        switch(value.sType)
        {
            case '1'://"HP"=>'1',
            {
                this.skillData['hp' + this.defender] = (this.skillData['hp' + this.defender] || 0) + value.value;
                player.addHp(value.value);
                break;
            }
            case '2'://    "SPD"=>'2',,
            {
                player.addSpeed(value.value);
                break;
            }
            case '3'://    "ATK"=>'3',
            {
                player.addAtk(value.value);
                break;
            }
            case '4'://    "MHP"=>'4',
            {
                this.skillData['mhp' + this.defender] = (this.skillData['mhp' + this.defender] || 0) + value.value;
                player.addMaxHp(value.value);
                break;
            }
            case '5'://    "MP"=>'5',
            {
                this.skillData['mp' + this.defender] = (this.skillData['mp' + this.defender] || 0) + value.value;
                player.addMp(value.value);
                break;
            }
        }
    }
}
