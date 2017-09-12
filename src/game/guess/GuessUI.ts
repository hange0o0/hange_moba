class GuessUI extends game.BaseWindow {
    private static instance:GuessUI;
    public static getInstance() {
        if (!this.instance) this.instance = new GuessUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "GuessUISkin";
    }

    private teamInfo1: eui.List;
    private teamInfo2: eui.List;
    private backBtn: eui.Button;
    private helpBtn: eui.Group;
    private videoBtn: eui.Group;
    private team1Btn: eui.Button;
    private team2Btn: eui.Button;
    private awardText: eui.Label;


    private data

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('胜负竞猜');


        this.addBtnEvent(this.backBtn, this.hide);
        this.addBtnEvent(this.team1Btn, this.onTeam1);
        this.addBtnEvent(this.team2Btn, this.onTeam2);
        this.addBtnEvent(this.videoBtn, this.onVideo);
        this.addBtnEvent(this.helpBtn, this.onHelp);



        this.teamInfo1.itemRenderer  = PKResultItem3
        this.teamInfo2.itemRenderer  = PKResultItem3

    }



    private onVideo(){
        GuessLogUI.getInstance().show();
    }
    private onHelp(){
        HelpManager.getInstance().guessHelp();
    }


    private onTeam1(){
        this.guess(true)
    }

    private onTeam2(){
        this.guess(false)
    }

    private guess(win){

        var self = this;
        GuessManager.getInstance().guess(win,function(){
           self.hide();
        })
    }


    public show(){
        GuessManager.getInstance().getGuess(()=>{
            super.show();
        })

    }

    public onShow(){

        var GM = GuessManager.getInstance();
        GM.passDay();
        var guessData = UM.active.guess || {};
        var current = guessData.num || 0;
        var max = GM.getMaxTimes();


        var specialData = {isEqual:true}
        var list = UM.active.guess.list1
        var list1 = []
        for(var i=0;i<list.length;i++)
        {
            var mid = list[i]
            var oo = {
                id:mid,
                list:list1,
                specialData:specialData,
                index:i,
                showIndex:i+1,
            }
            list1.push(oo)
        }

        list = UM.active.guess.list2
        var list2 = []
        for(var i=0;i<list.length;i++)
        {
            var mid = list[i]
            var oo = {
                id:mid,
                list:list2,
                specialData:specialData,
                index:i,
                showIndex:i+1,
            }
            list2.push(oo)
        }

        this.teamInfo1.dataProvider = new eui.ArrayCollection(list1)
        this.teamInfo2.dataProvider = new eui.ArrayCollection(list2)


        var str = '[成功奖励：]' + GM.getGuessAwardStr(guessData.award)
        MyTool.setColorText(this.awardText,str)

    }
}