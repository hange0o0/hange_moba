class RankItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "RankItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private scoreText: eui.Label;
    private numText2: eui.BitmapLabel;
    private numText: eui.Label;
    private infoText: eui.Label;



    public index;

    public childrenCreated(){
         super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.data.gameid != UM.openid)
        {
            OtherInfoUI.getInstance().showID(this.data.gameid);
        }
    }

    public dataChanged(){
        if(this.data.info)
        {
            this.currentState = 'info';
            var str = '排行榜生成时间：'+DateUtil.formatDate('yyyy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time));
            if(this.data.self)
                str += '\n你当前在第' + this.data.self + '名';
            else
                str += '\n你还没进榜';
            this.infoText.text = str;
            return;
        }
         this.headMC.source = MyTool.getHeadUrl(this.data.head);
        this.nameText.text = this.data.nick
        this.scoreText.text = this.data.value
        if(this.data.index < 10)
        {
            this.numText2.text = this.data.index;
            this.numText.text = '';
        }
        else
        {
            this.numText2.text = '';
            this.numText.text = '' + this.data.index;
        }

        if(this.data.gameid == UM.openid)
            this.currentState = 'self';
        else
            this.currentState = 'up';
    }
}