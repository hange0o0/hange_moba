class PKWinUI extends PKResultBase {
    private static instance:PKWinUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKWinUI();
        return this.instance;
    }

    private resultGroup: eui.Group;
    private desText: eui.Label;
    private list: eui.List;
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
        this.addBtnEvent(this.okBtn, this.onClick);
    }

    private onClick(){
        PKResultUI.getInstance().hide();
    }

    public renew(){

        this.desText.text = ''
        this.list.visible = false;
        this.okBtn.visible = false;


        this.step = 0;
        this.stepOne();
    }

    protected onStepOver(){
        this.okBtn.visible = true;
    }

}