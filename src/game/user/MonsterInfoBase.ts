//通用的怪物信息
class MonsterInfoBase extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private atkText: eui.Label;
    private speedText: eui.Label;
    private hpText: eui.Label;
    private sGroup: eui.Group;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
    private typeGroup: eui.Group;
    private typeText: eui.Label;
    private woodIcon: eui.Image;
    private woodText: eui.Label;
    private coinText: eui.Label;
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
        this.nameText.text = vo.name;
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

        for(var i=1;i<=4;i++)
        {
            var mc = this['s' + i];
            MyTool.removeMC(mc);
        }
        if(!specialData.isNPC)
        {
            var star = UM.getMonsterCollect(monsterID);
            for(var i=1;i<=4;i++)
            {
                var mc = this['s' + i];
                if(star > i)
                    this.sGroup.addChild(mc);
            }
        }



        //战力表现相关
        var fightData;
        if(specialData.isNPC)//有战力加成节点，表示是用战力加成值
        {
            var v = specialData.fight || 0;
            fightData = {atk:v,hp:v,speed:v};
        }
        else
        {
            if(specialData.isEqual)
                fightData = {atk:Config.equalValue,hp:Config.equalValue,speed:0};
            else if(specialData.isBase)
                fightData = {atk:0,hp:0,speed:0};
            else  //我自己
            {
                var force = (UM.award_force + UM.tec_force);
                fightData = UM.getTecMonsterAdd(monsterID);
                fightData.atk += force;
                fightData.hp += force;
            }

        }

        var atk = Math.round(vo.atk * (1+fightData.atk/100));
        var hp = Math.round(vo.hp * (1+fightData.hp/100));
        var speed = Math.round(vo.speed * (1+fightData.speed/100));
        this.atkText.text = NumberUtil.addNumSeparator(atk);
        this.hpText.text = NumberUtil.addNumSeparator(hp);
        this.speedText.text = NumberUtil.addNumSeparator(speed);

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
        this.list.dataProvider = new eui.ArrayCollection(arr);

    }




}