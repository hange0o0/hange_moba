class TeamPVEMain extends game.BaseUI {
    private static instance:TeamPVEMain;
    public static getInstance() {
        if (!this.instance) this.instance = new TeamPVEMain();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "GameLogUISkin";
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private headMC0: eui.Image;
    private nameText0: eui.Label;
    private headMC1: eui.Image;
    private nameText1: eui.Label;
    private headMC2: eui.Image;
    private nameText2: eui.Label;
    private rateText: eui.Label;
    private cb: eui.CheckBox;
    private timesText: eui.Label;
    private addBtn: eui.Group;
    private helpBtn: eui.Group;
    private b0: TeamDungeonAwardBoxItem;
    private b1: TeamDungeonAwardBoxItem;
    private b2: TeamDungeonAwardBoxItem;
    private b3: TeamDungeonAwardBoxItem;
    private b4: TeamDungeonAwardBoxItem;






    private data

    public childrenCreated() {
        super.childrenCreated();
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
            arr.push({text:list[i]})
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}