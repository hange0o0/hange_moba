class VideoItem3 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoItem3Skin";
    }


    private bg: eui.Rect;
    private bg2: eui.Rect;
    private con: eui.Group;
    private roundText: eui.Label;
    private moreText: eui.Label;




    public index;
    private isChoose
    public stopClick = false;
    //private maxConWidth = 500;
    private showCleaning = false//正在显示清队状态
    private lastClickTime = 0;

    public childrenCreated() {
        this.addBtnEvent(this,this.onChoose);
    }

    private onChoose(){
        if(this.data.type == 'over')
            return;
        if(this.isChoose)
        {
            if(egret.getTimer() - this.lastClickTime < 800)
            {
                var team = this.currentState == 'team1'?1:2;
                VideoDetailUI.getInstance().show({data:this.data,team:team});
            }
            this.lastClickTime = egret.getTimer();
        }
        else
            VideoUI.getInstance().setChoose(this.data,'item');
    }

    public setChoose(data,shake?){
        egret.Tween.removeTweens(this.roundText);
        //this.roundText.size = 18;
        if(data == this.data)
        {
            this.isChoose = true;
            this.bg.strokeColor = 0x774D2F
            this.bg2.strokeColor = 0x774D2F
            //if(shake)
            //{
            //    this.roundText.textColor = 0xFFFFFF;
            //    var tw:egret.Tween = egret.Tween.get(this.roundText);
            //    tw.wait(300).call(function(){this.roundText.textColor = 0xFFFF00;this.roundText.size = 22;},this);
            //    tw.wait(300).call(function(){this.roundText.textColor = 0xFFFFFF;this.roundText.size = 20;},this);
            //    tw.wait(300).call(function(){this.roundText.textColor = 0xFFFF00;this.roundText.size = 22;},this);
            //}
            //else
            //{
                this.roundText.textColor = 0xFFFF00;
                //this.roundText.size = 22;
            //}
        }
        else
        {
            this.roundText.textColor = 0xFFFFFF;
            this.bg.strokeColor = 0x673D1F
            this.bg2.strokeColor = 0x673D1F
            this.isChoose = false;
        }
        if(this.stopClick)
            this.isChoose = false
        //this.moreText.visible = this.isChoose;
    }

    public dataChanged() {
        var VC = VideoCode.getInstance();
        var data = this.data;
        this.setChoose(null);
        this.showCleaning = false;
        if(data.type == 'over')
        {
            this.currentState = 'team1'
            this.roundText.text = '战斗结束'
            this.con.removeChildren();
            this.con.addChild(VideoUI.getInstance()['resultMC'])
            //var group = this.addGroup();
            //if(data.isWin)
            //    group.addChild(this.getWordText('战斗结束,获得胜利',0x00FF00))
            //else
            //    group.addChild(this.getWordText('战斗结束,遗憾失败',0xFF0000))
            //group.height = 600;
            return;
        }
        var base = data[0];
        this.index = base.index;
        var atker = VC.getPlayerByID(base.atker);
        if(atker.teamID == 1)
        {
            this.currentState = 'team1';
        }
        else
        {
            this.currentState = 'team2';
        }

        this.roundText.text = 'Round ' + this.index + '';

        //if(atker.isPKing)
        //    this.bg.strokeColor = 0xBC703A;
        //else
        //    this.bg.strokeColor = 0x444444;

        //this.headMC.source =
        //console.log(data);
        //var skillI
        //this.currentState = 'left'
        //this.currentState = 'right'
        this.con.removeChildren();

        for(var i=0;i<data.length;i++)
        {
            this.addOneSkill(data[i])
        }
        //console.log(this.currentState)
    }

    private addOneSkill(data){

        var skill = data.skillID;

        switch(skill)
        {
            case -1://无行为的回合结速
                var atker = data.atker;
                var group = this.addGroup();
                this.getMonster(atker,group)
                group.addChild(this.getWordText('跳过了本次行动',0xAAAAAA))
                break;
            case 50://物攻
                this.decode_atk(data,0);
                break;
            case 51://秒杀
                this.decode_kill(data);
                break;
            case 52://回合结束时血量改变
                this.decode_hpChange(data);
                break;
            default:
                this.decode_skill(data);
                break;
        }

    //else if(data.skillID == 51)  //秒杀
    //    {
    //        this.onActionOver();
    //    }
    //    else if(data.skillID == 52)  //回合结束时血量改变
    //    {
    //        this.onActionOver();
    //    }
    //    else
    //    {
    //        if(data.atker >=10)
    //        {
    //            var mvo = atker.mvo;
    //            data.skillVO = mvo.getSkillByID(data.skillID,atker.isPKing)
    //        }
    //        else
    //        {
    //            // if(data.skillID == 1)//令牌
    //            // {
    //            // }
    //            //else
    //            // {
    //            var VM = VideoManager.getInstance();
    //            if(data.atker == 1)
    //                data.skillVO = VM.leaderSkill1[data.skillID - 2];
    //            else
    //                data.skillVO = VM.leaderSkill2[data.skillID - 2];
    //
    //            //}
    //        }
    //        data.mv = data.skillVO.mv;
    //        this.showSkillUse(data);
    //    }

    }

    //解释物攻
    private decode_atk(data,type){
        var group = this.addGroup();
        var effect = data.defender[0].list[0];

        this.addAtk(data,group,type);
        if(data.defender.length == 1 && data.defender[0].list.length<=2)
            this.addEffectList(data,group);
        else
        {
            this.addEffect(effect,group);
            this.addEffectList(data,null,1);
        }

    }

    //解释秒杀
    private decode_kill(data){
        var group = this.addGroup();
        var effect = data.defender[0].list[0];
        var atker = data.atker;
        var defender = data.defender;

        this.getMonster(atker,group)
        group.addChild(this.getWordText('绝杀'))
        this.getMonster(defender[0].defender,group)

        this.addEffect(effect,group);
    }


    private decode_hpChange(data){
        var group = this.addGroup();
        var effect = data.defender[0].list[0];
        var defender = data.defender;


        this.getMonster(defender[0].defender,group)
        group.addChild(this.getWordText('血量改变'))
        this.addEffectList(data,group);
    }

    //对1个单位施法
    private decode_skill(data){
        var VC = VideoCode.getInstance();
        var atker = VC.getPlayerByID(data.atker);
        if(data.atker >= 10)
        {
            var mvo = atker.mvo;
            var svo = mvo.getSkillByID(data.skillID,atker.isPKing);
        }
        else
        {
            var VM = VideoManager.getInstance()
            if(data.atker == 1)
                var oo = VM.leaderSkill1[data.skillID - 2]
            else
                var oo = VM.leaderSkill2[data.skillID - 2]
            var mvo = oo.mvo;
            var svo = oo.svo;
            atker.mid = mvo.id;

        }

        if(svo.mv == 'atk')
        {
            this.decode_atk(data,svo.type);
        }
        else
        {
            var group = this.addGroup();
            this.getMonster(data.atker,group,mvo);
            var short = true

            switch(svo.mv) {
                case 's_one':
                    var defender = data.defender;
                    group.addChild(this.getWordText('对',0,24))
                    this.getMonster(defender[0].defender,group)
                    short = false
                    break;
            }

            switch(svo.sp[0])
            {
                case 'TYPE':
                    group.addChild(this.getWordText('触发'))
                    break;
                case 'CD':
                    if(parseInt(svo.sp[1]))
                        group.addChild(this.getWordText('使用'))
                    else
                        group.addChild(this.getWordText('使用',0x00FF00))
                    break;
                default :
                    group.addChild(this.getWordText('使用'))
            }

            var color = 0x8917F5;
            if(svo.type == 1)
            {
                group.addChild(this.getSkill0Icon(svo.type))
                color = 0xEB911B;
            }
            else if(svo.type == 2)
            {
                group.addChild(this.getSkill0Icon(svo.type))
                color = 0x00DEFF;
            }
            else if(svo.type == 3)
            {
                group.addChild(this.getSkill0Icon(svo.type))
                color = 0x6fda13;
            }

            var nameText = this.getWordText('【'+svo.name + '】',color,26)
            group.addChild(nameText)
            this.addItemClick(nameText,atker)

            if(short && data.defender.length == 1 && data.defender[0].list.length==1 && data.defender[0].atker == data.defender[0].defender)
                this.addEffect(data.defender[0].list[0],group);
            else
                this.addEffectList(data);
        }
    }

    private addItemClick(mc,data){
        var self = this;
        var onDetail = function(e){
            if(self.isChoose)
                e.stopImmediatePropagation();
            var PKM = PKManager.getInstance();
            var team = data.teamID
            if(PKM.teamChange)
                var teamBase = team == 1?PKM.team2Base:PKM.team1Base
            else
                var teamBase = team == 1?PKM.team1Base:PKM.team2Base

            MonsterList.getInstance().show([{id:data.mid,specialData:teamBase.mb[data.mid]}])
        }

        this.addBtnEvent(mc,onDetail);
    }



    ////特效后使用攻击
    //private decode_satk(data){
    //    var arr = data.defender;
    //    var atker = data.atker;
    //    var group = this.addGroup();
    //    for(var i=0;i<arr.length;i++)
    //    {
    //
    //    }
    //}
    //
    ////攻击后有特效
    //private decode_atks(data){
    //    var group = this.addGroup();
    //    this.addAtk(data,group);
    //    var arr =  data.defender//[0].list[0];
    //
    //    for(var i=0;i<arr.length;i++)
    //    {
    //        var list = arr[i].list;
    //        if(i>0 || list.length > 1)
    //        {
    //            group = this.addGroup();
    //            this.getMonster(arr[i].defender,group)
    //        }
    //        for(var j=0;j<list.length;j++)
    //        {
    //            this.addEffect(list[j],group);
    //        }
    //    }
    //}

    //对1个单位施法
    //private decode_s_one(data,svo){
    //    var defender = data.defender;
    //    var atker = data.atker;
    //    var effect = data.defender[0].list[0];
    //    var group = this.addGroup();
    //
    //    this.getMonster(atker,group)
    //    group.addChild(this.getWordText('对'))
    //    this.getMonster(defender[0].defender,group)
    //    this.addSkillName(svo,group);
    //    if(data.defender.length == 1 && data.defender[0].list.length==1)
    //        this.addEffect(effect,group);
    //    else
    //        this.addEffectList(data);
    //}

    ////对自己施法
    //private decode_s_self(data,svo){
    //    var defender = data.defender;
    //    var atker = data.atker;
    //    var effect = data.defender[0].list[0];
    //    var group = this.addGroup();
    //
    //    this.getMonster(atker,group)
    //    group.addChild(this.getWordText('使用【'+svo.name + '】'))
    //    if(data.defender.length == 1 && data.defender[0].list.length==1)
    //        this.addEffect(effect,group);
    //    else
    //        this.addEffectList(data);
    //}

    //private addSkillName(svo,group){
    //    switch(svo.sp[0])
    //    {
    //        case 'TYPE':
    //            group.addChild(this.getWordText('触发'))
    //            break;
    //        default :
    //            group.addChild(this.getWordText('使用'))
    //    }
    //
    //    var color = 0x8917F5;
    //    if(svo.type == 1)
    //        color = 0xD317F5;
    //    group.addChild(this.getWordText('【'+svo.name + '】',color))
    //
    //}


    private addAtk(data,group,type,defIndex=0){
        var atker = data.atker;
        var defender = data.defender;

        this.getMonster(atker,group)

        group.addChild(this.getPKIcon(atker,type))

        this.getMonster(defender[defIndex].defender,group)
    }

    private addEffectList(data,group?,begin=0){
        var arr = data.defender;
        for(var i=0;i<arr.length;i++)
        {
            var list = arr[i].list;
            if(begin>=list.length)//后面没有状态了
            {
                begin = 0;
                continue;
            }
            if(!group || i > 0)
                group = this.addGroup();
            if(group.numChildren == 0)
                this.getMonster(arr[i].defender,group)
            for(var j=begin,begin=0;j<list.length;j++)
            {
                this.addEffect(list[j],group);
            }

        }
    }

    private addEffect(effect,group?:eui.Group)
    {
        if(!group)
            group = this.addGroup();
        if(this.showCleaning && effect.key != 'clean')
        {
            this.showCleaning = false;
            group = this.addGroup();
            this.getMonster(effect.defender,group)
        }
        var mc:any
        if(effect.key == 'hp')
        {
            mc = new VideoHpItem()
            group.addChild(mc)
            mc.data = effect.value;
        }
        else if(effect.key == 'nohurt')
        {
            group.addChild(this.getWordText('【免伤】',0xFF0000))
        }
        else if(effect.key == 'miss')
        {
            group.addChild(this.getWordText('【闪避】',0xFF0000))
        }
        else if(effect.key == 'die')
        {
            group.addChild(this.getWordText('【死亡】',0xFF0000))
        }
        else if(effect.key == 'stat')
        {
            mc = new VideoStatItem()
            group.addChild(mc)
            mc.data = effect.value
        }
        else if(effect.key == 'clean')
        {
            if(!this.showCleaning)
            {
                if(group.numChildren >1)
                    group = this.addGroup();
                this.showCleaning = true;
                if(group.numChildren == 0)
                    this.getMonster(effect.defender,group)
                group.addChild(this.getWordText('清除状态：'))
            }

            if(group.numChildren >4)
            {
                group = this.addGroup();
                this.getMonster(effect.defender,group)
                group.addChild(this.getWordText('清除状态：'))
            }
            mc = new VideoStatItem()
            group.addChild(mc)
            mc.data = effect.value;
        }
        else if(effect.key == 'mhp')
        {
            var str = '血量上限：';
            if(effect.value > 0)
                str += '+' + effect.value;
            else
                str += '' + effect.value;
            group.addChild(this.getWordText(str))
        }
        else if(effect.key == 'mmp')
        {
            var str = '怒气上限：';
            if(effect.value > 0)
                str += '+' + effect.value;
            else
                str += '' + effect.value;
            group.addChild(this.getWordText(str))
        }
        else if(effect.key == 'mp')
        {
            var str = '怒气：';
            if(effect.value > 0)
                str += '+' + effect.value;
            else
                str += '' + effect.value;
            group.addChild(this.getWordText(str))
        }
    }

    private addGroup(){
        var group = new eui.Group();
        var layOut = new eui.HorizontalLayout();
        group.layout = layOut;
        layOut.verticalAlign = 'middle';
        //layOut.gap = 10;
        group.height = 60;

        this.con.addChild(group);
        return group;
    }

    private getWordText(txt='',color? ,size?){
        if(!color)
            color = 0xFFFFFF;
        if(!size)
            size = 20;
        var hpText = new eui.Label();
        hpText.size = size;
        hpText.text = txt;
        hpText.textColor = color
        return hpText;
        //hpText.horizontalCenter = 0;
        //this.addChild(hpText)
        //hpText.text = '-' + NumberUtil.formatStrBigNum(word)
    }
    private getPKIcon(atker,type){
       var mc =  new eui.Image()
        var VC = VideoCode.getInstance();
        var playerVO = VC.getPlayerByID(atker);

        if(playerVO.teamID == 1)
        {
            if(type == 0)
                mc.source = 'video_atk1_png';
            else
                mc.source = 'video_atk3_png';
        }
        else
        {
            if(type == 0)
                mc.source = 'video_atk2_png';
            else
                mc.source = 'video_atk4_png';
        }

        mc.scaleX = mc.scaleY = 0.6
        return mc;
    }
    private getSkill0Icon(type){
        var group = new eui.Group();
        var mc =  new eui.Image()
        mc.source = 'icon_b'+type+'_png';
        mc.scaleX = mc.scaleY = 0.6
        group.addChild(mc)
        group.width = 25;
        return group;
    }
    private getMonster(id,group,mvo?){
        var VC = VideoCode.getInstance();
        var mc = new VideoMonsterItem()
        group.addChild(mc);
        var playerVO = VC.getPlayerByID(id);
        if(mvo)
            playerVO.headVO = mvo;
        else
            playerVO.headVO = null;
        mc.data = playerVO;
        this.addItemClick(mc,playerVO)
        return mc
    }
}