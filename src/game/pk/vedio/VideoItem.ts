class VideoItem extends game.BaseItem {
    public constructor() {
        super();
    }

    private hpBar: eui.Rect;
    private hpText: eui.Label;
    private healBar: eui.Rect;
    private healText: eui.Label;
    private headMC: VideoMonsterItem;



    public childrenCreated() {
        //this.addBtnEvent(this.closeBtn,this.onClose);
    }


    //初始化数据
    public dataChanged() {
        var player = this.data.player;
        this.headMC.data = player;
        this.hpText.text = player.hurtCount
        this.healText.text = player.healCount;
        this.hpBar.width = 150 * (player.hurtCount/this.data.hurt)
        this.healBar.width = 150 * (player.healCount/this.data.heal)

    }


}
