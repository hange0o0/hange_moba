class VideoMV {
    private static _instance:VideoMV;

    public static getInstance():VideoMV {
        if (!this._instance)
            this._instance = new VideoMV();
        return this._instance;
    }

    //A对B进行普通攻击
    public mv1(data){
        var vui = VideoUI.getInstance();
        var A = vui.getPlayer(data.atker);
        var B = vui.getPlayer(data.defender);
        var self = this;

        this.userMove(A,B,function(){

        })
    }



    //*************************   通用的动画方法    *****************************

    //从A跳到B
    private userMove(A,B,fun){
        var tw:egret.Tween = egret.Tween.get(A);
        tw.to({x:B.x}, 300).call(fun, this);
    }
}