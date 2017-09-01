class PKMainMV {
    private static _instance:PKMainMV;

    public static getInstance():PKMainMV {
        if (!this._instance)
            this._instance = new PKMainMV();
        return this._instance;
    }

    public speed = false;

    public walkTo(a,oo,fun1?,thisObj?,waitCD?){
        a.parent.addChild(a);
        a.moving = egret.getTimer();
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        var dis = MyTool.getDis(a,oo);
        var cd = dis * (2 + Math.random());
        var step = Math.ceil(cd/150)
        cd = step*150
        var tw2 = egret.Tween.get(a);
        if(waitCD)
        {
            tw.wait(waitCD)
            tw2.wait(waitCD)
        }
        while(step > 0)
        {
            step--;
            tw2.to({scaleX:1.2,scaleY:1.2}, 100,egret.Ease.sineOut).to({scaleX:1,scaleY:1}, 100,egret.Ease.sineIn);
        }
        tw.to(oo, cd).call(function(){
            a.moving = 0;
        });
        if(fun1)
            tw.call(fun1,thisObj)
    }

    private linePool = []
    public drawLine(from,to,team,con?){
         var rect:eui.Rect = this.linePool.pop()
        if(!rect)
        {
            rect = new eui.Rect()
            rect.width = 4
            rect.fillAlpha = 0.5
            rect.anchorOffsetX = 2
        }
        if(con)
            con.addChildAt(rect,0)
        else
            from.parent.addChildAt(rect,0);

        var dis = MyTool.getDis(from,to);

        if(team == 2)
        {
            rect.fillColor = 0x550000;
        }
        else
        {
            rect.fillColor = 0x000055;
        }

        rect.height = 0;
        rect.alpha = 1;
        rect.x = from.x;
        rect.y = from.y;
        rect.rotation = this.getRota(from,to) + 180;
        var tw:egret.Tween = egret.Tween.get(rect);
        tw.to({height:dis},Math.min(300,dis*2)).wait(200).to({alpha:0.3},200).call(function(){
            MyTool.removeMC(rect);
            this.linePool.push(rect)
        },this)
    }


    //移向指定玩家
    public moveToTarget(a,b,fun1?,thisObj?,waitCD?){
        a.parent.addChild(a);
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        var dis = MyTool.getDis(a,b);
        var rate = (a.atkDis || 100)/dis;
        //var rate = 100/dis;
        var x = b.x - (b.x - a.x)*rate;
        var y = b.y - (b.y - a.y)*rate;
        var oo = {x:x,y:y};
        if(waitCD)
            tw.wait(waitCD)
        var cd = Math.pow(dis-(a.atkDis || 100),0.8) * 3;
        if(this.speed)
            cd=2/3*cd
        tw.to(oo, cd,egret.Ease.sineIn);
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
        a.moving = egret.getTimer();
        var cd = Math.pow(dis,0.8) * 3.5;
        if(this.speed)
            cd/=2
        tw.to(b,cd).call(function(){
            a.moving = 0;
            fun1 && fun1.apply(thisObj);
        },thisObj)
    }

    public jumpToXY(a,b,fun1?,thisObj?,wait?,speedRate=1,sp?){       //,frontWait?

        sp = sp || {};
        //egret.Tween.removeTweens(a);
        var tw:egret.Tween = egret.Tween.get(a);
        a.parent.addChild(a);
        a.jumping = egret.getTimer();
        a.moving = egret.getTimer();
        var dis = Math.max(400*speedRate,MyTool.getDis(a,b));
        var cd = dis*speedRate;
        if(this.speed)
            cd/=2
        //if(frontWait)
        //    tw.wait(frontWait);
        //SoundManager.getInstance().playEffect(SoundConfig.pk_jump);
        if(sp.before)
            tw.wait(sp.before);
        tw.to({x:b.x,y:b.y}, cd).call(function(){
            a.jumping = 0;
            a.moving = 0;
            //SoundManager.getInstance().playEffect(SoundConfig.pk_jump2);
        });
        var tw:egret.Tween = egret.Tween.get(a);
        if(sp.before)
            tw.wait(sp.before);
        tw.to({scaleX:1.3,scaleY:1.3}, cd*2/3,egret.Ease.sineOut).to({scaleX:1,scaleY:1}, cd/3,egret.Ease.sineIn);
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
        tw.to({scaleX:1.1,scaleY:1.1,y:y - 10}, this.speed?100:200);
        if(fun1)
            tw.call(fun1,thisObj);
        tw.to({rotation:- 10}, this.speed?50:100).to({rotation: 10}, this.speed?100:200).to({rotation:0},this.speed?50:100)
        if(a.out)
            tw.to({scaleX:0.85,scaleY:0.85,y:y}, this.speed?100:200);
        else
            tw.to({scaleX:1,scaleY:1,y:y}, this.speed?100:200);
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
    public getRota(begin,end){
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
        var cd = 0.8*dis;
        if(this.speed)
            cd=2/3*cd;
        tw.to({y:to.y,x:to.x},cd ,egret.Ease.sineIn).call(function(){
            //MyTool.removeMC(mc);
            AM.removeMV(mc);
            if(fun)
                fun.apply(thisObj);
        });
    }

    public playBullet2(id,from,to,fun?,thisObj?,xy?){
        var AM = AniManager.getInstance();
        var mc = AM.getImg('bullet' + id + '_png');
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
        var cd = 0.8*dis;
        if(this.speed)
            cd=2/3*cd;
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.to({y:to.y,x:to.x,scaleY:1}, cd,egret.Ease.sineIn).call(function(){
            //MyTool.removeMC(mc);
            AM.removeImg(mc);
            if(fun)
                fun.apply(thisObj);
        });

        this.playBullet2_(id,baseFrom,to,{
            x:from.x + 30 -15*Math.random(),
            y:from.y + 30 -15*Math.random(),
        },this.speed?50:100);
        this.playBullet2_(id,baseFrom,to,{
            x:from.x + 30 -15*Math.random(),
            y:from.y + 30 -15*Math.random(),
        },this.speed?100:200);
    }

     //输助
    public playBullet2_(id,from,to,xy?,cd?){
        var AM = AniManager.getInstance();
        var mc = AM.getImg('bullet' + id + '_png');
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
        var mcd = 0.8*dis;
        if(this.speed)
            mcd=2/3*cd;
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.wait(cd).call(function(){
            baseFrom.parent.addChild(mc);
        }).to({y:to.y,x:to.x,scaleY:1}, mcd,egret.Ease.sineIn).call(function(){
            AM.removeImg(mc);
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