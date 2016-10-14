class HelpItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HelpItemSkin";
    }


    private text: eui.Label;



    public childrenCreated() {
    }

    public dataChanged() {
        this.setHtml(this.text,this.data.text.replace(/\[/g,'<font color="#FFF000">').replace(/\]/g,'<\\font>'))
    }


}