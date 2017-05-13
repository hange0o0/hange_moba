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






    private itemArr = [];

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);
    }


    public hide(){
        MyTool.removeMC(this);
        DrawUI.getInstance().hide();
    }

    public show(item){
        this.width = GameManager.container.width
        this.height = GameManager.container.height
        GameManager.container.addChild(this);
        this.addChild(item);
        this.diamondGroup.y = item.y + 150;

        var vo = MonsterVO.getObject(item.mid);
        this.resultText.text = '×' + vo.cost
        this.okBtn.visible = false;
        egret.setTimeout(function(){
            this.okBtn.visible = true;
        },this,500)
    }


}