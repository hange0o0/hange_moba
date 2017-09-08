class LeaderSkillOwnerListUI extends game.BaseWindow {
    private static instance:LeaderSkillOwnerListUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LeaderSkillOwnerListUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "LeaderSkillOwnerListUISkin";
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private img: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private backBtn: eui.Button;



    private nick;
    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn, this.hide);
        //this.addBtnEvent(this.okBtn, this.onPK);
        //this.addBtnEvent(this.refreshBtn, this.onRefresh);
        this.setTitle('掠夺');


    }

    public onPK(){
        var MD = MapData.getInstance();
        if(MD.getFightTimes() >= MD.maxFightTimes)
        {
            Alert('今日掠夺次数已达上限')
            return;
        }
        PKDressUI.getInstance().show({pktype:'map_fight',data:UM.pk_common.my_card})
        this.hide()
    }

    public onRefresh(){
        MapManager.getInstance().fightGet(()=>{this.renew();})
    }

    public show(){
        var MD = MapData.getInstance();
        if(MD.get_fight_enemy)
        {
            super.show();
            return;
        }
        MapManager.getInstance().fightGet(()=>{this.superShow()})

    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){

    }

    public renew(){


    }
}