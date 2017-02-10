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

    }

    public dataChanged(){
        var skill = this.data;
        this.icon.source = 'icon_b' + skill.type + '_png'
        this.titleText.text = skill.name
       this.setHtml(this.text,'　　' + skill.des);

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
                        this.setHtml(this.typeText,'施法间隔：<font color="#C274FF">'+ skill.sp[1] + '</font>')
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