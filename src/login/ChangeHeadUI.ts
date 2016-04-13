class ChangeHeadUI extends game.BaseWindow {
    private static instance:ChangeHeadUI;
    public static getInstance() {
        if (!this.instance) this.instance = new ChangeHeadUI();
        return this.instance;
    }

    public constructor() {
        super();
        var arr = this.headArray = [];
        for(var i=0;i<50;i++)
        {
            arr.push(i+1);
        }
        this.skinName = "ChangeHeadUISkin";

    }

    private titleText: eui.Label;
    private scroller: eui.Scroller;
    private list: eui.List;
    private okBtn: eui.Button;


    private index
    private headArray
    private fun

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.onChoose);

        this.titleText.text = '请选择头像'

        this.list.itemRenderer = HeadItem
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

        this.list.dataProvider = new eui.ArrayCollection(this.headArray);
    }

    private onChoose(){
        this.hide();
        if(this.fun)
            this.fun(this.list.selectedItem);
    }

    public show(data?,fun?){
        this.fun = fun;
        this.index = this.headArray.indexOf(data);
        this.height = Math.min(800,GameManager.stage.stageHeight-100)
        super.show();
    }

    public onShow(){
        this.list.selectedIndex = this.index;
    }
}