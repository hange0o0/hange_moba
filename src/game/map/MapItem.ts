class MapItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MapItemSkin";
    }

    private mc: eui.Image;
    private levelText: eui.Label;
    private headGroup: eui.Group;
    private headMC: eui.Image;









    public index;

    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this,this.onPK)
        this.anchorOffsetX = 50
        this.anchorOffsetY = 50

    }

    private onPK(){
       MapInfoUI.getInstance().show(this.data)
    }


    public dataChanged(){
        var MM = MapManager.getInstance();
        //egret.Tween.removeTweens(this.levelText)
        this.headGroup.visible = false;
        this.mc.visible = true;
        //this.levelText.text = this.data
        if(this.data == MM.level)
        {
            this.mc.visible = false
            this.headGroup.visible = true;
            this.headMC.source = MonsterVO.getObject(UM.head).thumbRound;
            //var tw = egret.Tween.get(this.levelText,{loop:true})
            //tw.wait(1000).to({y:49},100).to({rotation:15},100).to({rotation:-15},100).to({rotation:0,y:52},50).wait(8000)
        }
        else if(MM.getSweepNum(this.data) >= MM.getMaxPKNum(this.data))
            this.mc.source = 'map_item1_png'
        else
            this.mc.source = 'map_item3_png'
    }
}