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
    public mv

    public tecType = 2;

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
        this.mv = data.mv;
    }

    public getDes(level){
        return  this.des.replace(/\$\$/g,this.getRingAdd(level));
    }

    public getRingAdd(level){
        return this.begin + level*this.step;
    }

    public get thumb(){
        return 'head_png';
    }

    public getSkillVO(){
         return {
             name:this.name,
             des:'',
             type:4,
             mv:this.mv
         }
    }


}