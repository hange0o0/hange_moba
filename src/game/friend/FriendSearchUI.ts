class FriendSearchUI extends game.BaseWindow {
    private static instance:FriendSearchUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendSearchUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "FriendSearchUISkin";
    }

    private nameText: eui.TextInput;
    private backBtn: eui.Button;
    private okBtn: eui.Button;



    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onSearch);
    }

    private onSearch(){
        var nick;
        if(!nick)
        {
            Alert('输入内容不能为空')
            return
        }
        var self = this;
        var FM = FriendManager.getInstance();
        FM.getOtherInfoByNick(nick,function(){
            OtherInfoUI.getInstance().showNick(nick);
            self.hide();
        })

    }

    public show(){
        super.show();
    }

    public onShow(){
        this.itemMC.data = this.data;
    }
}