class MonsterList extends game.BaseUI {
    private static instance:MonsterList;
    public static getInstance() {
        if (!this.instance) this.instance = new MonsterList();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private info: MonsterInfoBase;
    private bottomGroup: eui.Group;
    private leftBtn: eui.Group;
    private rightBtn: eui.Group;
    private pageText: eui.Label;
    private pageGroup: eui.Group;
    private p0: eui.Image;
    private p1: eui.Image;
    private p2: eui.Image;
    private p3: eui.Image;
    private p4: eui.Image;
    private p5: eui.Image;
    private p6: eui.Image;
    private p7: eui.Image;
    private p8: eui.Image;
    private p9: eui.Image;


    public index;
    public dataArray;


    public constructor() {
        super();
        this.skinName = "MonsterListUISkin";
    }



    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('卡牌详情')
        this.topUI.addEventListener('hide',this.hide,this);


        this.addBtnEvent(this.leftBtn, this.onLeft);
        this.addBtnEvent(this.rightBtn, this.onRight);
    }


    private onLeft(){
         if(this.index > 0)
         {
             this.index --;
             this.renew()
         }
    }

    private onRight(){
        if(this.index < this.dataArray.length-1)
        {
            this.index ++;
            this.renew()
        }
    }


    public show(list?,index?){
        this.dataArray = list;
        this.index = index || 0;
        super.show();
    }

    public onShow(){
        if(this.dataArray.length <2)
        {
            this.bottomGroup.visible = false;
            this.scroller.bottom = 0;
        }
        else
        {
            this.bottomGroup.visible = true;
            this.scroller.bottom = 80;
        }

        this.renew();
    }

    public renew(){
        var oo =  this.dataArray[this.index];
        this.info.renew(oo.id,oo.specialData)
        this.renewPage();
    }

    public renewPage(){
        if(this.dataArray.length <2)
            return;
        this.leftBtn.visible = (this.index > 0)
        this.rightBtn.visible = (this.index < this.dataArray.length-1)
        this.pageText.text =  (this.index + 1) + '/' + this.dataArray.length;

        var current = this.index%10;
        var max = 10;
        if(Math.ceil(this.dataArray.length/10) ==  Math.ceil((this.index+1)/10))//最后一页
        {
            max = this.dataArray.length%10 || 10;
        }

        for(var i=0;i<10;i++)
        {
            var mc = this['p' + i];
            if(i<=max)
            {
                mc.visible = true;
                if(i == current)//当前
                    mc.source = 'point2_png';
                else
                    mc.source = 'point1_png';
            }
            else
            {
                mc.visible = false;
            }
        }
    }
}