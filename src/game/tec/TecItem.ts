class TecItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TecItemSkin";
    }

    private headMC: eui.Image;
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private nameText: eui.Label;



    public index;

    public childrenCreated() {
    }

    public dataChanged() {
       if(this.data.tecType == 1)
       {
           this.headMC.source;
           this.nameText.text = this.data.name;
           this.levelText.text = UM.tec.main[this.data.id] || 0;
       }
       else if(this.data.tecType == 2)
       {
           this.headMC.source;
           this.nameText.text = this.data.name;
           this.levelText.text = UM.tec.ring[this.data.id] || 0;
       }
       else if(this.data.tecType == 3)
       {
           var mvo = MonsterVO.getObject(this.data.id);
           this.headMC.source = mvo.thumb;
           this.nameText.text = mvo.name;
           this.levelText.text = UM.tec.monster[this.data.id] || 0;
       }


    }
}
