class DebugInput extends game.BaseWindow {
    private static instance:DebugInput;

    public static getInstance() {
        if (!this.instance) this.instance = new DebugInput();
        return this.instance;
    }

    private  cancelBtn: eui.Button;
    private  okBtn: eui.Button;
    private  inputText: eui.TextInput;
    private  titleText: eui.Label;

    private fun
    private title

    public constructor() {
        super();
        this.skinName = "DebugInputSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn,this.hide);
        this.addBtnEvent(this.okBtn,this.onClick);
    }

    public show(fun?,title?)
    {
        this.fun = fun;
        this.title = title || '';
        super.show();
    }

    public onShow(){
        this.titleText.text = this.title;
        this.inputText.text = '';
    }

    public onClick()
    {
        if(this.fun)
        {
            this.fun(this.inputText.text.split('#'));
        }
        this.hide();
    }


}