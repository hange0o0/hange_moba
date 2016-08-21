class ShopItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ShopItemSkin";
    }

    private buyBtn: eui.Button;
    private text1: eui.Label;
    private text2: eui.Label;
    private img: eui.Image;
    private icon: eui.Image;
    private rmbMC: eui.Image;





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
        this.rmbMC.visible = false;
        if(this.data.type == 'rmb')
        {
            this.rmbMC.visible = true;
            this.icon.source = 'icon_empty_png';
            this.text2.text = '￥' + this.data.cost;
        }  
        else if(this.data.type == 'free')
        {
            this.text2.text = '点券/钻石:' + this.data.cost;
            this.icon.source = 'icon_pvp_ticket_png';
        }
        else if(this.data.type == 'diamond')
        {
            this.text2.text = '钻石:' + this.data.cost;
            this.icon.source = 'icon_token_png';
        }


        if(this.data.id < 10)
        {
            this.img.source = 'pay_energy_png'
        }
        else if(this.data.id < 20) {   //￥
            this.img.source = 'pay_coin_png'
        }
        else if(this.data.id < 30) {   //卡包
            this.img.source = 'pay_coin_png'
        }
        else if(this.data.id < 40) {   //门票
            this.img.source = 'pay_coin_png'
        }
        else{  //钻石
            this.img.source = 'box' + (this.data.id - 21)+'_png'
        }
    }
}