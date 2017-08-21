class LeaderListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderListItemSkin";
    }

    private barMC: eui.Group;
    private bar1: eui.Rect;
    private bar2: eui.Rect;
    private maskMC: eui.Rect;
    private headMC: eui.Image;
    private expText: eui.Label;
    private addText: eui.Label;








    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.barMC.mask = this.maskMC

        this.addBtnEvent(this.headMC,this.onHead);

    }

    private onHead(){
        MonsterList.getInstance().showID(this.data.id);
    }



    public dataChanged(){


    }
}