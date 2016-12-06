class VideoStatItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoStatItemSkin";
    }

    private statText: eui.Label;
    private cdText: eui.Label;


    public mcWidth = 80
    public index;
    public baseData = {
        1:{txt:'攻击',stat:'upStat',color:0xFF0000},
        2:{txt:'速度',stat:'upStat',color:0xFF0000},
        3:{txt:'防御',stat:'upStat',color:0xFF0000},
        4:{txt:'伤害',stat:'upStat',color:0xFF0000},
        11:{txt:'攻击',stat:'downStat',color:0xFF0000},
        12:{txt:'速度',stat:'downStat',color:0xFF0000},
        13:{txt:'防御',stat:'downStat',color:0xFF0000},
        14:{txt:'伤害',stat:'downStat',color:0xFF0000},
        21:{txt:'缴械',stat:'infoStat',color:0xFF0000},
        22:{txt:'冷却',stat:'infoStat',color:0xFF0000},
        23:{txt:'沉默',stat:'infoStat',color:0xFF0000},
        24:{txt:'静止',stat:'infoStat',color:0xFF0000},
        25:{txt:'魅惑',stat:'infoStat',color:0xFF0000},
        31:{txt:'魔免',stat:'infoStat',color:0xFF0000},
        41:{txt:'治疗',stat:'infoStat',color:0xFF0000},
        42:{txt:'失血',stat:'infoStat',color:0xFF0000},


        'miss':{txt:'【闪避】',stat:'infoStat',color:0xFF0000},
        'nohurt':{txt:'【免伤】',stat:'infoStat',color:0xFF0000},
        'die':{txt:'【死亡】',stat:'infoStat',color:0xFF0000}


    }

    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {
        var oo = this.baseData[this.data.stat];
        this.currentState = oo.stat
        this.statText.text = oo.txt
        if(this.data.cd)
            this.cdText.text = this.data.cd
        else
            this.cdText.text = '';
    }
}