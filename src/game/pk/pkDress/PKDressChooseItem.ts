class PKDressChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseItemSkin";
    }

    private stateMC: eui.Image;
    private monsterGroup: eui.Group;
    private addMC: eui.Image;
    private headMC: eui.Image;
    private headBG: eui.Image;
    private pGroup: eui.Group;
    private p1: eui.Rect;
    private p2: eui.Rect;
    private p3: eui.Rect;
    private lvText: eui.Label;
    private levelGroup: eui.Group;
    private levelText: eui.Label;

    //private noteIcon: eui.Image;





    public index;

    public stopDrag;
    public stopMove = true;

    public childrenCreated(){
        //MyTool.addDoubleTouch(this,this.onDoubleClick,this)
        DragManager.getInstance().setDrag(this,true);
        //this.addBtnEvent(this.noteIcon,this.onNote)
    }

    //private onNote(e){
    //    var list = this.data.getChooseList();
    //    MonsterList.getInstance().show(list,list.indexOf(this.data))
    //}

    public setStaticVisible(b){
        this.stateMC.visible = b;

    }

    public setChoosing(b){
       if(b)
           this.monsterGroup.scaleX =this.monsterGroup.scaleY = 1.1;
        else
           this.monsterGroup.scaleX =this.monsterGroup.scaleY = 1.3;

    }

    //stat 0,无发光，1选中，2加成
    public dataChanged(){

        //this.noteIcon.visible = false;
        this.lvText.text = '';
        //this.pGroup.removeChildren()
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
        //this.noteIcon.visible = this.data.selected;
        this.levelText.text = PKManager.getInstance().getCostByNum(this.data.id,PKDressUI.getInstance().getMonsterNum(this.data.id)-1);
        this.levelGroup.visible = true
        this.stopDrag = false;

        var lv = UM.getMonsterLevel(this.data.id);
        if(!this.data.specialData.isEqual && lv)
            this.lvText.text = 'LV.' + lv;


    }
}