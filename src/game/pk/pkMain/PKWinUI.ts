class PKWinUI extends PKResultBase {
    private static instance:PKWinUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKWinUI();
        return this.instance;
    }
    
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
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

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