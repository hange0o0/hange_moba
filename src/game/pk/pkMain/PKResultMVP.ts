class PKResultMVP extends game.BaseContainer {
    private tab: eui.TabBar;
    private list: eui.List;



    public constructor() {
        super();

    }


    public childrenCreated() {
        super.childrenCreated();
        this.skinName = "PKResultMVPSkin";

        this.tab.addEventListener(eui.ItemTapEvent.CHANGE, this.typeBarClick, this);
        this.addBtnEvent(this.list,this.onSelectItem)

        this.list.itemRenderer = PKResultMVPItem
    }

    private onSelectItem(){
        var item = this.list.selectedItem;
        //if(item && item.isSelect)
        //{
        //    item.setChoose(false);
        //    this.list.selectedIndex = -1;
        //    return
        //}
        var list = []
        for(var i=0;i<this.list.numChildren;i++)
        {
            var oo:any = this.list.getChildAt(i)
            list.push(oo);
        }
        var choose = false
        for(var i=0;i<list.length;i++)
        {
            var oo:any = list[i]
            var b = item && item == oo.data && !oo.isSelect
            oo.setChoose(b);
            if(b)
            {
                choose = true;
                this.dispatchEventWith('choose_monster',true,{team:item.team,index:item.id%10})
            }
        }

        if(!choose)
        {
            this.list.selectedIndex = -1;
            this.dispatchEventWith('choose_monster',true,{team:0,index:10})
        }
    }

    public typeBarClick(){
        var mvpList = PKManager.getInstance().mvpList
        var list = mvpList.list;
        var arr = [];
        var topObj = {};
        for(var i=0;i<list.length;i++)
        {
            var item = list[i];
             var oo:any = {
                 id:item.id,
                 mid:item.mid,
                 team:item.team,
                 type:this.tab.selectedIndex,
             }
             switch(this.tab.selectedIndex)
             {
                 case 0:
                     oo.value = item.mvp
                     oo.maxValue = mvpList.mvp
                     break;
                 case 1:
                     oo.value = item.hp
                     oo.maxValue = mvpList.hp
                     break;
                 case 2:
                     oo.value = item.atk
                     oo.maxValue = mvpList.atk
                     break;
                 case 3:
                     oo.value = item.help
                     oo.maxValue = mvpList.help
                     break;
             }
            if(!topObj[this.tab.selectedIndex] && oo.value == oo.maxValue)
            {
                oo.isTop = true;
                topObj[this.tab.selectedIndex] = true;
            }
            arr.push(oo);
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
        this.dispatchEventWith('choose_monster',true,{team:0,index:10})
    }

    public renew(){
        this.tab.selectedIndex = 0;
        this.typeBarClick();
    }
}