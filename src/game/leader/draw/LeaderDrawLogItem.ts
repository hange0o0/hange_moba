class LeaderDrawLogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderDrawLogItemSkin";
    }

    private headMC: eui.Image;
    private desText: eui.Label;
    private timeText: eui.Label;


    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.headMC,this.onClick);

    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data.gameid)
    }



    public dataChanged(){
        var content = JSON.parse(this.data.content);
        this.headMC.source = MyTool.getHeadUrl(content.head)
        var skillVO = LeaderSkillVO.getObject(this.data.skillid);
        this.setHtml(this.desText,this.createHtml(Base64.decode(content.nick),0xE0A44A) + '\n　　获得了技能'+this.createHtml('【' + skillVO.name+'】',0xFfff00));
        this.timeText.text = DateUtil.getStringBySeconds(TM.now() - this.data.time,true) + '前'
    }



}