class LeaderSkillOwnerListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LeaderSkillOwnerListItemSkin";
    }

    private img: eui.Image;
    private nameGroup: eui.Group;
    private nameText: eui.Label;


    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick);

    }

    private onClick(){
        OtherInfoUI.getInstance().showID(this.data.gameid)
    }



    public dataChanged(){
          var content = JSON.parse(this.data.content);
        this.img.source = MyTool.getHeadUrl(content.head)
        this.nameText.text = Base64.decode(content.nick);
    }



}