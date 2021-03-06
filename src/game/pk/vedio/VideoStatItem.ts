class VideoStatItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoStatItemSkin";
    }

    private icon: eui.Image;
    private valueText: eui.Label;
    private cdText: eui.Label;



    public mcWidth = 80
    public index;
    public baseData = {
        1:{txt:'攻击',stat:'upStat',color:0xFF0000},
        2:{txt:'速度',stat:'upStat',color:0xFF0000},
        3:{txt:'防御',stat:'upStat',color:0xFF0000},
        4:{txt:'伤害',stat:'upStat',color:0xFF0000},
        5:{txt:'血量',stat:'upStat',color:0xFF0000},
        11:{txt:'攻击',stat:'downStat',color:0xFF0000},
        12:{txt:'速度',stat:'downStat',color:0xFF0000},
        13:{txt:'防御',stat:'downStat',color:0xFF0000},
        14:{txt:'伤害',stat:'downStat',color:0xFF0000},
        15:{txt:'血量',stat:'downStat',color:0xFF0000},
        21:{txt:'缴械',stat:'downStat',color:0xFF0000},
        22:{txt:'沉默',stat:'downStat',color:0xFF0000},
        23:{txt:'封印',stat:'downStat',color:0xFF0000},
        24:{txt:'晕眩',stat:'downStat',color:0xFF0000},
        25:{txt:'魅惑',stat:'downStat',color:0xFF0000},
        31:{txt:'魔免',stat:'upStat',color:0xFF0000},
        41:{txt:'治疗',stat:'upStat',color:0xFF0000},
        42:{txt:'失血',stat:'downStat',color:0xFF0000},


        //'miss':{txt:'【闪避】',stat:'infoStat',color:0xFF0000},
        //'nohurt':{txt:'【免伤】',stat:'infoStat',color:0xFF0000},
        //'die':{txt:'【死亡】',stat:'infoStat',color:0xFF0000}


    }

    public childrenCreated() {
        //FE7430   //down
        //FFDC5B


        //this.addBtnEvent(this.closeBtn,this.onKill);
    }

    public dataChanged() {
        if(this.data.id > 100)
        {
            this.icon.source = 'buff_XX_png'
            this.valueText.textColor = 0xFFDC5B
            this.valueText.text = MonsterVO.getObject(this.data.value[0]).getSkillByID(this.data.value[1],this.data.value[2]).name;
        }
        else
        {
            var oo = this.baseData[this.data.id];
            this.icon.source = 'buff_'+this.data.id+'_png'
            if(oo.stat == 'upStat')
                this.valueText.textColor = 0xFFDC5B
            else
                this.valueText.textColor = 0xFE7430
            if(this.data.value)
            {
                if(this.data.value > 0)
                    this.valueText.text = oo.txt + ' +' + this.data.value;
                else
                    this.valueText.text = oo.txt + ' ' + this.data.value;

                if(this.data.id == 3 || this.data.id == 13)
                    this.valueText.text += '%'
            }
            else
                this.valueText.text = oo.txt + ''
        }


        if(this.data.cd)
            this.cdText.text = '/' +(this.data.cd) // || this.data.num
        else
            this.cdText.text = '';
    }
}