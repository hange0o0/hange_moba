class GuessLogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "GuessLogItemSkin";
    }

    private titleBG: eui.Rect;
    private winBG1: eui.Rect;
    private winBG2: eui.Rect;
    private teamInfo1: eui.List;
    private teamInfo2: eui.List;
    private titleText: eui.Label;
    private timeText: eui.Label;
    private win1: eui.Image;
    private win2: eui.Image;
    private resultText: eui.Label;
    private videoBtn: eui.Button;
    private infoBtn: eui.Button;










    public index;

    public childrenCreated() {
        //MyTool.addTestBlock(this);
        this.addBtnEvent(this.videoBtn,this.onClick);
        this.addBtnEvent(this.infoBtn,this.onInfo);

        this.teamInfo1.itemRenderer  = PKResultItem3
        this.teamInfo2.itemRenderer  = PKResultItem3

        //this.teamInfo1.touchChildren =  this.teamInfo1.touchEnabled = false
        //this.teamInfo2.touchChildren =  this.teamInfo2.touchEnabled = false
        this.addEventListener(PKResultItem3.VIEW_EVENT,this.onMonsterClick,this)
    }

    private onMonsterClick(e){
        var data = e.data;
        if(data.teamID == 1)
        {
            var myList = this.teamInfo1
            var enemyList = this.teamInfo2
        }
        else
        {
            var myList = this.teamInfo2
            var enemyList = this.teamInfo1
        }
        for(var i=0;i<myList.numChildren;i++)
        {
            var item:any = myList.getChildAt(i);
            if(item.data == data)
                item.setKillType(1);
            else
                item.setKillType(0);
        }
        for(var i=0;i<enemyList.numChildren;i++)
        {
            var item:any = enemyList.getChildAt(i);
            if(data.kill && data.kill.length > 0 && data.kill.indexOf(i+1) != -1)
                item.setKillType(2);
            else if(data.die && data.die == i+1)
                item.setKillType(3);
            else
                item.setKillType(0);
        }
        //console.log(e.data);
    }

    private onInfo(){
        PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.data.videoData);
        DayLogMoreUI.getInstance().show();
    }

    private onClick(){
        PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.data.videoData);
        PKMainUI.getInstance().show(null,true);
    }

    public dataChanged() {
        var PKM = PKManager.getInstance();
        var team1 =PKM.getLogTeamData(this.data.team1Base,this.data.info1);
        var team2 =PKM.getLogTeamData(this.data.team2Base,this.data.info2);
        var sp = this.data.sp;
        //PKM.resetInfoData(team1,team2);
        this.teamInfo1.dataProvider = new eui.ArrayCollection(team1)
        this.teamInfo2.dataProvider = new eui.ArrayCollection(team2)

        this.timeText.text =  DateUtil.getStringBySeconds(TM.now() - this.data.time,false,2) + '前';

        this.resultText.text = '';
        if(sp.guessWin)
        {
            if(sp.award)
                this.resultText.text = '获得：' + GuessManager.getInstance().getGuessAwardStr(sp.award);
            this.titleBG.fillColor = 0x4F2900
            this.titleText.text = '竞猜成功'
        }
        else
        {
            this.resultText.text = '';
            this.titleBG.fillColor = 0x0F243A
            this.titleText.text = '竞猜失败'
        }



        var isWin = this.data.isWin;
        if(this.data.teamChange)
            isWin = !isWin;
        this.win1.visible = this.winBG1.visible = isWin
        this.win2.visible = this.winBG2.visible = !isWin


        //if(this.data.videoData.pk_version == Config.pk_version)
        if(this.data.videoData.pk_version >= 3)
        {
            this.videoBtn.touchEnabled = true;
            this.videoBtn.skinName = 'Btn_r2Skin';
            this.videoBtn.label = '录像回放'
            this.infoBtn.visible = true;
        }
        else
        {
            this.videoBtn.touchEnabled = false;
            this.videoBtn.skinName = 'Btn_d2Skin';
            this.videoBtn.label = '录像已失效'
            this.infoBtn.visible = false;
        }
    }
}
