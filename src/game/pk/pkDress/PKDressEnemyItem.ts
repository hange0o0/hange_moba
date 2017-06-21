class PKDressEnemyItem extends EnemyHeadItem {
    public constructor() {
        super();
    }

    private isChoose = false
    public childrenCreated() {
        super.childrenCreated();

    }


    protected onClick(){
        if(this.isChoose)
        {
            PKDressUI.getInstance().showEnemyInfo(null,0)
            this.setChoose(false);
        }
        else
            PKDressUI.getInstance().showEnemyInfo(this.data.list,this.data.index)
    }

    public dataChanged(){
        super.dataChanged();
        this.setChoose(false);
    }


    public setChoose(b) {
        this.isChoose = b;
        if(this.data.isTeam)
        {
            this['teamGroupBG'].visible = b;
        }
        else
        {
            this['chooseGroupBG'].visible = b;
        }
    }

}