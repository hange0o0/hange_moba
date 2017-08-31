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
    private iconMC: eui.Image;




    public index;

    public childrenCreated(){
         super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(!this.data.info)
        {
            OtherInfoUI.getInstance().showID(this.data.gameid);
        }
    }

    public dataChanged(){
        if(this.data.info)
        {
            this.currentState = 'info';
            var str = '';
            if(this.data.self)
                str += '你当前在第<font color="#FFFF00" size="26"><b> ' + this.data.self + ' </b></font>名';
            else
                str += '你还没进榜';
            str += '\n排行榜生成时间：'+DateUtil.formatDate('yyyy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time));
            this.setHtml(this.infoText, str);
            return;
        }

        this.iconMC.visible = false
        this.numText2.text = '';
        this.numText.text = ''
        var typeName = ['','战力：','等级：LV.','积分：','关卡：','积分：','评分：',]
        this.scoreText.text = typeName[this.data.type] +  NumberUtil.addNumSeparator(this.data.value);
        if(this.data.index < 4)
        {
            this.iconMC.visible = true
            this.iconMC.source =  this.data.index + 'th_png'
        }
        else if(this.data.index < 10 && !_get['app'])
        {
            this.numText2.text = this.data.index + '';
        }
        else
        {
            this.numText.text = '' + this.data.index;
        }

        var nick
        if(this.data.gameid == UM.gameid)
        {
            this.currentState = 'self';
            this.headMC.source = MyTool.getHeadUrl(UM.head);
            this.nameText.text = UM.nick
            nick = UM.nick;
        }
        else
        {
            this.headMC.source = MyTool.getHeadUrl(this.data.head);
            this.nameText.text = this.data.nick
            this.currentState = 'up';
            nick = this.data.nick;
        }

        if(this.data.type == 3)
            this.setHtml(this.nameText,nick + this.createHtml('  ['+MainGameManager.getInstance().getStepName(this.data.value)+']',0xE0A44A,22))
        else if(this.data.type == 5)
            this.setHtml(this.nameText,nick + this.createHtml('  ['+ServerGameManager.getInstance().getStepName(this.data.value)+']',0xE0A44A,22))
        else if(this.data.type == 6)
            this.setHtml(this.nameText,nick + this.createHtml('  ['+ServerGameEqualManager.getInstance().getStepName(this.data.value)+']',0xE0A44A,22))
    }
}