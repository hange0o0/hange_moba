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


    private nick;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onPK);
        this.addBtnEvent(this.refreshBtn, this.onRefresh);
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
        var MD = MapData.getInstance();
        var cd = MD.getNextFightCD();

        if(cd == 0)
        {
            MyTool.setColorText(this.desText,this.nick)
            this.refreshBtn.visible = true;
        }
        else
        {
            MyTool.setColorText(this.desText,this.nick +'\n\n' + DateUtil.getStringBySecond(cd) + '后可刷新')
            this.refreshBtn.visible = false;
        }
    }

    public renew(){
        var MD = MapData.getInstance();

        if(MD.get_fight_enemy.gameid == 'npc')
        {
            this.nick = '[神秘人]'
            this.headMC.source = 'head_png';
        }
        else
        {
            this.nick = '[' + Base64.decode(MD.get_fight_enemy.nick) + ']'
            this.headMC.source = MyTool.getHeadUrl(MD.get_fight_enemy.head);
        }

        this.onTimer();

    }
}