class PKDressChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }
    
    private stateMC: eui.Image;
    private myHeadItem: MyHeadItem;


    public index;

    public childrenCreated(){

    }

    public dataChange(){
         this.myHeadItem.data = this.data;

        if(this.data.stat)
        {
            this.stateMC.visible = true;
            this.stateMC.source;
        }
        else
        {
            this.stateMC.visible = false;
        }



    }
}