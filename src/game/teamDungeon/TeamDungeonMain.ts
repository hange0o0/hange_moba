class TeamDungeonMain extends game.BaseUI {
    private static instance:TeamDungeonMain;
    public static getInstance() {
        if (!this.instance) this.instance = new TeamDungeonMain();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "TeamDungeonMainSkin";
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;





    private data

    public childrenCreated() {
        super.childrenCreated();


        this.list.itemRenderer = HelpItem;
        this.list.useVirtualLayout = false;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }

    public hide(){
        super.hide();
        if(this.data)
            MyCardTaskUI.getInstance().testShow();
    }


    public beforeHide(){
        this.clearList([this.list])
    }

    public show(data?){
        this.data = data;
        super.show();
    }

    public onShow(){
        var logText = LoginManager.getInstance().logText;
        var list = logText.text.split('|')
        var arr = [];
        for(var i=0;i<list.length;i++)
        {
            arr.push({text:list[i]})
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}