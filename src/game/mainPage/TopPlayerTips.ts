class TopPlayerTips extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TopPlayerTipsSkin";
    }

    private nameText: eui.Label;
    private desText: eui.Label;
    private headMC: eui.Image;
    private closeBtn: eui.Button;





    public time = 0;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.onClose)
        this.addBtnEvent(this.headMC,this.onClick)
    }

    public hide(){
        this.visible = false;
    }
    public onClose(){
        egret.Tween.removeTweens(this);
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({scaleX:1.1,scaleY:1.1},200).to({scaleX:0,scaleY:0},200).call(this.hide,this)
    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data.gameid)
    }


    public dataChanged() {
        var typeName = ['','战力榜','等级榜','职业榜','任务榜','竞技榜','天赋榜'];
        var nick:any
        if(this.data.gameid == UM.gameid)
        {
            this.headMC.source = MyTool.getHeadUrl(UM.head);
            nick = UM.nick;
            this.desText.text = (UM.word || '我无话可说..')
        }
        else
        {
            this.headMC.source = MyTool.getHeadUrl(this.data.head);
            nick =  this.data.nick
            this.desText.text = (this.data.word || '我无话可说..')
        }

        MyTool.setColorText(this.nameText,'[' + nick + ']' + this.createHtml('('+typeName[this.data.type] + '-第' +this.data.index + '名)',undefined,22));
    }
}