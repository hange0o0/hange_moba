class VideoItem3 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoItem3Skin";
    }

    private headMC: eui.Image;
    private chooseBG: eui.Rect;
    private bg: eui.Rect;
    private con: eui.Group;


    public index;
    private maxConWidth = 500;
    private showCleaning = false//正在显示清队状态

    public childrenCreated() {
        this.addBtnEvent(this,this.onChoose);
    }

    private onChoose(){
        if(this.data.type == 'over')
            return;
        VideoUI.getInstance().setChoose(this.data,true);
    }

    public setChoose(data,shake?){
        if(data == this.data)
        {
            this.chooseBG.visible = true;
            this.chooseBG.alpha = 1;
            if(shake)
            {
                var tw:egret.Tween = egret.Tween.get(this.chooseBG);
                tw.to({alpha:0},200).to({alpha:1},200).to({alpha:0},200).to({alpha:1},200);
            }
        }
        else
            this.chooseBG.visible = false;
    }

    public dataChanged() {
        var VC = VideoCode.getInstance();
        var data = this.data;
        this.setChoose(null);
        this.showCleaning = false;
        if(data.type == 'over')
        {
            this.currentState = 'left'
            this.con.removeChildren();
            var group = this.addGroup();
            if(data.isWin)
                group.addChild(this.getWordText('战斗结束,获得胜利',0x00FF00))
            else
                group.addChild(this.getWordText('战斗结束,遗憾失败',0xFF0000))
            group.height = 600;
            return;
        }
        var base = data[0];
        this.index = base.index;
        var atker = VC.getPlayerByID(base.atker);
        if(atker.teamID == 1)
        {
            this.currentState = 'left';
        }
        else
        {
            this.currentState = 'right';
        }

        if(atker.isPKing)
            this.bg.strokeColor = 0xBC703A;
        else
            this.bg.strokeColor = 0x444444;

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
                group.addChild(this.getWordText('跳过了本次行动'))
                break;
            case 50://物攻
                this.decode_atk(data);
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
    private decode_atk(data){
        var group = this.addGroup();
        var effect = data.defender[0].list[0];

        this.addAtk(data,group);
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
            this.decode_atk(data);
        }
        else
        {
            var group = this.addGroup();
            this.getMonster(data.atker,group);
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
                group.addChild(this.getSkill0Icon())
                color = 0xEB911B;
            }

            group.addChild(this.getWordText('【'+svo.name + '】',color,26))

            if(short && data.defender.length == 1 && data.defender[0].list.length==1)
                this.addEffect(data.defender[0].list[0],group);
            else
                this.addEffectList(data);
        }
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


    private addAtk(data,group,defIndex=0){
        var atker = data.atker;
        var defender = data.defender;

        this.getMonster(atker,group)

        group.addChild(this.getPKIcon())

        this.getMonster(defender[defIndex].defender,group)
    }

    private addEffectList(data,group?,begin=0){
        var arr = data.defender;
        for(var i=0;i<arr.length;i++)
        {
            var list = arr[i].list;
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
        group.height = 70;

        this.con.addChild(group);
        return group;
    }

    private getWordText(txt='',color? ,size?){
        if(!color)
            color = 0x999999;
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
    private getPKIcon(){
       var mc =  new eui.Image()
        mc.source = 'pk_icon_png';
        mc.scaleX = mc.scaleY = 0.6
        return mc;
    }
    private getSkill0Icon(){
        var group = new eui.Group();
        var mc =  new eui.Image()
        mc.source = 'icon_b1_png';
        mc.scaleX = mc.scaleY = 0.6
        group.addChild(mc)
        group.width = 25;
        return group;
    }
    private getMonster(id,group){
        var VC = VideoCode.getInstance();
        var mc = new VideoMonsterItem()
        group.addChild(mc);
        mc.data = VC.getPlayerByID(id)
        return mc
    }
}