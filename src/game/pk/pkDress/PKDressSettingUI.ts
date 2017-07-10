class PKDressSettingUI extends game.BaseContainer {

    public constructor() {
        super();
        //this.skinName = "PKDressSettingSkin";
    }


    private itemGroup: eui.Group;
    private h0: PKDressSettingItem;
    private h1: PKDressSettingItem;
    private h2: PKDressSettingItem;
    private h3: PKDressSettingItem;
    private h4: PKDressSettingItem;
    private h5: PKDressSettingItem;
    private h6: PKDressSettingItem;
    private h7: PKDressSettingItem;
    private resetBtn: eui.Button;
    private pkBtn: eui.Button;

    private itemArr = [];
    public monsterSelect = {};
    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.pkBtn, this.onOK);
        this.addBtnEvent(this.resetBtn, this.onReset);

        for(var i=0;i<8;i++)
        {
            var mc = this['h' + i];
            this.itemArr.push(mc);
        }
    }

    private onOK(){
        var oo = {
            need:this.getPKArr(),
            dis:this.getDisArr()
        }
        if(oo.need.length == 0 && oo.dis.length == 0)
            oo = null;
        this.dispatchEventWith('dress_setting',false,oo);
    }

    public getPKArr(){
        var arr = []
        for(var s in this.monsterSelect)
        {
            if(this.monsterSelect[s] && this.monsterSelect[s] > 0)
            {
                var num = this.monsterSelect[s];
                while(num > 0)
                {
                    arr.push(parseInt(s));
                    num --;
                }
            }
        }
        return arr;
    }
    public getDisArr(){
        var arr = []
        for(var s in this.monsterSelect)
        {
            if(this.monsterSelect[s] == -1)
            {
                arr.push(parseInt(s));
            }
        }
        return arr;
    }

    private onReset(){
        this.monsterSelect = {};
        this.renew();
    }

    public init(arr,lastData?){
        this.monsterSelect = {};
        if(lastData){
               for(var i=0;i<lastData.dis.length;i++)
               {
                   var id = lastData.dis[i];
                   this.monsterSelect[id] = -1;
               }
               for(var i=0;i<lastData.need.length;i++)
               {
                   var id = lastData.need[i];
                   this.monsterSelect[id] = (this.monsterSelect[id] || 0) + 1;
               }
        }
        for(var i=0;i<arr.length;i++)
        {
            this.itemArr[i].data = {
                mid:arr[i],
                setting:this
            }
        }
        for(var i=0;i<this.itemArr.length;i++)
        {
            this.itemArr[i].setChooseing(null);
        }
    }

    public renew(){
        for(var i=0;i<this.itemArr.length;i++)
        {
            this.itemArr[i].dataChanged();
        }
        this.dispatchEventWith('dress_setting_change');
    }

    public renewChooseing(mid){
        for(var i=0;i<this.itemArr.length;i++)
        {
            this.itemArr[i].setChooseing(mid);
        }
        this.dispatchEventWith('dress_setting_choose',false,mid);
    }
}