class PKFailUI extends PKResultBase {
    private static instance:PKFailUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKFailUI();
        return this.instance;
    }

    private resultGroup: eui.Group;
    private desText: eui.Label;
    private list: eui.List;
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