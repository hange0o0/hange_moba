class UserManager {
    public constructor() {

    }

    private static _instance: UserManager;

    public static getInstance():UserManager{
        if(!UserManager._instance)
            UserManager._instance = new UserManager();
        return UserManager._instance;
    }



    public gameid: string;
    public landid: string;

    public word: string;
    public nick: string;
    public head: string;
    public coin: number;
    public exp: number;
    public uid: number;
    public next_exp: number;
    public level: number;
    public tec_force:number;
    public award_force:number;
    public last_land: number;
    public diamond: any;
    public tec: any;
    public server_game: any;
    public server_game_equal: any;
    public main_game: any;
    public day_game: any;
    public honor: any;
    public active: any;
    public prop: any;
    public collect: any;
    public friends: any;
    public energy: any;
    public pk_common: any;


    public friendtime: number;   //登录时，好友最新消息的时间点
    public maxEnergy = 60;
    public maxLevel = 50;


    public fill(data:any):void{
        this.gameid = data.gameid;
        this.landid = data.land_key;
        this.nick = data.nick;
        this.uid = data.uid;
        this.word = data.word;
        this.head = data.head;
        this.coin = data.coin;
        this.exp = data.exp;
        this.next_exp = data.next_exp;
        this.level = data.level;
        this.tec_force = data.tec_force;
        this.award_force = data.award_force;
        this.last_land = data.last_land;
        this.diamond = data.diamond;//'{"free":0,"rmb":0}'
        this.tec = data.tec;    //'{"main":{},"ring":{},"monster":{}}')
        this.server_game = data.server_game; //{"choose":null,"enemy":null,"exp":0,"win":0,"total":0,"last":0,"time":0,"pkdata":null,"pk":0}
        this.server_game_equal = data.server_game_equal; //{"choose":null,"enemy":null,"exp":0,"win":0,"total":0,"last":0,"max":0,"time":0,"pkdata":null,"pk":0}
        this.main_game = data.main_game;  //'{"choose":null,"level":1,"kill":[],"awardtime":0,"time":0,"pkdata":null}'
        this.day_game = data.day_game;  //'{"level":0,"free":0,"lasttime":0,"rmb":0,"times":0,"pkdata":null}');
        this.honor = data.honor;  //'{"monster":{},"ring":{},"task":{}}');
        this.prop = data.prop; //{id:{num}}
        this.collect = data.collect;     //'{"level":{},"num":{}}')
        this.friends = data.friends; //'{"v":0,"t":0,"tk":0}');//好友相关 每人每天只可发送20条消息
        this.energy = data.energy; //  '{"v":0,"t":0,"rmb":0}'
        this.active = data.active; //  '{task:{}}'
        this.pk_common = data.pk_common; //  '{history:{}}'




        if(!UM.tec.leader)
            UM.tec.leader = {};

        this.initActive();
         DayGameManager.getInstance().resetDay();

        this.friendtime = data.friendtime || 1;
        if(TM.now() - this.friendtime > 3600*24*3)
            this.friendtime = 1;

        Config.pk_version = Math.floor(data.pk_version);
    }

    public initActive(){
        if(!this.active)
            this.active = {};

        if(!UM.active.guess)
            UM.active.guess = {num:0,total:0,win:0,lasttime:0};

        if(this.active.team_pve)
        {
            if(!DateUtil.isSameDay(this.active.team_pve.lasttime))
            {
                if(DateUtil.isSameDay(this.active.team_pve.lasttime+3600*24))//昨天
                {
                    this.active.team_pve.yteam = this.active.team_pve.team;
                }
                this.active.team_pve.team = 0
                this.active.team_pve.lasttime = TM.now();
            }
        }
        else
            this.active.team_pve = {award:[]};


    }

    public getDiamond(rmb=false){
        if(rmb)
            return this.diamond.rmb;
        return this.diamond.free + this.diamond.rmb;
    }

    public addDiamond(value){
        this.diamond.rmb += value;
        EM.dispatch(GameEvent.client.diamond_change)
    }

    public getForce(){
        return this.tec_force + this.award_force;
    }

    public getEnergy(){
        var v = this.getEnergyStep();
        var t = TM.now();
        var add =   Math.floor((t - this.energy.t)/v)
        if(add > 0)
        {
            this.energy.v = Math.min(this.maxEnergy,this.energy.v + add);
            this.energy.t = this.energy.t + add*v;
            EM.dispatchEventWith(GameEvent.client.energy_change)
        }
        return this.energy.v;
    }

    public getEnergyStep(){
        return (this.energy.vip?24:30)*60;
    }

    public getNextEnergyCD(){
        var v = this.getEnergyStep();
        this.getEnergy();
        //if(this.energy.t == TM.now())
        //    return 0;
        return  this.energy.t + v -  TM.now();
    }

    public getFriendPKTimes(){
        this.resetFriend();
        return this.friends.v;
    }
    public getFriendTalk(){
        this.resetFriend();
        return this.friends.tk;
    }

    private resetFriend(){
        if(!DateUtil.isSameDay(this.friends.t))
        {
            this.friends.v = Math.max(FriendManager.getInstance().maxPK,this.friends.v);
            this.friends.tk = Math.max(FriendManager.getInstance().maxTalk,this.friends.tk);
            this.friends.t = TM.now();
        }
    }

    public addHistory(list){
        this.pk_common.history.unshift(list);
        if(this.pk_common.history.length > 20)
            this.pk_common.history.length = 20;
    }

    //取道具数量
    public getPropNum(propID){
        if(this.prop[propID])
            return this.prop[propID].num;
        return 0;
    }

    //计算等级战力
    public getLevelForce(){
        var tec_force = 0;
        //等级影响
        for(var i=1;i<=this.level;i++)
        {
            tec_force += i;//Math.ceil((i+1)/10);
        }
        return tec_force;
    }

    //计算科技战力
    public getTecForce(){
        //return tec_force;
        var tec_force = 0;
        //科技影响
        function getTecAdd(data){
            var count = 0;
            for(var s in data)
            {
                for(var i=1;i<=data[s];i ++)
                {
                    count += i;//ceil((i + 1)/10);
                }
            }
            return count;
        }
        //tec_force += getTecAdd(this.tec.main);
        //tec_force += getTecAdd(this.tec.ring);
        tec_force += getTecAdd(this.tec.monster);
        return tec_force;
    }

    //得到科技对这个怪物的加成
    public getTecMonsterAdd(id,levelLimit = 999){
        var oo = {
            atk:this.getTecAdd('main',this.tec.main[13]),
            hp:this.getTecAdd('main',this.tec.main[14]),
            speed:this.getTecAdd('main',this.tec.main[15])
        }
        var vo = MonsterVO.getObject(id);
        var typeAdd = 0//this.getTecAdd('main',this.tec.main[vo.type]);
        var monsterAdd = this.getTecAdd('monster',Math.min(this.tec.monster[id],levelLimit));
        oo.atk += typeAdd + monsterAdd;
        oo.hp += typeAdd + monsterAdd;
        //oo.speed += typeAdd + monsterAdd;
        return oo;
    }

    public getTecAdd(type,level=0){
        if(!level)
            return 0;
        if(type == 'main')
            return level;
        if(type == 'monster')
        {
            var count = 0;
            for(var i=1;i<=level;i ++)
            {
                count += i;//Math.ceil((i + 1)/10);
            }
            return count;
        }
    }
    
    public getLeaderExp(id){
        if(!this.tec.leader)
            this.tec.leader = {};
        return this.tec.leader[id] || 0
    }
    public getMyLeaderLevel(id,hard?){
        var lv = this.getLeaderLevel(id);
         if(hard)
            return Math.min(lv,TeamDungeonManager.getInstance().hardData[hard - 1].leader);
        return lv;
    }
    public getLeaderLevel(id,addExp=0){
        var leaderExp = this.getLeaderExp(id) + addExp;
        if(leaderExp)
        {
            for(var i=1;i<=30;i++)
            {
                var exp = this.getLeaderExpByLevel(i);
                if(leaderExp < exp)
                    return i - 1;
            }
            return 30;
        }
        return 0;
    }
    public getLeaderExpByLevel(level){
        return Math.floor(Math.pow(level,10/3.5) + 40*level);
    }
    public getLeaderWorldColor(type) {
        switch (type) {
            case 1:
                return 0xFDC04F;
            case 2:
                return 0xFF4747;
            case 3:
                return 0x747DFF;
        }
        return 0xFDC04F;
    }


    public getRingLevel(id){
        return this.tec.ring[id] || 0;
    }
    public getMainLevel(id){
        return this.tec.main[id] || 0;
    }
    public getMonsterLevel(id,hard?){
        if(hard)
            return Math.min(this.getMonsterLevel(id),TeamDungeonManager.getInstance().hardData[hard - 1].level);
        return this.tec.monster[id] || 0;
    }

    public get card(){
        return this.collect.num[0] || 0;
    }
    public set card(v){
        this.collect.num[0] = v;
    }

    //public getCollectNum(id?){
    //    id = 0;
    //    return  this.collect.num[id] || 0
    //}

    ////取显示的大等级
    //public getMonsterCollect(monsterID){
    //    return Math.floor(this.getMonsterLevel(monsterID)/10);
    //    //var vo = MonsterVO.getObject(monsterID);
    //    //var max = vo.collect;
    //    //if(this.collect.level[monsterID])
    //    //{
    //    //    max = Math.max(max,this.collect.level[monsterID]);
    //    //}
    //    //return max;
    //}

    //得到最常用的10个怪
    public getCommonUse(list){
        if(!list)
            return [];
        var obj = {};

        var array = [];
        for(var i=0;i<list.length;i++)
        {
            var temp = list[i].split(',');
            for(var j=0;j<temp.length;j++)
            {
                var id = temp[j];
                obj[id] =  (obj[id] || 0) + 1;
            }
        }

        for(var s in obj)
        {
            array.push({id:s,num:obj})
        }

        ArrayUtil.sortByField(array,['num','id'],[1,0])
        array.length = Math.min(8,array.length);

        return array;
    }

    public getNextDrawCD(){
        var num = UM.active.draw_num || 0;
        var time = UM.active.draw_time || 0;
        if(!DateUtil.isSameDay(time))
            num = 0;
        var nextTime = 0;
        if(num == 3)
            nextTime =  DateUtil.getNextDateTimeByHours(0) - TM.now()
        if(TM.now() - time < 3600*4)
        {
            nextTime = Math.max(nextTime,time + 3600*4 - TM.now())
        }
        return nextTime;
    }

    public getMyCard(){
        return this.pk_common.my_card[0]
    }

    public testDiamond(v){
        if(UM.getDiamond() < v)
        {
            Confirm('钻石不足！\n需要：' +v+'\n当前：'+UM.getDiamond() + '\n是否前往购买钻石？',function(v){
                if(v == 1)
                {
                    ShopUI.getInstance().show('diamond');
                }
            },['取消','购买'])
            return false;
        }
        return true;
    }
    public testCoin(v){
        if(UM.coin < v)
        {
            Confirm('金币不足！\n需要：' +v+'\n当前：'+UM.coin + '\n是否前往购买金币？',function(v){
                if(v == 1)
                {
                    ShopUI.getInstance().show('coin');
                }
            },['取消','购买'])
            return false;
        }
        return true;
    }
    public testCard(v){
        if(UM.card < v)
        {
            Confirm('碎片不足！\n需要：' +v+'\n当前：'+UM.card + '\n是否前往购买碎片？',function(v){
                if(v == 1)
                {
                    ShopUI.getInstance().show('card');
                }
            },['取消','购买'])
            return false;
        }
        return true;
    }
    public testEnergy(v){
        if(UM.getEnergy() < v)
        {
            Confirm('体力不足！\n需要：' +v+'\n当前：'+UM.getEnergy() + '\n是否前往购买体力？',function(v){
                if(v == 1)
                {
                    ShopUI.getInstance().show('energy');
                }
            },['取消','购买'])
            return false;
        }
        return true;

    }
}
                                