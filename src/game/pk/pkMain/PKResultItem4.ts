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
        var hpText = player.hp  + ''
        var atkText = player.atk  + '';
        var speedText = player.speed  + '';
        this.hpBar.width = 140 * (player.hp/this.data.totalData.hp)
        this.atkBar.width = 140 * (player.atk/this.data.totalData.atk)
        this.speedBar.width = 140 * ((player.speed - this.data.totalData.speed2*4/5)/(this.data.totalData.speed-this.data.totalData.speed2*4/5))

        if(this.data.teamID == 1)
        {
            if(player.hp == this.data.totalData.hp)
                hpText = this.createHtml('♕',0xFFFFFF) + player.hp
            if(player.atk == this.data.totalData.atk)
                atkText = this.createHtml('♕',0xFFFFFF)  + player.atk
            if(player.speed == this.data.totalData.speed)
                speedText = this.createHtml('♕',0xFFFFFF)  + player.speed
        }
        else
        {
            if(player.hp == this.data.totalData.hp)
                hpText += this.createHtml('♕',0xFFFFFF)
            if(player.atk == this.data.totalData.atk)
                atkText += this.createHtml('♕',0xFFFFFF)
            if(player.speed == this.data.totalData.speed)
                speedText += this.createHtml('♕',0xFFFFFF)
        }



        this.setHtml(this.hpText,hpText);
        this.setHtml(this.atkText,atkText);
        this.setHtml(this.speedText,speedText);


    }


}