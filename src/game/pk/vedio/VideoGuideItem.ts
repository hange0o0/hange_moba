class VideoGuideItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoGuideItemSkin";
    }

    private headMC: eui.Image;
    private bg: eui.Rect;
    private tb: eui.Rect;
    private tf: eui.Rect;
    private bb: eui.Rect;
    private bf: eui.Rect;
    private roundText: eui.Label;
    private icon: eui.Image;
    private currentMC: eui.Rect;
    private posText: eui.Label;




    private decColor = 0xFF0000
    private addColor = 0x00FF00
    private barWidth = 100;

    public childrenCreated() {
        //this.headMask.visible = false;
        //this.headMC.mask = this.headMask
        //this.addBtnEvent(this.closeBtn,this.onKill);
        this.tf.fillColor = 0x740714
        this.bf.fillColor = 0x740714
        this.addBtnEvent(this,this.onClick);
    }

    private onClick(){
        VideoUI.getInstance().scrollTo(this.data);
    }

    public dataChanged() {
        var chooseData = this.data;
        var item = chooseData[chooseData.length - 1];
        if(!item || !item.result)
        {
            this.visible = false;
            return;
        }

        this.visible = true;

        var data = item.result.player1;
        if(data.lhp > data.hp)//-
        {
           this.tb.fillColor = this.decColor;
           this.tb.width = this.barWidth * data.lhp/data.lmhp
           this.tf.width = this.barWidth * data.hp/data.maxHp
        }
        else
        {
            this.tb.fillColor = this.addColor;
            this.tf.width = this.barWidth * data.lhp/data.lmhp
            this.tb.width = this.barWidth * data.hp/data.maxHp
        }


        var data = item.result.player2;
        if(data.lhp > data.hp)//-
        {
           this.bb.fillColor = this.decColor;
           this.bb.width = this.barWidth * data.lhp/data.lmhp
           this.bf.width = this.barWidth * data.hp/data.maxHp
        }
        else
        {
            this.bb.fillColor = this.addColor;
            this.bf.width = this.barWidth * data.lhp/data.lmhp
            this.bb.width = this.barWidth * data.hp/data.maxHp
        }

        var base = chooseData[0];
        var VC = VideoCode.getInstance();

        this.roundText.text = base.index;
        var atker = VC.getPlayerByID(base.atker);
        if(base.atker < 10)
        {
            var VM = VideoManager.getInstance()
            if(base.atker == 1)
                var oo = VM.leaderSkill1[base.skillID - 2]
            else
                var oo = VM.leaderSkill2[base.skillID - 2]
            var mvo = oo.mvo;
            this.headMC.source = mvo.thumb
        }
        else
            this.headMC.source = atker.mvo.thumb
        if(atker.teamID == 1)
            this.bg.fillColor = 0x01014F
        else
            this.bg.fillColor = 0x4F0105
        this.currentMC.visible = VideoUI.getInstance().lastChooseData == this.data;

        this.icon.visible = true
        this.posText.visible = false
        if(atker.index == -1)
        {
            this.icon.visible = false
        }
        else if(atker.index == 0)
        {
            this.icon.source = 'icon_atk_png'
        }
        else
        {
            this.icon.source = 'icon_empty_png'
            this.posText.visible = true
            this.posText.text = atker.index
        }

    }
}