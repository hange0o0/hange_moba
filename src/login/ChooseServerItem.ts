class ChooseServerItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ChooseServerItemSkin";
    }


    private serverName: eui.Label;

    public index;

    public childrenCreated() {

    }

    public dataChanged() {
         var a = this.data.name;
        //if(LoginManager.getInstance().myServer[this.data.id])
        //{
        //
        //}
    }
}
