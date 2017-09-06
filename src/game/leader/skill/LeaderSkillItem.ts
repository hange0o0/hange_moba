class LeaderSkillItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderItemSkin";
    }

    private headMC: eui.Image;
    private headBG: eui.Image;
    private leaderText: eui.Label;
    private typeMC: eui.Image;
    private starGroup: eui.Group;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private expText: eui.Label;
    private upMC: eui.Image;











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