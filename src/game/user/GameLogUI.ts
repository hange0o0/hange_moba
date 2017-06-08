class GameLogUI extends game.BaseWindow {
    private static instance:GameLogUI;
    public static getInstance() {
        if (!this.instance) this.instance = new GameLogUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "GameLogUISkin";
    }

    private okBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;
    private cb: eui.CheckBox;




    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);
        this.addBtnEvent(this.cb, this.onCB);

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

    private onCB(){
        LoginManager.getInstance().logText.cb = this.cb.selected;
        LoginManager.getInstance().saveLogText();
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
        this.cb.selected = logText.cb;
        var list = logText.text.split('|')
        var arr = [];
        for(var i=0;i<list.length;i++)
        {
            arr.push({text:list[i],index:i})
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}