class VideoMV {
    private static _instance:VideoMV;

    public static getInstance():VideoMV {
        if (!this._instance)
            this._instance = new VideoMV();
        return this._instance;
    }

    //frameRate:默认是12，要变快就加大，慢变就减小
    public mvConfig = {
        '6':{frameRate:24},
        '33':{scale:1.5},
        '102':{scale:2},
        '124':{frameRate:24,scale:1.5},
        '154a':{frameRate:24},
        '166':{frameRate:24,scale:1.5},
        '176':{frameRate:24}
    };

    private getMVKey(key){
        return 'skill' + parseInt(key);
    }

    //通过动画ID，得到要加截的动画项
    public getLoadFormKey(key,temp?){
        var arr = [];
        var data = {
            kill:['skill162'],
            reborn:['skill32'],
            //mv6:['skill6'],
            //mv31:['skill31'],
            //mv32:['skill32'],
            //mv33:['skill33'],
            //mv102:['skill102'],
            mv105_28:['skill105','skill28']
            //mv111:['skill111'],
            //mv124:['skill124'],
            //mv145:['skill145'],
            //mv145_a:['skill145'],
            //mv154:['skill154'],
            //mv154_a:['skill154'],
            //mv176:['skill176'],
            //mv166:['skill166'],
            //mv2:['skill2']
        };

        if(data[key])
            arr = data[key];
        else if(key == 'mvX' && temp)
            arr =  [temp];
        else
        {
            var mvArr = key.split('|')
            mvArr.shift();
            for(var i=0;i<mvArr.length;i++)
            {
                var word = parseInt(mvArr[i]);
                if(word)
                    arr.push('skill' + word);
            }
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



    public showSkillMV(data,fun,thisObj){
        var a = data.atkMC
        var b = data.defMCs[0];
        var self = this;
        var mvArr = data.mv.split('|')
        switch(mvArr[0])
        {
            case 'atk':
                this.atkMove(a,b,function(){
                    self.testBeAtkTarget(data,b);
                },fun, thisObj)
                break;
            case 'kill':
                this.mode_target_mv(data,fun,thisObj,'162');
                break;
            case 'mvw':
                self.showSkillName(b,data.skillVO.name,0,fun,thisObj)
                break;
            case 'atkw':
                self.showSkillName(a,data.skillVO.name,0,function(){
                    self.atkMove(a,b,function(){
                        self.testBeAtkTarget(data,b);
                    },fun, thisObj)
                })
                break;
            case 'mvX':
                this.playOnItem(data.mvname,b,fun,thisObj)
                self.testBeAtkTarget(data,b,100);
                self.showSkillName(a,data.skillVO.name)
                break;
            case 'die':
                this.dieMV(data,fun,thisObj)
                break;
            case 'reborn':
                this.rebornMV(data,fun,thisObj)
                break;
            case 'mv0':
                fun.apply(thisObj);
                break;
            case 'atk_mv':
                this.mode_atk_mv(data,fun,thisObj,mvArr[1]);
                break;
            case 'move_mv_back':
                this.mode_move_mv_back(data,fun,thisObj,mvArr[1]);
                break;
            case 'wmv':
                this.mode_wmv(data,fun,thisObj,mvArr[1]);
                break;
            case 'w_mv':
                this.mode_w_mv(data,fun,thisObj,mvArr[1]);
                break;
            case 'w_mv_atk':
                this.mode_w_mv(data,fun,thisObj,mvArr[1]);
                break;
            default:
                if(this[mvArr[0]])
                    this[mvArr[0]](data,fun,thisObj);
                else
                    console.debug('no mv:' + mvArr[0])
                break;
        }
    }

    //死的动画
    public dieMV(data,fun,thisObj){

        for(var i=0;i<data.defMCs.length;i++)
        {
            var a = data.defMCs[i];
            var tw:egret.Tween = egret.Tween.get(a);
            var x = a.ox;
            tw.to({x:x - 30}, 30).to({x:x + 20}, 50).to({x:x - 10}, 30).to({x:x}, 10).to({alpha:0}, 300);
            if(i==0)
                tw.call(fun,thisObj);
        }

    }
    //复活的动画
    public rebornMV(data,fun,thisObj){
        for(var i=0;i<data.defMCs.length;i++)
        {
            var a = data.defMCs[i];
            var tw:egret.Tween = egret.Tween.get(a);
            tw.wait(200).to({alpha:1}, 300)
            this.mode_wmv(data,fun,thisObj,'32')
            if(i==0)
                tw.call(fun,thisObj);
        }
    }


    //电魂召唤
    public mv105_28(data,fun,thisObj){
        var mv = this.mode_umv_mmv_tmv(data,fun,thisObj,'skill105','skill105','skill28');
        var tw:egret.Tween = egret.Tween.get(mv);
        mv.scaleX = mv.scaleY = 2;
        mv.alpha = 0.5;
        tw.to({scaleX:1,scaleY:1,alpha:1}, 300)
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

    //播动画并显示文字
    private mode_wmv(data,fun,thisObj,skillName){
        var a = data.atkMC
        var self = this;
        for(var i=0;i<data.defMCs.length;i++)
        {
            self.testBeAtkTarget(data,data.defMCs[i],100);
            self.playOnItem(skillName,data.defMCs[i],fun,thisObj);
            fun = null;
        }
        self.showSkillName(a,data.skillVO.name,data.skillVO.type);
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
        var self = this;
        if(delay)
        {

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
            else if(player.mid == 5)
            {
                var tw:egret.Tween = egret.Tween.get(player.displayMC);
                //tw.to({x:mc.ox,y:mc.oy}, 100).call(self.moveBack,this,player.displayMC)
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
        tw.to({x:a.ox,y:a.oy}, 300)
            if(fun1)
                tw.call(fun1, thisObj);
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