class LeaderDrawLogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderDrawLogItemSkin";
    }

    private timeText: eui.Label;
    private headMC: eui.Image;
    private desText: eui.Label;
    private skillGroup: eui.Group;
    private img: eui.Image;



    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.headMC,this.onClick);
        this.addBtnEvent(this.skillGroup,this.onSkillClick);

    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data.gameid)
    }

    private onSkillClick(){
       LeaderSkillInfoUI.getInstance().show(this.data.skillid)
    }



    public dataChanged(){
        var content = JSON.parse(this.data.content);
        this.headMC.source = MyTool.getHeadUrl(content.head)
        var skillVO = LeaderSkillVO.getObject(this.data.skillid);
        this.setHtml(this.desText,this.createHtml(Base64.decode(content.nick),0xE0A44A) + '获得了')//+this.createHtml('【' + skillVO.name+'】',0xFfff00));
        this.timeText.text = DateUtil.getStringBySeconds(TM.now() - this.data.time,true) + '前'
        this.img.source = skillVO.thumb
    }



}