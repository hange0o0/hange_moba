class BagItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BagItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private numGroup: eui.Group;
    private numText: eui.Label;



    public hideNum = false;

    public childrenCreated(){
        super.childrenCreated();
    }

    public dataChanged(){
        var vo = PropVO.getObject(this.data.id);
        this.headMC.source = vo.thumb;
        this.nameText.text = vo.propname
        if(this.hideNum)
        {
            this.numGroup.visible = false 
        }
        else
        {
            this.numGroup.visible = true 
            this.numText.text = this.data.num
        }
           
    }
}