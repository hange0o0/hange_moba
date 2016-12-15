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
    public sortIndex


    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){

        this.name = data.name;
        this.des = data.des.replace(/\[/g,'<font color="#c71585">').replace(/\]/g,'</font>');
        this.mid = data.mid;
        this.index = data.index;
        this.mv = data.mv;
        this.sp = (data.sp || '').split('|');

        this.id = this.mid + '_' + this.index;
        if(this.index == 0)
            this.type = 1;
        else if(this.index < 10)
            this.type = 2;
        else
            this.type = 3;


        var spType = ['TYPE','XTYPE','STYPE','CD',''];
        this.sortIndex =  this.type*100000 + (spType.indexOf(this.sp[0]) + 1)*10000 + parseInt(this.sp[1] || '0')*100 +  this.index
    }


}