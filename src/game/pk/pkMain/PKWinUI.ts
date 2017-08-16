class PKWinUI extends PKResultBase {
    private static instance:PKWinUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKWinUI();
        return this.instance;
    }

    private resultGroup: eui.Group;
    private desText: eui.Label;
    private list: eui.List;
    private btnGroup: eui.Group;
    private backBtn: eui.Button;
    private okBtn: eui.Button;
    private reviewBtn: eui.Button;






    public constructor() {
        super();
        this.skinName = "PKWinUISkin";
    }


    public childrenCreated() {
        this._desText = this.desText;
        this._list = this.list;
        this._resultGroup = this.resultGroup;
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.onContinue);
        this.addBtnEvent(this.backBtn, this.onBack);
        this.addBtnEvent(this.reviewBtn, this.onReview);
    }

    private onReview(){
        PKResultUI.getInstance().hide();
        PKMainUI.getInstance().show(null,true)
    }

    private onBack(){
        PKResultUI.getInstance().hide();

        if(GuideManager.getInstance().isGuiding)
        {
            MyTool.removeMC(PopUpManager.shape);
            GuideManager.getInstance().showGuide(MainPageUI.getInstance())

        }

        var PKM = PKManager.getInstance();
        if(PKM.pkType == PKManager.PKType.MAP)
            MapMainUI.getInstance().show();

    }
    private onContinue(){
        var self = this;
        var PKM = PKManager.getInstance();
        if(PKM.pkType == PKManager.PKType.SERVER)
        {
            ServerGameManager.getInstance().openPKView(false,onOpenPKView);;
        }
        else if(PKM.pkType == PKManager.PKType.SERVER_EQUAL)
        {
            ServerGameEqualManager.getInstance().openPKView(false,onOpenPKView);
        }
        else if(PKM.pkType == PKManager.PKType.MAIN){
            MainGameManager.getInstance().openPKView(onOpenPKView);
        }
        else if(PKM.pkType == PKManager.PKType.DAY){
            DayGameUI.getInstance().show();
            PKResultUI.getInstance().hide();
        }
        else if(PKM.pkType == PKManager.PKType.PVE){
            if(TeamPVEManager.getInstance().canPK())
                TeamPVEMain.getInstance().show();
            PKResultUI.getInstance().hide();
        }
        else if(PKM.pkType == PKManager.PKType.MAP){
            var MM = MapManager.getInstance();
            MM.getEnemy(function(){
                MapGameUI.getInstance().show();
                PKResultUI.getInstance().hide();
            })
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
        this.btnGroup.visible = false;

        var PKM = PKManager.getInstance();
        if(PKM.pkType == PKManager.PKType.REPLAY || PKM.pkType == PKManager.PKType.FRIEND)
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
            this.okBtn.label = '继续挑战';
        }
        if(PKM.pkType == PKManager.PKType.MAP ){
            var MD = MapData.getInstance();
            if(MD.pkValue == 0)
            {
                MD.reInit();
                if(MD.pkValue == 0)
                {
                    MyTool.removeMC(this.okBtn)
                }
            }
        }

        this.step = 0;
        this.stepOne();
    }

    protected onStepOver(){
        this.btnGroup.visible = true;
        this.btnGroup.alpha = 0
        var tw:egret.Tween = egret.Tween.get(this.btnGroup);
        tw.wait(500).to({alpha:1}, 200);
    }

}