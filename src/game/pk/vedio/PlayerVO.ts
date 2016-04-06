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

    public displayMC:any;  //关联的显示对象

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
        this.actionCount = 0;
        this.tag = '';

        this.id = oo.id;
        this.mid = oo.mid;
        this.mvo = MonsterVO.getObject(this.mid);
    }

    public getSave()
    {
        var oo:any = {};
        oo.hp = this.hp;
        oo.maxHp = this.maxHp;
        oo.atk = this.atk;
        oo.speed = this.speed;
        oo.mp = this.mp;
        oo.tag = this.tag;
        oo.actionCount = this.actionCount;
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
        var maxMp = 150;
        this.mp += v;
        if(this.mp > maxMp)
            this.mp = maxMp;
        else if(this.mp < 0)
            this.mp = 0;
    }
    public addMaxHp(v){
        this.maxHp += v;
    }
    public addAtk(v){
        this.atk += v;
    }
    public addSpeed(v){
        this.speed += v;
    }
}