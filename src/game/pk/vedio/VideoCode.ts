class VideoCode{
    private static instance: VideoCode;
    public static getInstance() {
        if(!this.instance) this.instance = new VideoCode();
        return this.instance;
    }

    public player1;
    public player2;

    public atker;
    public defender;

    public record = [];
    public index = 0;
    public index2 = 0;
    public targetIndex = 999999;
    public stopMV = false;//停止动画表现
    public playFlag = false;//是否继续播放

    public currentAction;

    public constructor() {
        this.player1 = new PlayerVO();
        this.player2 = new PlayerVO();
    }

    public initData(roundData){
        //{"hp":40000000,"mhp":4000000,"spd":5700,"atk":10000,"mid":107,"id":10}
        this.player1.reset(roundData.player1[0])
        this.player2.reset(roundData.player2[0])
        this.index = 0;
        this.index2 = 0;
        this.targetIndex = 999999;
        this.record.length = 0;

        this.stopMV = false;
    }

    public play()
    {
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
            case 3:
            {
                if(this.stopMV)//只计算值，不表现动画
                {
                    this.onMovieOver();
                }
                else
                {
                    //表现动画,会通调用stepOne回来
                     VideoUI.getInstance().playSkill();
                }
                break;
            }
            case 4:   //改变攻击者的buffer(tag)
            {
                this.getPlayer(this.atker).tag =  action.tag;
                this.stepOne();
                break;
            }
            case 5:   //攻击者行动计数
            {
                this.getPlayer(this.atker).tag =  action.actionCount;
                this.stepOne();
                break;
            }
            default :
            {
                this.stepOne();
            }
        }
    }

    public onMovieOver(){
        this.onSkillValue(this.currentAction.action);
        this.stepOne();
    }

    //计算技能数值得
    public onSkillValue(arr){
        for(var i=0;i<arr.length;i++)
        {
            var value = arr[i];
            switch(value.type)
            {
                case '1'://"HP"=>'1',
                {
                    this.getPlayer(this.atker).addHp(value.value);
                    break;
                }
                case '2'://    "SPD"=>'2',,
                {
                    this.getPlayer(this.atker).addSpeed(value.value);
                    break;
                }
                case '3'://    "ATK"=>'3',
                {
                    this.getPlayer(this.atker).addAtk(value.value);
                    break;
                }
                case '4'://    "MHP"=>'4',
                {
                    this.getPlayer(this.atker).addMaxHp(value.value);
                    break;
                }
                case '5'://    "MP"=>'5',
                {
                    this.getPlayer(this.atker).addMp(value.value);
                    break;
                }
                case '6'://    "EHP"=>'6',
                {
                    this.getPlayer(this.defender).addHp(value.value);
                    break;
                }
                case '7'://    "ESPD"=>'7',
                {
                    this.getPlayer(this.defender).addSpeed(value.value);
                    break;
                }
                case '8': //    "EATK"=>'8',
                {
                    this.getPlayer(this.defender).addAtk(value.value);
                    break;
                }
                case '9'://    "EMHP"=>'9',,
                {
                    this.getPlayer(this.defender).addMaxHp(value.value);
                    break;
                }
                case 'A'://    "EMP"=>'A',
                {
                    this.getPlayer(this.defender).addMp(value.value);
                    break;
                }
                case 'B': //    "MOMIAN"=>'B'//这个不是技能中的参数
                {
                    break;
                }
                case '@': //转换被攻击者
                {
                    this.defender = value.value;
                    break;
                }
            }
        }
    }

    //取对应的场上单位
    private getPlayer(id)
    {
        if(this.atker < 10)//召唤师
        {
            if(id == 1)
                return this.player1;
            else
                return this.player2;
        }
        if(this.atker < 30)
            return this.player1;
        return this.player2;
    }
}
