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
        super.hide();
    }


    public beforeHide(){
        this.clearList([this.list])
    }

    public show(data?){
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

        var arr = ['pve'];
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}