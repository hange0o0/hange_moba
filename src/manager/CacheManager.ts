var $cache;
class CacheManager{

    private static _instance:CacheManager;
    public static getInstance():CacheManager {
        if (!this._instance)
            this._instance = new CacheManager();
        return this._instance;
    }
    public registerData = {};
    public table = {};

    private cacheLoad = {};

    public constructor() {
        this.register(MonsterVO);
        this.register(MainGameVO);
        this.register(MonsterKindVO);
        this.register(PropVO);
        this.register(RingVO);
    }

    private register(cls)
    {
        this.registerData[cls.dataKey] = cls;
    }

    //初始化数据
    public initData(data){
        for(var s in data)
        {
            if(!this.table[s])
                this.table[s] = {};
            if(this.registerData[s])
            {
                var cls = this.registerData[s];
                var key = cls.key;
                var oo = data[s];
                for(var ss in oo)
                {
                    var vo:any = new cls();
                    vo.fill(oo[ss]);
                    this.table[s][vo[key]] = vo;
                }
            }
        }
    }

    public loadCache(url,fun){
        if(this.cacheLoad[url])
        {
            if(fun)
                fun();
            return;
        }
        RES.getResAsync(url,function(){
            this.cacheLoad[url] = true;
            this.initData(RES.getRes(url));
            if(fun)
                fun();
        },this)
    }
}
