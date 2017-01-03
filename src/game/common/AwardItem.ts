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
                this.mc.source = 'diamond'
                break;
            }
            case 'coin':
            {
                this.mc.source = 'coin'
                break;
            }
            case 'energy':
            {
                this.mc.source = 'coin'
                break;
            }
            case 'exp':
            {
                this.mc.source = 'exp'
                break;
            }
            case 'card':
            {
                this.mc.source = 'card'
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