class LeaderSkillViewItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderSkillViewItemSkin";
    }

    private img: eui.Image;
    private nameGroup: eui.Group;
    private nameText: eui.Label;
    private numText: eui.Label;
    private haveBtn: eui.Image;
    private lockGroup: eui.Group;
    private lockText: eui.Label;


    public childrenCreated(){
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick);

    }

    //private onClick(){
    //
    //}



    public dataChanged(){
         this.img.source = this.data.thumb
        this.nameText.text = this.data.name
        if(this.data.isOpen())
        {
            var num = LeaderManager.getInstance().skillTotal[this.data.id] || 0
            this.numText.text = num + '/' + this.data.num;
            this.lockGroup.visible = false
            this.haveBtn.visible = UM.tec.skill.indexOf(this.data.id) != -1;

            this.touchChildren = this.touchEnabled = true
        }
        else
        {
            this.haveBtn.visible = false;
            this.lockGroup.visible = true
            this.numText.text = ''

            this.touchChildren = this.touchEnabled = false

            var date = DateUtil.timeToChineseDate(UM.opentime + 24*3600*this.data.day)
            this.lockText.text = DateUtil.formatDate('MM-dd',date)  + '\n12:00:00'
        }

    }


}