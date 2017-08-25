class TecManager{
    private static _instance:TecManager;
    public static getInstance():TecManager {
        if (!this._instance)
            this._instance = new TecManager();
        return this._instance;
    }

    public maxLevel = 30;
    public leaderDiamond = 500;

    public list1;
    public list2;
    public constructor() {
        //--13攻击，14血量，15速度，1-12对应属性加强（12个，攻血同加）
        //16伤害增强，17防御增强，18回复增强，19克制加强，20克制压制
        this.list1 = [
            {id:1,tecType:1,name:'金加强',des:'增加【金】属性卡兵$$%攻击力和生命值'},
            {id:2,tecType:1,name:'木加强',des:'增加【木】属性卡兵$$%攻击力和生命值'},
            {id:3,tecType:1,name:'水加强',des:'增加【水】属性卡兵$$%攻击力和生命值'},
            {id:4,tecType:1,name:'火加强',des:'增加【火】属性卡兵$$%攻击力和生命值'},
            {id:5,tecType:1,name:'土加强',des:'增加【土】属性卡兵$$%攻击力和生命值'},
            {id:6,tecType:1,name:'',des:''},
            {id:7,tecType:1,name:'',des:''},
            {id:8,tecType:1,name:'',des:''},
            {id:9,tecType:1,name:'',des:''},
            {id:10,tecType:1,name:'',des:''},
            {id:11,tecType:1,name:'',des:''},
            {id:12,tecType:1,name:'',des:''},
            {id:13,tecType:1,name:'攻击强化',des:'增加所有卡兵$$%攻击力'},
            {id:14,tecType:1,name:'生命强化',des:'增加所有卡兵$$%生命值'},
            {id:15,tecType:1,name:'速度强化',des:'增加所有卡兵$$%速度'},
            {id:16,tecType:1,name:'伤害强化',des:'当攻击其它卡兵时，所造成的伤害增加$$%'},
            {id:17,tecType:1,name:'防御强化',des:'当受到其它卡兵攻击时，造成的伤害减少$$%'},
            {id:18,tecType:1,name:'回复强化',des:'受治疗的效果加强$$%'},
            {id:19,tecType:1,name:'克制强化',des:'对其它卡兵的克制效果加成$$%'},
            {id:20,tecType:1,name:'克制压制',des:'被其它卡兵的克制影响减少$$%，极限情况是不受克制'}
        ];
        //this.list2 = ObjectUtil.objToArray(CM.table[RingVO.dataKey]);
        ArrayUtil.sortByField(this.list2,['id'],[0]);

    }

    //level是指目标等级
    public needCoin(mid,level){
        var cost = MonsterVO.getObject(mid).cost;
        //=FLOOR(POWER(A1,2.4)*(10*(A1/5+1)),1)+38*FLOOR(A1,1)
        return Math.floor((Math.pow(level,2.5)*(10*(level/5 + 1))) +38*Math.floor(Math.pow(level,1.5)) * (1+cost/100));  //
    }
    public collectNeed(mid,level){   //升级需要碎片数量
        //=FLOOR(POWER(1.25,A30)*(A30*0.6) + A30,1)
        var targetFun = function(level){
             return (Math.pow(1.3,level)*level*0.6 + level)
        }
        var cost = MonsterVO.getObject(mid).cost;
        return Math.floor((targetFun(level) - targetFun(level - 1)) * (1+cost/100)); // * (1+cost/100)
    }

    ////得到指定怪物的升级时显示的碎片信息
    //public collectRate(id){
    //    var lv = UM.getMonsterLevel(id);
    //    var now = UM.card;
    //    var need = this.collectNeed(lv + 1);
    //    if(lv == 0)
    //    {
    //        return [now,need]
    //    }
    //    //var last = this.collectNeed(lv)
    //    if(lv == this.maxLevel)
    //        return [now,0];
    //    return [now,need];
    //}



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
            //var vo = MonsterKindVO.getObject(oo.id)
            //if(!vo || vo.level > UM.level)
            //    continue;
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
            //var vo = MonsterKindVO.getObject(oo.id)
            //if(!vo || vo.level > UM.level)
            //    continue;
            arr.push(oo);
        }
        arr = arr.concat(this.list2.slice(12))
        return arr;
    }

    public getList3(fillMonster){
        var arr = [];
        var mdata = CM.table[MonsterVO.dataKey];
        var HM = HonorManager.getInstance()
        for(var s in mdata)
        {
            var vo = mdata[s];
            if(fillMonster && vo.type != fillMonster)
                continue;
            //var kindVO = MonsterKindVO.getObject(vo.type);
            if(vo.level<= UM.level + 1)
            {
                var oo = {
                    list:arr,
                    id:vo.id,
                    lv:UM.getMonsterLevel(vo.id),
                    openLevel:vo.level,
                    tecType:3
                }
                if(MonsterVO.getObject(oo.id).level > UM.level)
                    oo['toLast'] = true;
                HM.fillAwardStat(oo);
                arr.push(oo);
            }

        }
        //ArrayUtil.sortByField(arr,['id'],[0]);
        return arr;
    }

    public levelUp(type,id,fun?){
        var self = this;
        var oo:any = {};
        var force = UM.getForce();

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
            SoundManager.getInstance().playEffect(SoundConfig.effect_m_up);
            ShowTips('升级成功，战力' + MyTool.createHtml('　+'+(UM.getForce() - force),0xE0A44A))
            if(fun)
                fun();
        });
    }







    public leaderGet(type,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;

        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_get,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('时间未到');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('钻石不够');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('已有列表');
            }
            else if(msg.isFree)
            {
                UM.tec.leader.lasttime = TM.now();
            }
            UM.tec.leader.list = msg.list;

            if(fun)
                fun();
        });
    }

    public leaderAward(ids,fun?){
        var self = this;
        var oo:any = {};
        oo.ids = ids;

        Net.addUser(oo);
        Net.send(GameEvent.tec.leader_award,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到原始数据');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('选择数量不对');
                return;
            }
            UM.tec.leader.list = null;

            if(fun)
                fun();
        });
    }

}
