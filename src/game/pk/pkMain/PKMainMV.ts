class PKMainMV {
    private static _instance:PKMainMV;

    public static getInstance():PKMainMV {
        if (!this._instance)
            this._instance = new PKMainMV();
        return this._instance;
    }


    //移向指定玩家
    public moveToTarget(a,b,fun1?,thisObj?){
        a.parent.addChild(a);
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        var dis = MyTool.getDis(a,b);
        var rate = 100/dis;
        var x = b.x - (b.x - a.x)*rate;
        var y = b.y - (b.y - a.y)*rate;
        var oo = {x:x,y:y};
        tw.to(oo, Math.pow(dis-100,0.8) * 3);
        if(fun1)
            tw.call(fun1,thisObj)
        return oo;
    }

    public moveToXY(a,b,fun1?,thisObj?,frontWait?){
        //a.parent.addChild(a);
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        var dis = MyTool.getDis(a,b);
        if(frontWait)
            tw.wait(frontWait);
        tw.to(b, Math.pow(dis,0.8) * 4);
        if(fun1)
            tw.call(fun1,thisObj)
    }

    public jumpToXY(a,b,fun1?,thisObj?,wait?){       //,frontWait?

        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        a.parent.addChild(a);
        a.jumping = true;
        var dis = Math.max(400,MyTool.getDis(a,b));
        //if(frontWait)
        //    tw.wait(frontWait);
        SoundManager.getInstance().playEffect(SoundConfig.pk_jump);
        tw.to({x:b.x,y:b.y}, dis).call(function(){
            a.jumping = false;
            //SoundManager.getInstance().playEffect(SoundConfig.pk_jump2);
        });
        var tw:egret.Tween = egret.Tween.get(a);
        tw.to({scaleX:1.3,scaleY:1.3}, dis/2,egret.Ease.sineOut).to({scaleX:1,scaleY:1}, dis/2,egret.Ease.sineIn);
        if(fun1)
        {

            if(wait)
                tw.wait(wait);
            tw.call(fun1,thisObj)
        }

    }
    public behitMoveBack(a,b,fun1?,thisObj?){
        //b.parent.addChild(b);
        //egret.Tween.removeTweens(b);
        var tw:egret.Tween = egret.Tween.get(b);
        var dis = MyTool.getDis(a,b);
        var rate = (dis + 50)/dis;
        var x = a.x + (b.x - a.x)*rate;
        var y = a.y + (b.y - a.y)*rate;
        var oo = {x:x,y:y};

        var rate = (dis + 60)/dis;
        var x = a.x + (b.x - a.x)*rate;
        var y = a.y + (b.y - a.y)*rate;
        var oo2 = {x:x,y:y};
        tw.to(oo2, 100).to(oo, 50);
        if(fun1)
            tw.call(fun1,thisObj)
        return oo;
    }

    public behitMV(a,fun1?,thisObj?){
        //b.parent.addChild(b);
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        tw.to({x:a.x - 10}, 60).to({x:a.x + 5}, 30).to({x:a.x}, 20);
        if(fun1)
            tw.call(fun1,thisObj)
    }

    public skillMV(a,fun1?,thisObj?){
        a.parent.addChild(a);
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        tw.to({scaleX:1.2,scaleY:1.2}, 200);
        if(fun1)
            tw.call(fun1,thisObj);
        tw.to({scaleX:1,scaleY:1}, 200);
    }

    //退后再前进
    public skillMV2(a,b,fun1?,thisObj?){
        a.parent.addChild(a);
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        var dis = MyTool.getDis(a,b);
        var rate = (dis + 30)/dis;
        var x = b.x + (a.x - b.x)*rate;
        var y = b.y + (a.y - b.y)*rate;
        var oo = {x:x,y:y};
        tw.to(oo, 100)
        if(fun1)
            tw.call(fun1,thisObj)

        var oo2 = {x:a.x,y:a.y};
        tw.to(oo2, 80)
    }


    //转角度，由A指向B，A原来是指向Y轴
    private getRota(begin,end){
        return Math.atan2(end.y - begin.y,end.x - begin.x)* 180/3.14 + 90
    }

    //a指向b,dd+为前进，-为后退
    public getDisPoint(a,b,dd){
        var dis = MyTool.getDis(a,b);
        var rate = (dis - dd)/dis;
        var x = b.x + (a.x - b.x)*rate;
        var y = b.y + (a.y - b.y)*rate;
        return {x:x,y:y};
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

        this.playSkillSound(key);
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

    public playBullet(id,from,to,fun?,thisObj?,xy?){
        var AM = AniManager.getInstance();
        var mc = AM.getAni(this.getMVKey(id));
        from.parent.addChild(mc);
        if(xy)
        {
            from = xy;
        }

        var dis = MyTool.getDis(from,to);
        mc.x = from.x;
        mc.y = from.y;
        mc.rotation = this.getRota(from,to);
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.to({y:to.y,x:to.x}, 0.5*dis,egret.Ease.sineIn).call(function(){
            //MyTool.removeMC(mc);
            AM.removeMV(mc);
            if(fun)
                fun.apply(thisObj);
        });
    }

    public playSkillSound(id){
        var soundID = AniManager.getInstance().mvSoundConfig[id];
        if(soundID)
        {
            SoundManager.getInstance().playEffect('pk_effect' + soundID);
        }
        //else if(Config.isDebug)
        //    console.log('no Sound:' + id);
    }
}