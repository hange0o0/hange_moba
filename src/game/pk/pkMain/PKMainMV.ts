class PKMainMV {
    private static _instance:PKMainMV;

    public static getInstance():PKMainMV {
        if (!this._instance)
            this._instance = new PKMainMV();
        return this._instance;
    }

    private getDis(p1,p2){
        return Math.pow(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),0.5)
    }

    //移向指定玩家
    public moveToTarget(a,b,fun1?,thisObj?){
        a.parent.addChild(a);
        var tw:egret.Tween = egret.Tween.get(a);
        var dis = this.getDis(a,b);
        var rate = 100/dis;
        var x = b.x - (b.x - a.x)*rate;
        var y = b.y - (b.y - a.y)*rate;
        var oo = {x:x,y:y};
        tw.to(oo, Math.pow(dis-100,0.8) * 3);
        if(fun1)
            tw.call(fun1,thisObj)
        return oo;
    }

    public moveToXY(a,b,fun1?,thisObj?){
        //a.parent.addChild(a);
        var tw:egret.Tween = egret.Tween.get(a);
        var dis = this.getDis(a,b);
        tw.to(b, Math.pow(dis,0.8) * 3);
        if(fun1)
            tw.call(fun1,thisObj)
    }

    public jumpToXY(a,b,fun1?,thisObj?,wait?){
        a.parent.addChild(a);
        var tw:egret.Tween = egret.Tween.get(a);
        var dis = Math.max(500,this.getDis(a,b));
        tw.to({x:b.x,y:b.y}, dis);
        var tw:egret.Tween = egret.Tween.get(a);
        tw.to({scaleX:1.2,scaleY:1.2}, dis/2,egret.Ease.sineOut).to({scaleX:1,scaleY:1}, dis/2,egret.Ease.sineIn);
        if(fun1)
        {
            if(wait)
                tw.wait(wait);
            tw.call(fun1,thisObj)
        }

    }
    public behitMoveBack(a,b,fun1?,thisObj?){
        //b.parent.addChild(b);
        var tw:egret.Tween = egret.Tween.get(b);
        var dis = this.getDis(a,b);
        var rate = (dis + 50)/dis;
        var x = a.x + (b.x - a.x)*rate;
        var y = a.y + (b.y - a.y)*rate;
        var oo = {x:x,y:y};
        tw.to(oo, 100);
        if(fun1)
            tw.call(fun1,thisObj)
        return oo;
    }

    public skillMV(a,fun1?,thisObj?){
        a.parent.addChild(a);
        var tw:egret.Tween = egret.Tween.get(a);
        tw.to({scaleX:1.2,scaleY:1.2}, 200);
        if(fun1)
            tw.call(fun1,thisObj);
        tw.to({scaleX:1,scaleY:1}, 200);
    }


    //转角度，由A指向B，A原来是指向Y轴
    private getRota(begin,end){
        return Math.atan2(end.y - begin.y,end.x - begin.x)* 180/3.14 + 90
    }

    //*********************************************************  mv ************************************

    private getMVKey(key){
        return 'skill' + parseInt(key);
    }
    public playOnItem(key,item,fun?,thisObj?,xy?){
        var AM = AniManager.getInstance();
        var mv = AM.getAniOnce(this.getMVKey(key),fun,thisObj);
        if(xy)
        {
            mv.x = xy.x;
            mv.y = xy.y;
        }
        else
        {
            mv.x = item.x;
            mv.y = item.y;
        }
        item.parent.addChild(mv);
        var config = AM.mvConfig[key]
        if(config)
        {
            if(config.scale)
            {
                mv.scaleX = mv.scaleY = config.scale;
            }
            if(config.frameRate)
                mv.frameRate = config.frameRate;
        }
        return mv;
    }

    public playBullet(id,from,to,fun?,thisObj?){
        var AM = AniManager.getInstance();
        var mc = AM.getAni(this.getMVKey(id));
        var dis = this.getDis(from,to);
        mc.x = from.x;
        mc.y = from.y;
        mc.rotation = this.getRota(from,to);
        from.parent.addChild(mc);
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.to({y:to.y,x:to.x}, 0.5*dis,egret.Ease.sineIn).call(function(){
            MyTool.removeMC(mc);
            AM.removeMV(mc);
            if(fun)
                fun.apply(thisObj);
        });
    }
}