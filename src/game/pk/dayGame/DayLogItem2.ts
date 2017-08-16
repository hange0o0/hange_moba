class DayLogItem2 extends DayLogItem {

    public constructor() {
        super();
        this.logType = 2;
    }

    public childrenCreated() {
        super.childrenCreated();
        //MyTool.addTestBlock(this);
        this.addBtnEvent(this['useBtn'],this.onUse);
    }

    private onUse(){
        var list = this.data.team1Base.list;
        this.dispatchEventWith('use_card',true,list)
    }

    public dataChanged(){
        super.dataChanged();

        if(this.data.sp.type == PKManager.PKType.DAY)
            var myCardList = DayGameManager.getInstance().data.choose.list
        else
            var myCardList = UM.getMyCard().list;
        var list = this.data.team1Base.list;
        var myCardObj = {};

        for(var i=0;i<myCardList.length;i++) {
            myCardObj[myCardList[i]] = true;
        }
        for(var i=0;i<list.length;i++)
        {
            var id = list[i];
            if(!myCardObj[id])
            {
                this.currentState = 'normal'
                return;
            }
        }
        this.currentState = 'loss'
    }
}
