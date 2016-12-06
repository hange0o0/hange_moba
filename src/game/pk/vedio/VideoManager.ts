

class VideoManager {
    private static _instance:VideoManager;
    public static getInstance():VideoManager {
        if (!this._instance)
            this._instance = new VideoManager();
        return this._instance;
    }

    public index = 0;//当前的播放头

    public baseData;//触发战斗的数据(基础数据）
    public dataArray = [];//数据内容

    public videoData = {};//所有录象的集合
    public type//录象的类型


    public leaderSkill1
    public leaderSkill2

    //public skillAni

    public constructor() {
        //this.skillAni = {
        //    mv:['skill1','skill2'],
        //    le:['skill1'],
        //    ls:['skill2']
        //}
    }

    public decodeLeaderSkill(str){
        //sm_101_f1 ,sm_101_ds1,sm_507_ds2#123
        var arr = (str.split('#')[0]).split('_');
        var mvo = MonsterVO.getObject(arr[1]);
        var temp = arr[2].split('');
        var id = temp.pop();
        var svo = mvo.getSkillByID(id,false);
        var mv:any;
        if(temp.length < 2)
            mv = svo.mv;
        else
            mv = 'l' + temp.pop();
        return {
            name:mvo.name, //+'·'+ svo.name,
            des:'',
            type:3,
            mv:mv
        }

    }

    //得到动画预加载项
    public getVideoAniGroup(){
        var PKM = PKManager.getInstance();
        var mArr = [];
        for(var i=0;i<this.baseData.player1.length;i++)
        {
            var vo = MonsterVO.getObject(this.baseData.player1[i].mid);
            if(i==0)
                mArr = mArr.concat(vo.mv1)
            else
                mArr = mArr.concat(vo.mv2)

        }
        for(var i=0;i<this.baseData.player2.length;i++)
        {
            var vo = MonsterVO.getObject(this.baseData.player2[i].mid);
            if(i==0)
                mArr = mArr.concat(vo.mv1)
            else
                mArr = mArr.concat(vo.mv2)
        }
        for(var i=0;i<this.leaderSkill1.length;i++)
        {
            mArr.push(this.leaderSkill1[i].mv);
        }
        for(var i=0;i<this.leaderSkill2.length;i++)
        {
            mArr.push(this.leaderSkill2[i].mv);
        }
        //mArr.push(RingVO.getObject(PKM.team1Ring).getSkillVO().mv)
        var mObj = {};
        for(var i=0;i<mArr.length;i++)
        {
            var arr = mArr[i];
            if(arr)
            {
                for(var j=0;j<arr.length;j++)
                {
                    mObj[arr[j]] = true;
                }
            }
        }

        var arr2 = [];
        for(var s in mObj)
        {
            arr2.push(s);
            //arr2.push(s+'_json');
            //arr2.push(s+'_png');
        }
        return arr2;
    }

    public cleanVideo(type){
        this.videoData[type] = null;
    }

    //播放指定位置的动画
    public playVideo(type,index){
        var self = this;
        var baseData = PKManager.getInstance().getVedioBase(index);
        if(!this.videoData[type])
            this.videoData[type] = {};
        if(this.videoData[type][index])
        {
            play();
            return
        }



        Net.send(GameEvent.pkCore.pk_vedio,baseData,function(data){
            var msg = data.msg;
            self.videoData[type][index] = msg.pkdata;
            play();

        });

        function play(){
            self.baseData = ObjectUtil.clone(baseData);

            if(PKManager.getInstance().teamChange)
            {
                ObjectUtil.swapKey(self.baseData,'player1','player2')
                ObjectUtil.swapKey(self.baseData,'team1','team2')
                ObjectUtil.swapKey(self.baseData,'team1base','team2base')
                self.baseData.result.w =  self.baseData.result.w == 1?2:1;
            }

            self.leaderSkill1 = []
            self.leaderSkill2 = []
            for(var i=0;i<self.baseData.team1.ac.length;i++)
            {
                self.leaderSkill1.push(self.decodeLeaderSkill(self.baseData.team1.ac[i]))
            }
            for(var i=0;i<self.baseData.team2.ac.length;i++)
            {
                self.leaderSkill2.push(self.decodeLeaderSkill(self.baseData.team2.ac[i]))
            }


            self.type = type;
            self.index = index;
            VideoManager.getInstance().initVideo(self.videoData[type][index]);
            VideoUI.getInstance().show()
        }
    }

    public initVideo(data){
        var array = data.split(',');
        var len = array.length;
        var temp = [];
        this.dataArray.length = 0;
        this.dataArray.push([]);
        this.dataArray.push(temp);
        var gameStart = false

        //var skillArray;
        for(var i=0;i<len;i++)
        {
            var action = this.decode(array[i]);
            if(action.type == 6)
            {
                if(gameStart || temp.length != 0)
                {
                    if(gameStart)
                        temp.push(action);
                    temp = [];
                    this.dataArray.push(temp);
                }
            }
            else
            {
                //if(action.type == 7)
                //{
                //    skillArray = [action];
                //}
                //else if(action.type == 9)
                //{
                //    temp.push(skillArray);
                //    skillArray = null;
                //}
                //else if(skillArray)
                //    skillArray.push(action);
                //else

                if(action.type == 10)
                    gameStart = true;
                temp.push(action);
            }
        }
        this.dataArray.pop();
    }

    //对一次行为进行解释
    private decode(str){
        var oo:any = {};
        oo.type = MyTool.str2Num(str.charAt(0));
        switch(oo.type)
        {
            case 1: //转攻击者
            case 2: //转防御者
                oo.id = Math.floor(str.substr(1));
                break
            //case 3: //技能效果开始
            //    break
            case 4: //改变攻击者的buffer(tag)
                oo.tag = str.substr(1);
                break
            case 5: //攻击者行动计数
                oo.times = Math.floor(str.substr(1));
                break
            case 6: //本次攻击行为结束
                break;


            case 7: //单个技能开始
                oo.skillID = MyTool.str2Num(str.charAt(1));//技能的ID，对于攻击者来说，第几个技能
                break
            case 8: //单个技能过程
                this.decodeSkill(str.substr(1),oo);
                break
            case 9: //单个技能结束
                break
            case 10: //前置技能结束
                break
            //case 11: //清除效果
            //    oo.cd = Math.floor(str.substr(2));
            //    oo.id = MyTool.str2Num(str.charAt(1))
            //    break
            //case 12: //单位死亡
            //    break
        }
        return oo;
    }

    //处理一个技能行为
    private decodeSkill(str,oo){
        var type = str.charAt(0);
        var value:any;
        if(type == 'a')
            value = {stat:MyTool.str2Num(str.charAt(1)) ,cd: MyTool.str2Num(str.charAt(2)),value: Math.floor(str.substr(3))};
        else if(type == '3')
            value = {id:MyTool.str2Num(str.charAt(1)) ,cd:  MyTool.str2Num(str.charAt(2)),value: Math.floor(str.substr(3))};
        else
        {
            value = Math.floor(str.substr(1));
            oo.isNegative = str.charAt(1) == '-';
            console.log(str,str.charAt(1),oo.isNegative)
        }
        oo.sType = type;
        oo.value = value;
    }
}