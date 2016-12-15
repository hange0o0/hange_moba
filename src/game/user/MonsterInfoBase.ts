//通用的怪物信息
class MonsterInfoBase extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private typeGroup: eui.Group;
    private atkText: eui.Label;
    private hpText: eui.Label;
    private speedText: eui.Label;
    private mpText: eui.Label;
    private coinText: eui.Label;
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private list: eui.List;





     private vo;


    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = MonsterInfoBaseItem;
        this.addBtnEvent(this.typeGroup,this.onTypeClick)
    }

    public onTypeClick(){
        TypeInfoUI.getInstance().show(this.vo.type);
    }

    public setMinHeight(v){
        this.minHeight = v
    }

    public renew(monsterID,specialData?){
        specialData = specialData || {};
        var vo = this.vo = MonsterVO.getObject(monsterID);

        //其本信息
        this.headMC.source = vo.url;
        //this.typeText.text = MonsterKindVO.getObject(vo.type).word
        var nameStr = vo.name;

        this.mpText.text = '怒气上限：' + vo.mp;
        this.coinText.text = '召唤花费：' + vo.cost;
        //this.levelText.text = 'LV.' + UM.getMonsterLevel(monsterID);
        this.levelGroup.visible = false;
        //this.txt.text = vo.des;
        //this.coinText.text = 'X' + vo.cost;
        //if(vo.wood)
        //{
        //    this.woodText.text = 'X' + vo.wood;
        //    this.woodIcon.visible =  true;
        //}
        //else
        //{
        //    this.woodText.text = ''
        //    this.woodIcon.visible =  false;
        //}

        //for(var i=1;i<=4;i++)
        //{
        //    var mc = this['s' + i];
        //    MyTool.removeMC(mc);
        //}
        //if(!specialData.isNPC)
        //{
        //    var star = UM.getMonsterCollect(monsterID);
        //    for(var i=1;i<=4;i++)
        //    {
        //        var mc = this['s' + i];
        //        if(star > i)
        //            this.sGroup.addChild(mc);
        //    }
        //}



        //战力表现相关
        var fightData;
        if(specialData.isNPC)//有战力加成节点，表示是用战力加成值
        {
            var v = specialData.fight || 0;
            fightData = {atk:v,hp:v,speed:v};
            //this.levelGroup.visible = false;
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
            }

        }

        this.setHtml(this.nameText,nameStr)

        var atk = Math.round(vo.atk * (1+fightData.atk/100));
        var hp = Math.round(vo.hp * (1+fightData.hp/100));
        var speed = Math.round(vo.speed * (1+fightData.speed/100));
        if(specialData.isLevelUp)
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