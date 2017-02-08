class AwardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AwardItemSkin";
    }

    private group: eui.Group;
    private mc: eui.Image;
    private desText: eui.Label;




    public childrenCreated() {
        //this.collectItem.showInProp = true;
    }

    public dataChanged() {
        this.desText.text = this.data.des;
        switch(this.data.type)
        {
            case 'diamond':
            {
                this.mc.source = 'prop_diamond_jpg'
                break;
            }
            case 'coin':
            {
                this.mc.source = 'prop_coin_jpg'
                break;
            }
            case 'energy':
            {
                this.mc.source = 'prop_energy_jpg'
                break;
            }
            case 'exp':
            {
                this.mc.source = 'prop_exp_jpg'
                break;
            }
            case 'card':
            {
                this.mc.source = 'prop_card_jpg'
                break;
            }
            default:    //prop
            {
                this.mc.source = PropVO.getObject(this.data.id).thumb;
                break;
            }

        }

    }
}