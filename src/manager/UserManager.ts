class UserManager {
    public constructor() {

    }

    private static _instance: UserManager;

    public static getInstance():UserManager{
        if(!UserManager._instance)
            UserManager._instance = new UserManager();
        return UserManager._instance;
    }



    public openid: string;
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


    public fill(data:any):void{
        this.openid = data.gameid;
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
    }

    public getDiamond(){
        return this.diamond.free + this.diamond.rmb;
    }

    public getForce(){
        return this.tec_force + this.award_force;
    }

    public getEnergy(){
        if(!DateUtil.isSameDay(this.energy.t))
        {
            this.energy.v = Math.min(50,this.energy.v + 30);
            this.energy.t = TM.now();
        }
        return this.energy.v + this.energy.rmb;
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
            this.friends.v = Math.max(10,this.friends.v);
            this.friends.tk = Math.max(20,this.friends.tk);
            this.friends.t = TM.now();
        }
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
        var typeAdd = this.getTecAdd('main',this.tec.main[vo.type]);
        var monsterAdd = this.getTecAdd('monster',this.tec.monster[id]);
        oo.atk += typeAdd + monsterAdd;
        oo.hp += typeAdd + monsterAdd;
        oo.speed += typeAdd + monsterAdd;
        return oo;
    }

    private getTecAdd(type,level=0){
        if(!level)
            return 0;
        if(type == 'main')
            return level;
        if(type == 'monster')
        {
            var count = 0;
            for(var i=1;i<=level;level ++)
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

    public getMonsterCollect(monsterID){
        var vo = MonsterVO.getObject(monsterID);
        var max = vo.collect;
        if(this.collect.level[monsterID])
        {
            max = Math.max(max,this.collect.level[monsterID]);
        }
        return max;
    }
}
                                