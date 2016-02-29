

class VideoManager {
    private static _instance:VideoManager;
    public static getInstance():VideoManager {
        if (!this._instance)
            this._instance = new VideoManager();
        return this._instance;
    }

    public index = 0;//当前的播放头
    public total = 0;//最终的次数
    public dataArray = [];//数据内容


    public constructor() {

    }

    public initVideo(data){
        this.index = 0;
        var array = data.split(',');
        var len = array.length;
        var temp = [];
        this.dataArray.length = 0;
        this.dataArray.push([]);
        this.dataArray.push(temp);
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
            case 3: //使用技能
                oo.skillID = MyTool.str2Num(str.charAt(1));//技能的ID，对于攻击者来说，第几个技能
                var temp = str.substr(2);
                oo.action = [];
                if(temp)
                {
                    var arr = temp.split('|');
                    for(var i=0;i<arr.length;i++)
                    {
                        oo.action.push(this.decodeSkill(arr[i]))
                    }
                }
                break
            case 4: //改变攻击者的buffer(tag)
                oo.tag = str.substr(1);
                break
            case 5: //攻击者行动计数
                oo.times = Math.floor(str.substr(1));
                break
            case 6: //本次攻击行为结束
                break
        }
        return oo;
    }

    //处理一个技能行为
    private decodeSkill(str){
        var type = str.charAt(0);
        var value = Math.floor(str.substr(1));
        return {type:type,value:value};
    }
}