class PKDressChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseItemSkin";
    }

    private stateMC: eui.Image;
    private myHeadItem: MyHeadItem;
    private deleteBtn: eui.Button;



    public index;

    public childrenCreated(){
        //MyTool.addDoubleTouch(this,this.onDoubleClick,this)
        this.addBtnEvent(this.deleteBtn,this.onClick)
    }
    
    private onClick(e){
        e.stopImmediatePropagation();
        this.dispatchEventWith('deleted');
    }

    //stat 0,无发光，1选中，2加成
    public dataChanged(){

        if(!this.data)
        {
            this.deleteBtn.visible = false;
            this.stateMC.visible = false;
            this.myHeadItem.data = null;
            this.myHeadItem.levelText.text = this.index
            return;
        }

        this.stateMC.visible = this.data.selected;
        this.deleteBtn.visible = this.data.selected;
        this.myHeadItem.data = this.data;
        this.myHeadItem.levelText.text = 'm'


    }
}