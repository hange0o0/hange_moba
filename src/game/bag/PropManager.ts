class PropManager {
    private static _instance:PropManager;
    public static getInstance():PropManager {
        if (!this._instance)
            this._instance = new PropManager();
        return this._instance;
    }

    public constructor() {

    }

    public getNum(id){
         return UM.getPropNum(id);
    }

    public addProp(id,num){
        if(!UM.prop[id])
        {
            UM.prop[id] = {num:0};
        }
        UM.prop[id].num += num;;
    }

    public getBagList(){
        var arr = [];
        for(var s in UM.prop)
        {
            arr.push({id:s,num:UM.prop[s].num});
        }
        return arr;
    }
}