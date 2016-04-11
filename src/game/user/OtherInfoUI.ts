class OtherInfoUI extends game.BaseUI {
    private static instance:OtherInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new OtherInfoUI();
        return this.instance;
    }
    
    private topUI: TopUI;
    private headMC: eui.Image;
    private nameText: eui.Label;
    private friendBtn: eui.Button;
    private levelText: eui.Label;
    private forceText: eui.Label;
    private mainGameText: eui.Label;
    private serverLevelText: eui.Label;
    private serverScroeText: eui.Label;
    private serverRateText: eui.Label;
    private serverEqualText: eui.Label;
    private serverEqualScoreText: eui.Label;
    private serverEqualRateText: eui.Label;
    private serverEqualWinText: eui.Label;
    private list: eui.List;




    private dataIn;
    public constructor() {
        super();
        this.skinName = "OtherInfoUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('他人信息')
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.friendBtn, this.onFriend);

        this.list.itemRenderer = EnemyHeadItem;
    }

    private onFriend(){

    }

    public show(data?){
        this.dataIn = data;
        super.show();
    }

    public onShow(){
        this.renew();
    }

    private renew(){
       var dataIn = this.dataIn

        this.headMC.source = MyTool.getHeadUrl(dataIn.head);
        this.nameText.text = dataIn.nick;
        this.levelText.text = '等级：LV.' + dataIn.level;
        this.forceText.text = '战力：' + dataIn.force;

        this.mainGameText.text = '试练场等级：' + dataIn.main_game.level;

        this.serverLevelText.text = '竞技场等级：' + ServerGameManager.getInstance().getPKTableLevel(dataIn.server_game.exp);
        this.serverScroeText.text = '积分：' + dataIn.server_game.exp
        this.serverRateText.text = '胜率：' + (dataIn.server_game.win/(dataIn.server_game.total || 0)*100).toFixed(2) + '%';

        this.serverEqualText.text = '竞技场等级：' + ServerGameManager.getInstance().getPKTableLevel(dataIn.server_game_equal.exp);
        this.serverEqualScoreText.text = '积分：' + dataIn.server_game_equal.exp
        this.serverEqualRateText.text = '胜率：' + (dataIn.server_game_equal.win/(dataIn.server_game.server_game_equal || 0)*100).toFixed(2) + '%';
        this.serverEqualWinText.text = '最高连胜：' + dataIn.server_game_equal.max;


        var specialData = {
            isBase:true
        };
        var arr =  MyTool.getCommonUse(dataIn.pk_common.history);
        for(var i=0;i<arr.length;i++){
            arr[i] = {
                vo: MonsterVO.getObject(arr[i]),
                type: 1,

                id: arr[i],
                specialData: specialData,

                index: i,
                list:arr
            }
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)


    }
}