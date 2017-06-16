//通用的怪物信息
class MonsterInfoBase extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private nameText: eui.Label;
    private atkText: eui.Label;
    private hpText: eui.Label;
    private speedText: eui.Label;
    private mpText: eui.Label;
    private coinText: eui.Label;
    private headMC: eui.Image;
    private typeMC: eui.Image;
    private list: eui.List;
    private levelUpCon: eui.Group;
    private levelUpCoinGroup: eui.Group;
    private levelUpCoinText: eui.Label;
    private levelUpBtn: eui.Button;
    private levelUpCardGroup: eui.Group;
    private levelUpCardText: eui.Label;
    private lockGroup: eui.Group;
    private levelDes: eui.Label;
    private talkText: eui.Label;











    private vo;
     private specialData;


    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = MonsterInfoBaseItem;

        this.addBtnEvent(this.levelUpBtn, this.onLevelUp);
        this.addBtnEvent(this.levelUpCoinGroup, this.onAddCoin);
        this.addBtnEvent(this.levelUpCardGroup, this.onAddCard);

        //addBtnTips(this.headMC,this.onTips,this);
    }

    //private onTips(){
    //    if(this.vo)
    //    {
    //        return this.vo.getTipsWord();
    //    }
    //    return null;
    //}

    private onAddCoin(e){
        ShopUI.getInstance().show('coin');
    }
    private onAddCard(e) {
        ShopUI.getInstance().show('card');
    }

    private onLevelUp(e){
        e.stopImmediatePropagation();
        if(this.levelUpBtn.skinName != 'Btn_r1Skin')
            return;
        var self = this;
        var oo =  this.vo
        TecManager.getInstance().levelUp(3,oo.id,function(){
            self.renewMonster();
            GuideManager.getInstance().showGuide(MonsterList.getInstance());
        });
    }

    public setMinHeight(v){
        this.minHeight = v
    }

    public renewLevelUp(){
        this.levelUpCon.visible = true;
        var oo =  this.vo;
        var TEC = TecManager.getInstance();
        var cost = TEC.needCoin(UM.getMonsterLevel(oo.id) + 1)

        var levelUpAble = true;
        var arr = TecManager.getInstance().collectRate(oo.id);
        var collectNeed = arr[1];
        var collectNum = arr[0];
        if(collectNeed == 0)
        {
            this.levelUpBtn.label = '满级'
            levelUpAble = false
        }
        else
        {
            this.levelUpBtn.label = '升级'
        }
        if(cost > UM.coin)
        {
            this.levelUpCoinText.textColor = 0xFF0000;
            levelUpAble = false
        }
        else
            this.levelUpCoinText.textColor = 0xCCCCCC
        this.levelUpCoinText.text = '' + NumberUtil.addNumSeparator(cost);

        if(collectNeed > collectNum)
        {
            levelUpAble = false
            this.levelUpCardText.textColor = 0xFF0000
        }
        else
        {
            this.levelUpCardText.textColor = 0xCCCCCC
        }
        this.levelUpCardText.text = '' + NumberUtil.addNumSeparator(collectNeed);

        if(levelUpAble)
            this.levelUpBtn.skinName = 'Btn_r1Skin'
        else
            this.levelUpBtn.skinName = 'Btn_d1Skin'


    }

    public renew(monsterID,specialData?){
        this.specialData = specialData = specialData || {};
        this.vo = MonsterVO.getObject(monsterID);
        this.renewMonster();
    }

    private renewUnlockText(){
        var vo = this.vo
        this.lockGroup.visible = true;
        this.setHtml(this.levelDes,this.changeTitle('解锁等级：') + vo.level);
    }

    public renewMonster(){
        var vo = this.vo
        var specialData = this.specialData
        var monsterID = vo.id;


        //其本信息
        this.headMC.source = vo.url;
        this.typeMC.source = vo.typeIcon;
        //this.typeText.text = MonsterKindVO.getObject(vo.type).word
        var nameStr = vo.name;


        //this.levelText.text = 'LV.' + UM.getMonsterLevel(monsterID);

        this.levelUpCon.visible = false;
        this.lockGroup.visible = false;



        //战力表现相关
        var fightData;
        var isFromPK = false
        if(specialData.isNPC)//有战力加成节点，表示是用战力加成值
        {
            var v = specialData.fight || 0;
            fightData = {atk:v,hp:v,speed:v};
            //this.levelGroup.visible = false;
        }
        else if(specialData.atk && specialData.hp && specialData.speed)//pk中进来的，已带3围
        {
            fightData = specialData;
            if(specialData.lv)
            {
                nameStr += '  <font color="#cc9900" size="22">(LV.' + specialData.lv + ')</font>';
            }
            isFromPK = true;
        }
        else
        {
            if(specialData.isEqual)
            {
                fightData = {atk:Config.equalValue,hp:Config.equalValue,speed:0};
                if(specialData.equalAdd)
                {
                     for(var s in fightData)
                     {
                         fightData[s] += specialData.equalAdd;
                     }
                }
                nameStr += '  <font color="#cc9900" size="22">(修正)</font>';
                //this.levelGroup.visible = false;
            }

            else if(specialData.isBase)   {

                //this.levelGroup.visible = false;
                fightData = {atk:0,hp:0,speed:0};
                nameStr += '  <font color="#cc9900" size="22">(基础)</font>';

            }
            else  //我自己
            {
                var force = (UM.award_force + UM.tec_force);
                var levelLimit = 999;
                if(specialData.hard)//带难度的
                {
                      var hardData = TeamDungeonManager.getInstance().hardData[specialData.hard - 1];
                    levelLimit = hardData.level;
                    force = Math.min(hardData.force,force);
                }
                fightData = UM.getTecMonsterAdd(monsterID,levelLimit);
                fightData.atk += force;
                fightData.hp += force;

                if(UM.level >= vo.level)
                {
                    if(specialData.hard)
                        nameStr += '  <font color="#cc9900" size="22">(LV.' + UM.getMonsterLevel(monsterID) + '/'+levelLimit+')</font>'
                    else
                        nameStr += '  <font color="#cc9900" size="22">(LV.' + UM.getMonsterLevel(monsterID) + ')</font>';

                    if(specialData.hard)
                    {
                         if(vo.level < levelLimit)
                             this.renewLevelUp();
                    }
                    else
                        this.renewLevelUp();
                }
                //else
                //{
                //    this.renewUnlockText()
                //}

            }

        }

        if(UM.level < vo.level)
        {
            this.renewUnlockText()
        }

        this.setHtml(this.nameText,nameStr)

        if(isFromPK)
        {
            var atk = <number>fightData.atk;
            var hp = <number>fightData.hp;
            var speed =<number>fightData.speed;
        }
        else
        {
            var atk = Math.round(vo.atk * (1+fightData.atk/100));
            var hp = Math.round(vo.hp * (1+fightData.hp/100));
            var speed = Math.round(vo.speed * (1+fightData.speed/100));
        }

        if(this.levelUpCon.visible)
        {
            //先模拟升一级
            UM.tec.monster[monsterID] = (UM.tec.monster[monsterID] || 0) + 1
            var force = (UM.award_force + UM.getTecForce() + UM.getLevelForce());
            fightData = UM.getTecMonsterAdd(monsterID);
            fightData.atk += force;
            fightData.hp += force;
            var atkAdd = Math.round(vo.atk * (1+fightData.atk/100)) - atk;
            var hpAdd = Math.round(vo.hp * (1+fightData.hp/100)) - hp;UM.tec.monster[monsterID] --;       //降回去

            this.setHtml(this.atkText,this.changeTitle('攻击：') + NumberUtil.addNumSeparator(atk) + '<font color="#00ff00"> +'+atkAdd+'</font>');
            this.setHtml(this.hpText, this.changeTitle('生命：') + NumberUtil.addNumSeparator(hp) + '<font color="#00ff00"> +'+hpAdd+'</font>');
            this.setHtml(this.speedText, this.changeTitle('速度：') + NumberUtil.addNumSeparator(speed));
        }
        else
        {
            this.setHtml(this.atkText, this.changeTitle('攻击：') + NumberUtil.addNumSeparator(atk));
            this.setHtml(this.hpText, this.changeTitle('生命：') + NumberUtil.addNumSeparator(hp));
            this.setHtml(this.speedText, this.changeTitle('速度：') + NumberUtil.addNumSeparator(speed));
        }

        this.setHtml(this.mpText, this.changeTitle('怒气上限：') + vo.mp);
        this.setHtml(this.coinText, this.changeTitle('召唤花费：') + vo.cost);


        //技能表现
        var arr = [];
        if(vo.sn)
            arr.push(vo.sn);
        for(var i=1;i<6;i++)
        {
            if(vo['sn' + i])
                arr.push(vo['sn' + i]);
        }
        for(var i=1;i<6;i++)
        {
            if(vo['sfn' + i])
                arr.push(vo['sfn' + i]);
        }

        for(var i=0;i<arr.length;i++)
        {
            arr[i].atk = atk;
        }

        ArrayUtil.sortByField(arr,['sortIndex'],[0]);
        this.list.dataProvider = new eui.ArrayCollection(arr);

        this.talkText.text = '　' + this.vo.des
    }

    private changeTitle(str){
        return this.createHtml(str,0xcc9900)
    }


}