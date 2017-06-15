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
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private emptyText: eui.Label;
    //private list: eui.List;
    private starCon: eui.Group;
    private headMC: eui.Image;
    private startBG: eui.Group;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
    private nameText: eui.Label;
    private scoreText: eui.Label;
    private bar4: eui.Rect;
    private num4: eui.Label;
    private bar3: eui.Rect;
    private num3: eui.Label;
    private bar2: eui.Rect;
    private num2: eui.Label;
    private bar1: eui.Rect;
    private num1: eui.Label;
    private bar0: eui.Rect;
    private num0: eui.Label;
    private talkBtn: eui.Button;
    private scoreBtn: eui.Button;
    private disableText: eui.Label;






    private vGroup = new VScrollerGroup();
    private monsterID


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('卡兵交流')
        this.topUI.addEventListener('hide',this.hide,this);

        //this.list.itemRenderer = MonsterTalkItem;
        MyTool.changeGray(this.startBG);

        this.scrollerGroup.addChild(this.vGroup)
        this.vGroup.itemRenderer = MonsterTalkItem;
        this.vGroup.initScroller(this.scroller);
        this.vGroup.margin = 0;
        this.vGroup.marginLeft = 30;
        this.vGroup.marginBottom = 10;
        this.vGroup.desTop = 330;
        this.vGroup.addChild(this.starCon)
        this.vGroup.addChild(this.emptyText)

        this.addBtnEvent(this.talkBtn,this.onTalk)
        this.addBtnEvent(this.scoreBtn,this.onScore)
    }

    private onTalk(){
         MonsterSendTalkUI.getInstance().show(this.monsterID);
    }

    private onScore(){
        MonsterSendStarUI.getInstance().show(this.monsterID);
    }

    public beforeHide(){
        this.vGroup.clean()
    }




    public show(monsterID?){
        //if(!RankManager.getInstance().isRankOpen())
        //{
        //    Alert('排行榜明天开放！')
        //    return;
        //}
        this.monsterID = monsterID;
        var self = this;

        MonsterManager.getInstance().getTalk(monsterID,function(){
            HonorManager.getInstance().getHonorMore(function(){
                self.superShow();
            })
        })
    }

    private superShow(){
        super.show();
    }

    public onSetStar(){
        SharedObjectManager.instance.setMyValue('monstar_star_' + this.monsterID,TM.now());
        this.scoreBtn.visible = false;
        this.renewStar();
    }

    public onShow(){

        //this.con.minHeight = this.scroller.height;
        var w = HonorManager.getInstance().getMonsterHonorData(this.monsterID).w;
        if(w >= 10)
        {
            this.talkBtn.visible = true
            this.scoreBtn.visible = TM.now() - (SharedObjectManager.instance.getMyValue('monstar_star_' + this.monsterID) || 0) > 3600*24
            this.disableText.visible = false;
        }
        else
        {
            this.talkBtn.visible = false
            this.scoreBtn.visible = false
            this.disableText.visible = true;
            this.setHtml(this.disableText,'该卡获得 ' + this.createHtml('['+w+'/10]',0xE0A44A)+' 胜后才能发言')
        }
        var vo = MonsterVO.getObject(this.monsterID);
        this.headMC.source = vo.url;
        this.nameText.text = vo.name;


        this.renewStar();


        this.scroller.viewport.scrollV = 0;
        this.validateNow();
        this.renewTalk();


    }

    public renewTalk(){
        var MM = MonsterManager.getInstance();
        var talkList = MM.getTalkList(this.monsterID)
        this.vGroup.setData(talkList);
        this.vGroup.scrollTo(0);
        //this.list.dataProvider = new eui.ArrayCollection(talkList)
        this.emptyText.visible = talkList.length == 0;
    }

    public renewStar(){
        var MM = MonsterManager.getInstance();
        var starData = MM.talkData[this.monsterID].star;
        var total = 0;
        var num = 0;
        var barWidth = 200;
        for(var i=1;i<=5;i++)
        {
            total +=  starData['s' + i] * i;
            num +=  starData['s' + i]
        }

        for(var i=1;i<=5;i++)
        {
            this['bar' + (i-1)].width = (starData['s' + i] / num) * barWidth
            this['num' + (i-1)].text = NumberUtil.addNumSeparator(starData['s' + i]);
        }

        var score = 0;
        if(total)
        {
            score = total/num
            this.scoreText.text = MyTool.toFixed(score,2);
        }
        else
            this.scoreText.text = '--';


        var starWidth = 38;
        for(var i=0;i<5;i++)
        {
            this['s' + i].width = starWidth * Math.min(1,Math.max(score-i,0))
        }
    }

    private onClick(){

    }
}