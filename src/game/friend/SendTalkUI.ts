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



    private openid

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn, this.hide);
        this.addBtnEvent(this.sendBtn, this.onSend);
    }

    private onSend(){
        var self = this;
        FriendManager.getInstance().talk(this.openid,this.editText,function(){
             self.hide();
        })
    }

    public show(data?){
        this.openid = data;
        super.show();
    }

    public onShow(){
        this.editText.text = '';
        this.titleText.text = '发送聊天信息'
    }
}