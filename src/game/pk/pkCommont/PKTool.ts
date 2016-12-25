class PKTool {
    public constructor() {
    }

    //计算PK所处阶段
    public static getPKTableLevel(exp,step){
        var level = 1;
        for(var i=1;i<=100;i++)
        {
            if(exp >= Math.pow(1.2,i)*step - step)
                level ++;
            else
                break;
        }
        return level;
    }
    public static getPKTableExp(lv,step){
        return Math.ceil(Math.pow(1.2,(lv-1))*step - step)
    }

    //显示令牌信息
    public static showRingInfo(ringId){
    }



}



