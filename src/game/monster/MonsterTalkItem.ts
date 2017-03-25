class MonsterTalkItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MonsterTalkItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private dingText: eui.Label;
    private caiText: eui.Label;






    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }
}