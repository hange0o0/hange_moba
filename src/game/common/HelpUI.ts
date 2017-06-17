class HelpUI extends game.BaseWindow {
    private static instance:HelpUI;
    public static getInstance() {
        if (!this.instance) this.instance = new HelpUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "HelpUISkin";
    }

    private okBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;




    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);

        this.list.itemRenderer = HelpItem;
        this.list.useVirtualLayout = false;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }

    public beforeHide(){
        this.clearList([this.list])
    }

    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        this.setTitle(this.data.title);
        var arr = [];
        for(var i=0;i<this.data.list.length;i++)
        {
            arr.push({text:this.data.list[i],index:i})
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}