class MonsterInfoBaseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MonsterInfoBaseItemSkin";
    }

    private icon: eui.Image;
    private text: eui.Label;
    private titleText: eui.Label;
    private typeText: eui.Label;



    public childrenCreated(){

    }

    public dataChanged(){
        var skill = this.data;
        this.icon.source = 'icon_b' + skill.type + '_png'
       this.text.text = skill.name + '：'+skill.des;

    }
}