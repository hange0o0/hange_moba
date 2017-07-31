class MapData {
    private static _instance:MapData;
    public static getInstance():MapData {
        if (!this._instance)
            this._instance = new MapData();
        return this._instance;
    }
    public showCD = 5;
    public maxBossTimes = 10;


    public serverBossCD = 0;



    public monsterHurts:any = {};//每个怪对BOSS造成的伤害
    public monsterValues:any = {};//每个怪对BOSS造成的伤害
    public bossCD = 0;

    //public pkList = []//pk中的队列(打完这个BOSS用的卡兵)
    //public bakList = []//接着出场的队列(不参与打完这个BOSS)
    //public pkPool = []//pk生成的队列
    //public pkPoolLevel = 0;//生成PKPool标识


    //public currentBossHp = 0
    //public currentBossMaxHp = 0
    //public setDisplayTime = 0;


    public level = 1;
    public maxLevel = 1;
    public step = 1;  //打最高关BOSS的次数
    public lastTime = 0  //上次PK胜利结束时间
    public bag = 0
    public pkValue = 0
    public value = 0
    //public lastAwardTime = 0
    public enemy; //通辑令数据



    public constructor() {
        //this.initData(null);
    }

    public initData(){
        this.fillData(UM.pk_common.map || {});
        //this.resetPKPool();
    }

    public addValue(v){
        if(!v)
            return;
        this.value += v;
        EM.dispatchEventWith(GameEvent.client.map_value_change)
    }

    public fillData(map){
        this.level = map.level || 1;
        this.value = map.value || 0;
        this.maxLevel = map.max_level || 1;
        this.bag = map.bag || 0;
        this.pkValue = map.pk_value || 0;
        this.step = map.step || 0;
        this.lastTime = map.lasttime || 0;

        this.enemy = map.enemy;

        this.serverBossCD = map.cd || 0;
    }

    ////重置怪物池
    //private resetPKPool(){
    //    if(this.pkPoolLevel != UM.level)
    //    {
    //        this.pkPoolLevel = UM.level;
    //        var list = MonsterVO.getListByLevel(UM.level);
    //        if(this.pkPool.length > 0)
    //        {
    //
    //            var addArr = []
    //            for(var i=0;i<7;i++)
    //            {
    //                var vo = this.pkPool.pop();
    //                var index = list.indexOf(vo);
    //                list.splice(index,1);
    //                addArr.push(vo);
    //            }
    //            this.pkPool = list.concat(addArr);
    //        }
    //        else
    //        {
    //            this.pkPool = list
    //        }
    //    }
    //}

    //private resetBakList(){
    //    while(this.bakList.length < 10)
    //    {
    //        this.bakList.push(this.getOneID());
    //    }
    //}

    //取要出战的ID
    //private getPKID(){
    //    return this.getOneID();//this.bakList.shift() ||
    //}
    ////生成一个ID
    //private getOneID(){
    //    var index = Math.floor(Math.random() * (this.pkPool.length - 7));
    //    var vo = this.pkPool[index]
    //    this.pkPool.splice(index,1);
    //    this.pkPool.push(vo);
    //    return vo.id;
    //}

    public getBossVO(){
        var seed = this.lastTime;
        seed = ( seed * 6075 + 106 ) % 1283;
        var rd = seed / ( 1283.0 );
        var list = MonsterVO.getListByLevel(this.level);
        return  list[Math.floor(rd*list.length)];
    }

    //当前正在PK的对像已经过的时间
    //public getPKPass(){
    //    var passcd = TM.now() - this.lastTime;
    //    return passcd%this.showCD;
    //}

    //计算数据
    public reInit(){
        var cd = this.getCurrentCD();  //打完一个BOSS需要的时间
        var passcd = TM.now() - this.lastTime;
        var addNum =  Math.floor(passcd/cd)

        if(addNum) //要结算
        {
            this.pkValue += addNum;
            this.bag += this.getCurrentAward()*addNum;
            this.lastTime += cd * addNum;
            var awardMax = this.getAwardMax();
            if(this.bag > awardMax)
                this.bag = awardMax
        }
    }

    //public getNeedNum(){
    //    var cd = this.getCurrentCD();  //打完一个BOSS需要的时间
    //    return Math.round(cd / this.showCD);
    //}

    //public setPKDisplayData(){
    //    if(this.setDisplayTime == this.lastTime)  //都是同一批次，不用重新计算
    //    {
    //        this.resetHp();
    //        return;
    //    }
    //    var needNum = this.getNeedNum();
    //    var cd = this.getCurrentCD()
    //    if(this.setDisplayTime + cd == this.lastTime) //相邻的批次
    //    {
    //        this.pkList.splice(0,needNum-1);
    //    }
    //    else //相差太远，重置
    //    {
    //        this.pkList.length = 0;
    //    }
    //    this.setDisplayTime = this.lastTime;
    //    var count = needNum + 10
    //    while(this.pkList.length < count)
    //    {
    //        this.pkList.push(this.getPKID());
    //    }
    //    //this.resetBakList();
    //
    //    //计算血量
    //    this.resetHp();
    //}

    //private resetHp(){
    //    var needNum = this.getNeedNum();
    //    var pkIndex = this.getPKingIndex();
    //    this.currentBossHp = 0
    //    this.currentBossMaxHp = 0
    //    for(var i=0;i<needNum;i++)
    //    {
    //        var id = this.pkList[i];
    //        this.currentBossMaxHp += this.monsterHurts[id];
    //        if(i>= pkIndex)
    //            this.currentBossHp += this.monsterHurts[id];
    //    }
    //}


    //当前正在打的坐标
    //public getPKingIndex(){
    //    var passCD = (TM.now() - this.lastTime);
    //    return Math.floor(passCD / this.showCD);
    //}

    ////一个卡兵出战完毕
    //public onPKOneFinish(){
    //    var id = this.pkList.shift();
    //    this.currentBossHp -= this.monsterHurts[id];
    //}

    //public onKillBoss(){
    //    this.reInit();
    //    this.setPKDisplayData();
    //}



    ////重新计算BOSS血量
    //private resetBossHp(){
    //    var rate = needNum/Math.ceil(cd / this.showCD);
    //    this.currentBossMaxHp = 0
    //    this.currentBossMaxHp = 0
    //    for(var i=0;i<this.pkList.length;i++)
    //    {
    //        var id = this.pkList[i];
    //        this.currentBossHp += this.monsterHurts[id];
    //    }
    //}

    public getCurrentCD(){
        var key = UM.getForce() + '_' + this.level;
        if(key == this.monsterHurts.key)
            return this.bossCD;
        var bossData = this.getBoss();
        var totalHurt = 0;
        this.monsterHurts = {key:key};
        var list = MonsterVO.getListByLevel(UM.level);
        for(var i=0;i<list.length;i++)
        {
            var mid = list[i].id;
            var hurt = this.getMonsterHurts(mid,bossData);
            this.monsterHurts[mid] = hurt;
            totalHurt += hurt;
        }
        totalHurt /= list.length;//平均伤害值
        this.bossCD = Math.max(30,Math.ceil(bossData.hp/totalHurt) * this.showCD)

        return this.bossCD;
    }

    //取怪物对BOSS的伤害值
    public getMonsterHurts(mid,boss){
        var mValue = MonsterManager.getInstance().getMonsterValue(mid);
        this.monsterValues[mid] = mValue;
        var bossTime = Math.ceil(mValue.hp / boss.atk); //boss攻击我的次数
        var mTime = Math.floor(bossTime*mValue.speed/boss.speed); //我在死之前的攻击次数
        return Math.max(1,mTime) * mValue.atk;
    }

    public getBoss(){
         var base = {
             atk:90,
             hp:600,
             speed:50,
         }
        var force =Math.pow(1+this.level/2,1.3);
        base.atk = Math.floor(force*base.atk);
        base.hp = Math.floor(force*20*base.hp);

        return base;
    }

    //每胜一场奖励积分
    public getCurrentAward(){
       return Math.ceil(Math.pow(this.level,1.3));
    }

    //奖励上限
    public getAwardMax(){
        return (140 +this.level *10) * this.getCurrentAward();
    }

    public getExCoin(v){
        return Math.floor(v*2);
    }

    public getExCard(v){
        return Math.floor(v/50);
    }

    public getExCardNeed(v){
        return Math.floor(v*50);
    }



}