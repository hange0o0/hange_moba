class VideoGuideItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "VideoGuideItemSkin";
    }

    private headGroup: eui.Group;
    private headMC: eui.Image;
    private bg: eui.Rect;
    private roundText: eui.Label;
    private icon: eui.Image;
    private currentMC: eui.Rect;
    private posText: eui.Label;
    private bb: eui.Rect;
    private bf: eui.Rect;
    private tb: eui.Rect;
    private tf: eui.Rect;
    private skillIcon: eui.Image;






    private decColor = 0xFF0000
    private addColor = 0x00FF00
    private barWidth = 115;

    public childrenCreated() {
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
        var base = chooseData[0];
        this.visible = true;

        var data = item.result.player1;
        var rate1 = data.lhp/data.lmhp
        var rate2 = data.hp/data.maxHp
        if(rate1 > rate2)//-
        {
           this.tb.fillColor = this.decColor;
           this.tb.width = this.barWidth * rate1
           this.tf.width = this.barWidth * rate2
        }
        else
        {
            this.tb.fillColor = this.addColor;
            this.tf.width = this.barWidth * rate1
            this.tb.width = this.barWidth * rate2
        }


        var data = item.result.player2;
        var rate1 = data.lhp/data.lmhp
        var rate2 = data.hp/data.maxHp
        if(rate1 > rate2)//-
        {
           this.bb.fillColor = this.decColor;
           this.bb.width = this.barWidth * rate1
           this.bf.width = this.barWidth * rate2
        }
        else
        {
            this.bb.fillColor = this.addColor;
            this.bf.width = this.barWidth * rate1
            this.bb.width = this.barWidth * rate2
        }


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
            this.bg.fillColor = 0x000099
        else
            this.bg.fillColor = 0x990000
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
            this.posText.text = (atker.index+1)
        }

        //这里要拿出技能者的
        this.skillIcon.visible = (atker.isPKing && base.skillID == 0)

        // if(base.skillID == -1)
        //    MyTool.changeGray(this.headGroup);
        //else
        //     this.headGroup.filters = null;



    }
}