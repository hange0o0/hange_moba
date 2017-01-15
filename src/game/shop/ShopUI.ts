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
    private dataArr;
    public constructor() {
        super();
        this.skinName = "ShopUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('神秘商店')
        this.topUI.addEventListener('hide', this.hide, this);

        this.list.itemRenderer = ShopItem2;
        this.list.useVirtualLayout = false;
        this.scroller.viewport = this.list;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.scroller.bounces = false;

    }

    public show(v?){
        this.dataIn = v;
        if(this.stage)
        {
            this.renewScroll(this.dataIn,true);
            return;
        }
         super.show();
    }

    public onShow(){
        this.resourceUI.renew();

        var arr = PayManager.getInstance().shopItem.slice();
        if(UM.energy.vip)
            arr.shift();
        var dataArr = this.dataArr = [];
        var listObj = {txt:'购买体力',wType:'energy',list:[]};
        dataArr.push(listObj);
        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            if(oo.id == 11)
            {
                listObj = {txt:'购买金币',wType:'coin',list:[]};
                dataArr.push(listObj);
            }
            else if(oo.id == 21)
            {
                listObj = {txt:'购买卡片',wType:'card',list:[]};
                dataArr.push(listObj);
            }
            else if(oo.id == 31)
            {
                listObj = {txt:'购买修正场门券',wType:'ticket',list:[]};
                dataArr.push(listObj);
            }
            else if(oo.id == 101)
            {
                listObj = {txt:'购买钻石',wType:'diamond',list:[]};
                dataArr.push(listObj);
            }
            listObj.list.push(oo);
        }

        this.list.dataProvider = new eui.ArrayCollection(dataArr);


        if(this.dataIn)
        {
            this.renewScroll(this.dataIn);
        }
        this.dataIn = null;
    }

    public renewScroll(dataIn,mv?){
        var v = 0;
        var dataArr = this.dataArr
        for(var i=0;i<dataArr.length;i++)
        {
            if(dataArr[i].wType == dataIn)
            {
                break;
            }

            v += dataArr[i].list.length * 115 + 70 + 20 + 5;
        }
        //this.once(egret.Event.ENTER_FRAME,function(){
            this.once(egret.Event.ENTER_FRAME,function(){
                for(var i=0;i<this.list.numChildren;i++)
                {
                    var item = (<any>this.list.getChildAt(i));
                    if(item.data.wType == dataIn)
                    {
                        item.flash();
                        break;
                    }

                }

                v = Math.min(v,this.scroller.viewport.contentHeight - this.scroller.height);
                if(mv)
                {
                    var tw:egret.Tween = egret.Tween.get(this.scroller.viewport);
                    tw.to({scrollV:v},200)
                }
                else
                {
                    this.scroller.viewport.scrollV = v;
                }

            },this)
        //},this)

    }

}

