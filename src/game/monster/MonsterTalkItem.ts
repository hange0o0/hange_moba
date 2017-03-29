class MonsterTalkItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MonsterTalkItemSkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private dingText: eui.Label;
    private caiText: eui.Label;






    public index;
    public gameid;
    public isSameServer;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.headMC,this.onClick)
        this.addBtnEvent(this.dingText,this.onDing)
        this.addBtnEvent(this.caiText,this.onCai)
    }

    private onClick(){
        if(this.gameid != UM.gameid && this.isSameServer)
        {
            OtherInfoUI.getInstance().showID(this.gameid,'无法查看非本区玩家的数据')
        }

    }
    private onDing(){
        var self = this;
        MonsterManager.getInstance().sendComment(this.data.monsterID,this.data.id,1,function(){
            self.dataChanged();
        })
    }
    private onCai(){
        var self = this;
        MonsterManager.getInstance().sendComment(this.data.monsterID,this.data.id,0,function(){
            self.dataChanged();
        })
    }

    public dataChanged(){
        var MM = MonsterManager.getInstance();
        var data = JSON.parse(this.data.talk)
        this.desText.text = Base64.decode(data.talk);
        this.headMC.source = MyTool.getHeadUrl(data.head)
        this.isSameServer = false;
        if(data.serverid == Net.getInstance().serverID)
        {
            this.nameText.text = Base64.decode(data.nick);
            this.isSameServer = true;
        }
        else
            this.setHtml(this.nameText,Base64.decode(data.nick) + this.createHtml(' ['+data.serverid+'区]',0xCBC08A));
        this.gameid = data.gameid;
        var comment = MM.testComment(this.data)
        if(comment || this.gameid == UM.gameid)
        {
            if(this.gameid == UM.gameid)
            {
                this.setHtml(this.dingText,this.createHtml('顶 ',0x999999) + this.createHtml('['+this.data.good+']',0xFABE48))
                this.setHtml(this.caiText,this.createHtml('踩 ',0x999999) + this.createHtml('['+this.data.bad+']',0x80F87A))
            }
            else if(comment.v)
            {
                this.setHtml(this.dingText,this.createHtml('顶 ',0x48DFFA) + this.createHtml('['+this.data.good+']',0xFABE48))
                this.setHtml(this.caiText,this.createHtml('踩 ',0x999999) + this.createHtml('['+this.data.bad+']',0x80F87A))
            }
            else
            {
                this.setHtml(this.dingText,this.createHtml('顶 ',0x999999) + this.createHtml('['+this.data.good+']',0xFABE48))
                this.setHtml(this.caiText,this.createHtml('踩 ',0x48DFFA) + this.createHtml('['+this.data.bad+']',0x80F87A))
            }

            this.dingText.touchEnabled = this.caiText.touchEnabled = false;
        }
        else
        {
            this.setHtml(this.dingText,'顶 ' + this.createHtml('['+this.data.good+']',0xFABE48))
            this.setHtml(this.caiText,'踩 ' + this.createHtml('['+this.data.bad+']',0x80F87A))
            this.dingText.touchEnabled = this.caiText.touchEnabled = true;
        }

    }
}