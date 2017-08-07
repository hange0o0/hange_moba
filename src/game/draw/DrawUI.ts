class DrawUI extends game.BaseWindow {
    private static instance:DrawUI;
    public static getInstance() {
        if (!this.instance) this.instance = new DrawUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "DrawUISkin";
    }

    private okBtn: eui.Button;
    private cardGroup: eui.Group;
    private c0: DrawItem;
    private c1: DrawItem;
    private c2: DrawItem;
    private c3: DrawItem;
    private c4: DrawItem;
    private c5: DrawItem;
    private c6: DrawItem;
    private c7: DrawItem;
    private c8: DrawItem;
    private timeText: eui.Label;






    private itemArr = [];

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('钻石翻翻乐')
        this.addBtnEvent(this.okBtn, this.hide);
        for(var i=0;i<9;i++)
        {
            var item = this['c' + i];
            item.index = i;
            this.itemArr.push(item)
        }

    }

    public beforeHide(){

    }

    public show(data?){
        super.show();
    }

    public onShow(){
        this.timeText.text = '今天翻牌次数：' + (UM.active.draw_num || 0) +'/3';
        for(var i=0;i<this.itemArr.length;i++)
        {
            this.itemArr[i].reInit();
            this.cardGroup.addChild(this.itemArr[i]);
        }
        this.cardGroup.touchChildren = this.cardGroup.touchEnabled = true
    }

    public showDrawMV(){
        this.cardGroup.touchChildren = this.cardGroup.touchEnabled = false
    }
    public showOtherDraw(mid){
        var arr = [];
        var mdata = CM.table[MonsterVO.dataKey];
        var level = Math.max(3,UM.level);
        for(var s in mdata)
        {
            var vo = mdata[s];
            if(vo.level<= level && vo.id != mid)
                arr.push(vo.id);
        }
        ArrayUtil.random(arr);

        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            if(this.cardGroup.contains(item))
            {
                item.showOtherDraw(arr.shift())
            }
        }
    }
}