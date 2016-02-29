class RingVO {
    public static dataKey = 'ring_base';
    public static key = 'id';
    public static getObject(id: number): RingVO{
        return CM.table[this.dataKey][id];
    }
    public static equalLevel = 10;


    public id
    public name
    public des
    public begin
    public step

    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.id = data.id;
        this.name = data.name;
        this.des = data.des;
        this.begin = data.begin;
        this.step = data.step;
    }

    public getLevelDes(level){
        return  this.des;
    }


}