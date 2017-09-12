class LeaderSkillChangeUI extends game.BaseWindow {
    private static instance:LeaderSkillChangeUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LeaderSkillChangeUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "LeaderSkillChangeUISkin";
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private img: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private noSkillBtn: eui.Button;
    private backBtn: eui.Button;




    private nick;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.onChoose);
        this.addBtnEvent(this.noSkillBtn, this.onNoSkill);
        //this.addBtnEvent(this.okBtn, this.onPK);
        //this.addBtnEvent(this.refreshBtn, this.onRefresh);
        this.setTitle('技能选择');

        this.list.itemRenderer = LeaderSkillItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

        this.list.addEventListener(egret.Event.CHANGE,this.onListChange,this)

    }

    private onChoose(){
        if(UM.tec.use_skill != this.list.selectedItem)
        {
            LeaderManager.getInstance().skillSet(this.list.selectedItem,()=>{this.hide()})
            return;
        }
        this.hide()
    }
    private onNoSkill(){
        if(UM.tec.use_skill)
        {
            LeaderManager.getInstance().skillSet(0,()=>{this.hide()})
            return;
        }
        this.hide()
    }

    public onListChange(){
        var skillID = this.list.selectedItem;
        var skillVO = LeaderSkillVO.getObject(skillID);
        this.img.source = skillVO.thumb;
        this.nameText.text = skillVO.name
        this.setHtml(this.desText,skillVO.getDes())
    }


    public onShow(){
        this.renew();
    }


    public renew(){
        var list = UM.tec.skill
        this.list.dataProvider = new eui.ArrayCollection(list);
        var index = list.indexOf(UM.tec.use_skill)
        if(index == -1)
            this.list.selectedIndex = 0;
        else
            this.list.selectedIndex = index;
        this.onListChange();

    }
}