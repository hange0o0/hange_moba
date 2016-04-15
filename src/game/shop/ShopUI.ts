class ShopUI extends game.BaseUI {
    private static instance:ShopUI;

    public static getInstance() {
        if (!this.instance) this.instance = new ShopUI();
        return this.instance;
    }

    private topUI:TopUI;
    private scroller:eui.Scroller;
    private list:eui.List;
    private resourceUI:ResourceUI;


    private dataIn;
    public constructor() {
        super();
        this.skinName = "ShopUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('神秘商店')
        this.topUI.addEventListener('hide', this.hide, this);

        this.list.itemRenderer = ShopItem;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

    }

    public show(v?){
        this.dataIn = v;
         super.show();
    }

    public onShow(){
        this.resourceUI.renew();

        var arr = PayManager.getInstance().shopItem.slice();
        if(UM.energy.vip)
            arr.shift();

        this.list.dataProvider = new eui.ArrayCollection(arr);

        var v = 0
        if(this.dataIn == 'coin')
        {
            for(var i=0;i<arr.length;i++)
            {
                if(arr[i].id > 10)
                    break;
            }
            v = i*100;
        }
        else if(this.dataIn == 'diamond')
        {
            for(var i=0;i<arr.length;i++)
            {
                if(arr[i].id > 20)
                    break;
            }
            v = i*100;
        }


        this.once(egret.Event.RENDER,function(){
            this.scroller.viewport.scrollV = Math.min(v,this.scroller.viewport.contentHeight - this.scroller.height);
        },this)

        this.dataIn = null;
    }
}

