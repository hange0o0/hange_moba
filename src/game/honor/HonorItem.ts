class HonorItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HonorItemSkin";
    }

    private headMC: eui.Image;
    private useText: eui.Label;
    private winText: eui.Label;
    private winRateText: eui.Label;
    private rateText: eui.Label;
    private awardBtn: eui.Button;
    private barMC: eui.Image;
    private awardText: eui.Label;
    private finishText: eui.Label;
    private sGroup: eui.Group;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;






    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.awardBtn,this.onAward);
        this.addBtnEvent(this.headMC,this.onHead);
    }

    private onHead(){
        MonsterList.getInstance().showID(this.data.id);
    }

    private onAward(){
        HonorManager.getInstance().award('monster',this.data.id,this.data.level+1);
    }

    public dataChanged(){
        //var oo;
        var HM = HonorManager.getInstance();
        var id = this.data.id;
        if(this.data.honorType == 1)//怪
        {
            //oo = UM.honor.monster[id];
            var mvo = MonsterVO.getObject(id);
            this.headMC.source = mvo.thumb;
        }
        else
        {
            //oo = UM.honor.ring[id];
            //var rvo = RingVO.getObject(id);
            //this.nameText.text = rvo.name;
            //this.headMC.source = rvo.thumb;
        }
        //oo = oo ||  {t:0,w:0}
        var awardLevel = this.data.level;
        this.setText(this.useText ,'[使用：]' + this.data.t);
        this.setText(this.winText, '[胜利：]' + this.data.w);
        this.setText(this.winRateText, '[胜率：]' + MyTool.toFixed(this.data.w/(this.data.t || 0)*100,1) + '%');

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

        this.rateText.text = this.data.w + '/' + award.num;
        this.barMC.width = 280*Math.min(1,this.data.w/award.num)
        this.awardText.text = 'X' + award.diamond;
        this.awardBtn.visible = this.data.award

        if(this.awardBtn.visible)
            this.barMC.source = 'bar1_png'
        else
            this.barMC.source = 'bar3_png'

        this.sGroup.removeChildren();
        for(var i=0;i<5;i++)
        {
            if(awardLevel > i)
                this.sGroup.addChild(this['s' + i]);
        }

    }

    private setText(text,str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(text,str);
    }
}