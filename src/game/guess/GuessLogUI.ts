class GuessLogUI extends game.BaseUI {
    private static instance:GuessLogUI;

    public static getInstance() {
        if (!this.instance) this.instance = new GuessLogUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private emptyText: eui.Label;
    private infoText: eui.Label;



    private data;

    public constructor() {
        super();
        this.skinName = "GuessLogUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('竞猜日志')
        this.topUI.addEventListener('hide', this.hide, this);

        this.list.itemRenderer = GuessLogItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

    }

    public hide(){
        super.hide();
    }

    public beforeHide(){
        this.clearList([this.list])
    }


    public show(){
        this.data = GuessManager.getInstance().logList
        //if(this.data.length == 0)
        //{
        //    Alert('暂无竞猜记录')
        //    return;
        //}
        super.show();
    }


    public onShow(){
        //var DM = DayGameManager.getInstance();
        var list = this.data;//DM.getLogList();
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.emptyText.visible = list.length == 0;

        var guess = UM.active.guess;
        MyTool.setColorText(this.infoText, '[竞猜次数：]' +guess.total + '　　　[准确率：]' + MyTool.toFixed(guess.win/(guess.total || 1)*100,1) + '%')
    }



}

