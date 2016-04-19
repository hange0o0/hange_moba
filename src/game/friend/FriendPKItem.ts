class FriendPKItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FriendPKItemSkin";
    }



    private headMC: eui.Image;
    private nameText: eui.Label;
    private btnGroup: eui.Group;
    private refuseBtn: eui.Button;
    private talkText: eui.Label;


    public childrenCreated(){

    }

    public dataChanged(){

    }
}