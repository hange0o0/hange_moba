class MonsterInfoBaseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MonsterInfoBaseItemSkin";
    }

    private icon: eui.Image;
    private text: eui.Label;
    private titleText: eui.Label;
    private typeText: eui.Label;



    public childrenCreated(){
        this.text.wordWrap = true;
        addBtnTips(this.typeText,this.onTypeText,this)
        addBtnTips(this.icon,this.onIcon,this)
    }

    private onTypeText(){
        switch(this.typeText.text)
        {
            case '【绝招】':
                return '当怒气蓄满后就可以马上释放此技能了';
            case '【前置】':
                return '在双方PK开始前会释放一次的技能';
            case '【血脉】':
                return '满足一定条件就能自动释放的技能';
            case '【法球】':
                return '法球技能会替换掉卡牌的普通攻击';
            case '【天赋】':
                return '卡牌所特有的技能，会无条件生效';
        }
        return '';
    }

    private onIcon(){
        switch(this.data.type)
        {
            case 1:
                return '当怒气蓄满后就可以马上释放此技能了，只有出战单位才有怒气';
            case 2:
                return '单位出战时所使用的技能';
            case 3:
                return '辅助出战单位时所使用的技能';
        }
        return '';
    }

    public dataChanged(){
        var skill = this.data;
        this.icon.source = 'icon_b' + skill.type + '_png'
        this.titleText.text = skill.name
       this.setHtml(this.text,'' + skill.des);

        switch(skill.type)
        {
            case 1:
                this.titleText.textColor = 0xEB911B;
                break;
            case 2:
                this.titleText.textColor = 0x00DEFF;
                break;
            case 3:
                this.titleText.textColor = 0x6fda13;
                break;
        }


        if(skill.type == 1)
        {
            this.typeText.text = '【绝招】'
            this.typeText.textColor = 0xEB911B;
        }
        else
        {
            //['CD','TYPE','XTYPE','XTYPE',''];
            switch(skill.sp[0])
            {
                case 'CD':
                    if(Math.floor(skill.sp[1]) == 0)
                    {
                        this.typeText.text = '【前置】'
                        this.typeText.textColor = 0x3E9942;
                    }
                    else
                    {
                        this.setHtml(this.typeText,'<font color="#C274FF">施法间隔：</font>'+ skill.sp[1] + '')
                    }

                    break;
                case 'TYPE':
                    this.typeText.text = '【血脉】'
                    this.typeText.textColor = 0xC23B32;
                    break;
                case 'XTYPE':
                    this.typeText.text = '【法球】'
                    this.typeText.textColor = 0xBD43D9;
                    break;
                case 'STYPE':
                    this.typeText.text = '【天赋】'
                    this.typeText.textColor = 0x6746A7;
                    break;
               default:
                   this.typeText.text = ''
                    break;
            }
        }


    }
}