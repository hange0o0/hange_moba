class TeamDungeonAwardBoxItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TeamDungeonAwardBoxItemSkin";
    }


    private headMC: eui.Image;
    private nameText: eui.Label;
    private forceText: eui.Label;
    private levelText: eui.Label;
    private inviteBtn: eui.Button;




    public childrenCreated() {
    }

    public dataChanged() {

    }


}