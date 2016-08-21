class VideoUI extends game.BaseUI {
    private static instance: VideoUI;
    public static getInstance() {
        if(!this.instance) this.instance = new VideoUI();
        return this.instance;
    }

    private bg: eui.Image;
    private topUI: TopUI;
    private enemyItem: VideoItem;
    private selfItem: VideoItem;
    private itemGroup: eui.Group;
    private selfSkill: eui.Label;
    private enemySkill: eui.Label;


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

        this.topUI.addEventListener('hide',this.onClose,this);

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
        var group = VideoMV.getInstance().getLoadFormKey(mvType)
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
            for(var i=0;i<data.defs.length;i++)
            {
                data.defMCs.push(getMCByID(data.defs[i]));
            }
            this.showSkillUse(data)
            return;
        }
        var VM = VideoManager.getInstance();
        this.topUI.setTitle('第'+(VM.index + 1)+'轮')
        var scene = PKManager.getInstance().getPKBG(VM.type);
        this.bg.source = scene;



        var VC = VideoCode.getInstance()
        VC.initData(VM.baseData);


        this.selfItem.data = VC.player1
        this.enemyItem.data = VC.player2
        this.enemySkill.text = ''
        this.selfSkill.text = ''

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
                return this.selfItems[index]
            if(index == 3)
                return this.skiller1;
        }
        else
        {
            if(index < 3)
                return this.enemyItems[index]
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
            MV.atk(data,this.onActionOver,this)
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
                data.mv = data.skillVO.mv;
                 //}
            }
            this.showSkillUse(data);
        }
    }

    private showSkillUse(data){
        var MV = VideoMV.getInstance();
        //if(data.skillVO.type == 1)//主技能
        //{
        //     if(data.teamID == 1)
        //        this.selfSkill.text = data.skillVO.name;
        //    else
        //        this.enemySkill.text = data.skillVO.name;
        //}

        //MV['mv'](data,function(){
        MV[data.mv](data,function(){
            this.onActionOver();
            this.selfSkill.text = '';
            this.enemySkill.text = '';
        },this)
    }

    private debugShow(data){
        var VC = VideoCode.getInstance();

        if(data.atker != 1 && data.atker != 2)
            data.atker = data.atker+'['+VC.getPlayerByID(data.atker).mvo.id+']'+(VC.getPlayerByID(data.atker).isPKing?'*':'');
        data.defList = [];
        for(var s in data.defender)
        {
            var temp = ''
            if(data.defender[s].miss)
                temp += '【闪】'
            if(data.defender[s].nohurt)
                temp += '【替】'
            data.defList.push(s + '[' + VC.getPlayerByID(s).mvo.id+']'+(VC.getPlayerByID(s).isPKing?'*':'')  + temp);
        }

        if(data.skillID == 50)
        {
            var str = data.atker + ' 攻击 ' + data.defList.join(',');
        }
        else if(data.skillID == 51)
        {
            var str = data.atker + ' 秒杀 ' + data.defList.join(',');
        }
        else if(data.skillID == 52)
        {
            var str = data.atker + ' 回合结束时血量改变 '+ data.defList.join(',');
        }
        //else if(data.skillID == 53)
        //{
        //    var str = data.atker +  ' 对 ' + data.defList.join(',') + ' 进行加成';
        //}
        else
        {
            var str = data.atker + '对' + data.defList.join(',') + '使用技能' + data.skillID ;
        }
        str += '   ->  hp1 : '+VC.player1.hp + '/' + VC.player1.maxHp+'    hp2 : '+VC.player2.hp + '/' + VC.player2.maxHp

        console.log(data.index + ':    '+str);
        this.onActionOver();
    }

}


