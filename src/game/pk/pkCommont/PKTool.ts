class PKTool {
    public constructor() {
    }

    //计算PK所处阶段
    public static getPKTableLevel(exp){
        var level = 1;
        for(var i=0;i<=20;i++)
        {
            if(exp >= Math.pow(2,i)*100)
                level ++;
            else
                break;
        }
        return level;
    }

    //显示令牌信息
    public static showRingInfo(ringId){

    }



}



