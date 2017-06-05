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






    private mid;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);
    }


    public hide(){
        MyTool.removeMC(this);
        DrawUI.getInstance().showOtherDraw(this.mid);
    }

    public show(item){
        SoundManager.getInstance().playEffect(SoundConfig.effect_m_up);
        this.width = GameManager.container.width
        this.height = GameManager.container.height
        GameManager.container.addChild(this);
        this.addChild(item);
        this.diamondGroup.y = item.y + 150;

        this.mid = item.mid;
        var vo = MonsterVO.getObject(item.mid);
        this.resultText.text = '×' + vo.cost
        this.okBtn.visible = false;
        egret.setTimeout(function(){
            this.okBtn.visible = true;
        },this,500)
    }


}