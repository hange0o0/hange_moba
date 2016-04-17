class FriendListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private levelText: eui.Label;
    private forceText: eui.Label;



    public index;

    public childrenCreated(){

    }

    public dataChanged(){
    }
}