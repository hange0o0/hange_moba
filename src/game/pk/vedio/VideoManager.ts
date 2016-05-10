

class VideoManager {
    private static _instance:VideoManager;
    public static getInstance():VideoManager {
        if (!this._instance)
            this._instance = new VideoManager();
        return this._instance;
    }

    public index = 0;//当前的播放头

    public baseData = {};//触发战斗的数据(基础数据）
    public dataArray = [];//数据内容

    public videoData = {};//所有录象的集合
    public type//录象的类型


    public constructor() {

    }

    public cleanVideo(type){
        this.videoData[type] = null;
    }

    //播放指定位置的动画
    public playVideo(type,index){
        var self = this;
        if(!this.videoData[type])
            this.videoData[type] = {};
        if(this.videoData[type][index])
        {
            play();
            return
        }
        var baseData = this.baseData = PKManager.getInstance().getVedioBase(index);
        Net.send(GameEvent.pkCore.pk_vedio,baseData,function(data){
            var msg = data.msg;
            self.videoData[type][index] = msg.pkdata;
            play();

        });

        function play(){
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

        //var skillArray;
        for(var i=0;i<len;i++)
        {
            var action = this.decode(array[i]);
            if(action.type == 6)
            {
                temp = [];
                this.dataArray.push(temp);
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
        }
        return oo;
    }

    //处理一个技能行为
    private decodeSkill(str,oo){
        var type = str.charAt(0);
        var value = Math.floor(str.substr(1));
        oo.sType = type;
        oo.value = value;
    }
}