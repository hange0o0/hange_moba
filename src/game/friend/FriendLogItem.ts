class FriendLogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private infoGroup: eui.Group;
    private levelText: eui.Label;
    private forceText: eui.Label;
    private btnGroup: eui.Group;
    private agreeBtn: eui.Button;
    private refuseBtn: eui.Button;
    private talkText: eui.Label;


    public index;

    public childrenCreated(){

    }

    public dataChanged(){

    }
}