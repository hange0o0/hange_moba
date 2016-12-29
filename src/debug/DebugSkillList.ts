class DebugSkillList extends game.BaseUI {
    private static instance:DebugSkillList;
    public static getInstance() {
        if (!this.instance) this.instance = new DebugSkillList();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "DebugSkillListSkin";
        this.LoadFiles = ['ani'];
    }

    private scroller: eui.Scroller;
    private list: eui.List;


    public childrenCreated() {
        super.childrenCreated();

        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.list.itemRenderer = DebugSkillItem
    }

    public show(data?){
        super.show();

    }

    public onShow(){
        var arr = [];
        var noArr = [1,2,155,156,169,101,171,165]
        for(var i=1;i<180;i++)
        {
            if(!RES.hasRes('skill' + i + '_json'))
                continue;
            
            if(noArr.indexOf(i) == -1)
                arr.push('skill' + i);
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}