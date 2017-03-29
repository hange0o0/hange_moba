class UserChangeWordUI extends game.BaseWindow {
    private static instance:UserChangeWordUI;
    public static getInstance() {
        if (!this.instance) this.instance = new UserChangeWordUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "UserChangeWordSkin";
    }

    private titleText: eui.Label;
    private editText: eui.EditableText;
    private cancelBtn: eui.Button;
    private sendBtn: eui.Button;






    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn, this.hide);
        this.addBtnEvent(this.sendBtn, this.onSend);
        this.editText.restrict = "^\\\\\"\'\n\r"
        this.editText.prompt = "宣言最多25个中文"

        this.editText.addEventListener(egret.TextEvent.CHANGE,this.onChange,this);
    }

    private onChange(){
        var len = StringUtil.getStringLength(this.editText.text);
        this.editText.text = MyTool.replaceEmoji(this.editText.text);
        if(len > 50)
        {
            this.editText.text = StringUtil.getStringByLength(this.editText.text,25);
        }

    }

    private onSend(){
        var self = this;
        if(!this.editText.text)
        {
            Alert('没输入任何内容')
            return
        }
        if(BadWordsFilter.validateWords(this.editText.text))
        {
            Alert('文字中含有非法字符')
            return
        }
        if(this.editText.text == UM.word)
        {
            this.hide();
            return;
        }
        FriendManager.getInstance().changeWord(this.editText.text,function(){
            self.hide();
        })
    }

    public show(data?){
        super.show();
    }

    public onShow(){
        this.editText.text = UM.word || '';
        this.editText.setFocus();


    }
}