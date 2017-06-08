class HelpItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HelpItemSkin";
    }


    private bg: eui.Rect;
    private text: eui.Label;




    public childrenCreated() {
    }

    public dataChanged() {
        this.setHtml(this.text,this.data.text.replace(/\[/g,'<font color="#FFFF00">').replace(/\]/g,'<\/font>'))
        this.bg.visible = this.data.index%2 == 0;
    }


}