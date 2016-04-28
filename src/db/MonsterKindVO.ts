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
    public word
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.level = data.level;
        this.list = data.list;
        this.id = data.id;
        this.restrain = data.restrain;
        this.word = data.word;
    }

    public getBeRestrain(){
        var arr = [];
        var data = CM.table[MonsterKindVO.dataKey];
         for(var s in data)
         {
             if(data[s].restrain.indexOf(this.id) != -1)
                arr.push(s)
         }
        return arr;
    }


}