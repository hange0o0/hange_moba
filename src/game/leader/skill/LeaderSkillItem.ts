class LeaderSkillItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderSkillItemSkin";
    }

    private img: eui.Image;
    private nameGroup: eui.Group;
    private nameText: eui.Label;
    private haveBtn: eui.Image;



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

        this.haveBtn.visible = (UM.tec.use_skill == this.data)

    }



}