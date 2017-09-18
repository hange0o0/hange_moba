class LeaderSkillItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderSkillItemSkin";
    }

    private img: eui.Image;
    private nameGroup: eui.Group;
    private nameText: eui.Label;
    private haveBtn: eui.Image;
    private cdText: eui.Label;




    public index;

    public childrenCreated(){
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick);

    }

    public onTimer(){
        if(UM.tec.skill.indexOf(this.data) == -1)
        {
            var cd = (UM.tec.copy_skill[this.data] || 0) - TM.now()
             if(cd > 0)
             {
                 this.cdText.text = DateUtil.getStringBySecond(cd);
             }
            else
             {
                 this.touchChildren = this.touchEnabled = false;
                 this.cdText.text = '已过期'
             }
        }
    }



    public dataChanged(){
        this.touchChildren = this.touchEnabled = true;
        var vo = LeaderSkillVO.getObject(this.data);
        this.img.source = vo.thumb
        this.nameText.text = vo.name;

        this.cdText.text = ''

        this.haveBtn.visible = (UM.tec.use_skill == this.data)
        this.onTimer();

    }



}