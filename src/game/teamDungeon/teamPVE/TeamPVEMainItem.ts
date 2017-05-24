class TeamPVEMainItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TeamPVEMainItemSkin";
    }


    private text: eui.Label;



    public childrenCreated() {
    }

    public dataChanged() {
        this.setHtml(this.text,this.data.text.replace(/\[/g,'<font color="#FFFF00">').replace(/\]/g,'<\/font>'))
    }


}