class MonsterVO {
    public static dataKey = 'monster_base';
    public static key = 'id';
    public static getObject(id: any): MonsterVO{
        return CM.table[this.dataKey][id];
    }
    public static initFinish(){
        var data = CM.table[this.dataKey];
        for(var s in data)
        {
            var vo = data[s];
            vo.initSkill();
        }
    }



    public id
    public name
    public des
    public hp
    public atk
    public speed
    public level
    public type//高中低费
    public cost
    public mp
    //public collect
    //public kind//arr
    //public effect_kind //arr
    public sn
    public sn1
    public sn2
    public sn3
    public sn4
    public sn5
    public sfn1
    public sfn2
    public sfn3
    public sfn4
    public sfn5

    //0，近程，1远程对方，2远程对方子弹,3远程已方
    public mvType1:any = [{type:0,id:6},{type:1,id:16},{type:2,id:10,id2:28}]
    public mvType2:any = [{type:3,id:136}]
    //public mvType1 = {type:0,mv:[6,16,136]}
    //public mvType2 = {type:2,mv:[10,28]}
    public mvList = ['skill6_png','skill6_json','skill16_png','skill16_json','skill136_png','skill136_json','skill10_png','skill10_json',];

    public mv1 = []  //作为出战要用的技能动画
    public mv2 = []  //作为辅助要用的技能动画

    public constructor(data?: any) {
        if(data)
            this.fill(data);
        //this.mvType1.type = Math.random()>0.5?0:1;
        //this.mvType2.type = Math.random()>0.5?0:3;

    }

    public fill(data){
        this.id = data.id;
        this.name = data.name;
        this.des = data.des;
        this.hp = data.hp;
        this.atk = data.atk;
        this.speed = data.speed;
        this.level = data.level;
        this.mp = data.mp;
        this.cost = data.cost;

        if(this.cost < 10)
            this.type = 1;
        else if(this.cost < 20)
            this.type = 2;
        else
            this.type = 3

        //this.effect_kind = data.effect_kind;

        //this.initSkill('sn',data);
        //
        //this.initSkill('sn1',data);
        //this.initSkill('sn2',data);
        //this.initSkill('sn3',data);
        //this.initSkill('sn4',data);
        //this.initSkill('sn5',data);
        //
        //this.initSkill('sfn1',data);
        //this.initSkill('sfn2',data);
        //this.initSkill('sfn3',data);
        //this.initSkill('sfn4',data);
        //this.initSkill('sfn5',data);


        this.mvList = [];
        this.mvType1 = [];
        this.mvType2 = [];
        if(data.mv1)
            this.addMV(data.mv1,this.mvType1)
        if(data.mv2)
            this.addMV(data.mv2,this.mvType2)

    }

    private addMV(mv,dataArr){
        var arr = mv.split(',');
        for(var i=0;i<arr.length;i++)
        {
            var temp = arr[i].split('|');
            var oo = {type:temp[0],id:temp[1]}
            dataArr.push(oo)
            this.pushLoadKey(oo.id);
            if(oo.type == 2)
            {
                oo['id2'] = temp[2]
                this.pushLoadKey(oo['id2']);
                if(!oo['id2'])
                {
                    throw new Error('monster' + this.id)
                }
            }
        }
    }

    private pushLoadKey(id){
        this.mvList.push('skill' + id + '_json');
        this.mvList.push('skill' + id + '_png');
    }

    public initSkill(){
        this.sn = MonsterSkillVO.getObject(this.id + '_' + 0);
        this.sn1 = MonsterSkillVO.getObject(this.id + '_' + 1);
        this.sn2 = MonsterSkillVO.getObject(this.id + '_' + 2);
        this.sn3 = MonsterSkillVO.getObject(this.id + '_' + 3);
        this.sn4 = MonsterSkillVO.getObject(this.id + '_' + 4);
        this.sn5 = MonsterSkillVO.getObject(this.id + '_' + 5);
        this.sfn1 = MonsterSkillVO.getObject(this.id + '_' + 11);
        this.sfn2 = MonsterSkillVO.getObject(this.id + '_' + 12);
        this.sfn3 = MonsterSkillVO.getObject(this.id + '_' + 13);
        this.sfn4 = MonsterSkillVO.getObject(this.id + '_' + 14);
        this.sfn5 = MonsterSkillVO.getObject(this.id + '_' + 15);

        var MV = VideoMV.getInstance();
        //if(this.sn)
        //    this.mv1.push(MV.getLoadFormKey(this.sn.mv));
        //for(var i=1;i<=5;i++)
        //{
        //    if(this['sn'+i])
        //        this.mv1.push(MV.getLoadFormKey(this['sn'+i].mv));
        //    if(this['sfn'+i])
        //        this.mv2.push(MV.getLoadFormKey(this['sfn'+i].mv));
        //}


    }

    //private initSkill2(key,data){
    //    this[key] = null;
    //    var value = data[key];
    //    if(value)
    //    {
    //        var MV = VideoMV.getInstance();
    //        var arr = value.split('#');
    //        if(arr.length != 3)
    //        {
    //            console.log('error:'+this.id+'---'+key)
    //            throw(new Error('init'));
    //        }
    //        this[key] = {};
    //        var mv = arr[0].split('|');
    //        this[key].mv = mv.shift();
    //        this[key].mvData = mv;
    //        this[key].name = arr[1];
    //        this[key].des = arr[2];
    //
    //        var type = (arr[3] || '').split('|');
    //        this[key].type = type.shift();
    //        this[key].typeData = type;
    //
    //        if(key == 'sn')     //大绝
    //        {
    //            this[key].type = 1;
    //            this.mv1.push(MV.getLoadFormKey(arr[0]))
    //        }
    //        else if(key.substr(0,2) == 'sn') //小技
    //        {
    //            this[key].type = 2;
    //            this.mv1.push(MV.getLoadFormKey(arr[0]))
    //        }
    //        else        //辅助
    //        {
    //            this[key].type = 3;
    //            this.mv2.push(MV.getLoadFormKey(arr[0]))
    //        }
    //
    //    }
    //}

    public get thumb(){
        return Config.localResRoot + 'head/m_head'+this.id+'.jpg';
    }

    public get url(){
        return Config.localResRoot + 'card/monster_'+this.id+'.jpg';
        //return 'full_bg_jpg';
    }

    public getSkillByID(id,isPKing):MonsterSkillVO
    {
        if(id == 0)
            return this.sn;
         if(isPKing)
            return this['sn' + id];
        return this['sfn' + id];
    }


    ////取我的对应宠物的战力加成
    // public getMyForce(){
    //     return UM.getMonsterLevel(this.id) + UM.getMainLevel(this.type)
    // }

}



