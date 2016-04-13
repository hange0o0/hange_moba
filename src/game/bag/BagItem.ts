class BagItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BagItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;


    public hideNum = false;

    public childrenCreated(){
        super.childrenCreated();
    }

    public dataChanged(){
        var vo = PropVO.getObject(this.data.id);
        this.headMC.source = vo.thumb;
        if(this.hideNum)
           this.nameText.text = vo.propname
        else
           this.nameText.text = vo.propname  + '\nX' + this.data.num
    }
}