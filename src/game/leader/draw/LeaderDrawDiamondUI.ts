class LeaderDrawDiamondUI extends game.BaseWindow {
    private static instance:LeaderDrawDiamondUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LeaderDrawDiamondUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "LeaderDrawDiamondUISkin";
    }

    private backBtn: eui.Button;
    private okBtn: eui.Button;
    private autoCB: eui.CheckBox;
    private diamondGroup: eui.Group;
    private diamondRect: eui.Rect;
    private diamondText: eui.Label;





    private needDiamond;
    private times;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onPK);
        this.addBtnEvent(this.autoCB, this.onCB);

        this.autoCB.selected = SharedObjectManager.instance.getMyValue('skillDrawDiamond')
    }

    private onCB(){
        if(this.autoCB.selected)
            SharedObjectManager.instance.setMyValue('skillDrawDiamond',TM.now())
        else
            SharedObjectManager.instance.setMyValue('skillDrawDiamond',0)
    }

    public onPK(){
        if(!UM.testDiamond(this.needDiamond))
            return;
        this.hide()
        LeaderDrawMainUI.getInstance().draw(this.times,true);
        if(this.autoCB.selected)
            SharedObjectManager.instance.setMyValue('skillDrawDiamond',TM.now())
    }

    public show(v?){
       this.times = v;
        super.show();
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.renew)
    }

    public renew(){
        var propNum = UM.getPropNum(41);
        var dec =  this.times - propNum;
        if(dec <= 0)
        {
            this.needDiamond = 0
            this.diamondText.text = '0';
            this.diamondRect.width = 0;
        }
        else
        {
            var needDiamond = this.needDiamond = dec*100
            this.diamondText.text = '' + needDiamond
            this.diamondRect.width = 100 * Math.min(1,needDiamond/UM.getDiamond());
        }
    }
}