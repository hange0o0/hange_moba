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
    private r0: eui.RadioButton;
    private r1: eui.RadioButton;




    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onSearch);
        this.r0.group.addEventListener(eui.UIEvent.CHANGE,this.onRChange,this);
        this.r0.selected = true

        this.nameText.restrict = "a-zA-Z0-9_\u0391-\uFFE5";
        this.nameText.addEventListener(egret.TextEvent.CHANGE,this.onChange,this);
    }

    private onRChange(){
        if(this.r0.selected)
            this.nameText.prompt="请输入对方昵称"
        else
            this.nameText.prompt="请输入对方ID"
    }

    private onChange(){
        var len = StringUtil.getStringLength(this.nameText.text);
        if(len > 14)
        {
            this.nameText.text = StringUtil.getStringByLength(this.nameText.text,7);
        }
    }

    private onSearch(){
        var nick = this.nameText.text;
        if(!nick)
        {
            Alert('输入内容不能为空')
            return
        }

        var self = this;
        var FM = FriendManager.getInstance();
        if(this.r0.selected)
        {
            if(nick == UM.nick)
            {
                MyInfoUI.getInstance().show();
                return
            }
            FM.getOtherInfoByNick(nick,function(){
                OtherInfoUI.getInstance().showNick(nick);
                self.hide();
            })
        }
        else
        {
            if(nick == UM.gameid)
            {
                MyInfoUI.getInstance().show();
                return
            }
            FM.getOtherInfoByID(nick,function(){
                OtherInfoUI.getInstance().showID(nick);
                self.hide();
            })
        }


    }

    public show(){
        super.show();
    }

    public onShow(){
        this.nameText.text = '';
        this.onRChange();
    }
}