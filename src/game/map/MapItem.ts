class MapItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MapItemSkin";
    }

    private desText: eui.Label;
    private bg: eui.Image;
    private rateText: eui.Label;
    private forceText: eui.Label;
    private pkBtn: eui.Button;
    private sweepBtn: eui.Button;







    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.sweepBtn,this.onSweep)
        this.desText.text = '每次挑战需消耗 1 点体力\n每次扫荡消耗 10 钻石，获得 10 倍积分'
        this.mask = new egret.Rectangle(0,0,640,94)

        this.bg.scaleX = this.bg.scaleY = 1.25
    }

    private onPK(){

    }
    private onSweep(){

    }

    public dataChanged(){
        if(!this.data)
        {
            this.currentState = 'info'
            return;
        }

        this.currentState = 'normal'
        this.bg.source = 'pk_bg20_jpg'
        var index = 10 - this.data;
        this.bg.y = -index*96;
        this.forceText.text = '1256 - 123'
        if(true)
        {
            this.rateText.text = ''
            this.sweepBtn.visible = true;
        }
        else
        {
            this.rateText.text = '通关进度：'+9+'/10'
            this.sweepBtn.visible = false;
        }
    }
}