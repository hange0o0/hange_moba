class VideoUI extends game.BaseUI {
    private static instance: VideoUI;
    public static getInstance() {
        if(!this.instance) this.instance = new VideoUI();
        return this.instance;
    }

    private bg: eui.Image;
    private enemyItem: VideoItem;
    private selfItem: VideoItem;
    private itemGroup: eui.Group;
    private jumpBtn: eui.Button;
    private skillGroup: eui.Group;
    private skillName: eui.Label;



    private skiller1;
    private skiller2;

    private enemyItems = []
    private selfItems = []

    private stageHeight;
    private itemWidth = 114;
    private itemHeight = 110;
    private itemY1 = 380
    private itemY2 = 120


    private currentAction;
    private skillData;
    private timer;

    public debugData;

    public constructor() {
        super();
        this.skinName = "VideoUISkin";
    }

    public addToGroup(mc,index = -1){
        if(index == -1)
            this.itemGroup.addChild(mc);
        else
            this.itemGroup.addChildAt(mc,index);
    }


    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.jumpBtn,this.onClose)
        //this.topUI.addEventListener('hide',this.onClose,this);

        for(var i=0;i<3;i++)
        {
            var item = this.newItem(i)
            this.selfItems.push(item)
            if(i == 0)
            {
                item.scaleX = item.scaleY = 1.2;
                item.y = this.itemY1;
            }
            else
                item.y = 480;
            item.oy = item.y;
            item.ar = -1;

            var item = this.newItem(i)
            this.enemyItems.push(item)
            if(i == 0)
            {
                item.scaleX = item.scaleY = 1.2;
                item.y = this.itemY2;
            }
            else
                item.y = 20;
            item.oy = item.y;
            item.ar = 1;
        }

        this.selfItem.index = 1;
        this.enemyItem.index = 2;

    }

    private newItem(index){
        var item = new PKItem();
        item.anchorOffsetX = this.itemWidth/2;
        item.anchorOffsetY = this.itemHeight/2;
        if(index == 0)
            item.x = 320;
        else if(index == 1)
            item.x = 190;
        else
            item.x = 450;
        item.ox = item.x;
        this.itemGroup.addChild(item);

        return item;
    }


    private onClose(){
        this.hide();
        egret.Tween.removeAllTweens();
        egret.clearTimeout(this.timer);
    }

    public showMVDebug(data){
        var self = this;
        var mvType = data.mv
        var group = VideoMV.getInstance().getLoadFormKey(mvType,data.mvname)
        if(group.length == 0)
            this.LoadFiles = [];
        else
        {
            RES.createGroup('skill_ani',group,true);
            this.LoadFiles = ['skill_ani'];
        }


        this.debugData = data;
        //this.showSkillUse(data)
        super.show();


    }


    public show(){
        var group = VideoManager.getInstance().getVideoAniGroup();
        if(group.length == 0)
            this.LoadFiles = [];
        else
        {
            RES.createGroup('skill_ani',group,true);
            this.LoadFiles = ['skill_ani'];
        }
        super.show();
    }

    public onShow(){
        var self = this;
        this.stageHeight = this.stage.stageHeight;
        this.itemGroup.y = ((this.stageHeight - 250-180)-500)/2 + 250
        this.itemGroup.removeChildren();



        var p = this.selfItem.getPlayerXY();
        p = this.itemGroup.globalToLocal(p.x,p.y)
        this.skiller1 = {x:p.x,ox:p.x,y:p.y,oy:p.y}

        var p = this.enemyItem.getPlayerXY();
        p = this.itemGroup.globalToLocal(p.x,p.y)
        this.skiller2 = {x:p.x,ox:p.x,y:p.y,oy:p.y}
        if(this.debugData)
        {
            var data = this.debugData
            data.atkMC = getMCByID(data.atker);
            data.defMCs = [];
            data.defMCs_s = []; //技能者的友方
            data.defMCs_e = []; //技能者的敌方
            for(var i=0;i<data.defender.length;i++)
            {
                var mc = getMCByID(data.defender[i]);
                data.defMCs.push(mc);
                if(Math.abs(data.defender[i] - data.atker) < 10)
                    data.defMCs_s.push(mc);
                else
                    data.defMCs_e.push(mc);
            }
            for(var i=0;i<3;i++)
            {
                this.addToGroup(this.selfItems[i]);
                this.addToGroup(this.enemyItems[i]);
            }
            this.showSkillUse(data)
            return;
        }
        var VM = VideoManager.getInstance();
        //this.topUI.setTitle('第'+(VM.index + 1)+'轮')
        var scene = PKManager.getInstance().getPKBG(VM.type);
        this.bg.source = scene;



        var VC = VideoCode.getInstance()
        VC.initData(VM.baseData);


        this.selfItem.data = VC.player1
        this.enemyItem.data = VC.player2
        this.skillGroup.visible = false;
        //this.enemySkill.text = ''
        //this.selfSkill.text = ''

        if(VM.type == 'test')
            this.hide();

        VC.play(VM.type == 'test');


        function getMCByID(id){
            if(id >= 30)
                return self.enemyItems[id-30]
            return  self.selfItems[id-10]
        }
    }

    //取关联的显示对象
    public getRelateMC(team,index):any{
        if(team == 1)
        {
            if(index < 3)
            {
                this.addToGroup(this.selfItems[index]);
                return this.selfItems[index]
            }
            if(index == 3)
                return this.skiller1;
        }
        else
        {
            if(index < 3)
            {
                this.addToGroup(this.enemyItems[index]);
                return this.enemyItems[index]
            }
            if(index == 3)
                return this.skiller2;
        }
        return null;
    }

    public getPlayer(id){
        return null;
    }

    //玩家回合结束
    public roundOver(){
        var VC = VideoCode.getInstance();
        if(VC.isDebug)
        {
            VC.onMovieOver();
            return;
        }
        this.timer = egret.setTimeout(function(){
            VC.onMovieOver()
        },this,200);
    }

    private onActionOver(){
        if(this.debugData)
            return;
        var VC = VideoCode.getInstance();
        if(!VC.isDebug)
        {
            this.selfItem.showValueChange()
            this.enemyItem.showValueChange()
        }
        //if(this.skillData.diePlayer.length)//有死了的单位
        //{
        //    // {index:this.index,atker:this.atker,skillID:action.skillID,defender:{},diePlayer:[]};
        //    this.skillData.defender =  {};
        //    for(var i=0;i<this.skillData.diePlayer.length;i++)
        //    {
        //        this.skillData.defender[this.skillData.diePlayer[i]] = {}
        //    }
        //    this.skillData.diePlayer = [];
        //    this.skillData.skillID = 'die';
        //    this.playSkill(this.skillData);
        //    return;
        //}

        VC.onMovieOver();
    }

    //根据数据刷新画面
    public renewView(){

    }

    //播放动画序列
    public playSkill(data){
        this.skillData = data;
        var VC = VideoCode.getInstance();
        if(VC.isDebug)
        {
            this.debugShow(data);
            return;
        }

        var MV = VideoMV.getInstance();
        var atker = VC.getPlayerByID(data.atker);
        data.teamID = atker.teamID;
        data.atkMC = atker.displayMC;
        data.defMCs = [];
        for(var s in data.defender)
        {
            data.defMCs.push(VC.getPlayerByID(s).displayMC);
        }
        if(data.skillID == 50)  //攻击
        {
            data.mv = 'atk'
            this.showSkillUse(data);
            //MV.atk(data,this.onActionOver,this)
        }
        else if(data.skillID == 'die')  //死亡动画
        {
            data.mv = 'die'
            this.showSkillUse(data);
        }
        else if(data.skillID == 51)  //秒杀
        {
            this.onActionOver();
        }
        else if(data.skillID == 52)  //回合结束时血量改变
        {
            this.onActionOver();
        }
        else
        {
            if(data.atker >=10)
            {
                var mvo = atker.mvo;
                data.skillVO = mvo.getSkillByID(data.skillID,atker.isPKing)
            }
            else
            {
                // if(data.skillID == 1)//令牌
                // {
                // }
                //else
                // {
                     var VM = VideoManager.getInstance();
                     if(data.atker == 1)
                         data.skillVO = VM.leaderSkill1[data.skillID - 2];
                     else
                         data.skillVO = VM.leaderSkill2[data.skillID - 2];

                 //}
            }
            data.mv = data.skillVO.mv;
            this.showSkillUse(data);
        }
    }

    private showSkillUse(data){
        var self = this;
        var MV = VideoMV.getInstance();
        if(data.skillVO && data.skillVO.type == 1)//主技能
        {
             //if(data.teamID == 1)
                this.skillName.text = data.skillVO.name;
            //else
            //    this.enemySkill.text = data.skillVO.name;
            this.skillGroup.visible = true;
            this.skillGroup.validateNow();
            this.skillGroup.x = -this.skillGroup.width;
            var tw:egret.Tween = egret.Tween.get(this.skillGroup);
            tw.to({x:(640-this.skillGroup.width)/2},200).wait(1200).to({x:640},200).call(playMV);
        }
        else
        {
            playMV();
        }

        function playMV(){
            //if(!MV[data.mv])
            //{
            //    console.debug('no mv:' + data.mv)
            //    MV['mvw'](data,function(){
            //        self.onActionOver();
            //        self.skillGroup.visible = false;
            //    },self)
            //
            //    return;
            //}
            MV.showSkillMV(data,function(){
                self.onActionOver();
                self.skillGroup.visible = false;
            },self)
        }

    }

    //private debugShow(data){
    //    var VC = VideoCode.getInstance();
    //
    //    if(data.atker != 1 && data.atker != 2)
    //        data.atkerW = data.atker+'['+VC.getPlayerByID(data.atker).mvo.id+']'+(VC.getPlayerByID(data.atker).isPKing?'*':'');
    //    data.defList = [];
    //    for(var s in data.defender)
    //    {
    //        var temp = ''
    //        if(data.defender[s].miss)
    //            temp += '【闪】'
    //        if(data.defender[s].nohurt)
    //            temp += '【替】'
    //
    //
    //        if(data.defender[s].stat)
    //        {
    //            temp += '[-'+JSON.stringify(data.defender[s].stat)+'-]'
    //        }
    //
    //        data.defList.push(s + '[' + VC.getPlayerByID(s).mvo.id+']'+(VC.getPlayerByID(s).isPKing?'*':'')  + temp);
    //    }
    //
    //    if(data.skillID == 50)
    //    {
    //        var str = data.atkerW + ' 攻击 ' + data.defList.join(',');
    //    }
    //    else if(data.skillID == 'die')
    //    {
    //        var str = '死亡单位： ' + data.defList.join(',');
    //    }
    //    else if(data.skillID == 51)
    //    {
    //        var str = data.atkerW + ' 秒杀 ' + data.defList.join(',');
    //    }
    //    else if(data.skillID == 52)
    //    {
    //        var str = data.atkerW + ' 回合结束时血量改变 '+ data.defList.join(',');
    //    }
    //    //else if(data.skillID == 53)
    //    //{
    //    //    var str = data.atker +  ' 对 ' + data.defList.join(',') + ' 进行加成';
    //    //}
    //    else
    //    {
    //        var str = data.atkerW + '对' + data.defList.join(',') + '使用技能' + data.skillID ;
    //    }
    //
    //    str += '   ->  hp1 : '+VC.player1.hp + '/' + VC.player1.maxHp+'    hp2 : '+VC.player2.hp + '/' + VC.player2.maxHp
    //
    //    console.log(data.index + ':    '+str);
    //    this.onActionOver();
    //}

    private debugShow(data){
        var VC = VideoCode.getInstance();

        if(data.atker != 1 && data.atker != 2)
            data.atkerW = data.atker+'['+VC.getPlayerByID(data.atker).mvo.id+']'+(VC.getPlayerByID(data.atker).isPKing?'*':'');
        data.defList = [];
        var lastDefender
        for(var i=0;i< data.defender.length;i++)
        {
            var temp = ''
            var ooo = data.defender[i];
            data.defList.push(ooo.defender + '[' + VC.getPlayerByID(ooo.defender).mvo.id+']'+(VC.getPlayerByID(ooo.defender).isPKing?'*':''))
            for(var ii=0;ii<ooo.list.length;ii++)
            {
                var oo = ooo.list[ii];
                switch(oo.key)
                {
                    case 'hp':
                        if(oo.value > 0)
                            data.defList.push('加血'+oo.value);
                        else
                            data.defList.push('扣血'+oo.value);
                        break;
                    case 'mhp':
                        if(oo.value > 0)
                            data.defList.push('总血量+'+oo.value);
                        else
                            data.defList.push('总血量-'+oo.value);
                        break;
                    case 'mp':
                        if(oo.value > 0)
                            data.defList.push('怒气+'+oo.value);
                        else
                            data.defList.push('怒气-'+oo.value);
                        break;
                    case 'miss':
                        data.defList.push('【闪避】');
                        break;
                    case 'nohurt':
                        data.defList.push('【免伤】'+oo.value);
                        break;
                    case 'mmp':
                        if(oo.value > 0)
                            data.defList.push('怒气上限+'+oo.value);
                        else
                            data.defList.push('怒气上限-'+oo.value);
                    case 'stat':
                        data.defList.push(this.changeStat(oo.value));
                        break;
                    case 'die':
                        data.defList.push('死亡');
                        break;
                }
            }

            //if(data.defender[s].miss)
            //    temp += '【闪】'
            //if(data.defender[s].nohurt)
            //    temp += '【替】'
            //
            //
            //if(data.defender[s].stat)
            //{
            //    temp += '[-'+JSON.stringify(data.defender[s].stat)+'-]'
            //}

            //data.defList.push(s + '[' + VC.getPlayerByID(s).mvo.id+']'+(VC.getPlayerByID(s).isPKing?'*':'')  + temp);
        }

        if(data.skillID == 50)
        {
            var str = data.atkerW + ' 攻击 ' + data.defList.join(',');
        }
        else if(data.skillID == 'die')
        {
            var str = '死亡单位： ' + data.defList.join(',');
        }
        else if(data.skillID == 51)
        {
            var str = data.atkerW + ' 秒杀 ' + data.defList.join(',');
        }
        else if(data.skillID == 52)
        {
            var str = data.atkerW + ' 回合结束时血量改变 '+ data.defList.join(',');
        }
        //else if(data.skillID == 53)
        //{
        //    var str = data.atker +  ' 对 ' + data.defList.join(',') + ' 进行加成';
        //}
        else
        {
            var str = data.atkerW + '使用技能' + data.skillID +':'+ data.defList.join(',') ;
        }

        str += '   ->  hp1 : '+VC.player1.hp + '/' + VC.player1.maxHp+'    hp2 : '+VC.player2.hp + '/' + VC.player2.maxHp

        console.log(data.index + ':    '+str);
        this.onActionOver();
    }

    public onOver(){
        this.timer = egret.setTimeout(this.onClose,this,500);
    }

    private changeStat(data){
        var str = ''
        var oo = {
            1:'攻击+',
            2:'速度+',
            3:'防御+',
            4:'伤害+',
            11:'攻击-',
            12:'速度-',
            13:'防御-',
            14:'伤害-',
            21:'缴械',
            22:'冷却',
            23:'沉默',
            24:'静止',
            25:'魅惑',
            31:'魔免',
            41:'治疗',
            42:'失血'
        }

        if(data.cd)
            return oo[data.stat] + data.cd;
        return oo[data.stat];
    }

}


