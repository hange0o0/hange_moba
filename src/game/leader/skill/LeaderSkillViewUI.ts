class LeaderSkillViewUI extends game.BaseUI {
    private static instance:LeaderSkillViewUI;

    public static getInstance() {
        if (!this.instance) this.instance = new LeaderSkillViewUI();
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
    private topUI: TopUI;


    private data;
    private title;
    private type;

    public constructor() {
        super();
        this.skinName = "LeaderSkillViewUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('技能图鉴')
        this.topUI.addEventListener('hide', this.hide, this);

        this.list.itemRenderer = LeaderSkillViewItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

        this.addBtnEvent(this.btn,this.onClick)
        this.list.addEventListener(egret.Event.CHANGE,this.onListChange,this)

    }

    private onListChange(){
        this.currentState = 'selected'
        var skillVO = this.list.selectedItem;
        this.img.source = skillVO.thumb;
        var num = LeaderManager.getInstance().skillTotal[skillVO.id] || 0
        this.nameText.text = skillVO.name  + ' ('+num+ '/' + skillVO.num  + ')'
        this.setHtml(this.desText,skillVO.getDes())
    }


    public onClick(){
        LeaderSkillOwnerListUI.getInstance().show(this.list.selectedItem.id)
    }

    public beforeHide(){
        this.clearList([this.list])
    }


    public show(){
        LeaderManager.getInstance().skillView(()=>{super.show()})
    }


    public onShow(){
        var list = ObjectUtil.objToArray( LeaderSkillVO.data)
        ArrayUtil.sortByField(list,['day'],[0])
        for(var i=0;i<list.length;i++)
        {

            if(!list[i].isOpen())
            {
                list.length = i+1;
                break;
            }
        }
        list.reverse();
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.list.selectedIndex = -1;
        this.scroller.viewport.scrollV = 0;
        this.currentState = 'normal';
    }



}

