class TecManager{
    private static _instance:TecManager;
    public static getInstance():TecManager {
        if (!this._instance)
            this._instance = new TecManager();
        return this._instance;
    }

    public maxLevel = 30;

    public list1;
    public list2;
    public constructor() {
        //--13攻击，14血量，15速度，1-12对应属性加强（12个，攻血同加）
        //16伤害增强，17防御增强，18回复增强，19克制加强，20克制压制
        this.list1 = [
            {id:1,tecType:1,name:'金加强',des:'增加【金】属性卡牌$$%攻击力和生命值'},
            {id:2,tecType:1,name:'木加强',des:'增加【木】属性卡牌$$%攻击力和生命值'},
            {id:3,tecType:1,name:'水加强',des:'增加【水】属性卡牌$$%攻击力和生命值'},
            {id:4,tecType:1,name:'火加强',des:'增加【火】属性卡牌$$%攻击力和生命值'},
            {id:5,tecType:1,name:'土加强',des:'增加【土】属性卡牌$$%攻击力和生命值'},
            {id:6,tecType:1,name:'',des:''},
            {id:7,tecType:1,name:'',des:''},
            {id:8,tecType:1,name:'',des:''},
            {id:9,tecType:1,name:'',des:''},
            {id:10,tecType:1,name:'',des:''},
            {id:11,tecType:1,name:'',des:''},
            {id:12,tecType:1,name:'',des:''},
            {id:13,tecType:1,name:'攻击强化',des:'增加所有卡牌$$%攻击力'},
            {id:14,tecType:1,name:'生命强化',des:'增加所有卡牌$$%生命值'},
            {id:15,tecType:1,name:'速度强化',des:'增加所有卡牌$$%速度'},
            {id:16,tecType:1,name:'伤害强化',des:'当攻击其它卡牌时，所造成的伤害增加$$%'},
            {id:17,tecType:1,name:'防御强化',des:'当受到其它卡牌攻击时，造成的伤害减少$$%'},
            {id:18,tecType:1,name:'回复强化',des:'受治疗的效果加强$$%'},
            {id:19,tecType:1,name:'克制强化',des:'对其它卡牌的克制效果加成$$%'},
            {id:20,tecType:1,name:'克制压制',des:'被其它卡牌的克制影响减少$$%，极限情况是不受克制'}
        ];
        this.list2 = ObjectUtil.objToArray(CM.table[RingVO.dataKey]);
        ArrayUtil.sortByField(this.list2,['id'],[0]);

    }

    //level是指目标等级
    public needCoin(level){
        return Math.floor(Math.pow(level,1.5)*1000);
    }
    public propNum1(level){   //初级道具  升3级开始要
        if(level > 2)
            return level - 1;//首次2个
        return 0;
    }
    public propNum2(level){  //高级道具   升12级开始要
        if(level > 19)
            return level - 19;//首次1个
        return 0;
    }

    public prop1ID(type){
        if(type == 1)
            return  1;
        else if(type == 2)
            return  2;
        else if(type == 3)
            return  3;
    }

    public prop2ID(type){
        if(type == 1)
            return  11;
        else if(type == 2)
            return  12;
        else if(type == 3)
            return  13;
    }

    public getList1(){
        var arr = [];
        for(var i=0;i<12;i++)
        {
            var oo = this.list1[i];
            var vo = MonsterKindVO.getObject(oo.id)
            if(!vo || vo.level > UM.level)
                continue;
            arr.push(oo);
        }
        arr = arr.concat(this.list1.slice(-8))
        return arr;
    }

    public getList2(){
        var arr = [];
        for(var i=0;i<12;i++)
        {
            var oo = this.list2[i];
            var vo = MonsterKindVO.getObject(oo.id)
            if(!vo || vo.level > UM.level)
                continue;
            arr.push(oo);
        }
        arr = arr.concat(this.list2.slice(12))
        return arr;
    }

    public getList3(fillMonster){
        var arr = [];
        var mdata = CM.table[MonsterVO.dataKey];
        for(var s in mdata)
        {
            var vo = mdata[s];
            if(fillMonster && vo.type != fillMonster)
                continue;
            var kindVO = MonsterKindVO.getObject(vo.type);
            if(kindVO.level<= UM.level)
                arr.push({
                    id:vo.id,
                    tecType:3
                });
        }
        ArrayUtil.sortByField(arr,['id'],[0]);
        return arr;
    }

    //取更详细的碎片数据
    public levelUp(type,id,fun?){
        var self = this;
        var oo:any = {};

        if(type == 1)
            oo.type = 'main';
        else if(type == 2)
            oo.type = 'ring';
        else if(type == 3)
            oo.type = 'monster';

        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.tec.levelup_tec,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('钱不够');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('低级道具不够');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('高级道具不够');
                return;
            }
            if(msg.fail == 4)
            {
                Alert('已达最大升级等级');
                return;
            }
            if(fun)
                fun();
        });
    }

}
