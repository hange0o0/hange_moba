class OtherInfoUI extends game.BaseUI {
    private static instance:OtherInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new OtherInfoUI();
        return this.instance;
    }

    private expBar: eui.Image;
    private nameText: eui.Label;


    private dataIn;
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this, this.onClick);
    }

    public show(data?){
        this.dataIn = data;
        super.show();
    }

    public onShow(){
        this.renew();
    }

    private renew(){
        //头像，呢称，等级，战力：X
        //主线进度
        //竞技场等级，胜利率
        //无科技场等级，胜利率，最高
       var dataIn = this.dataIn

        this.expBar.source = MyTool.getHeadUrl(dataIn.head);
        this.nameText.text = dataIn.nick;
        this.nameText.text = 'LV.' + dataIn.level;
        this.nameText.text = '战力:' + dataIn.force;
            //$returnUser->server_game = array('exp'=>$otherUser->server_game->exp,'win'=>$otherUser->server_game->win,'total'=>$otherUser->server_game->total);
            //$returnUser->server_game_equal = array('exp'=>$otherUser->server_game_equal->exp,'win'=>$otherUser->server_game_equal->win,'total'=>$otherUser->server_game_equal->total,'max'=>$otherUser->server_game_equal->max);
            //$returnUser->main_game = array('level'=>$otherUser->main_game->level);
        this.nameText.text = '试练场:' + dataIn.main_game.level;

        this.nameText.text = '竞技场:' + dataIn.server_game.exp + '('+ServerGameManager.getInstance().getPKTableLevel(dataIn.server_game.exp)+')  胜率：' + (dataIn.server_game.win/(dataIn.server_game.total || 0)*100).toFixed(1) + '%';
        this.nameText.text = '修正场:' + dataIn.server_game_equal.exp + '('+ServerGameManager.getInstance().getPKTableLevel(dataIn.server_game_equal.exp)+')  胜率：' +
            (dataIn.server_game_equal.win/(dataIn.server_game_equal.total || 0)*100).toFixed(1) + '%    最高连胜：'+dataIn.server_game_equal.max;

    }
}