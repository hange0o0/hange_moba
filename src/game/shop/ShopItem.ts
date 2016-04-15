class ShopItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ShopItemSkin";
    }

    private headMC:eui.Image;
    private buyBtn: eui.Button;
    private text1: eui.Label;
    private text2: eui.Label;



    public index;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.buyBtn,this.onBuy);
    }

    private onBuy(){
        var self = this;
        if(this.data.type == 'free' && UM.getDiamond() < this.data.cost)
        {
            Alert('钻石不足！')
            return;
        }
        else if(this.data.type == 'diamond' && UM.getDiamond(true) < this.data.cost)
        {
            Alert('钻石不足！')
            return;
        }
        PayManager.getInstance().buy(this.data.id,function(){
              if(self.data.id == 1)
              {
                  ShopUI.getInstance().onShow();
              }
        })
    }

    public dataChanged() {
        this.text1.text = this.data.word;
        if(this.data.type == 'rmb')
            this.text2.text = '￥' + this.data.cost;
        else if(this.data.type == 'free')
        {
            this.text2.text = 'free:' + this.data.cost;
        }
        else if(this.data.type == 'diamond')
        {
            this.text2.text = 'diamond:' + this.data.cost;
        }


    }
}