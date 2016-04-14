class HonorItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HonorItemSkin";
    }

    private headMC: eui.Image;
    private useText: eui.Label;
    private winText: eui.Label;
    private rateText: eui.Label;
    private awardBtn: eui.Button;
    private barMC: eui.Image;
    private awardText: eui.Label;
    private finishText: eui.Label;
    private nameText: eui.Label;



    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.awardBtn,this.onAward);
    }

    private onAward(){

    }

    public dataChanged(){
        var oo;
        var HM = HonorManager.getInstance();
        var id = this.data.id;
        if(this.data.honorType == 1)//怪
        {
            oo = UM.honor.monster[id];
            var mvo = MonsterVO.getObject(id);
            this.nameText.text = mvo.name;
            this.headMC.source = mvo.thumb;
        }
        else
        {
            oo = UM.honor.ring[id];
            var rvo = RingVO.getObject(id);
            this.nameText.text = rvo.name;
            this.headMC.source = rvo.thumb;
        }
        oo = oo ||  {t:0,w:0}
        var awardLevel = oo.a || 0; //已领奖的等级
        this.useText.text = '使用：' + oo.t;
        this.winText.text = '胜利：' + oo.w;

        if(awardLevel == 5)
        {
            this.currentState = 'finish';
            return;
        }
        else
        {
            this.currentState = 'normal';
        }
        var award = HM.awardBase[awardLevel + 1]

        this.rateText.text = award.num + '/' + oo.w
        this.barMC.width = 325*Math.min(1,award.num/oo.w)
        this.awardText.text = 'X' + award.diamond;

    }
}