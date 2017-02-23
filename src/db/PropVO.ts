class PropVO {
    public static dataKey = 'prop';
    public static key = 'id';
    public static getObject(id: number): PropVO{
        return CM.table[this.dataKey][id];
    }
    //public static maxLevel = 300;//最大关卡数


    public id
    public propdes //arr
    public propname
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.id = data.id;
        this.propdes = data.propdes;
        this.propname = data.propname;
    }

    public get thumb(){
        return 'prop_thumb_' + this.id + '_jpg';
    }


}