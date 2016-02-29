class MainGameVO {
    public static dataKey = 'main_game';
    public static key = 'level';
    public static getObject(id: number): MainGameVO{
        return CM.table[this.dataKey][id];
    }
    public static maxLevel = 300;//最大关卡数


    public level
    public list //arr
    public ring
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.level = data.level;
        this.list = data.list;
        this.ring = data.ring;
    }


}