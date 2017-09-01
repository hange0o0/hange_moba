class MapLogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MapLogItemSkin";
    }


    private bg: eui.Rect;
    private text: eui.Label;
    private dayText: eui.Label;
    private videoBtn: eui.Group;
    private pkBtn: eui.Group;







    public childrenCreated() {
        this.addBtnEvent(this.videoBtn,this.onVideo)
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.text.addEventListener(egret.TextEvent.LINK,this.onClick,this)
        this.text.touchEnabled = true;
    }

    private onClick(e){
        console.log(e.text)
        OtherInfoUI.getInstance().showID(e.text);
    }

    private createName(nick,openid){
        return this.createHtml('<a href="event:'+openid+'">' + nick + '</a>',0xE0A44A)
    }

    private onPK(){
        var MD = MapData.getInstance();
        if(MD.getFightTimes() >= MD.maxFightTimes)
        {
            Alert('今日掠夺次数已达上限')
            return;
        }
        var self = this;
        PKDressUI.getInstance().show({pktype:'map_fight',data:UM.pk_common.my_card,logData:this.data,fun:function(){
             self.dataChanged();
        }})

    }
    private onVideo(){
        MapManager.getInstance().playBack(this.data,function(){
            PKMainUI.getInstance().show(null,true);
        });
    }

    public dataChanged() {
        this.dayText.text = DateUtil.formatDate('yyyy-MM-dd hh:mm',DateUtil.timeToChineseDate(this.data.time))
        this.bg.visible = this.data.index%2 == 0;

        this.currentState = 'normal'
        var content = JSON.parse(this.data.content);
        var str = ''
        var formNick = this.createName(Base64.decode(content.from_nick),this.data.from_gameid);
        var toNick = this.createName(Base64.decode(content.to_nick),this.data.to_gameid);
        if(content.result)
        {
            if(this.data.to_gameid == UM.gameid)//我被抢
            {
                this.currentState = 'pk'
                MyTool.changeGray(this.pkBtn,this.data.type==1,true);
                str = formNick + '从你身上夺走了['+content.value+']功勋'
            }
            else
            {
                str = '你从'+toNick+'身上夺走了['+content.value+']功勋'
            }
        }
        else
        {
            if(this.data.to_gameid == UM.gameid)//我被抢
            {
                str = formNick + '想从你身上夺取功勋，但被你打跑了'
            }
            else
            {
                str = '你想从'+toNick+'身上夺取功勋，但遗憾失败'
            }
        }
        MyTool.setColorText(this.text,'' + str);
    }


}