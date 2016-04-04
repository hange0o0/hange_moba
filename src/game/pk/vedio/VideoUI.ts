class VideoUI extends game.BaseWindow {
    private static instance: VideoUI;
    public static getInstance() {
        if(!this.instance) this.instance = new VideoUI();
        return this.instance;
    }

    private bg: eui.Image;
    private nameText2: eui.Label;
    private nameText1: eui.Label;
    private item1: VideoItem;
    private item2: VideoItem;
    private stateText1: eui.BitmapLabel;
    private stateText2: eui.BitmapLabel;
    private monster1: eui.Image;
    private monster2: eui.Image;
    private monster3: eui.Image;
    private monster4: eui.Image;
    private rateBar: eui.Image;
    private dragMC: eui.Image;
    private closeBtn: eui.Button;
    private titleText: eui.Label;
    private rateText: eui.Label;
    private videoBtn: eui.Group;
    private videoText: eui.Label;
    private videoIcon: eui.Image;
    private player1: eui.Image;
    private player2: eui.Image;


    private currentAction;
    private mvList;

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
    }

    public initData(){

    }

    public getPlayer(id){
        return null;
    }

    private onActionOver(){
        var VC = VideoCode.getInstance();
        VC.onMovieOver();
    }

    //根据数据刷新画面
    public renewView(){

    }

    //播放动画序列
    public playSkill(list){
        this.mvList = list;
        this.playOneSkill();
    }

    //播放单个动画
    public playOneSkill(){
        if(this.mvList.length == 0)
        {
            this.onActionOver();
        }
        else
        {
            var VC = VideoCode.getInstance();
             var data = this.mvList.pop();
            if(data.atker != 1 && data.atker != 2)
                data.atker = data.atker+'['+VC.getPlayerByID(data.atker).mvo.id+']'+(VC.getPlayerByID(data.atker).isPKing?'*':'');
            for(var i=0;i<data.defender.length;i++)
            {
                data.defender[i] = data.defender[i] + '[' + VC.getPlayerByID(data.defender[i]).mvo.id+']'+(VC.getPlayerByID(data.defender[i]).isPKing?'*':'');
            }

            if(data.skillID == 50)
            {
                var str = data.atker + ' 攻击 ' + data.defender[0];
            }
            else if(data.skillID == 51)
            {
                var str = data.atker + ' 秒杀 ' + data.defender[0];
            }
            else if(data.skillID == 52)
            {
                var str = data.atker + ' 回合结束时血量改变';
            }
            else if(data.skillID == 53)
            {
                var str = data.atker +  ' 对 ' + data.defender.join(',') + ' 进行加成';
            }
            else
            {
                var str = data.atker + '对' + data.defender.join(',') + '使用技能' + data.skillID ;
            }
            str += '   ->  hp1 : '+VC.player1.hp + '/' + VC.player1.maxHp+'    hp2 : '+VC.player2.hp + '/' + VC.player2.maxHp
            console.log(str);
            this.playOneSkill();
        }
    }

}
