class LeaderSkillInfoUI extends game.BaseWindow {
    private static instance:LeaderSkillInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LeaderSkillInfoUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "LeaderSkillInfoSkin";
    }

    private img: eui.Image;
    private nameText: eui.Label;
    private backBtn: eui.Button;
    private ownerBtn: eui.Button;
    private desText: eui.Label;






    private skillID;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.hide);
        this.addBtnEvent(this.ownerBtn, this.onOwner);
        this.setTitle('队伍技能');
    }

    private onOwner(){
        LeaderSkillOwnerListUI.getInstance().show(this.skillID)
    }

    public show(v?){
        this.skillID = v;
        super.show();

    }

    public onShow(){
        this.renew();
    }

    public renew(){
        var skillID = this.skillID;
        var skillVO = LeaderSkillVO.getObject(skillID);
        this.img.source = skillVO.thumb;

        this.nameText.text = (skillVO.name);
        this.setHtml(this.desText,skillVO.getDes())


    }
}