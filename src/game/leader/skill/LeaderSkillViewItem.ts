class LeaderSkillViewItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderSkillViewItemSkin";
    }

    private img: eui.Image;
    private nameGroup: eui.Group;
    private nameText: eui.Label;
    private numText: eui.Label;
    private haveBtn: eui.Image;
    private lockGroup: eui.Group;
    private lockText: eui.Label;











    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick);

    }

    private onClick(){

    }



    public dataChanged(){

    }


}