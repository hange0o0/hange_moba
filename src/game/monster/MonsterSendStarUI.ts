class MonsterSendStarUI extends game.BaseWindow {
    private static instance:MonsterSendStarUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MonsterSendStarUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MonsterSendStarSkin";
    }

    private titleText: eui.Label;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
    private starText: eui.Label;
    private cancelBtn: eui.Button;
    private sendBtn: eui.Button;



    private gameid

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn, this.hide);
        this.addBtnEvent(this.sendBtn, this.onSend);

    }



    private onSend(){
        //var self = this;
        //FriendManager.getInstance().talk(this.gameid,this.editText.text,function(){
        //    self.hide();
        //})
    }

    public show(data?){
        this.gameid = data;
        super.show();
    }

    public onShow(){


    }
}