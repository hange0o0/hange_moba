class PlayerVO {
    public hp = 0;
    public maxHp = 0;
    public atk = 0;
    public speed = 0;

    public mp = 0;
    public tag = '';
    public actionCount = 0;

    public reset(oo){
        //{"hp":40000000,"mhp":4000000,"spd":5700,"atk":10000,"mid":107,"id":10}  hpadd,atkadd,spdadd
        this.hp = oo.hp;
        this.maxHp = oo.mhp + (oo.hpadd || 0);
        this.atk = oo.atk + (oo.atkadd || 0);
        this.speed = oo.spd + (oo.spdadd || 0);

        this.mp = 0;
        this.actionCount = 0;
        this.tag = '';
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
        this.hp += v;
        this.maxHp += v;
    }
    public addAtk(v){
        this.atk += v;
    }
    public addSpeed(v){
        this.speed += v;
    }
}