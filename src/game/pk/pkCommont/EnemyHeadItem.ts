class EnemyHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "EnemyHeadItemSkin";
    }

    private headMC: eui.Image;
    private closeBtn: eui.Button;


    public index;

    public childrenCreated() {
          this.addBtnEvent(this.closeBtn,this.onKill);
          this.addBtnEvent(this,this.onClick);

        MyTool.addTestBlock(this);
    }

    private onKill(e:egret.TouchEvent){
        e.stopImmediatePropagation();
        var self = this;
        MainGameManager.getInstance().kill(this.data.index,function(){
            MainGameUI.getInstance().renewPrice();
            self.data.isKill = true;
            self.dataChanged();
        })
    }
    private onClick(){
        MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    //type == 1,显示基础
    //type == 2,在主线PK中，会杀
    public dataChanged() {
        if(!this.data.vo)
            this.data.vo = MonsterVO.getObject(this.data.id);
        this.headMC.source = this.data.vo.thumb
      if(this.data.type == 2)
      {
           this.closeBtn.visible = this.data.isKill;
      }
      else
      {
          this.closeBtn.visible = false;
      }
    }
}