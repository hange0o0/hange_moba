class SendTalkUI extends game.BaseWindow {
    private static instance:SendTalkUI;
    public static getInstance() {
        if (!this.instance) this.instance = new SendTalkUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "SendTalkUISkin";
    }

    private titleText: eui.Label;
    private editText: eui.EditableText;
    private cancelBtn: eui.Button;
    private sendBtn: eui.Button;



    private gameid

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn, this.hide);
        this.addBtnEvent(this.sendBtn, this.onSend);
        this.editText.restrict = "^\\\\\"\'"

        this.editText.addEventListener(egret.TextEvent.CHANGE,this.onChange,this);
    }

    private onChange(){
        var len = StringUtil.getStringLength(this.editText.text);
        this.editText.text = MyTool.replaceEmoji(this.editText.text);
        if(len > 200)
        {
            len = 200;
            this.editText.text = StringUtil.getStringByLength(this.editText.text,100);
        }
        this.titleText.text = '发送聊天(' + len + '/200)'
    }

    private onSend(){
        var self = this;
        FriendManager.getInstance().talk(this.gameid,this.editText.text,function(){
             self.hide();
        })
    }

    public show(data?){
        this.gameid = data;
        super.show();
    }

    public onShow(){
        this.editText.text = '';
        this.onChange();
        this.validateNow()
        //this.once(egret.Event.ENTER_FRAME,function(){
            this.editText.setFocus();
        //},this)

    }
}