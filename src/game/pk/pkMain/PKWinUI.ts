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
    }

    private onBack(){
        PKResultUI.getInstance().hide();

        if(GuideManager.getInstance().isGuiding)
        {
            MyTool.removeMC(PopUpManager.shape);
            GuideManager.getInstance().showGuide(MainPageUI.getInstance())

        }

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
        else if(PKM.pkType == PKManager.PKType.MAP){
            var MM = MapManager.getInstance();
            MM.getEnemy(MM.pkLevel,function(){
                onOpenPKView();
                MapGameUI.getInstance().show();
            })
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
        else
        {
            this.btnGroup.addChild(this.okBtn);
            this.okBtn.label = '继续挑战';
        }
        if(PKM.pkType == PKManager.PKType.MAP ){
            var MM = MapManager.getInstance();
            if(MM.level == MM.pkLevel)
            {
                if(MM.step < 10)
                    this.okBtn.label = '继续清剿';
                else
                    MyTool.removeMC(this.okBtn)
            }
            else
            {
                if(MM.getSweepNum(MM.pkLevel) < 10)
                    this.okBtn.label = '继续扫荡';
                else
                    MyTool.removeMC(this.okBtn)
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