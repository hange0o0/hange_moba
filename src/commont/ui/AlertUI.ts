class AlertUI extends game.BaseWindow {
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

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.onClick);
        MyTool.removeMC(this.closeBtn)
        MyTool.removeMC(this.cancelBtn)
    }

    public show(v?,fun?){
        this.textIn = v;
        this.fun = fun;
        super.show();
    }

    public onShow(){
        this.text.text = this.textIn;


        var ww = GameManager.container.width;
        var hh = GameManager.container.height;
        this.x = (ww - this.width) / 2;
        this.y = (hh - this.height) / 2;
    }

    private onClick(){
        this.hide();
        if(this.fun)
            this.fun();
    }
}