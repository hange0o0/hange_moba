class MonsterInfoBaseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MonsterInfoBaseItemSkin";
    }

    private icon: eui.Image;
    private text: eui.Label;


    public childrenCreated(){

    }

    public dataChanged(){
        var skill = this.data;
        this.icon.source = 'skill_icon' + skill.type
       this.text.text = skill.name + '：'+skill.des;

    }
}