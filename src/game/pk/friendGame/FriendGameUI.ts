class FriendGameUI extends game.BaseUI {
    private static instance:FriendGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendGameUI();
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

    private onClick(){

    }
}