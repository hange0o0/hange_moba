class LeaderSkillMainUI extends game.BaseContainer {
    private static instance:LeaderSkillMainUI;
    public static getInstance() {
        return this.instance;
    }

    private bg: eui.Rect;
    private scroller: eui.Scroller;
    private list: eui.List;
    private selectGroup: eui.Group;
    private img: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private btn: eui.Button;
    private getBtn: eui.Button;
    private viewBtn: eui.Button;
    private emptyGroup: eui.Group;
    private getBtn2: eui.Button;



    private data;
    private title;
    private type;

    public constructor() {
        super();
        this.skinName = "LeaderSkillMainUISkin";
        LeaderSkillMainUI.instance = this;
    }


    public childrenCreated() {
        super.childrenCreated();


        this.list.itemRenderer = LeaderSkillItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

        this.list.addEventListener(egret.Event.CHANGE,this.onListChange,this)

        this.addBtnEvent(this.getBtn,this.onGet)
        this.addBtnEvent(this.getBtn2,this.onGet)
        this.addBtnEvent(this.viewBtn,this.onView)
        this.addBtnEvent(this.btn,this.onClick)

    }

    private onView(){
         LeaderSkillViewUI.getInstance().show()
    }
    private onClick(){
        if(UM.tec.use_skill == this.list.selectedItem)
        {
              LeaderManager.getInstance().skillSet(0,()=>{this.onListChange()})
        }
        else
        {
            LeaderManager.getInstance().skillSet(this.list.selectedItem,()=>{this.onListChange()})
        }
    }
    private onGet(){
        LeaderMainUI.getInstance().showDraw()
    }

    private onListChange(){
        this.currentState = 'choose'
        var skillID = this.list.selectedItem;
        var skillVO = LeaderSkillVO.getObject(skillID);
        this.img.source = skillVO.thumb;
        this.nameText.text = skillVO.name
        this.setHtml(this.desText,skillVO.getDes())

        if(UM.tec.use_skill == skillID)
        {
            this.btn.skinName = 'Btn_b1Skin'
            this.btn.label = '卸下'
        }
        else
        {
            this.btn.skinName = 'Btn_r1Skin'
            this.btn.label = '装备'
        }
    }

    public hide(){
        this.beforeHide();
        MyTool.removeMC(this)
    }

    public beforeHide(){
        this.clearList([this.list])
    }

    public onShow(){
        //var DM = DayGameManager.getInstance();
        var list = UM.tec.skill
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.emptyGroup.visible = list.length == 0;

        if(list.length)
        {
            var index = list.indexOf(UM.tec.use_skill)
            this.list.selectedIndex = index;
            this.scroller.viewport.scrollV = 0;
            if(index != -1)
            {
                 this.onListChange();
            }
        }
        else
        {
            this.currentState = 'normal'
        }

    }



}

