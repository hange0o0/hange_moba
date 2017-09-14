class LeaderSkillVO {
    public static dataKey = 'leader_skill';
    public static key = 'id';
    public static getObject(id: number): LeaderSkillVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey];
    }

   public leaderSkill = true;
    public id
    public name //arr
    public des
    public day
    public num
    public skillmv
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.id = data.id;
        this.name = data.name;
        this.des = data.des;
        this.day = data.day;
        this.num = data.num;
        this.skillmv = data.skillmv;
    }

    public get thumb(){
        return Config.localResRoot + 'skill/skill_thumb_'+this.id+'.jpg';
    }

    public getDes(){
        return this.des.replace(/\[r/g,'<font color="#FF0000">').
            replace(/\[g/g,'<font color="#00FF00">').
            replace(/\[/g,'<font color="#FFFF00">').
            replace(/\]/g,'</font>')
    }

    public isOpen(){
        return this.day <= Math.floor((TM.now() - UM.opentime)/3600/24)
    }


}