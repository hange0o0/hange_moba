class PKDressChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseItemSkin";
    }

    private stateMC: eui.Image;
    private myHeadItem: MyHeadItem;



    public index;

    public childrenCreated(){
        //MyTool.addDoubleTouch(this,this.onDoubleClick,this)
    }
    

    //stat 0,无发光，1选中，2加成
    public dataChanged(){

        if(!this.data)
        {
            this.stateMC.visible = false;
            this.myHeadItem.data = null;
            this.myHeadItem.levelText.text = 'X'
            return;
        }

        var vo = MonsterVO.getObject(this.data.id);
        this.stateMC.visible = this.data.selected;
        this.myHeadItem.data = this.data;
        this.myHeadItem.levelText.text = PKManager.getInstance().getCostByNum(this.data.id,PKDressUI.getInstance().getMonsterNum(this.data.id)-1);


    }
}