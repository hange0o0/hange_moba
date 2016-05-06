class AwardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AwardItemSkin";
    }

    private collectItem: CollectItem;
    private group: eui.Group;
    private mc: eui.Image;
    private desText: eui.Label;



    public childrenCreated() {
        this.collectItem.showInProp = true;
    }

    public dataChanged() {
        this.collectItem.visible = false;
        this.group.visible = false;
        if(this.data.type == 'monster')
        {
            this.collectItem.visible = true;
            this.group.visible = false;
            this.collectItem.data = MonsterVO.getObject(this.data.id);
        }
        else
        {
            this.collectItem.visible = false;
            this.group.visible = true;
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
                default:    //prop
                {
                    this.mc.source = PropVO.getObject(this.data.id).thumb;
                    break;
                }

            }
        }

    }
}