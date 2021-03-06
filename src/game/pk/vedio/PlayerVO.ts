//单个玩家数据
class PlayerVO {
    public id = 0;
    public mid = 0;
    public mvo;
    public isPKing = false;    //是否在场上


    public hp = 0;
    public maxHp = 0;
    public atk = 0;
    public speed = 0;

    public mp = 0;
    public maxMp = 0;
    public tag = '';
    public actionCount = 0;
    public index;

    public teamID;

    public displayMC:any;  //关联的显示对象

    public buffList = [];

    public hurtCount = 0
    public healCount = 0


    public orginData = {};
    public constructor(oo?,oo2?) {
        if(oo)
        {
             this.fill(oo,oo2);
        }
    }

    public fill(oo,oo2){
        //{"hp":40000000,"mid":107,"id":10}  add_hp,..
        //{"rl":0,"r":1,"tl":null,"mb":{"101":{"hp":100,"atk":30,"speed":51}}
        var baseData = oo2.mb[oo.mid];
        this.hp = oo.hp;

        this.maxHp = baseData.hp + (oo.add_hp || 0);
        this.atk = baseData.atk + (oo.add_atk || 0);
        this.speed = baseData.speed + (oo.add_speed || 0);

        this.mp = 0;
        this.hurtCount = 0;
        this.healCount = 0;
        this.actionCount = 0;
        this.tag = '';

        this.id = oo.id;
        this.mid = oo.mid;
        this.mvo = MonsterVO.getObject(this.mid);

        this.maxMp = this.mvo.mp;

        this.buffList = [];

        if(oo.add_hp)
        {
            this.buffList.push({id:5,value:oo.add_hp})
        }
        if(oo.add_atk)
        {
            this.buffList.push({id:1,value:oo.add_atk})
        }
        if(oo.add_speed)
        {
            this.buffList.push({id:2,value:oo.add_atk})
        }
        this.orginData = this.getSave();
    }

    public addBuff(data,atker){
        var id = data.id;
        //if(id == 24)
        //{
        //    console.log(data)
        //}
        var cd = data.cd;
        var value = data.value;
        if(cd)
            this.buffList.push({id:id,cd:cd,value:value,atker:atker})
        else
        {
            var b = true
            //如果只是去掉之前自己技能产生的效果
            for(var i=0;i<this.buffList.length;i++)
            {
                var item = this.buffList[i];
                if(item.forever && Math.abs(item.value) == Math.abs(value) && item.atker == atker && Math.abs(item.id - id) == 10)
                {
                    this.buffList.splice(i,1);
                    b = false;
                    break;
                }
            }
            if(b)
                this.buffList.push({id:id,forever:true,value:value,atker:atker})
        }

    }

    public cleanBuff(id,cd,value){
         for(var i=0;i<this.buffList.length;i++){
             var oo = this.buffList[i];
             if(oo.id == id && oo.cd == cd && oo.value == value)
             {
                 this.buffList.splice(i,1);
                 break;
             }
         }
    }

    public onAction(){
        for(var i=0;i<this.buffList.length;i++){
            var oo = this.buffList[i];
            if(oo.forever)
                continue;
            oo.cd --;
            if(oo.cd <= 0)
            {
                this.buffList.splice(i,1);
                i--;
            }
        }
    }

    public onDie(){
        for(var i=0;i<this.buffList.length;i++){
            var oo = this.buffList[i];
            if(oo.forever)
                continue;
            this.buffList.splice(i,1);
            i--;
        }
    }


    public getSave()
    {
        var oo:any = {};
        oo.hp = this.hp;
        oo.maxHp = this.maxHp;
        oo.atk = this.atk;
        oo.speed = this.speed;
        oo.mp = this.mp;
        oo.maxMp = this.maxMp;
        oo.ap = this.actionCount;
        oo.buffList = JSON.stringify(this.buffList);
        return oo;
    }

    public fromSave(oo)
    {
        for(var s in oo)
        {
            this[s] = oo[s];
        }
    }

    public addHp(v){
        this.hp += v;
        if(this.hp > this.maxHp)
            this.hp = this.maxHp;
        else if(this.hp < 0)
            this.hp = 0;
    }
    public addMp(v){
        this.mp += v;
        if(this.mp > this.maxMp)
            this.mp = this.maxMp;
        else if(this.mp < 0)
            this.mp = 0;
    }
    public addMaxHp(v){
        this.maxHp += v;
    }
    //public addAtk(v){
    //    this.atk += v;
    //}
    //public addSpeed(v){
    //    this.speed += v;
    //}

    public atkerHP(v){
        if(v > 0)
            this.healCount += v
        else
            this.hurtCount += -v
    }
}