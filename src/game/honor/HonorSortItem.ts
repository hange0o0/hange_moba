class HonorSortItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HonorSortItemSkin";
    }

    private text: eui.Label;

    public childrenCreated(){
        super.childrenCreated();
        this.text.textAlign = 'left'
    }

}