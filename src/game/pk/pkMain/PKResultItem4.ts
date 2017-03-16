class PKResultItem4 extends game.BaseItem {
    public constructor() {
        super();
    }

    private hpText: eui.Label;
    private hpBar: eui.Rect;
    private atkText: eui.Label;
    private atkBar: eui.Rect;
    private speedText: eui.Label;
    private speedBar: eui.Rect;
    private headMC: eui.Image;
    private costText: eui.Label;





    public childrenCreated() {
        this.addBtnEvent(this.headMC,this.onHead);
    }

    private onHead(){
        MonsterList.getInstance().show(this.data.list,this.data.index)
    }


    //初始化数据
    public dataChanged() {
        var player = this.data.specialData;
        var vo = MonsterVO.getObject(this.data.id);
        this.costText.text = vo.cost
        this.headMC.source = vo.thumb;
        this.hpText.text = player.hp
        this.atkText.text = player.atk;
        this.speedText.text = player.speed;
        this.hpBar.width = 150 * (player.hp/this.data.totalData.hp)
        this.atkBar.width = 150 * (player.atk/this.data.totalData.atk)
        this.speedBar.width = 150 * ((player.speed - this.data.totalData.speed2*4/5)/(this.data.totalData.speed-this.data.totalData.speed2*4/5))

    }


}