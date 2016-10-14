class HelpUI extends game.BaseUI {
    private static instance:HelpUI;
    public static getInstance() {
        if (!this.instance) this.instance = new HelpUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "HelpUISkin";
    }

    private titleText: eui.Label;
    private okBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;



    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);

        this.list.itemRenderer = HelpItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }

    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        this.titleText.text = this.data.title;
        var arr = [];
        for(var i=0;i<this.data.list.length;i++)
        {
            arr.push({text:this.data.list[i]})
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}