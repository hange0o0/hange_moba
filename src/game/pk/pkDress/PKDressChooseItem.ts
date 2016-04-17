class PKDressChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseItemSkin";
    }
    
    private stateMC: eui.Image;
    private myHeadItem: MyHeadItem;


    public index;

    public childrenCreated(){
        MyTool.addDoubleTouch(this,this.onDoubleClick,this)
    }
    
    private onDoubleClick(){
        
    }

    //stat 0,无发光，1选中，2加成
    public dataChanged(){
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