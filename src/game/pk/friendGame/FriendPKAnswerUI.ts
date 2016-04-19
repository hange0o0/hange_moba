class FriendPKAnswerUI extends game.BaseUI {
    private static instance:FriendPKAnswerUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FriendPKAnswerUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "FriendPKAnswerUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    private onClick(){

    }
}