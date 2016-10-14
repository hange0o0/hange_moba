class VideoMV {
    private static _instance:VideoMV;

    public static getInstance():VideoMV {
        if (!this._instance)
            this._instance = new VideoMV();
        return this._instance;
    }

    //frameRate:默认是12，要变快就加大，慢变就减小
    public mvConfig = {
        'skill102':{scale:2},
        'skill154a':{frameRate:24},
        'skill124':{frameRate:24,scale:1.5},
        'skill176':{frameRate:24}
    };

    private getMVKey(key){
        return key.replace(/[abcdefg_]/g,'');
    }

    //通过动画ID，得到要加截的动画项
    public getLoadFormKey(key,temp?){
        var arr = [];
        var data = {
            kill:['skill162'],
            mv31:['skill31'],
            mv102:['skill102'],
            mv105_28:['skill105','skill28'],
            mv111:['skill111'],
            mv124:['skill124'],
            mv145:['skill145'],
            mv145_a:['skill145'],
            mv154:['skill154'],
            mv154_a:['skill154'],
            mv176:['skill176'],
            mv2:['skill2']
        };

        if(data[key])
            arr = data[key];
        else if(key == 'mvX' && temp)
            arr =  [temp];


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

    //秒杀动画
    public kill(data,fun,thisObj){
        this.mode_target_mv(data,fun,thisObj,'skill162');
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

    //喷毒
    public mv31(data,fun,thisObj){
        this.mode_move_mv_back(data,fun,thisObj,'skill31');
    }

    //雷击
    public mv102(data,fun,thisObj){
        this.mode_w_mv(data,fun,thisObj,'skill102');
    }


    //毒气刺激
    public mv111(data,fun,thisObj){
        this.mode_w_mv(data,fun,thisObj,'skill111');
    }

    //电魂召唤
    public mv105_28(data,fun,thisObj){
        var mv = this.mode_umv_mmv_tmv(data,fun,thisObj,'skill105','skill105','skill28');
        var tw:egret.Tween = egret.Tween.get(mv);
        mv.scaleX = mv.scaleY = 2;
        mv.alpha = 0.5;
        tw.to({scaleX:1,scaleY:1,alpha:1}, 300)
    }



    //愤怒一击
    public mv145(data,fun,thisObj){
        this.mode_w_mv_atk(data,fun,thisObj,'skill145');
    }
    //怒火中烧
    public mv145_a(data,fun,thisObj){
        this.mode_w_mv(data,fun,thisObj,'skill145');
    }

    //静电场/ 电之力
    public mv154(data,fun,thisObj){
        this.mode_w_mv(data,fun,thisObj,'skill154');
    }

    //净化
    public mv154_a(data,fun,thisObj){
        this.mode_atk_mv(data,fun,thisObj,'skill154a');
    }

    //心灵控制
    public mv124(data,fun,thisObj){
        this.mode_w_mv(data,fun,thisObj,'skill124');
    }
    //public mv176(data,fun,thisObj){
    //    this.mode_w_mv(data,fun,thisObj,'skill176');
    //}

    //-----------------------------------------------------------------------------------------------------------------------------
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
            self.playOnItem('skill102',b,function(){
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

    //静电场 / 电之力
    public mv15(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function(){
            for(var i=0;i<data.defMCs.length;i++)
            {
                self.testBeAtkTarget(data,data.defMCs[i],100);
                self.playOnItem('skill154',data.defMCs[i],fun,thisObj);
                fun = null;
            }
        });
    }
    //人鱼快打
    public mv16(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function() {
            self.moveToPlayer(a, b, function () {
                self.playOnItem('skill136', b, function () {

                }, thisObj)
                self.moveBack(a, fun, thisObj)
                self.testBeAtkTarget(data, b, 100);
            }, thisObj)
        });
    }

    public mv17(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function() {
            self.moveToPlayer(a, b, function () {
                self.playOnItem('skill137', b, function () {

                }, thisObj)
                self.moveBack(a, fun, thisObj)
                self.testBeAtkTarget(data, b, 100);
            }, thisObj)
        });
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

    public mvX(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.playOnItem(data.mvname,b,fun,thisObj)
        self.testBeAtkTarget(data,b,100);
        self.showSkillName(a,data.skillVO.name)
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

    //*************************   技能模板    *****************************
    //移动过去播放动画后返回
    private mode_move_mv_back(data,fun,thisObj,skillName){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;
        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function() {
            self.moveToPlayer(a, b, function () {
                self.playOnItem(skillName, b, function () {
                    self.testBeAtkTarget(data, b, 100);
                    self.moveBack(a, fun, thisObj)
                }, thisObj);
            }, thisObj)
        });
    }
    //攻击后在对方身上播动画
    private mode_atk_mv(data,fun,thisObj,skillName){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;

        this.atkMove(a,b,function(){
            self.playOnItem(skillName, b)
            self.testBeAtkTarget(data,b,100);
        },fun, thisObj)
    }

    //显示文字后在目标身上播放动画
    private mode_w_mv(data,fun,thisObj,skillName){
        var a = data.atkMC
        var self = this;
        self.showSkillName(a,data.skillVO.name,data.skillVO.type,function(){
            for(var i=0;i<data.defMCs.length;i++)
            {
                self.testBeAtkTarget(data,data.defMCs[i],100);
                self.playOnItem(skillName,data.defMCs[i],fun,thisObj);
                fun = null;
            }
        });
    }

    //播动画后移动攻击
    private mode_w_mv_atk(data,fun,thisObj,skillName){
        var a = data.atkMC
        var b = data.defMCs_e[0];
        var self = this;
        self.showSkillName(a,data.skillVO.name,data.skillVO.type);
        self.playOnItem(skillName,a,function(){
            this.atkMove(a,b,function(){
                self.testBeAtkTarget(data,b);
            },fun, thisObj)
        },this);


    }

    //在目标身上播放动画
    private mode_target_mv(data,fun,thisObj,skillName){
        var self = this;
        for(var i=0;i<data.defMCs.length;i++)
        {
            self.testBeAtkTarget(data,data.defMCs[i],100);
            self.playOnItem(skillName,data.defMCs[i],fun,thisObj);
            fun = null;
        }
    }

    //在使用者身上播放动画，然后移向目标，再在目标身上播放动画
    private mode_umv_mmv_tmv(data,fun,thisObj,s1,s2,s3){
        var a = data.atkMC
        var b = data.defMCs_e[0];
        var self = this;

        return self.playOnItem(s1,a,function(){
            var AM = AniManager.getInstance();
            var mv = AM.getAni(s2);
            self.playBullet(mv,a,b,function(){
                self.playOnItem(s3,b,fun,thisObj);
                self.testBeAtkTarget(data,b);
            })
        });
    }

    //*************************   通用的动画方法    *****************************
    //在mc上播放指定动画，播完后回调
    private playOnItem(key,item,fun?,thisObj?){
        var AM = AniManager.getInstance();
        var mv = AM.getAniOnce(this.getMVKey(key),fun,thisObj);
        mv.x = item.x;
        mv.y = item.y;
        VideoUI.getInstance().addToGroup(mv);
        var config = this.mvConfig[key]
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

    //子弹模式
    private playBullet(mc,from,to,fun?,cd=300,thisObj?){
        mc.x = from.x;
        mc.y = from.y;
        mc.rotation = this.getRota(from,to);
        VideoUI.getInstance().addToGroup(mc);
        var tw:egret.Tween = egret.Tween.get(mc);
        tw.to({y:to.y,x:to.x}, cd).call(function(){
            MyTool.removeMC(mc);
            if(fun)
                fun.apply(thisObj);
        });
    }
    //子弹模式
    private playBulletScale(mc,from,to,fun?,cd=300,thisObj?){
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
        },this);
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