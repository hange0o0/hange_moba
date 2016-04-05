class MonsterInfoBaseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private img:eui.Image;

    public index;

    public childrenCreated(){

    }

    public dataChanged(){
        //var oo = PKManager.getInstance().indexAdd(this.itemIndex);
        //var id = this.data;
    }
}