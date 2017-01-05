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

    public nick: string;
    public head: string;
    public coin: number;
    public exp: number;
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

    public maxEnergy = 60;


    public fill(data:any):void{
        this.gameid = data.gameid;
        this.landid = data.land_key;
        this.nick = data.nick;
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
    }

    public getDiamond(rmb=false){
        if(rmb)
            return this.diamond.rmb;
        return this.diamond.free + this.diamond.rmb;
    }

    public getForce(){
        return this.tec_force + this.award_force;
    }

    public getMaxEnergy(){

    }

    public getEnergy(){
        var v = this.energy.vip?24:30;
        var t = TM.now();
        var add =   Math.floor((t - this.energy.t)/v)
        if(add > 0)
        {
            this.energy.v = Math.min(this.maxEnergy,this.energy.v + add);
            this.energy.t = this.energy.t + add*v;
            EM.dispatchEventWith(GameEvent.client.energy_change)
        }
        return this.energy.v + this.energy.rmb;
    }

    public getNextEnergyCD(){
        var v = (this.energy.vip?24:30)*60;
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
            tec_force += Math.ceil((i+1)/10);
        }
        return tec_force;
    }

    //计算科技战力
    public getTecForce(){
        var tec_force = 0;
        //科技影响
        function getTecAdd(data){
            var count = 0;
            for(var s in data)
            {
                count += data[s];
            }
            return count;
        }
        tec_force += getTecAdd(this.tec.main);
        tec_force += getTecAdd(this.tec.ring);
        tec_force += getTecAdd(this.tec.monster);
        return tec_force;
    }

    //得到科技对这个怪物的加成
    public getTecMonsterAdd(id){
        var oo = {
            atk:this.getTecAdd('main',this.tec.main[13]),
            hp:this.getTecAdd('main',this.tec.main[14]),
            speed:this.getTecAdd('main',this.tec.main[15])
        }
        var vo = MonsterVO.getObject(id);
        var typeAdd = 0//this.getTecAdd('main',this.tec.main[vo.type]);
        var monsterAdd = this.getTecAdd('monster',this.tec.monster[id]);
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
                count += Math.ceil((i + 1)/10);
            }
            return count;
        }
    }


    public getRingLevel(id){
        return this.tec.ring[id] || 0;
    }
    public getMainLevel(id){
        return this.tec.main[id] || 0;
    }
    public getMonsterLevel(id){
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

    //取显示的大等级
    public getMonsterCollect(monsterID){
        return Math.floor(this.getMonsterLevel(monsterID)/10);
        //var vo = MonsterVO.getObject(monsterID);
        //var max = vo.collect;
        //if(this.collect.level[monsterID])
        //{
        //    max = Math.max(max,this.collect.level[monsterID]);
        //}
        //return max;
    }

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

    public testDiamond(v){
        if(UM.getDiamond() < v)
        {
            Confirm('钻石不足！',function(v){
                if(v == 1)
                {
                    ShopUI.getInstance().show('diamond');
                }
            },['取消','购买'])
            return false;
        }
        return true;

    }
}
                                