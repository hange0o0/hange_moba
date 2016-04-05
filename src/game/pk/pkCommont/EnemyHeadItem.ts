class EnemyHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "EnemyHeadItemSkin";
    }

    private headMC: eui.Image;
    private closeBtn: eui.Button;


    public index;

    public childrenCreated() {
          this.addBtnEvent(this.closeBtn,this.onClose);
    }

    private onClose(){

    }

    public dataChanged() {
        this.headMC.source = MyTool.getMonsterHead(this.data.id);
          if(this.data.type == 1)
          {
               this.closeBtn.visible = false;
          }
    }
}