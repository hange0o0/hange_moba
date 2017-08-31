class MapFightUI extends game.BaseWindow {
    private static instance:MapFightUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MapFightUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "MapFightUISkin";
    }

    private desText: eui.Label;
    private refreshBtn: eui.Button;
    private closeBtn: eui.Button;
    private okBtn: eui.Button;
    private headMC: eui.Image;







    private data

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onPK);
        this.addBtnEvent(this.refreshBtn, this.onRefresh);
        this.setTitle('掠夺');


    }

    public onPK(){
        PKDressUI.getInstance().show({pktype:'map_fight',data:UM.pk_common.my_card})
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
        MapManager.getInstance().fightGet(()=>{super.show();})

    }

    public onShow(){
        this.renew();
    }

    public renew(){
        var MD = MapData.getInstance();
        this.desText.text = ''
        MD.get_fight_enemy.nick
    }
}