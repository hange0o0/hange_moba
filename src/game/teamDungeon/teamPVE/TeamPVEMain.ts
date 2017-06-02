class TeamPVEMain extends game.BaseUI {
    private static instance:TeamPVEMain;
    public static getInstance() {
        if (!this.instance) this.instance = new TeamPVEMain();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "TeamPVEMainSkin";
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
    private logBtn: eui.Group;
    private helpBtn: eui.Group;
    private player0: eui.Group;
    private player1: eui.Group;
    private player2: eui.Group;
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
        this.addBtnEvent(this.logBtn, this.onLog);

        this.topUI.setTitle(TeamDungeonManager.DungeonName.pve + '副本')
        this.topUI.addEventListener('hide',this.hide,this);

        this.list.itemRenderer = TeamPVEMainItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

        for(var i=0;i<3;i++)
        {
            var player = this['player' + i];
            player.touchChildren = false;
            player.index = i+1;
            this.addBtnEvent(player,this.onPlayerClick)
        }
    }

    private onLog(){
        DayLogUI.getInstance().show(TeamPVEManager.getInstance().logList,'挑战日志');
    }

    private onPlayerClick(e){
        var data = TeamPVEManager.getInstance().data['player' + e.currentTarget.index];
        if(data && data.gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(data.gameid)
    }

    private onAdd(){
        var self = this;
        Confirm('确定花费100钻石增加5次挑战机会吗？',function(type){
            if(type == 1)
            {
                TeamPVEManager.getInstance().addTimes(function(){
                    self.renewTimes();
                });
            }
        });
    }

    private onHelp(){
        HelpManager.getInstance().pveHelp();
    }

    public hide(){
        super.hide();
    }

    private onCB(){
         this.renewList();
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
        var self = this;
        TeamPVEManager.getInstance().award(index,function(){
            self.renewAward();
        });
    }

    public onShow(){
        var PVEM = TeamPVEManager.getInstance();
        this.headMC0.source = MyTool.getHeadUrl(PVEM.data.player1.head)
        this.headMC1.source = MyTool.getHeadUrl(PVEM.data.player2.head)
        this.headMC2.source = MyTool.getHeadUrl(PVEM.data.player3.head)

        this.renewList();
        this.renewTimes();
        this.renewAward();

        this.addPanelOpenEvent(GameEvent.client.PVE_CHANGE,this.renewChange)
    }

    private renewChange(){
        this.renewTimes();
        this.renewListByChange();
        this.renewAward();
    }

    public renewTimes(){
        var PVEM = TeamPVEManager.getInstance();
        var finishNum = PVEM.getFinishNum()
        MyTool.setColorText(this.rateText,'[进度：]' + finishNum + '/25');
        var player = PVEM.getMyData();
        var current = player.pk_time;
        var max = player.buy_time*5 + 10
        MyTool.setColorText(this.timesText,'[挑战次数:]' + current + '/' +max);
        this.addBtn.visible = current >= max;
    }
    private renewList(){
        var PVEM = TeamPVEManager.getInstance();
        MyTool.setHtml(this.nameText0, this.createHtml(StringUtil.getStringByLength(PVEM.data.player1.nick,5),0xE0A44A)  + ' ×' + PVEM.getPlayerFinish(1));
        MyTool.setHtml(this.nameText1, this.createHtml(StringUtil.getStringByLength(PVEM.data.player2.nick,5) ,0xE0A44A)  + ' ×' + PVEM.getPlayerFinish(2));
        MyTool.setHtml(this.nameText2, this.createHtml(StringUtil.getStringByLength(PVEM.data.player3.nick,5) ,0xE0A44A)  + ' ×' + PVEM.getPlayerFinish(3));

        var list = []
        for(var i=0;i<PVEM.listData.length;i++)
        {
            if(this.cb.selected && PVEM.data.game_data.finish[i+1])
                continue;
            PVEM.listData[i].index = i+1;
            list.push(PVEM.listData[i])
        }
        this.list.dataProvider = new eui.ArrayCollection(list);
    }
    private renewListByChange(){
        if(this.cb.selected)
        {
            return this.renewList();
        }
        var PVEM = TeamPVEManager.getInstance();
        MyTool.setHtml(this.nameText0, this.createHtml(StringUtil.getStringByLength(PVEM.data.player1.nick,5)  + ' ×',0xE0A44A) + PVEM.getPlayerFinish(1));
        MyTool.setHtml(this.nameText1, this.createHtml(StringUtil.getStringByLength(PVEM.data.player2.nick,5)  + ' ×',0xE0A44A) + PVEM.getPlayerFinish(2));
        MyTool.setHtml(this.nameText2, this.createHtml(StringUtil.getStringByLength(PVEM.data.player3.nick,5)  + ' ×:',0xE0A44A) + PVEM.getPlayerFinish(3));

        for(var i=0;i<this.list.numChildren;i++)
        {
            this.list.getChildAt(i)['renewInfo']();
        }
    }

    private renewAward(){
        var PVEM = TeamPVEManager.getInstance();
        var finishNum = PVEM.getFinishNum()
        var player = PVEM.getMyData();

        var awardStep = Math.floor(finishNum/5)
        for(var i=0;i<5;i++)
        {
            var mc = this['b' + i];
            mc.data = {
                index:i+1,
                awardFun:this.awardFun,
                thisObj:this,
                isOpen:awardStep > i,
                text:finishNum + '/' + (i+1)*5,
                award:{
                    coin:PVEM.getAwardCoin(PVEM.data.game_data.hard,i+1),
                    card:PVEM.getAwardCard(PVEM.data.game_data.hard,i+1),
                },
                isAward:player.award[i+1]
            }
        }
    }
}