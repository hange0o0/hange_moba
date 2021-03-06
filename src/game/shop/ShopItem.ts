class ShopItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ShopItemSkin";
    }

    private buyBtn: eui.Button;
    private text1: eui.Label;
    private text2: eui.Label;
    private img: eui.Image;
    private numText: eui.Label;
    private icon: eui.Image;
    private rmbMC: eui.Image;







    public index;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.buyBtn,this.onBuy);
    }

    private onBuy(){
        var self = this;
        var free = this.data.id == 31 && !(UM.active.task.stat || {})['ticket']
        if(!free && this.data.type == 'diamond' && UM.getDiamond() < this.data.cost)
        {
            Alert('钻石不足！')
            return;
        }
        //else if(this.data.type == 'diamond' && UM.getDiamond(true) < this.data.cost)
        //{
        //    Alert('钻石不足！')
        //    return;
        //}
        PayManager.getInstance().buy(this.data.id,function(){
              if(self.data.id > 200)
              {
                  ShopUI.getInstance().onShow();
              }
        })
    }

    public dataChanged() {
        if(this.data.rate)
            this.numText.text = '×' + this.data.rate;
        else
            this.numText.text = '';

        if(this.data.shopType == 'coin')
            this.setHtml(this.text1,this.data.word + ' <font size="22">(金币X' + NumberUtil.addNumSeparator(PayManager.getInstance().getCoin(this.data.id)) + ')</font>');
        else  if(this.data.shopType == 'card')
            this.setHtml(this.text1,this.data.word + ' <font size="22">(卡片X' + NumberUtil.addNumSeparator(PayManager.getInstance().getCard(this.data.id)) + ')</font>');
        else  if(this.data.shopType == 'ticket')
            this.setHtml(this.text1,this.data.word + ' <font size="22">(当前拥有：' + UM.getPropNum(21) + ')</font>');
        else
            this.text1.text = this.data.word;

        this.rmbMC.visible = false;
        if(this.data.type == 'rmb')
        {
            this.rmbMC.visible = true;
            this.icon.source = 'icon_empty_png';
            this.text2.text = '￥' + this.data.cost;

        }  
        //else if(this.data.type == 'free')
        //{
        //    this.text2.text = '点券/钻石:' + this.data.cost;
        //    this.icon.source = 'icon_pvp_ticket_png';
        //}
        else if(this.data.type == 'diamond')
        {
            this.text2.text = '钻石:' + this.data.cost;
            this.icon.source = 'icon_token_png';

            if(this.data.id == 31 && !(UM.active.task.stat || {})['ticket'])
                this.text2.text = '首次免费'
        }

        this.img.source = this.data.img;
    }
}