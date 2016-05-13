class VideoMV {
    private static _instance:VideoMV;

    public static getInstance():VideoMV {
        if (!this._instance)
            this._instance = new VideoMV();
        return this._instance;
    }

    //A对B进行普通攻击
    public atk(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        var tw:egret.Tween = egret.Tween.get(a);
        tw.to({x:b.ox,y:b.oy + b.ar*100}, 300).call(function(){
            self.beAtk(b);
        }).to({x:a.ox,y:a.oy}, 300).call(fun, thisObj);
    }

    //leader对已方加成
    public ls(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;
    }
    //leader对敌方加成
    public le(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;
    }

    public mv(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        var AM = AniManager.getInstance();
        var mv = AM.getAni('skill2');
        mv.x = a.x;
        mv.y = a.y;
        mv.rotation = this.getRota(a,b);
        VideoUI.getInstance().addToGroup(mv);

        var tw:egret.Tween = egret.Tween.get(mv);
        tw.to({x:b.x,y:b.y}, 300).call(function(){
            AM.removeMV(mv);
            mv = AM.getAniOnce('skill1',function(){
                fun.apply(thisObj);
            })
            mv.x = b.x;
            mv.y = b.y;
            VideoUI.getInstance().addToGroup(mv);
           self.beAtk(b,100);
        })
    }

    //*************************   通用的动画方法    *****************************
    //被攻击动画
    private beAtk(mc,delay=0){
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.wait(delay).to({y:mc.oy - mc.ar*10}, 100).to({y:mc.oy}, 100)
    }

    //移动动画
    private move(mc,p,fun,thisObj){
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.to({y:mc.oy - mc.ar*10}, 100).to({y:mc.oy}, 100)
    }

    //转角度，由A指向B，A原来是指向X轴
    private getRota(begin,end){
        return -Math.atan2(end.y - begin.y,end.x - begin.x)* 180/3.14
    }
}