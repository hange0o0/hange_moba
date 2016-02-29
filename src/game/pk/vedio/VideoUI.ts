class VideoUI extends game.BaseWindow {
    private static instance: VideoUI;
    public static getInstance() {
        if(!this.instance) this.instance = new VideoUI();
        return this.instance;
    }


    private currentAction;

    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
    }

    //播放动画，完后回调videoCode
    public playSkill(){
        var VC = VideoCode.getInstance();
        var ca = this.currentAction = VC.currentAction;
        if(ca.skillID == 50)
        {
            var str = VC.atker + '攻击' + VC.defender;
        }
        else if(ca.skillID == 51)
        {
            var str = VC.atker + '秒杀' + VC.defender;
        }
        else if(ca.skillID == 52)
        {
            var str = VC.atker + '回合结束时血量改变';
        }
        else
        {
            var str = VC.atker + '对' + VC.defender + '使用技能' + ca.skillID ;
        }

        console.log(str);
        egret.setTimeout(this.onActionOver,this,100);
    }

    private onActionOver(){
        var VC = VideoCode.getInstance();
        VC.onMovieOver();
    }

    //根据数据刷新画面
    public renewView(){

    }
}
