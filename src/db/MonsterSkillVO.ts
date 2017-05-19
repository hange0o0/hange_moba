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

    public hideName;


    public mvType = 0
    public mvID1 = 0
    public mvID2 = 0


    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public get pkColor(){
        if(this.type == 1)
        {
            return 0xEB911B;
        }
        else if(this.type == 2)
        {
            return 0x00DEFF;
        }
        else if(this.type == 3)
        {
            return 0x6fda13;
        }
    }

    public fill(data){

        this.name = data.name;
        this.des = data.des.replace(/\[r/g,'<font color="#FF0000">').
            replace(/\[g/g,'<font color="#00FF00">').
            replace(/\[/g,'<font color="#FFFF00">').
            replace(/\]/g,'</font>')//.replace(/$$/g,'\n');
        this.mid = data.mid;
        this.index = data.index;
        this.mv = data.mv;
        this.sp = (data.sp || '').split('|');

        if(data.skillmv)
        {
            this.hideName = data.skillmv.indexOf('[HN]') != -1;
            data.skillmv = data.skillmv.replace('[HN]','');
            var temp = data.skillmv.split('#');
            this.mvType = temp[0]
            this.mvID1 = temp[1]
            this.mvID2 = temp[2]
        }


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