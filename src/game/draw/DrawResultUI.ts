class DrawResultUI extends game.BaseContainer {
    private static instance:DrawResultUI;
    public static getInstance() {
        if (!this.instance) this.instance = new DrawResultUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "DrawResultUISkin";
    }

    private diamondGroup: eui.Group;
    private resultText: eui.Label;
    private okBtn: eui.Button;






    private item;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);
    }


    public hide(){
        DrawUI.getInstance().showOtherDraw(this.item.mid);
        this.item.backPos();
        MyTool.removeMC(this);


    }

    public show(item){
        SoundManager.getInstance().playEffect(SoundConfig.effect_m_up);
        this.width = GameManager.container.width
        this.height = GameManager.container.height
        GameManager.container.addChild(this);
        this.addChild(item);
        this.diamondGroup.y = item.y + 150;

        this.item = item;
        var vo = MonsterVO.getObject(item.mid);
        this.resultText.text = '×' + vo.cost
        this.okBtn.visible = false;
        egret.setTimeout(function(){
            this.okBtn.visible = true;
        },this,500)
    }


}