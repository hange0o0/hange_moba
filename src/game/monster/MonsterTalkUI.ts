class MonsterTalkUI extends game.BaseUI {
    private static instance:MonsterTalkUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MonsterTalkUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MonsterTalkSkin";
    }

    private topUI: TopUI;
    private headMC: eui.Image;
    private startBG: eui.Group;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
    private nameText: eui.Label;
    private scoreText: eui.Label;
    private bar0: eui.Rect;
    private num0: eui.Label;
    private bar1: eui.Rect;
    private num1: eui.Label;
    private bar2: eui.Rect;
    private num2: eui.Label;
    private bar3: eui.Rect;
    private num3: eui.Label;
    private bar4: eui.Rect;
    private num4: eui.Label;
    private talkBtn: eui.Button;
    private scoreBtn: eui.Button;
    private disableText: eui.Label;
    private list: eui.List;





    private indexIn


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('卡牌交流')
        this.topUI.addEventListener('hide',this.hide,this);

        this.list.itemRenderer = MonsterTalkItem;

        this.addBtnEvent(this.talkBtn,this.onTalk)
        this.addBtnEvent(this.scoreBtn,this.onScore)
    }

    private onTalk(){
         MonsterSendTalkUI.getInstance().show();
    }

    private onScore(){
        MonsterSendStarUI.getInstance().show();
    }

    public beforeHide(){
        this.clearList([this.list])
    }




    public show(rankType = 1){
        //if(!RankManager.getInstance().isRankOpen())
        //{
        //    Alert('排行榜明天开放！')
        //    return;
        //}
        //this.indexIn = rankType - 1;
        var self = this;
        //RankManager.getInstance().getRank(rankType,function(){
            self.superShow();
        //})
    }

    private superShow(){
        super.show();
    }

    public onShow(){
         this.disableText.visible = false;
        this.talkBtn.visible = true
        this.scoreBtn.visible = true
    }

    public renewRank(){
        var arr// = RankManager.getInstance().getRankList();
        //this.list.dataProvider = new eui.ArrayCollection(arr);
    }

    private onClick(){

    }
}