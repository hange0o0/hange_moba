class PKDressChooseListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseListItem";
    }

    private headMC: PKDressChooseItem;
    private joinBtn: eui.Image;
    private typeText: eui.Label;
    private nameText: eui.Label;
    private forceText: eui.Label;
    private coinText: eui.Label;
    private woodText: eui.Label;
    private useMC1: eui.Image;
    private useMC2: eui.Image;
    private useMC3: eui.Image;


    public index;

    public childrenCreated(){

    }

    public dataChange(){


    }
}