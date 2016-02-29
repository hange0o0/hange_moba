class FriendTalkUI extends game.BaseUI {
    private static instance:FriendTalkUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendTalkUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    public onShow(){
        this.renew();
    }

    private onClick(){

    }

    private renew(){

    }
}