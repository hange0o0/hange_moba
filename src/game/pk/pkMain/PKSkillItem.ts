class PKSkillItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKSkillItemSkin";
    }

    private img: eui.Image;
    private nameText: eui.Label;




    public index;

    public childrenCreated(){
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick);

    }

    //private onClick(){
    //
    //}



    public dataChanged(){
        var vo = LeaderSkillVO.getObject(this.data);
        this.img.source = vo.thumb
        this.nameText.text = vo.name;
    }



}