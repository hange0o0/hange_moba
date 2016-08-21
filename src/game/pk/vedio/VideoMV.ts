class VideoMV {
    private static _instance:VideoMV;

    public static getInstance():VideoMV {
        if (!this._instance)
            this._instance = new VideoMV();
        return this._instance;
    }

    //通过动画ID，得到要加截的动画项
    public getLoadFormKey(key){
        var arr = [];
         switch(key){
             case 'mv1':
                 arr =  ['skill1'];
                 break;
             case 'mv2':
                 arr =  ['skill2'];
                 break;
             case 'mv3':
                 arr =  ['skill3'];
                 break;
             case 'mv4':
                 arr =  ['skill4'];
                 break;
             case 'mv5':
                 arr =  ['skill5'];
                 break;
             case 'mv6':
                 arr =  ['skill6'];
                 break;
             case 'mv7':
                 arr =  ['skill7'];
                 break;
             case 'mv8':
                 arr =  ['skill8'];
                 break;
             case 'mv9':
                 arr =  ['skill9'];
                 break;
             case 'mv10':
                 arr =  ['skill10'];
                 break;
             case 'mv11':
                 arr =  ['skill11'];
                 break;
             case 'mv12':
                 arr =  ['skill12'];
                 break;
             case 'mv13':
                 arr =  ['skill13'];
                 break;
             case 'mv14':
                 arr =  ['skill14'];
                 break;
             case 'mv15':
                 arr =  ['skill15'];
                 break;
             case 'mv16':
                 arr =  ['skill16'];
                 break;
             case 'mv17':
                 arr =  ['skill17'];
                 break;
             case 'mv18':
                 arr =  ['skill18'];
                 break;
             case 'mv19':
                 arr =  ['skill19'];
                 break;
             case 'mv20':
                 arr =  ['skill20'];
                 break;
             case 'mv21':
                 arr =  ['skill21'];
                 break;
             case 'mv22':
                 arr =  ['skill22'];
                 break;
             case 'mv23':
                 arr =  ['skill23'];
                 break;
             case 'mv24':
                 arr =  ['skill24'];
                 break;
             case 'mv25':
                 arr =  ['skill25'];
                 break;
             case 'mv26':
                 arr =  ['skill26'];
                 break;
             case 'mv27':
                 arr =  ['skill27'];
                 break;
             case 'mv28':
                 arr =  ['skill28'];
                 break;
             case 'mv29':
                 arr =  ['skill29'];
                 break;
             case 'mv30':
                 arr =  ['skill30'];
                 break;
             case 'mv31':
                 arr =  ['skill31'];
                 break;
             case 'mv32':
                 arr =  ['skill32'];
                 break;
             case 'mv33':
                 arr =  ['skill33'];
                 break;
             case 'mv34':
                 arr =  ['skill34'];
                 break;
             case 'mv35':
                 arr =  ['skill35'];
                 break;
             case 'mv36':
                 arr =  ['skill36'];
                 break;
             case 'mv37':
                 arr =  ['skill37'];
                 break;
             case 'mv38':
                 arr =  ['skill38'];
                 break;
             case 'mv39':
                 arr =  ['skill39'];
                 break;
             case 'mv40':
                 arr =  ['skill36'];
                 break;
         }
        var arr2 = [];
        for(var i=0;i<arr.length;i++)
        {
            var key = arr[i];
            arr2.push(key + '_png')
            arr2.push(key + '_json')
        }
         return arr2;
    }

    //A对B进行普通攻击
    public atk(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.atkMove(a,b,function(){
            self.beAtk(b);
        },fun, thisObj)
    }

    ////leader对已方加成
    //public ls(data,fun,thisObj){
    //    var a = data.atkMC
    //    var b = data.defMCs[0];
    //
    //    var AM = AniManager.getInstance();
    //    var mv = AM.getAniOnce('skill1',function(){
    //        fun.apply(thisObj);
    //    })
    //    mv.x = b.x;
    //    mv.y = b.y;
    //    VideoUI.getInstance().addToGroup(mv);
    //}
    ////leader对敌方加成
    //public le(data,fun,thisObj){
    //    var a = data.atkMC
    //    var b = data.defMCs[0];
    //    var self = this;
    //
    //    var AM = AniManager.getInstance();
    //    var mv = AM.getAniOnce('skill1',function(){
    //        fun.apply(thisObj);
    //    })
    //    mv.x = b.x;
    //    mv.y = b.y;
    //    VideoUI.getInstance().addToGroup(mv);
    //    self.beAtk(b,100);
    //}

    //秒杀动画
    public kill(data,fun,thisObj){
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
        tw.to({x:b.x,y:b.y}, Math.min(MyTool.getDes(a,b),400),egret.Ease.sineIn).call(function(){
            AM.removeMV(mv);
            self.beAtk(b);
        }).wait(100).call(fun,thisObj);
    }

    ////A指向B的魔法
    //public hit1(data,fun,thisObj){
    //    var a = data.atkMC
    //    var b = data.defMCs[0];
    //    var self = this;
    //
    //    var AM = AniManager.getInstance();
    //    var mv = AM.getAni('skill2');
    //    mv.x = a.x;
    //    mv.y = a.y;
    //    mv.rotation = this.getRota(a,b);
    //    VideoUI.getInstance().addToGroup(mv);
    //
    //
    //    var tw:egret.Tween = egret.Tween.get(mv);
    //    tw.to({x:b.x,y:b.y}, Math.min(MyTool.getDes(a,b),400),egret.Ease.sineIn).call(function(){
    //        AM.removeMV(mv);
    //        mv = AM.getAniOnce('skill1',function(){
    //            fun.apply(thisObj);
    //        })
    //        mv.x = b.x;
    //        mv.y = b.y;
    //        VideoUI.getInstance().addToGroup(mv);
    //        self.beAtk(b,100);
    //    })
    //}


    public mv1(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill1',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv2(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill2',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv3(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill3',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv4(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill4',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv5(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill5',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv6(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill6',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv7(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill7',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv8(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill8',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv9(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill9',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv10(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill10',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv11(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill11',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv12(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill12',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv13(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill13',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv14(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill14',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv15(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill15',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv16(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill16',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv17(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill17',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv18(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill18',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv19(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill19',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv20(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill20',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv21(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill21',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv22(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill22',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv23(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill23',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv24(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill24',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv25(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill25',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv26(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill26',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv27(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill27',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv28(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill28',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv29(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill29',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv30(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill30',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv31(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill31',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv32(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill32',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv33(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill33',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv34(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill34',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv35(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill35',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv36(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill36',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv37(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill37',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv38(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill38',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv39(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill39',b,fun,thisObj)
        self.beAtk(b,100);
    }

    public mv40(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.atkMove(a,b,function(){
            self.beAtk(b);
            self.playOnItem('skill36',b,fun,thisObj)
        },fun, thisObj)


        //var mc = new eui.Image();
        //mc.source = 'bullet1_png';
        //mc.anchorOffsetX = 25
        //mc.anchorOffsetY = 25
        //this.playBullet(mc,{x:a.ox,y:a.oy},{x:b.ox,y:b.oy},function(){
        //    self.beAtk(b);
        //    self.playOnItem('skill36',b,fun,thisObj)
        //    //fun.apply(thisObj);
        //})
    }

    //test
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
        tw.to({x:b.x,y:b.y}, Math.min(MyTool.getDes(a,b),400),egret.Ease.sineIn).call(function(){
            //return
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
    //在mc上播放指定动画，播完后回调
    private playOnItem(key,item,fun?,thisObj?){
        var AM = AniManager.getInstance();
        var mv = AM.getAniOnce(key,fun,thisObj);
        mv.x = item.x;
        mv.y = item.y;
        VideoUI.getInstance().addToGroup(mv);
    }

    //子弹模式
    private playBullet(mc,from,to,fun?,cd=300,thisObj?){
        mc.x = from.x;
        mc.y = from.y;
        mc.scaleY = 0.1
        mc.rotation = this.getRota(from,to);
        VideoUI.getInstance().addToGroup(mc);
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.to({y:to.y,x:to.x,scaleY:1.2}, cd).call(function(){
            MyTool.removeMC(mc);
            if(fun)
                fun.apply(thisObj);
        });
    }


    //被攻击动画
    private beAtk(mc,delay=0){
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.wait(delay).to({y:mc.oy - mc.ar*10}, 100).to({y:mc.oy}, 100)
    }

    //移动动画
    private atkMove(a,b,fun1,fun2,thisObj){
        var tw:egret.Tween = egret.Tween.get(a);
        var desX = (a.ox - b.ox)/5;
        tw.to({x:b.ox + desX,y:b.oy + b.ar*100}, 300).call(fun1,thisObj).to({x:a.ox,y:a.oy}, 300).call(fun2, thisObj);
    }

    //转角度，由A指向B，A原来是指向Y轴
    private getRota(begin,end){
        return Math.atan2(end.y - begin.y,end.x - begin.x)* 180/3.14 + 90
    }
}