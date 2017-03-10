class PKDressChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseItemSkin";
    }

    private stateMC: eui.Image;
    private monsterGroup: eui.Group;
    private headMC: eui.Image;
    private headBG: eui.Image;
    private lvText: eui.Label;
    private levelGroup: eui.Group;
    private levelText: eui.Label;





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

    public setChoosing(b){
       if(b)
           this.monsterGroup.scaleX =this.monsterGroup.scaleY = 1;
        else
           this.monsterGroup.scaleX =this.monsterGroup.scaleY = 1.2;
    }

    //stat 0,无发光，1选中，2加成
    public dataChanged(){

        this.lvText.text = '';
        if(!this.data)
        {
            this.stateMC.visible = false;
            this.headMC.source = null;
            this.levelGroup.visible = false
            this.stopDrag = true;
            return;
        }

        var vo = MonsterVO.getObject(this.data.id);
        this.headMC.source = vo.thumbRound;
        this.stateMC.visible = this.data.selected;
        this.levelText.text = PKManager.getInstance().getCostByNum(this.data.id,PKDressUI.getInstance().getMonsterNum(this.data.id)-1);
        this.levelGroup.visible = true
        this.stopDrag = false;

        var lv = UM.getMonsterLevel(this.data.id);
        if(!this.data.specialData.isEqual && lv)
            this.lvText.text = 'LV.' + lv;


    }
}