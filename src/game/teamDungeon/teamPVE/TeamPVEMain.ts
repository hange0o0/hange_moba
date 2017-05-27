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
        this.addBtnEvent(this.addBtn, this.onAdd);
        this.addBtnEvent(this.helpBtn, this.onHelp);

        this.topUI.setTitle('PVE副本')
        this.topUI.addEventListener('hide',this.hide,this);

        this.list.itemRenderer = HelpItem;
        this.list.useVirtualLayout = false;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }

    private onAdd(){

    }

    private onHelp(){

    }

    public hide(){
        super.hide();
    }

    private onCB(){

    }

    public beforeHide(){
        this.clearList([this.list])
    }

    public show(data?){
        var self = this;
        var PVEM = TeamPVEManager.getInstance();
        PVEM.info(function(){
            PVEM.list(function(){
                self.superShow();
            })
        })
    }

    private superShow(){
        super.show();
    }

    private awardFun(index){

    }

    public onShow(){
        var PVEM = TeamPVEManager.getInstance();
        this.headMC0.source = MyTool.getHeadUrl(PVEM.data.player1.head)
        this.nameText0.text = StringUtil.getStringByLength(Base64.decode(PVEM.data.player1.head),5)  + ':' + PVEM.getPlayerFinish(1);

        this.headMC1.source = MyTool.getHeadUrl(PVEM.data.player2.head)
        this.nameText1.text = StringUtil.getStringByLength(Base64.decode(PVEM.data.player2.head),5)  + ':' + PVEM.getPlayerFinish(2);

        this.headMC2.source = MyTool.getHeadUrl(PVEM.data.player3.head)
        this.nameText2.text = StringUtil.getStringByLength(Base64.decode(PVEM.data.player3.head),5)  + ':' + PVEM.getPlayerFinish(3);

        var finishNum = PVEM.getFinishNum()
        this.rateText.text = '进度：' + finishNum + '/25';
        var player = PVEM.getMyData();
        var current = player.pk_time;
        var max = player.buy_time*5 + 10
        this.timesText.text = '挑战次数：' + current + '/' +max;
        this.addBtn.visible = current >= max;

        var awardStep = Math.floor(finishNum/5)
        for(var i=0;i<5;i++)
        {
            var mc = this['b' + i];
            mc.data = {
                index:i+1,
                awardFun:this.awardFun,
                isOpen:awardStep > i,
                isAward:player.award[i+1]
            }
        }





        var list = []
        for(var i=0;i<PVEM.listData.length;i++)
        {
            if(this.cb.selected && PVEM.data.finish[i+1])
                continue;
            PVEM.listData[i].index = i+1;
            list.push(PVEM.listData[i])
        }
        this.list.dataProvider = new eui.ArrayCollection(PVEM.listData);
    }
}