class MonsterKind {
    public static dataKey = 'monster_kind';
    public static key = 'id';
    public static getObject(id: number): MonsterKind{
        return CM.table[this.dataKey][id];
    }


    public id
    public level //arr
    public list
    public restrain
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.level = data.level;
        this.list = data.list;
        this.id = data.id;
        this.restrain = data.restrain;
    }


}