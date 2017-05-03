class AwardUI extends game.BaseWindow {
    private static instance:AwardUI;
    public static getInstance() {
        if (!this.instance) this.instance = new AwardUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "AwardUISkin";
    }

    private okBtn: eui.Button;
    private list: eui.List;


    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.hide);

        this.list.itemRenderer = AwardItem
    }

    public show(data?){
        this.data = data;
        super.show();
        //AwardUI.getInstance().show({monster:{101:3}})
    }

    public beforeHide(){
        this.clearList([this.list])
    }

    public onShow(){
        SoundManager.getInstance().playEffect(SoundConfig.effect_m_up);
        var arr = [];
        if(this.data.coin)
        {
            arr.push({type:'coin',des:'×' + this.data.coin})
        }
        if(this.data.energy)
        {
            arr.push({type:'energy',des:'×' + this.data.energy})
        }
        if(this.data.diamond)
        {
            arr.push({type:'diamond',des:'×' + this.data.diamond})
        }
        if(this.data.g_exp)
        {
            arr.push({type:'g_exp',des:'×' + this.data.g_exp})
        }
        if(this.data.collect)
        {
            arr.push({type:'card',des:'×' + this.data.collect})
        }
        if(this.data.card)
        {
            arr.push({type:'card',des:'×' + this.data.card})
        }
        if(this.data.prop)
        {
            for(var s in this.data.prop)
            {
                arr.push({type:'prop',id:s,des:'×' + this.data.prop[s]})
            }
        }
        if(this.data.monster)
        {
            for(var s in this.data.monster)
            {
                var num = this.data.monster[s];
                while(num --)
                    arr.push({type:'monster',id:s})
            }
        }
        (<eui.TileLayout>this.list.layout).requestedColumnCount = Math.min(4,arr.length)
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}