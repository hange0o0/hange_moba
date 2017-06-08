class MapCode {
    private static _instance:MapCode;
    public static getInstance():MapCode {
        if (!this._instance)
            this._instance = new MapCode();
        return this._instance;
    }

    public level = 1;

    public monsterHurts:any = {};//每个怪对BOSS造成的伤害
    public bossCD = 0;


    public constructor() {

    }

    public resetCD(){
        var key = UM.getForce() + '_' + this.level;
        if(key == this.monsterHurts.key)
            return
        var bossData = this.getBoss();
        var totalHurt = 0;
        this.monsterHurts = {key:key};
        var list = MonsterVO.getListByLevel(UM.level);
        for(var i=0;i<list.length;i++)
        {
            var mid = list[i].id;
            var hurt = this.getMonsterHurts(mid,bossData);
            this.monsterHurts = hurt;
            totalHurt += hurt;
        }
        totalHurt /= list.length;//平均伤害值
        this.bossCD = Math.ceil(bossData.hp/totalHurt) * 5
    }

    //取怪物对BOSS的伤害值
    public getMonsterHurts(mid,boss){
        var mValue = MonsterManager.getInstance().getMonsterValue(mid);
        var bossTime = Math.ceil(mValue.hp / boss.atk); //boss攻击我的次数
        var mTime = bossTime*Math.floor(mValue.speed/boss.speed); //我在死之前的攻击次数
        return mTime * mValue.atk;
    }

    public getBoss(){
         var base = {
             atk:90,
             hp:100,
             speed:50,
         }
        base.atk *= this.level;
        base.hp *= this.level*50;

        return base;
    }

    public getCurrentCD(){

    }


}