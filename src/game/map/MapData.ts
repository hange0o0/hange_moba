class MapData {
    private static _instance:MapData;
    public static getInstance():MapData {
        if (!this._instance)
            this._instance = new MapData();
        return this._instance;
    }
    public showCD = 5;


    public level = 1;

    public monsterHurts:any = {};//每个怪对BOSS造成的伤害
    public bossCD = 0;

    public pkList = []//pk中的队列(打完这个BOSS用的卡牌)
    public bakList = []//接着出场的队列(不参与打完这个BOSS)
    public pkPool = []//pk生成的队列
    public pkPoolLevel = 0;//生成PKPool标识


    public currentBossHp = 0
    public currentBossMaxHp = 0

    public lastPKTime = 0  //上次PK胜利结束时间
    public awardValue = 0
    public pkValue = 0
    public scoreValue = 0
    public lastAwardTime = 0
    public lastPKData;
    public constructor() {
        this.initData(null);
    }

    public initData(data){
        this.resetPKPool();
    }

    //重置怪物池
    private resetPKPool(){
        if(this.pkPoolLevel != UM.level)
        {
            this.pkPoolLevel = UM.level;
            var list = MonsterVO.getListByLevel(UM.level);
            if(this.pkPool.length > 0)
            {

                var addArr = []
                for(var i=0;i<7;i++)
                {
                    var vo = this.pkPool.pop();
                    var index = list.indexOf(vo);
                    list.splice(index,1);
                    addArr.push(vo);
                }
                this.pkPool = list.concat(addArr);
            }
            else
            {
                this.pkPool = list
            }
        }
    }

    private resetBakList(){
        while(this.bakList.length < 10)
        {
            this.bakList.push(this.getOneID());
        }
    }

    //取要出战的ID
    private getPKID(){
        return this.bakList.shift() || this.getOneID()
    }
    //生成一个ID
    private getOneID(){
        var index = Math.floor(Math.random() * (this.pkPool.length - 7));
        var vo = this.pkPool[index]
        this.pkPool.splice(index,1);
        this.pkPool.push(vo);
        return vo.id;
    }

    public getBossVO(){
        var seed = this.lastPKTime;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        var list = MonsterVO.getListByLevel(this.level);
        return  list[Math.floor(rd*list.length)];
    }

    //计算数据
    public reInit(){
        //if(!this.lastPKTime)
        //{
            this.lastPKTime = TM.now();
        //}

        var cd = this.getCurrentCD();  //打完一个BOSS需要的时间
        var passcd = TM.now() - this.lastPKTime;
        var addNum =  Math.floor(passcd/cd)
        var leaveTime =  cd - (passcd%cd);
        if(addNum) //要结算
        {
            this.pkValue += addNum;
            this.awardValue += this.getCurrentAward()*addNum;
            this.lastPKTime += cd * addNum;
            var awardMax = this.getAwardMax();
            if(this.awardValue > awardMax)
                this.awardValue = awardMax

            this.currentBossMaxHp = 0;
        }

        var pkEndNum = Math.ceil(leaveTime / this.showCD);
        var needNum = pkEndNum;
        while(this.pkList.length < needNum)
        {
            this.pkList.push(this.getPKID());
        }

        if(this.currentBossMaxHp == 0) //重新计算BOSSHP
        {
            this.resetBossHp();
            var rate = needNum/Math.ceil(cd / this.showCD);
            this.currentBossMaxHp = Math.ceil(this.currentBossHp/rate);
        }
        else //移除用过的 pkList
        {
            if(this.pkList.length > needNum)
            {
                this.pkList = this.pkList.slice(-needNum);
                this.resetBossHp();
            }
        }

        this.resetBakList();
    }

    //一个卡牌出战完毕
    public onPKOneFinish(){
        var id = this.pkList.shift();
        this.currentBossHp -= this.monsterHurts[id];
    }

    public onKillBoss(){
        this.reInit();
    }



    //重新计算BOSS血量
    private resetBossHp(){
        this.currentBossHp = 0
        for(var i=0;i<this.pkList.length;i++)
        {
            var id = this.pkList[i];
            this.currentBossHp += this.monsterHurts[id];
        }
    }

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
        this.bossCD = Math.ceil(bossData.hp/totalHurt) * this.showCD

        return this.bossCD;
    }

    //取怪物对BOSS的伤害值
    public getMonsterHurts(mid,boss){
        var mValue = MonsterManager.getInstance().getMonsterValue(mid);
        var bossTime = Math.ceil(mValue.hp / boss.atk); //boss攻击我的次数
        var mTime = Math.floor(bossTime*mValue.speed/boss.speed); //我在死之前的攻击次数
        return mTime * mValue.atk;
    }

    public getBoss(){
         var base = {
             atk:90,
             hp:1000,
             speed:50,
         }
        var force = Math.ceil(Math.pow(this.level,1.2));
        base.atk *= force;
        base.hp *= force*50;

        return base;
    }

    //每胜一场奖励积分
    public getCurrentAward(){
       return Math.ceil(Math.pow(this.level,1.2));
    }

    //奖励上限
    public getAwardMax(){
        return 100 * this.getCurrentAward();
    }

    public getExCoin(v){
        return Math.floor(v*5);
    }

    public getExCard(v){
        return Math.floor(v/20);
    }

    public getExCardNeed(v){
        return Math.floor(v*20);
    }



}