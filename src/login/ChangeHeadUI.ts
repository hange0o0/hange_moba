class ChangeHeadUI extends game.BaseWindow {
    private static instance:ChangeHeadUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ChangeHeadUI();
        return this.instance;
    }

    public constructor() {
        super();

        this.skinName = "ChangeHeadUISkin";

    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private btnGroup: eui.Group;
    private cencelBtn: eui.Button;
    private okBtn: eui.Button;
    private head1: HeadItem;
    private head2: HeadItem;
    private headGroup: eui.Group;
    private changeGroup: eui.Group;






    private dataIn
    private isChoose
    private headArray
    private fun

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.onChoose);
        this.addBtnEvent(this.cencelBtn, this.hide);

        this.setTitle('请选择头像');

        this.list.itemRenderer = HeadItem
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false


        this.list.addEventListener(egret.Event.CHANGE,this.onSelect,this)

        this.head1.touchEnabled = false
        this.head2.touchEnabled = false
    }

    private onSelect(){
        this.head2.data = this.list.selectedItem
        if(this.dataIn == this.list.selectedItem)
        {
            this.head2.currentState = 'up';
            this.changeGroup.visible = false;
            this.headGroup.y = 55;
        }
        else
        {
            this.head2.currentState = 'down';
            this.changeGroup.visible = true;
            this.headGroup.y = 25;
        }
    }

    private onChoose(){
        //this.hide();
        if(this.fun)
            this.fun(this.list.selectedItem);
    }

    public show(data?,isChoose?,fun?){
        this.fun = fun;
        this.isChoose = isChoose;
        this.dataIn = data;
        //this.height = Math.min(800,GameManager.stage.stageHeight-100)
        super.show();
    }

    public onShow(){
        if(this.isChoose)
        {
            this.currentState = 'choose';
            MyTool.removeMC(this.cencelBtn);
            this.headArray = MonsterVO.getListByLevel(1);

        }
        else
        {
            this.currentState = 'change';
            this.head1.data = this.dataIn;
            this.btnGroup.addChildAt(this.cencelBtn,0)
            this.headArray = MonsterVO.getListByLevel(UM.level);
        }
        for(var i=0;i<this.headArray.length;i++)
        {
            this.headArray[i] = this.headArray[i].id
        }
        this.list.dataProvider = new eui.ArrayCollection(this.headArray);
        this.list.selectedIndex = this.headArray.indexOf(Math.floor(this.dataIn));
        this.onSelect();

    }

}