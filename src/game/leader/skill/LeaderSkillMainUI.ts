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
    private btnGroup: eui.Group;
    private copyBtn: eui.Button;
    private getGroup: eui.Group;
    private getBtn: eui.Button;
    private redMC: eui.Image;
    private viewBtn: eui.Button;
    private emptyGroup: eui.Group;




    private haveCopySkill = false;
    private awardTime = 0;

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
        this.addBtnEvent(this.copyBtn,this.onCopy)
        this.addBtnEvent(this.viewBtn,this.onView)
        this.addBtnEvent(this.btn,this.onClick)

    }
    private onGet(){
        LeaderManager.getInstance().skillCopyAward(()=>{
            this.getBtn.touchEnabled = false;
            this.redMC.visible = false;
            this.awardTime = TM.now();
        })
    }
    private onView(){
         LeaderSkillViewUI.getInstance().show()
    }
    private onCopy(){
         LeaderSkillCopyUI.getInstance().show()
    }
    private onClick(){
        if(UM.tec.use_skill == this.list.selectedItem)
        {
              LeaderManager.getInstance().skillSet(0,()=>{
                  this.onListChange();
                  this.renewList();
              })
        }
        else
        {
            LeaderManager.getInstance().skillSet(this.list.selectedItem,()=>{
                this.onListChange();
                this.renewList();
            })
        }
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

    private renewList(){
        for(var i=0;i<this.list.numChildren;i++)
        {
            var item:any = this.list.getChildAt(i)
            item.dataChanged()
        }
    }
    public onShow(){
        this.renew();
    }

    public onTimer(){
        if(this.getGroup.stage)
        {
            var cd = 60*3 - (TM.now() - this.awardTime);
            if( cd>0)
            {
                 this.getBtn.touchEnabled = false;
                this.getBtn.skinName = 'Btn_d2Skin'
                this.getBtn.label = DateUtil.getStringBySecond(cd).substr(-5)
            }
            else
            {
                 this.getBtn.touchEnabled = true;
                this.getBtn.skinName = 'Btn_r2Skin'
                this.getBtn.label = '技能收益'
            }
        }

        if(!this.haveCopySkill)
            return;
        for(var i=0;i<this.list.numChildren;i++)
        {
            var item:any = this.list.getChildAt(i);
            item.onTimer();
        }
    }

    public renew(){
        var copyList =  LeaderManager.getInstance().getCopySkillList();
        var list = copyList.concat(UM.tec.skill);
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
            else
                this.currentState = 'normal'
        }
        else
        {
            this.currentState = 'normal'
        }

        this.haveCopySkill = copyList.length > 0
        this.redMC.visible = false;
        if(copyList.length)
            this.btnGroup.addChildAt(this.getGroup,0)
        else
            MyTool.removeMC(this.getGroup)
        this.onTimer();
    }



}

