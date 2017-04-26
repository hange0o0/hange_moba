class MapItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MapItemSkin";
    }

    private desText: eui.Label;
    private bg: eui.Image;
    private nameText: eui.Label;
    private rateText: eui.Label;
    private forceText: eui.Label;
    private awardText: eui.Label;
    private pkBtn: eui.Button;
    private sweepBtn: eui.Button;






    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.sweepBtn,this.onSweep)
        this.desText.text = '每次挑战需消耗 1 点体力\n每次扫荡消耗 10 钻石，获得 10 倍积分'
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
        //this.bg.source = ''
        this.nameText.text = ''
        this.forceText.text = '野怪战力：123456 - 123456'
        this.awardText.text = '获胜积分：123'
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