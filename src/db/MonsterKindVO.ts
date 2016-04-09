class MonsterKindVO {
    public static dataKey = 'monster_kind';
    public static key = 'id';
    public static getObject(id: number): MonsterKindVO{
        return CM.table[this.dataKey][id];
    }


    public id
    public level
    public list
    public restrain
    public world
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.level = data.level;
        this.list = data.list;
        this.id = data.id;
        this.restrain = data.restrain;
        this.world = data.world;
    }


}