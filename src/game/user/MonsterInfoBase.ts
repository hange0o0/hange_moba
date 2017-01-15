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
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private list: eui.List;
    private levelUpCon: eui.Group;
    private levelUpCoinGroup: eui.Group;
    private levelUpCardGroup: eui.Group;
    private levelUpCoinText: eui.Label;
    private levelUpBtn: eui.Button;
    private levelUpCardText: eui.Label;






     private vo;
     private specialData;


    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = MonsterInfoBaseItem;

        this.addBtnEvent(this.levelUpBtn, this.onLevelUp);
        this.addBtnEvent(this.levelUpCoinGroup, this.onAddCoin);
        this.addBtnEvent(this.levelUpCardGroup, this.onAddCard);
    }

    private onAddCoin(){
        ShopUI.getInstance().show('coin');
    }
    private onAddCard() {
        ShopUI.getInstance().show('card');
    }

    private onLevelUp(){
        if(this.levelUpBtn.skinName != 'Btn_r1Skin')
            return;
        var self = this;
        var oo =  this.vo
        TecManager.getInstance().levelUp(3,oo.id,function(){
            self.renewMonster();
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

    public renewMonster(){
        var vo = this.vo
        var specialData = this.specialData
        var monsterID = vo.id;


        //其本信息
        this.headMC.source = vo.url;
        //this.typeText.text = MonsterKindVO.getObject(vo.type).word
        var nameStr = vo.name;

        this.mpText.text = '怒气上限：' + vo.mp;
        this.coinText.text = '召唤花费：' + vo.cost;
        //this.levelText.text = 'LV.' + UM.getMonsterLevel(monsterID);
        this.levelGroup.visible = false;
        this.levelUpCon.visible = false;



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
                nameStr += '  <font color="#226C17" size="22">(LV.' + specialData.lv + ')</font>';
            }
            isFromPK = true;
        }
        else
        {
            if(specialData.isEqual)
            {
                fightData = {atk:Config.equalValue,hp:Config.equalValue,speed:0};
                //this.levelGroup.visible = false;
            }

            else if(specialData.isBase)   {

                //this.levelGroup.visible = false;
                fightData = {atk:0,hp:0,speed:0};
            }
            else  //我自己
            {
                var force = (UM.award_force + UM.tec_force);
                fightData = UM.getTecMonsterAdd(monsterID);
                fightData.atk += force;
                fightData.hp += force;
                nameStr += '  <font color="#226C17" size="22">(LV.' + UM.getMonsterLevel(monsterID) + ')</font>';
                this.renewLevelUp();
            }

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

            this.setHtml(this.atkText,'攻击：' + NumberUtil.addNumSeparator(atk) + '<font color="#00ff00"> +'+atkAdd+'</font>');
            this.setHtml(this.hpText, '生命：' + NumberUtil.addNumSeparator(hp) + '<font color="#00ff00"> +'+hpAdd+'</font>');
            this.speedText.text = '速度：' + NumberUtil.addNumSeparator(speed);
        }
        else
        {
            this.atkText.text = '攻击：' + NumberUtil.addNumSeparator(atk);
            this.hpText.text = '生命：' + NumberUtil.addNumSeparator(hp);
            this.speedText.text = '速度：' + NumberUtil.addNumSeparator(speed);
        }


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

        ArrayUtil.sortByField(arr,['sortIndex'],[0]);
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }




}