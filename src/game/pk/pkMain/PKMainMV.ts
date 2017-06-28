class PKMainMV {
    private static _instance:PKMainMV;

    public static getInstance():PKMainMV {
        if (!this._instance)
            this._instance = new PKMainMV();
        return this._instance;
    }


    //移向指定玩家
    public moveToTarget(a,b,fun1?,thisObj?,waitCD?){
        a.parent.addChild(a);
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        var dis = MyTool.getDis(a,b);
        var rate = 100/dis;
        var x = b.x - (b.x - a.x)*rate;
        var y = b.y - (b.y - a.y)*rate;
        var oo = {x:x,y:y};
        if(waitCD)
            tw.wait(waitCD)
        tw.to(oo, Math.pow(dis-100,0.8) * 3,egret.Ease.sineIn);
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
        a.moving = true;
        tw.to(b, Math.pow(dis,0.8) * 3.5).call(function(){
            a.moving = false;
            fun1 && fun1.apply(thisObj);
        },thisObj)
    }

    public jumpToXY(a,b,fun1?,thisObj?,wait?,speedRate=1,sp?){       //,frontWait?

        sp = sp || {};
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        a.parent.addChild(a);
        a.jumping = true;
        a.moving = true;
        var dis = Math.max(400*speedRate,MyTool.getDis(a,b));
        //if(frontWait)
        //    tw.wait(frontWait);
        //SoundManager.getInstance().playEffect(SoundConfig.pk_jump);
        if(sp.before)
            tw.wait(sp.before);
        tw.to({x:b.x,y:b.y}, dis*speedRate).call(function(){
            a.jumping = false;
            a.moving = false;
            //SoundManager.getInstance().playEffect(SoundConfig.pk_jump2);
        });
        var tw:egret.Tween = egret.Tween.get(a);
        if(sp.before)
            tw.wait(sp.before);
        tw.to({scaleX:1.3,scaleY:1.3}, dis*2/3*speedRate,egret.Ease.sineOut).to({scaleX:1,scaleY:1}, dis/3*speedRate,egret.Ease.sineIn);
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
        var y = a.y
        tw.to({scaleX:1.1,scaleY:1.1,y:y - 10}, 200);
        if(fun1)
            tw.call(fun1,thisObj);
        tw.to({rotation:- 10}, 100).to({rotation: 10}, 200).to({rotation:0},100)
        if(a.out)
            tw.to({scaleX:0.85,scaleY:0.85,y:y}, 200);
        else
            tw.to({scaleX:1,scaleY:1,y:y}, 200);
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

    public getMVKey(key){
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
        //mc.scaleY = 0.3;
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.to({y:to.y,x:to.x}, 0.8*dis,egret.Ease.sineIn).call(function(){
            //MyTool.removeMC(mc);
            AM.removeMV(mc);
            if(fun)
                fun.apply(thisObj);
        });
    }

    public playBullet2(id,from,to,fun?,thisObj?,xy?){
        var mc = new eui.Image('bullet' + id + '_png');
        if(id == 8)
        {
            mc.anchorOffsetX = 20;
            mc.anchorOffsetY = 30;
        }
        else
        {
            mc.anchorOffsetX = 25;
            mc.anchorOffsetY = 40;
        }
        var baseFrom = from;
        from.parent.addChild(mc);
        if(xy)
        {
            from = xy;
        }

        var dis = MyTool.getDis(from,to);
        mc.x = from.x;
        mc.y = from.y;
        mc.rotation = this.getRota(from,to);
        mc.scaleY = 0.5;
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.to({y:to.y,x:to.x,scaleY:1}, 0.8*dis,egret.Ease.sineIn).call(function(){
            //MyTool.removeMC(mc);
            MyTool.removeMC(mc);
            if(fun)
                fun.apply(thisObj);
        });

        this.playBullet2_(id,baseFrom,to,{
            x:from.x + 30 -15*Math.random(),
            y:from.y + 30 -15*Math.random(),
        },100);
        this.playBullet2_(id,baseFrom,to,{
            x:from.x + 30 -15*Math.random(),
            y:from.y + 30 -15*Math.random(),
        },200);
    }

     //输助
    public playBullet2_(id,from,to,xy?,cd?){
        var mc = new eui.Image('bullet' + id + '_png');
        if(id == 8)
        {
            mc.anchorOffsetX = 20;
            mc.anchorOffsetY = 30;
        }
        else
        {
            mc.anchorOffsetX = 25;
            mc.anchorOffsetY = 40;
        }
        var baseFrom = from;
        if(xy)
        {
            from = xy;
        }

        var dis = MyTool.getDis(from,to);
        mc.x = from.x;
        mc.y = from.y;
        mc.rotation = this.getRota(from,to);
        mc.scaleY = 0.5;
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.wait(cd).call(function(){
            baseFrom.parent.addChild(mc);
        }).to({y:to.y,x:to.x,scaleY:1}, 0.8*dis,egret.Ease.sineIn).call(function(){
            MyTool.removeMC(mc);
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