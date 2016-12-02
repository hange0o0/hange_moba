class VideoUI2 extends game.BaseUI {
    private static instance:VideoUI2;

    public static getInstance() {
        if (!this.instance) this.instance = new VideoUI2();
        return this.instance;
    }


    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;

    private listArray = [];
    private currentList = []

    public constructor() {
        super();
        this.skinName = "VideoUI2Skin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.list.itemRenderer = VideoItem3;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

        this.topUI.addEventListener('hide',this.hide,this);
    }

    public showMVDebug(v?){}
    public addToGroup(v?){}


    //public show(){
    //    super.show();
    //}

    public onShow(){
        this.listArray = [];
        this.currentList = [];
        this.listArray.push(this.currentList);
        var VM = VideoManager.getInstance();
        var VC = VideoCode.getInstance()
        VC.initData(VM.baseData);
        VC.play(true);
        this.visible = false;
    }

    //单个回合结束
    public roundOver(v?){
        if(this.currentList.length > 0)
        {
            this.currentList = [];
            this.listArray.push(this.currentList);
        }

        var VC = VideoCode.getInstance();
        VC.onMovieOver();
    }

    //PK结束
    public onOver(v?){
        this.listArray.push({type:'over'})
        this.list.dataProvider = new eui.ArrayCollection(this.listArray);
    }

    //加入一个动画
    public playSkill(v?){
        this.currentList.push(v);
        var VC = VideoCode.getInstance();
        VC.onMovieOver();
    }
}