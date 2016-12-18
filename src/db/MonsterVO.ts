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
    public mvType1 = {type:0,mv:[15]}
    public mvType2 = {type:1,mv:[15]}

    public mv1 = []  //作为出战要用的技能动画
    public mv2 = []  //作为辅助要用的技能动画

    public constructor(data?: any) {
        if(data)
            this.fill(data);

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
        if(this.sn)
            this.mv1.push(MV.getLoadFormKey(this.sn.mv));
        for(var i=1;i<=5;i++)
        {
            if(this['sn'+i])
                this.mv1.push(MV.getLoadFormKey(this['sn'+i].mv));
            if(this['sfn'+i])
                this.mv2.push(MV.getLoadFormKey(this['sfn'+i].mv));
        }
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
        return 'head_png';
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



