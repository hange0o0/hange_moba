class LeaderSkillItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderSkillItemSkin";
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
       var vo = LeaderSkillVO.getObject(this.data);
        this.img.source = vo.thumb
        this.nameText.text = vo.name;
    }



    public dataChanged(){

    }



}