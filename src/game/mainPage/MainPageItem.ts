class MainPageItem extends game.BaseItem {

    private chooseMC: eui.Image;
    private bg: eui.Image;
    private redMC: eui.Image;
    private lockMC: eui.Image;

    
    public index;
    public constructor() {
        super();
        this.skinName = "MainPageItemSkin";
    }


    public childrenCreated() {
        this.addBtnEvent(this,this.onClick);
    }

    private onClick(){
         MainPageUI.getInstance().clickPage(this.index)
    }

    public dataChanged() {
        this.bg.source = 'main_pk'+(this.index + 1)+'_png'
        this.lockMC.visible = this.isLock()
        this.setChoose(MainPageUI.getInstance().currentPage == this.index);
    }

    public setChoose(b){
        this.chooseMC.visible = b
        if(b)
            this.redMC.visible = false
        else
        {
            this.redMC.visible = this.isRed()
        }
    }

    //是否有红点
    private isRed(){
        if(this.index==0 && !(UM.main_game.awardtime && DateUtil.isSameDay(UM.main_game.awardtime)))
            return true
        else if(this.index==1 && DayGameManager.getInstance().isRed())
            return true
        else if(this.index == 2)
        {
            var MD = MapData.getInstance();
            if(MD.lastTime) {
                MD.reInit();
                var awardMax = MD.getAwardMax();
                if (MD.bag >= awardMax)
                    return true
                else
                    return false
            } else
                return false
        }
         return false
    }
    //是否锁住
    private isLock(){
        switch(this.index)
        {
            case 1:
                return UM.level < Config.dayLevel
            case 2:
                return UM.main_game.level < Config.mapLevel
            case 3:
                return UM.main_game.level < Config.serverLevel
            case 4:
                return UM.main_game.level < Config.serverEqualLevel
        }
         return false
    }
}