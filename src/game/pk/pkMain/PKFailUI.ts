class PKFailUI extends PKResultBase {
    private static instance:PKFailUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKFailUI();
        return this.instance;
    }

    private resultGroup: eui.Group;
    private desText: eui.Label;
    private list: eui.List;
    private noteGroup: eui.Group;
    private noteText: eui.Label;
    private btnGroup: eui.Group;
    private backBtn: eui.Button;
    private okBtn: eui.Button;
    private reviewBtn: eui.Button;




    public timer;
    public constructor() {
        super();
        this.skinName = "PKFailUISkin";
    }


    public childrenCreated() {
        this._desText = this.desText;
        this._list = this.list;
        this._resultGroup = this.resultGroup;
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.onBack);
        this.addBtnEvent(this.okBtn, this.onRestart);
        this.addBtnEvent(this.reviewBtn, this.onReview);
    }

    private onReview(){
        PKResultUI.getInstance().hide();
        PKMainUI.getInstance().show(null,true)
    }


    private onBack(){
        PopUpManager.testShape(true);
        PKResultUI.getInstance().hide();
        GuideManager.getInstance().showGuide()


        //var PKM = PKManager.getInstance();
        //if(PKM.pkType == PKManager.PKType.MAP || PKM.pkType == PKManager.PKType.MAP_FIGHT)
        //{
        //    MapMainUI.getInstance().show();
        //}
    }
    private onRestart(){
        var self = this;
        var PKM = PKManager.getInstance();
        if(PKM.pkType == PKManager.PKType.SERVER)
        {
            //Confirm('再次挑战需要耗费2点体力，是否继续？',function(type){
            //    if(type == 1)
            //    {
            //        ServerGameManager.getInstance().openPKView(true,onOpenPKView);
            //    }
            //});
            ServerGameManager.getInstance().openPKView(true,()=>{
                onOpenPKView();
                ServerGameUI.getInstance().onChoose();
                ServerGameUI.getInstance().hide();
            });
        }
        else if(PKM.pkType == PKManager.PKType.SERVER_EQUAL)
        {
            var num = UM.getPropNum(21);
            Confirm('再次挑战需要再次缴纳修正币！\n当前拥有修正币数量：' + num + '\n，是否继续？',function(type){
                if(type == 1)
                {
                    ServerGameEqualManager.getInstance().openPKView(true,()=>{
                        onOpenPKView();
                        ServerGameEqualUI.getInstance().onChoose();
                        ServerGameEqualUI.getInstance().hide();
                    });
                }
            });

        }
        else if(PKM.pkType == PKManager.PKType.MAIN){
            MainGameManager.getInstance().openPKView(PKM.pkResult.hard,function(){
                onOpenPKView();
                MainGameUI.getInstance().onChoose1();
                MainGameUI.getInstance().hide();
            });

        }
        else if(PKM.pkType == PKManager.PKType.DAY){
            DayGameUI.getInstance().show(true);
            PKResultUI.getInstance().hide();
        }
        else if(PKM.pkType == PKManager.PKType.MAP){
            MapManager.getInstance().pkAgain();
        }
        else if(PKM.pkType == PKManager.PKType.PVE){
            if(TeamPVEManager.getInstance().canPK())
                TeamPVEManager.getInstance().pkAgain();
            PKResultUI.getInstance().hide();
        }
        else if(PKM.pkType == PKManager.PKType.GUESS){
            PKResultUI.getInstance().hide();
            GuessUI.getInstance().show();
        }

        function onOpenPKView(){
           self.onBack();
        }

    }

    public renew(){

        this.desText.text = ''
        this.list.visible = false;
        MyTool.removeMC(this.noteGroup);
        MyTool.removeMC(this.btnGroup);

        this.okBtn.label = '重新布阵'
        var PKM = PKManager.getInstance();
        if(PKM.pkType == PKManager.PKType.REPLAY || PKM.pkType == PKManager.PKType.FRIEND || PKM.pkType == PKManager.PKType.MAP_FIGHT)
        {
            MyTool.removeMC(this.okBtn)
        }
        else if(PKM.pkType == PKManager.PKType.PVE && !TeamPVEManager.getInstance().canPK())
        {
            MyTool.removeMC(this.okBtn)
        }
        else if(PKM.pkType == PKManager.PKType.GUESS)
        {
            var guessData = UM.active.guess || {};
            var current = guessData.num || 0;
            var max = GuessManager.getInstance().getMaxTimes();
            if(max > current)
            {
                this.btnGroup.addChildAt(this.okBtn,1);
                this.okBtn.label = '继续竞猜';
            }
            else
                MyTool.removeMC(this.okBtn)
        }
        else
        {
            this.btnGroup.addChildAt(this.okBtn,1);
        }

        if(PKM.pkType != PKManager.PKType.REPLAY)
        {
            if(PKM.teamChange)
            {
                var team1Base = PKM.team2Base
                var team2Base = PKM.team1Base
            }
            else
            {
                var team1Base = PKM.team1Base
                var team2Base = PKM.team2Base
            }
            var arr = [];
            var list = team1Base.list;
            var cost = PKM.getCost(list);
            if(cost < 80)
                arr.push('充分利用所有符文，上阵更多更强卡兵')
            arr.push('调整卡兵出战顺序，增强卡兵间的配合')
            arr.push('更换你的出战卡兵，针对对方进行布局')
            if(!PKM.pkResult.isequal)
            {
                arr.push('升级你的低级卡兵，增强综合卡兵能力')
                if(PKM.pkType == PKManager.PKType.FRIEND)
                {
                    if(Math.floor(team1Base.f) < Math.floor(team2Base.f))
                        arr.push('用修正场规则挑战，依靠智慧战胜好友')
                }
            }

            for(var i=0;i<arr.length;i++)
            {
                arr[i] = (i+1) + '、' + arr[i] + '；'
            }
            this.noteText.text = arr.join('\n')
        }



        this.step = 0;
        this.stepOne();
    }

    protected onStepOver(){
        var PKM = PKManager.getInstance();
        if(PKM.pkType != PKManager.PKType.REPLAY)
            this.resultGroup.addChild(this.noteGroup);
        this.resultGroup.addChild(this.btnGroup);
        this.btnGroup.alpha = 0
        var tw:egret.Tween = egret.Tween.get(this.btnGroup);
        tw.wait(500).to({alpha:1}, 200);
    }

}