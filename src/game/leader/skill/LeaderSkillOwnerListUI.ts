class LeaderSkillOwnerListUI extends game.BaseWindow {
    private static instance:LeaderSkillOwnerListUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LeaderSkillOwnerListUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "LeaderSkillOwnerListUISkin";
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private img: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private backBtn: eui.Button;
    private emptyText: eui.Label;




    private skillID;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.hide);
        this.setTitle('技能拥有者');

        this.list.itemRenderer = LeaderSkillOwnerListItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;
    }

    public show(v?){
        this.skillID = v;
        LeaderManager.getInstance().skillViewList(this.skillID,()=>{super.show()})

    }

    public onShow(){
        this.renew();
    }

    public renew(){
        var LM = LeaderManager.getInstance();
        var arr = LM.getSkillLog(this.skillID);


        var skillID = this.skillID;
        var skillVO = LeaderSkillVO.getObject(skillID);
        this.img.source = skillVO.thumb;
        this.nameText.text = skillVO.name  + '('+arr.length+ '/' + skillVO.num  + ')'
        this.setHtml(this.desText,skillVO.getDes())

        this.scroller.viewport.scrollV = 0;

        this.list.dataProvider = new eui.ArrayCollection(arr)
        this.emptyText.visible = arr.length == 0;

    }
}