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

        this.topUI.setTitle('战队副本')
        this.topUI.addEventListener('hide',this.hide,this);

        this.list.itemRenderer = TeamDungeonItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }



    public hide(){
        TaskManager.getInstance().cleanNowAcrion('friend_dungeon');
        super.hide();
    }


    public beforeHide(){
        this.clearList([this.list])
    }

    public show(data?){
        if(UM.level < Config.friendLevel)
        {
            Alert('战队系统'+Config.friendLevel+'级开放')
            return;
        }
        var self = this;
        UM.initActive();
        TeamDungeonManager.getInstance().info(function(){
            var PVEM = TeamPVEManager.getInstance();
            if(PVEM.isInOpenTime() && UM.active.team_pve.team)
            {
                PVEM.info(function(){
                    self.superShow();
                })
            }
            else
                self.superShow();
        })
    }

    private superShow(){
        super.show();
    }

    public onShow(){


        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)

        if(TaskManager.getInstance().nowAction == 'friend_dungeon')
        {
            this.list.validateNow()
            TaskManager.getInstance().showGuideMC(this.list.getChildAt(0)['btn'])
        }
    }

    private onTimer(){
        for(var i=0;i<this.list.numChildren;i++)
        {
            this.list.getChildAt(i)['onTimer']();
        }
    }
    private renew(){
        var arr = ['pve','pvp'];
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}