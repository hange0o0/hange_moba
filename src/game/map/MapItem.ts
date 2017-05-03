class MapItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MapItemSkin";
    }

    private mc: eui.Image;







    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onPK)
        this.anchorOffsetX = 50
        this.anchorOffsetY = 50

    }

    private onPK(){
       MapInfoUI.getInstance().show(this.data)
    }


    public dataChanged(){
        var MM = MapManager.getInstance();
        if(this.data == MM.level)
            this.mc.source = 'map_item2_png'
        else if(MM.getSweepNum(this.data) >= 10)
            this.mc.source = 'map_item1_png'
        else
            this.mc.source = 'map_item3_png'
    }
}