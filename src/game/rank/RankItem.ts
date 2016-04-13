class RankItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private headMC: eui.Image;
    private nameText: eui.Label;
    private scoreText: eui.Label;
    private numText2: eui.BitmapLabel;
    private numText: eui.Label;


    public index;

    public childrenCreated(){

    }

    public dataChanged(){

    }
}