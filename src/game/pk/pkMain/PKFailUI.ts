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
    }


    private onBack(){
        PKResultUI.getInstance().hide();
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
            ServerGameManager.getInstance().openPKView(true,onOpenPKView);
        }
        else if(PKM.pkType == PKManager.PKType.SERVER_EQUAL)
        {
            var num = UM.getPropNum(21);
            Confirm('当前拥有修正币数量：' + num + '\n再次挑战需要花费1个修正币，是否继续？',function(type){
                if(type == 1)
                {
                    ServerGameEqualManager.getInstance().openPKView(true,onOpenPKView);
                }
            });

        }
        else if(PKM.pkType == PKManager.PKType.MAIN){
            MainGameManager.getInstance().openPKView(onOpenPKView);
        }
        else if(PKM.pkType == PKManager.PKType.DAY){
            DayGameUI.getInstance().show(true);
            PKResultUI.getInstance().hide();
        }
        else if(PKM.pkType == PKManager.PKType.MAP){
            MapManager.getInstance().pkAgain(onOpenPKView);
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


        var PKM = PKManager.getInstance();
        if(PKM.pkType == PKManager.PKType.REPLAY || PKM.pkType == PKManager.PKType.FRIEND)
        {
            MyTool.removeMC(this.okBtn)
        }
        else
        {
            this.btnGroup.addChild(this.okBtn);
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
                arr.push('充分利用所有符文，上阵更多更强卡牌')
            arr.push('调整卡牌出战顺序，增强卡牌间的配合')
            arr.push('更换你的出战卡牌，针对对方进行布局')
            if(!PKM.pkResult.isequal)
            {
                arr.push('升级你的低级卡牌，增强综合卡牌能力')
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