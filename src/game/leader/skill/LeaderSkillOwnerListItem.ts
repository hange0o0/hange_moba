class LeaderSkillOwnerListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderSkillOwnerListItemSkin";
    }

    private img: eui.Image;
    private nameGroup: eui.Group;
    private nameText: eui.Label;











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