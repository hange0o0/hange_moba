class ConfirmUI extends game.BaseWindow {
    public constructor() {
        super();
        this.skinName = "AlertSkin";
    }

    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private closeBtn: eui.Button;
    private text: eui.Label;

    private textIn;
    private fun;
    private btnWord;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.onClick);
        this.addBtnEvent(this.cancelBtn, this.onCancelClick);
        this.addBtnEvent(this.closeBtn, this.onCloseClick);
    }

    public show(v?,fun?,btnWord?){
        this.textIn = v;
        this.fun = fun;
        this.btnWord = btnWord;
        super.show();
    }

    public onShow(){
        this.text.text = this.textIn;
        if(this.btnWord)
        {
            this.cancelBtn.label = this.btnWord[0];
            this.okBtn.label = this.btnWord[1];
        }


        var ww = GameManager.container.width;
        var hh = GameManager.container.height;
        this.x = (ww - this.width) / 2;
        this.y = (hh - this.height) / 2;
    }

    private onClick(){
        this.hide();
        if(this.fun)
            this.fun(1);
    }
    private onCancelClick(){
        this.hide();
        if(this.fun)
            this.fun(2);
    }
    private onCloseClick(){
        this.hide();
        if(this.fun)
            this.fun(3);
    }
}
