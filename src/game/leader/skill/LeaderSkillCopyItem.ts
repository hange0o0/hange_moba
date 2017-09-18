class LeaderSkillCopyItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderSkillCopyItemSkin";
    }

    private propBtn: eui.Button;
    private diamondBtn: eui.Button;
    private cdText: eui.Label;
    private img: eui.Image;
    private nameGroup: eui.Group;
    private nameText: eui.Label;




    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.img,this.onClick);
        this.addBtnEvent(this.propBtn,this.onProp);
        this.addBtnEvent(this.diamondBtn,this.onDiamond);

    }

    private onProp(){
        var self = this;
        Confirm( '确定消耗1个['+PropVO.getObject(22).propname+']，获得1小时的该技能的分身吗？',function(v){
            if(v == 1)
            {
                if(UM.getPropNum(22) < 1)
                {
                    Alert(PropVO.getObject(22).propname + '数量不足')
                    return;
                }
                self.copySkill(2);
            }
        },['取消','确定'])
    }

    private onDiamond(){
        var self = this;
        Confirm( '确定消耗[100钻石]，获得24小时的该技能的分身吗？',function(v){
            if(v == 1)
            {
                if(!UM.testDiamond(100))
                    return;
                self.copySkill(1);
            }
        },['取消','确定'])
    }

    private copySkill(type){
        if(UM.tec.skill.indexOf(parseInt(this.data.skillid)) != -1)
        {
            Alert('你已经拥有该技能了')
             return;
        }
        LeaderManager.getInstance().skillCopy(this.data,type,function(){
            LeaderSkillCopyUserUI.getInstance().hide()
        })
    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data.gameid)
    }

    private onTimer(){
        var cd = this.data.copy_time - TM.now()
        if(cd > 0)
        {
            this.cdText.visible = true;
            this.cdText.text = DateUtil.getStringBySecond(cd);
            this.propBtn.visible = false;
            if(cd > 60*10)
            {
                this.diamondBtn.visible = false;
                this.cdText.y = 35
            }
            else
            {
                this.diamondBtn.visible = true;
                this.cdText.y = 17
            }
        }
        else
        {
            this.cdText.visible = false;
            this.diamondBtn.visible = true;
            this.propBtn.visible = true;
        }
    }



    public dataChanged(){
        var content = JSON.parse(this.data.content);
        this.img.source = MyTool.getHeadUrl(content.head)
        this.nameText.text = Base64.decode(content.nick);

        this.onTimer();

    }



}