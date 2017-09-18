class LeaderSkillCopyUserUI extends game.BaseUI {
    private static instance:LeaderSkillCopyUserUI;

    public static getInstance() {
        if (!this.instance) this.instance = new LeaderSkillCopyUserUI();
        return this.instance;
    }
    private bg: eui.Rect;
    private scroller: eui.Scroller;
    private list: eui.List;
    private selectGroup: eui.Group;
    private img: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private topUI: TopUI;
    private propText: eui.Label;




    private skillVO;

    public constructor() {
        super();
        this.skinName = "LeaderSkillCopyUserUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('技能分身')
        this.topUI.addEventListener('hide', this.hide, this);

        this.list.itemRenderer = LeaderSkillCopyItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;
    }


    public beforeHide(){
        this.clearList([this.list])
    }


    public show(v?){
        this.skillVO = v;
        LeaderManager.getInstance().skillViewList(this.skillVO.id,()=>{
            var num = LeaderManager.getInstance().skillTotal[this.skillVO.id] || 0
            if(!num)
            {
                Alert('暂时还没有玩家拥有该技能！')
                return;
            }
            super.show()
        },10)
    }


    public onShow(){
        var skillVO = this.skillVO;
        var LM = LeaderManager.getInstance();
        var arr = LM.getSkillLog(skillVO.id);

        this.scroller.viewport.scrollV = 0;
        this.list.dataProvider = new eui.ArrayCollection(arr)


        this.img.source = skillVO.thumb;
        var num = LeaderManager.getInstance().skillTotal[skillVO.id] || 0
        this.nameText.text = skillVO.name  + ' ('+num+ '/' + skillVO.num  + ')'
        this.setHtml(this.desText,skillVO.getDes());

        this.renewResource();

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.renewResource)
        this.addPanelOpenEvent(GameEvent.client.prop_change,this.renewResource)
    }

    public onTimer(){
        for(var i=0;i<this.list.numChildren;i++)
        {
            var item:any = this.list.getChildAt(i);
            item.onTimer();
        }
    }

    private renewResource(){
        MyTool.setColorText(this.propText, '[技能分身卷轴：]' + UM.getPropNum(22) + '　　　[钻石：]' + UM.getDiamond())
    }



}

