class MonsterSkillVO {
    public static dataKey = 'monster_skill';
    public static key = 'id';
    public static getObject(id: any): MonsterSkillVO{
        return CM.table[this.dataKey][id];
    }



    public id
    public mid
    public index
    public mv
    public name
    public sp
    public des

    public type


    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){

        this.name = data.name;
        this.des = data.des;
        this.mid = data.mid;
        this.index = data.index;
        this.mv = data.mv;
        this.sp = data.sp;

        this.id = this.mid + '_' + this.index;
        if(this.index == 0)
            this.type = 1;
        else if(this.index < 10)
            this.type = 2;
        else
            this.type = 3;
    }


}