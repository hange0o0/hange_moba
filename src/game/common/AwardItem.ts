class AwardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AwardItemSkin";
    }

    private group: eui.Group;
    private mc: eui.Image;
    private desText: eui.Label;
    private infoGroup: eui.Group;
    private infoText: eui.Label;
    private newIcon: eui.Image;





    private timer

    public childrenCreated() {
        //this.collectItem.showInProp = true;
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.data.type == 'monster')
        {
            this.newIcon.visible = false;
            MonsterList.getInstance().show([this.data]);
            return;
        }
        if(this.data.type == 'skill')
        {
            LeaderSkillInfoUI.getInstance().show(this.data.id)
            return;
        }
        //this.infoGroup.visible = true;
        //this.timer = egret.setTimeout(function(){
        //    this.infoGroup.visible = false;
        //},this,2000);
    }

    public dataChanged() {
        this.newIcon.visible = false;
        //this.infoGroup.visible = true;
        this.infoGroup.visible = false;
        egret.clearTimeout(this.timer);

        if(this.data.color == 'red')
        {
            this.desText.textColor = 0xFF0000
        }
        else
        {
            this.desText.textColor = 0xCCB48E
        }
        switch(this.data.type)
        {
            case 'diamond':
            {
                this.mc.source = 'prop_diamond_jpg'
                this.desText.text = '钻石\n' + this.data.des;
                //this.infoText.text = '钻石';
                break;
            }
            case 'coin':
            {
                this.mc.source = 'prop_coin_jpg'
                //this.infoText.text = '金币';
                this.desText.text = '金币\n' + this.data.des;
                break;
            }
            case 'energy':
            {
                this.mc.source = 'prop_energy_jpg'
                //this.infoText.text = '体力';
                this.desText.text = '体力\n' + this.data.des;
                break;
            }
            case 'exp':
            {
                this.mc.source = 'prop_exp_jpg'
                //this.infoText.text = '经验';
                this.desText.text = '经验\n' + this.data.des;
                break;
            }
            case 'card':
            {
                this.mc.source = 'prop_card_jpg'
                //this.infoText.text = '碎片';
                this.desText.text = '碎片\n' + this.data.des;
                break;
            }
            case 'g_exp':
            {
                this.mc.source = 'prop_score_jpg'
                //this.infoText.text = '积分';
                this.desText.text = '积分\n' + this.data.des;
                break;
            }
            case 'monster':
            {
                var mvo = MonsterVO.getObject(this.data.id);
                this.mc.source = mvo.thumb;
                this.desText.text = mvo.name;
                this.newIcon.visible = true;
                this.infoGroup.visible = false;
                break;
            }
            case 'skill':
            {
                var svo = LeaderSkillVO.getObject(this.data.id);
                this.mc.source = svo.thumb;
                this.desText.text = svo.name;
                this.infoGroup.visible = false;
                break;
            }
            default:    //prop
            {
                var pvo = PropVO.getObject(this.data.id);
                this.mc.source = pvo.thumb;
                //this.infoText.text = pvo.propname;
                this.desText.text = pvo.propname + '\n' + this.data.des;

                addBtnTips(this,pvo.propdes,true);
                break;
            }

        }

    }
}