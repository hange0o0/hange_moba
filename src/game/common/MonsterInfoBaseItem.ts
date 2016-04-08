class MonsterInfoBaseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MonsterInfoBaseItemSkin";
    }

    private img:eui.Image;
    private txt:eui.Label;

    public index;

    public childrenCreated(){

    }

    public dataChanged(){
        //var oo = PKManager.getInstance().indexAdd(this.itemIndex);
        //var id = this.data;

        var skill = this.data;
        this.img.source = 'skill_icon' + skill.type
       this.txt.text = skill.name + '：'+skill.des;

    }
}