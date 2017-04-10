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

        var str = ''
        var lv = UM.getMonsterLevel(this.data.id);
        if(!this.data.specialData.isEqual && lv)
            str = 'LV.' + lv;


        var atkData = PKDressUI.getInstance()['pkDressChooseUI'].atkData;
        if(atkData.atk && atkData.atk.length > 1)
        {
            var fightList = PKDressUI.getInstance().atkData;
            var fightData = fightList[this.data.id];
             if(str)
                str += '\n';
            var arr = [];
            arr.push({w:this.createHtml('血',0xFF4747),v:atkData.hp.indexOf(fightData.hp),v2:fightList.hp.indexOf(fightData.hp),v3:1})
            arr.push({w:this.createHtml('攻',0xFDC04F),v:atkData.atk.indexOf(fightData.atk),v2:fightList.atk.indexOf(fightData.atk),v3:1})
            arr.push({w:this.createHtml('速',0x747DFF),v:atkData.speed.indexOf(fightData.speed),v2:fightList.speed.indexOf(fightData.speed),v3:1})
            ArrayUtil.sortByField(arr,['v','v2','v3'],[0,0,0])
            str += arr[0].w + arr[1].w + arr[2].w;
            //str += '\n' + arr[0].v +','+ arr[1].v+',' + arr[2].v;
        }

        this.setHtml(this.lvText,str);
    }
}