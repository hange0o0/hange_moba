class LeaderSkillCopyUI extends game.BaseUI {
    private static instance:LeaderSkillCopyUI;

    public static getInstance() {
        if (!this.instance) this.instance = new LeaderSkillCopyUI();
        return this.instance;
    }
    private bg: eui.Rect;
    private scroller: eui.Scroller;
    private list: eui.List;
    private topUI: TopUI;



    private data;
    private title;
    private type;

    public constructor() {
        super();
        this.skinName = "LeaderSkillCopyUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('技能分身')
        this.topUI.addEventListener('hide', this.hide, this);

        this.list.itemRenderer = LeaderSkillViewItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onListChoose,this);

    }

    private onListChoose(){
        var skillVO = this.list.selectedItem;
        if(!LeaderManager.getInstance().isSkillOverTime(skillVO.id))
        {
            Alert('技能还在有效期内')
            return;
        }
        LeaderSkillCopyUserUI.getInstance().show(skillVO);
    }

    public beforeHide(){
        this.clearList([this.list])
    }


    public show(){
        LeaderManager.getInstance().skillView(()=>{super.show()})
    }


    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.leader_skill_change,this.renew)
    }

    private renew(){
        var list = ObjectUtil.objToArray( LeaderSkillVO.data)
        ArrayUtil.sortByField(list,['day'],[0])
        var arr = [];
        for(var i=0;i<list.length;i++)
        {
            if(list[i].isOpen() && LeaderManager.getInstance().isSkillOverTime(list[i].id))
            {
                arr.push(list[i])
            }
        }
        arr.reverse();
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.scroller.viewport.scrollV = 0;
    }



}

