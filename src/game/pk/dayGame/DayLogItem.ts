class DayLogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DayLogItemSkin";
    }

    private titleBG: eui.Rect;
    private teamInfo2: eui.List;
    private teamInfo1: eui.List;
    private titleText: eui.Label;
    private timeText: eui.Label;
    private resultIcon: eui.Image;
    private resultText: eui.Label;
    private videoBtn: eui.Button;




    public index;

    public childrenCreated() {
        //MyTool.addTestBlock(this);
        this.addBtnEvent(this.videoBtn,this.onClick);
        this.teamInfo1.itemRenderer  = PKResultItem3
        this.teamInfo2.itemRenderer  = PKResultItem3

        //this.teamInfo1.touchChildren =  this.teamInfo1.touchEnabled = false
        //this.teamInfo2.touchChildren =  this.teamInfo2.touchEnabled = false
    }

    private onClick(){
        PKManager.getInstance().getReplayByData(this.data.sp.type,this.data.videoData)
    }

    public dataChanged() {
        var PKM = PKManager.getInstance();
          this.teamInfo1.dataProvider = new eui.ArrayCollection(PKM.getLogTeamData(this.data.team1Base,this.data.info1))
          this.teamInfo2.dataProvider = new eui.ArrayCollection(PKM.getLogTeamData(this.data.team2Base,this.data.info2))
        var hpText = ''+Math.ceil(this.data.rate*100)+''
        if(this.data.isWin)
        {
            this.resultText.text = '我方剩余血量：' + hpText + '%';
            this.resultText.textColor = 0xFFEE66
        }
        else
        {
            this.resultText.text = '对方剩余血量：' + hpText + '%';
            this.resultText.textColor = 0x75BCFF
        }
        this.timeText.text =  DateUtil.getStringBySeconds(TM.now() - this.data.time,false,2) + '前';
        this.titleText.text = '第 '+this.data.sp.round+' 关'
        this.titleBG.fillColor = this.data.isWin?0x4F2900:0x0F243A
        this.resultIcon.source = this.data.isWin?'win_icon_png':'lose_icon_png'

        if(this.data.videoData.pk_version == Config.pk_version)
        {
            this.videoBtn.touchEnabled = true;
            this.videoBtn.skinName = 'Btn_r2Skin';
            this.videoBtn.label = '录像回放'
        }
        else
        {
            this.videoBtn.touchEnabled = false;
            this.videoBtn.skinName = 'Btn_d2Skin';
            this.videoBtn.label = '已失效'
        }
    }
}
