//通用的怪物信息
class MonsterInfoBase extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private group:eui.Group
    private txt:eui.Label
    private img:eui.Image
    private list:eui.List
    private scroller:eui.Scroller


    public childrenCreated() {
        super.childrenCreated();
    }

    public renew(monsterID,specialData?){
        specialData = specialData || {};
        var vo = MonsterVO.getObject(monsterID);

        //其本信息
        this.img.source = vo.url;
        this.img.source = 'monster_type_' + vo.type + '_png';
        this.txt.text = vo.name;
        this.txt.text = vo.des;
        this.txt.text = vo.cost;
        this.txt.text = vo.wood;
        this.txt.text = vo.effectWord(vo.effect_kind).join('、');
        this.txt.text = vo.effectWord(vo.kind).join('、');


        this.group.visible = false;
        if(!specialData.isNPC)
        {
            this.group.visible = true;
            var star = UM.getMonsterCollect(monsterID);
            for(var i=0;i<4;i++)
            {
                var mc = this['star' + i];
                mc.visible = star > i;
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
                fightData = {atk:300,hp:300,speed:300};
            else
                fightData = UM.getTecMonsterAdd(monsterID);
        }
        var atk = Math.round(vo.atk * (1+fightData.atk/100));
        var hp = Math.round(vo.hp * (1+fightData.hp/100));
        var speed = Math.round(vo.speed * (1+fightData.speed/100));
        this.txt.text = NumberUtil.addNumSeparator(atk);
        this.txt.text = NumberUtil.addNumSeparator(hp);
        this.txt.text = NumberUtil.addNumSeparator(speed);
        //MyTool.setHtml(this.txt,speed + ' <font color="#CCCCCC">(' + vo.speed + ')</font>')

        ////显示位置加成
        //if('index' in specialData)//在位置队列中
        //{
        //    var indexAdd = PKManager.getInstance().indexAdd(specialData.index);
        //    if(indexAdd)//当前怪有位置加成
        //    {
        //
        //    }
        //}

        //技能表现
        var arr = [];
        if(vo.sn)
            arr.push(vo.sn);
        for(var i=1;i<6;i++)
        {
            if(vo['sn' + i])
                arr.push(vo);
        }
        for(var i=1;i<6;i++)
        {
            if(vo['sfn' + i])
                arr.push(vo);
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);

    }




}