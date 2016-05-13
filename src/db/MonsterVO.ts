class MonsterVO {
    public static dataKey = 'monster_base';
    public static key = 'id';
    public static getObject(id: any): MonsterVO{
        return CM.table[this.dataKey][id];
    }



    public id
    public name
    public des
    public hp
    public atk
    public speed
    public type
    public cost
    public wood
    public collect
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

    public mv1 = []  //作为出战要用的技能动画
    public mv2 = []

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
        this.type = data.type;
        this.cost = data.cost;
        this.wood = data.wood;
        this.collect = data.collect;
        //this.kind = data.kind;
        //this.effect_kind = data.effect_kind;

        this.initSkill('sn',data);

        this.initSkill('sn1',data);
        this.initSkill('sn2',data);
        this.initSkill('sn3',data);
        this.initSkill('sn4',data);
        this.initSkill('sn5',data);

        this.initSkill('sfn1',data);
        this.initSkill('sfn2',data);
        this.initSkill('sfn3',data);
        this.initSkill('sfn4',data);
        this.initSkill('sfn5',data);
    }

    private initSkill(key,data){
        this[key] = null;
        var value = data[key];
        if(value)
        {
            var arr = value.split('#');
            if(arr.length != 3)
            {
                console.log('error:'+this.id+'---'+key)
                throw(new Error('init'));
            }
            this[key] = {};
            this[key].mv = arr[0];
            this[key].name = arr[1];
            this[key].des = arr[2];

            if(key == 'sn')     //大绝
            {
                this[key].type = 1;
                this.mv1.push(arr[0])
            }
            else if(key.substr(0,2) == 'sn') //小技
            {
                this[key].type = 2;
                this.mv1.push(arr[0])
            }
            else        //辅助
            {
                this[key].type = 3;
                this.mv2.push(arr[0])
            }

        }
    }

    public get thumb(){
        return 'head_png';
    }

    public get url(){
        return 'full_bg_jpg';
    }

    public getSkillByID(id,isPKing)
    {
        if(id == 0)
            return this.sn;
         if(isPKing)
            return this['sn' + id];
        return this['sfn' + id];
    }

    ////影响指定单位
    //public isEffect(id){
    //    var vo = MonsterVO.getObject(id);
    //    for(var i=0;i<vo.kind.length;i++)
    //    {
    //        if(this.effect_kind.indexOf(vo.kind[i]) != -1)
    //        {
    //            return true;
    //        }
    //    }
    //    return false;
    //}
    //
    ////被指定单位影响
    //public isBeEffect(id){
    //    var vo = MonsterVO.getObject(id);
    //    for(var i=0;i<this.kind.length;i++)
    //    {
    //        if(vo.effect_kind.indexOf(this.kind[i]) != -1)
    //        {
    //            return true;
    //        }
    //    }
    //    return false;
    //}
    //
    ////把影响变成文字
    //public effectWord(arr)
    //{
    //    var arr2 = [];
    //    for(var i=0;i<arr.length;i++)
    //    {
    //        arr2.push(Config.cons[arr[i]]);
    //    }
    //    return arr2;
    //}

     //public getTypeName(){
     //    var obj = {
     //        1:'金',
     //        2:'木',
     //        3:'水',
     //        4:'火',
     //        5:'土'
     //    }
     //    return obj[this.type];
     //}

    ////取我的对应宠物的战力加成
    // public getMyForce(){
    //     return UM.getMonsterLevel(this.id) + UM.getMainLevel(this.type)
    // }

}