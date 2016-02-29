class MainGameUI extends game.BaseUI {
    private static instance:MainGameUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MainGameUI();
        return this.instance;
    }

    private npcTeamUI:NPCTeamUI;


    public level = 0;

    //等级加成
    private forceAdd = 2;

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    private getFight(){
        return this.level * 2;
    }

    private getRingLevel(){
        return Math.ceil(this.level/100);
    }

    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    public renew(){
        //var MGM = MainGameManager.getInstance();
        var vo = MainGameVO.getObject(this.level);
        var oo = {
            list:vo.list,
            ring:{id:vo.ring,level:this.getRingLevel()},
            fight:this.getFight()
        };
        this.npcTeamUI.renew(oo)
    }

    private onClick(){

    }
}