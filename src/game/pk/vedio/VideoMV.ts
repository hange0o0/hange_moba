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
                 arr =  ['skill31'];
                 break;
             case 'mv2':
                 arr =  ['skill35'];
                 break;
             case 'mv3':
                 arr =  ['skill31'];
                 break;
             case 'mv4':
                 arr =  ['skill10','skill28','skill35'];
                 break;
             case 'mv5':
                 arr =  ['skill28'];
                 break;
             case 'mv6':
                 arr =  ['skill5'];
                 break;
             case 'mv7':
                 arr =  ['skill32'];
                 break;
             case 'mv8':
                 arr =  ['skill33'];
                 break;
             case 'mv9':
                 arr =  ['skill27'];
                 break;
             case 'mv10':
                 arr =  ['skill30'];
                 break;
             case 'mv11':
                 arr =  ['skill38'];
                 break;
             case 'mv12':
                 arr =  ['skill14'];
                 break;
             case 'mv13':
                 arr =  [];
                 break;
             case 'mv14':
                 arr =  ['skill23'];
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
            self.testBeAtkTarget(data,b);
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
    //    self.testBeAtkTarget(data,b,100);
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
            self.testBeAtkTarget(data,b);
        }).wait(100).call(fun,thisObj);
    }

    //显示文本
    public mvw(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;
        self.showSkillName(b,data.skillVO.name,0,fun,thisObj)
    }

    //普字后进行普攻
    public atkw(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;
        self.showSkillName(a,data.skillVO.name,0,function(){
            self.atkMove(a,b,function(){
                self.testBeAtkTarget(data,b);
            },fun, thisObj)
        })
    }

    //喷毒 移过去播放毒液动画然后回来
    public mv1(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;
        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function() {
            self.moveToPlayer(a, b, function () {
                self.playOnItem('skill31', b, function () {
                    self.testBeAtkTarget(data, b, 100);
                    self.moveBack(a, fun, thisObj)
                }, thisObj);
            }, thisObj)
        });
    }

    //显示技能名，并在所有目标身上播放增益光效
    public mv2(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;
        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function(){
            for(var i=0;i<data.defMCs.length;i++)
            {
                self.testBeAtkTarget(data,data.defMCs[i],100);
                self.playOnItem('skill35',data.defMCs[i],fun,thisObj);
                fun = null;
            }
        });

    }
    //显示技能名，并在目标身上播放debuff光效
    public mv3(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function(){
            for(var i=0;i<data.defMCs.length;i++)
            {
                self.testBeAtkTarget(data,data.defMCs[i],100);
                self.playOnItem('skill31',data.defMCs[i],fun,thisObj);
                fun = null;
            }
        });
    }

    //电老头绝技   技能效果由A冲向B，对自己增益，对方debuff
    public mv4(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs_e[0];
        var self = this;

        self.playOnItem('skill35',a,function(){
            var AM = AniManager.getInstance();
            var mv = AM.getAni('skill10');
            self.playBullet(mv,a,b,function(){
                self.playOnItem('skill28',b,fun,thisObj);
                self.testBeAtkTarget(data,b);
            })
        });

    }

    //电老头爆击  冲过去放技能后返回
    public mv5(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.moveToPlayer(a,b,function(){
            self.playOnItem('skill28',b,function(){
            },thisObj);
            self.testBeAtkTarget(data,b,100);
            self.moveBack(a,fun,thisObj)
        }, thisObj)
    }

    //移动过去物攻，有物攻光效
    public mv6(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function() {
            self.moveToPlayer(a, b, function () {
                self.playOnItem('skill5', b, function () {

                }, thisObj).frameRate = 24//技能动画变快;
                self.moveBack(a, fun, thisObj)
                self.testBeAtkTarget(data, b, 100);
            }, thisObj)
        });
    }

    //复活目标
    public mv7(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill32',b,fun,thisObj);
        self.showSkillName(a,data.skillVO.name,data.skillVO.type);
        self.testBeAtkTarget(data,b,100);
    }

    //亡语效果
    public mv8(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill33',b,fun,thisObj)
        self.showSkillName(a,data.skillVO.name,data.skillVO.type);
        self.testBeAtkTarget(data,b,100);
    }

    //风刃 堕天使的大绝
    public mv9(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs_e[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function() {
            self.playOnItem('skill27', b, fun, thisObj)
            self.testBeAtkTarget(data, b, 200);
            self.testBeAtkTarget(data, a, 200);
        });

    }

    //加目标加血
    public mv10(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function() {
            for(var i=0;i<data.defMCs.length;i++)
            {
                self.testBeAtkTarget(data,data.defMCs[i],100);
                self.playOnItem('skill30',data.defMCs[i],fun,thisObj);
                fun = null;
            }
        });
    }


    //绿色光球 净化
    public mv11(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function() {
            self.playOnItem('skill38', b, fun, thisObj)
            self.testBeAtkTarget(data, b, 200);
        });
    }

    // 在目标身上播放转圈的效果 水盾
    public mv12(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function() {
            self.playOnItem('skill14', b, fun, thisObj)
            self.testBeAtkTarget(data, b, 200);
        });
    }

    //升空，变大一下
    public mv13(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        var tw:egret.Tween = egret.Tween.get(a);
        tw.to({scaleX:a.scaleX*1.2,scaleY:a.scaleY*1.2}, 200).wait(200).
            to({scaleX:a.scaleX,scaleY:a.scaleY}, 300).call(fun,thisObj);

    }

    //晕技
    public mv14(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function(){
            for(var i=0;i<data.defMCs.length;i++)
            {
                self.testBeAtkTarget(data,data.defMCs[i],100);
                self.playOnItem('skill23',data.defMCs[i],fun,thisObj);
                fun = null;
            }
        });
    }

    public mv15(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill15',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv16(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill16',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv17(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill17',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv18(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill18',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv19(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill19',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv20(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill20',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv21(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill21',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv22(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill22',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv23(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill23',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv24(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill24',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv25(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill25',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv26(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill26',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv27(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill27',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv28(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill28',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv29(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill29',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv30(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill30',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv31(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill31',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv32(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill32',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv33(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill33',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv34(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill34',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv35(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill35',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv36(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill36',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv37(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill37',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv38(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill38',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
    }

    public mv39(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem('skill39',b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
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
           self.testBeAtkTarget(data,b,100);
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
        return mv;
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

    //对被攻击目标进行处理
    private testBeAtkTarget(data,mc,delay = 0){
        var defData = data.defender[mc.playerData.id]
        if(!defData)
            return;
        if(delay)
        {
            var self = this;
            var tw:egret.Tween = egret.Tween.get(mc);
            tw.wait(delay).call(function(){
                self.testBeAtkTarget(data,mc);
            })
            return;
        }
        var VC = VideoCode.getInstance();
        if(defData.miss)//闪掉
        {
            this.showWord(mc,'闪避',1)
        }
        if(defData.nohurt)//不死
        {
            var player = VC.getPlayerByID(defData.nohurt)
            if(!player)
            {
                this.showWord(mc,'不死',1)
            }
            else if(player.mid == 1)
                this.showWord(mc,'本命牌',1);
            else if(defData.mid == 5)
            {
                var tw:egret.Tween = egret.Tween.get(player.displayMC);
                tw.to({x:mc.ox,y:mc.oy}, 100).call(function(){
                    self.moveBack(player.displayMC)
                })
            }
            else
                this.showWord(mc,'不死',1)
        }
        if(defData.hp)
        {
            this.showHPChange(mc,defData.hp);
            if(defData.hp < 0)
            {

                if(VC.getPlayerByID(data.atker).teamID != VC.getPlayerByID(mc.playerData.id).teamID)//
                {
                      this.beAtk(mc);
                }
            }
        }
    }

    //移动到目标后返回
    private atkMove(a,b,fun1,fun2,thisObj?){
        var tw:egret.Tween = egret.Tween.get(a);
        this.moveToPlayer(a,b,function(){
            fun1.apply(thisObj);
            this.moveBack(a,fun2,thisObj);
        },thisObj);

        //var desX = (a.ox - b.ox)/5;
        //tw.to({x:b.ox + desX,y:b.oy + b.ar*100}, 300).call(fun1,thisObj).to({x:a.ox,y:a.oy}, 300).call(fun2, thisObj);
    }

    //移向指定玩家
    private moveToPlayer(a,b,fun1,thisObj?){
        var tw:egret.Tween = egret.Tween.get(a);
        var desX = (a.ox - b.ox)/5;
        tw.to({x:b.ox + desX,y:b.oy + b.ar*100*Math.abs(b.scaleY)}, 300).call(fun1,thisObj)
    }

    //移动动画，移到中场
    private moveMiddle(a,fun1,thisObj?){
        var tw:egret.Tween = egret.Tween.get(a);
        tw.to({x:320,y:250}, 300).call(fun1,thisObj);
    }

    //移动到原来的位置
    private moveBack(a,fun1?,thisObj?){
        var tw:egret.Tween = egret.Tween.get(a);
        tw.to({x:a.ox,y:a.oy}, 300).call(fun1, thisObj);
    }

    //转角度，由A指向B，A原来是指向Y轴
    private getRota(begin,end){
        return Math.atan2(end.y - begin.y,end.x - begin.x)* 180/3.14 + 90
    }

    //表现血量改变
    public showHPChange(item,value){
        if(!value)
            return;
         var txt = new eui.BitmapLabel();

        if(value > 0)
        {
            txt.font = 'font_num1_fnt'
            txt.text = '+' + value;
        }
        else
        {
            txt.font = 'font_num1_fnt'
            txt.text = '' + value;
        }
        VideoUI.getInstance().addToGroup(txt);
        txt.x = item.ox - txt.width/2;
        txt.y = item.oy - 50;


        var tw:egret.Tween = egret.Tween.get(txt);
        tw.to({y:txt.y - 50}, 200).wait(500).to({alpha:0}, 200).call(function(){
            MyTool.removeMC(txt);
        });
    }

    //表现技能名字 (在人物头上冒字),type为1是绝招，不显示文本
    public showSkillName(item,value,type?,fun?,thisObj?){
        if(!value || type == 1)
        {
            if(fun)
                fun.apply(thisObj);
            return;
        }

        var txt = new eui.Label();

        txt.text = '' + value;
        txt.stroke = 2;
        if(type == 1)
            txt.textColor = 0xFFF000;
        VideoUI.getInstance().addToGroup(txt);
        txt.x = item.ox - txt.width/2;
        txt.y = item.oy - 50;

        var tw:egret.Tween = egret.Tween.get(txt);
        tw.to({y:txt.y - 50}, 200).wait(500).call(function(){
            MyTool.removeMC(txt);
            if(fun)
                fun.apply(thisObj);
        }).to({y:txt.y - 100,alpha:0}, 200);
    }

    //表现技能名字 (在人物头上冒字),突显渐消
    public showWord(item,value,type?,fun?,thisObj?){
        if(!value)
        {
            if(fun)
                fun.apply(thisObj);
            return;
        }

        var txt = new eui.Label();

        txt.text = '' + value;
        txt.stroke = 2;
        if(type == 1)
            txt.textColor = 0xFFF000;
        VideoUI.getInstance().addToGroup(txt);
        txt.x = item.ox - txt.width/2;
        txt.y = item.oy - 50;

        var tw:egret.Tween = egret.Tween.get(txt);
        tw.wait(500).to({alpha:0}, 200).call(function(){
            MyTool.removeMC(txt);
            if(fun)
                fun.apply(thisObj);
        });
    }
}