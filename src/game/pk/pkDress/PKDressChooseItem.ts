class PKDressChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseItemSkin";
    }

    private stateMC: eui.Image;
    private myHeadItem: MyHeadItem;



    public index;

    public stopDrag;
    public stopMove = true;

    public childrenCreated(){
        //MyTool.addDoubleTouch(this,this.onDoubleClick,this)
        DragManager.getInstance().setDrag(this,true);
    }

    public setStaticVisible(b){
        this.stateMC.visible = b;
    }

    //stat 0,无发光，1选中，2加成
    public dataChanged(){

        if(!this.data)
        {
            this.stateMC.visible = false;
            this.myHeadItem.data = null;
            this.myHeadItem.levelGroup.visible = false
            this.stopDrag = true;
            return;
        }

        var vo = MonsterVO.getObject(this.data.id);
        this.stateMC.visible = this.data.selected;
        this.myHeadItem.data = this.data;
        this.myHeadItem.levelText.text = PKManager.getInstance().getCostByNum(this.data.id,PKDressUI.getInstance().getMonsterNum(this.data.id)-1);
        this.myHeadItem.levelGroup.visible = true
        this.stopDrag = false;


    }
}