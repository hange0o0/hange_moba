class AniManager {

    private static _instance:AniManager;
    public static getInstance():AniManager {
        if (!this._instance)
            this._instance = new AniManager();
        return this._instance;
    }

    private mcFactorys:any = {}
    private mcPool = [];
    private mvList = [];



    public constructor() {

    }

    public removeAllMV(){
        while(this.mvList.length > 0)
        {
            this.removeMV(this.mvList[0])
        }
    }


    private onSkillAni(event:RES.ResourceEvent):void {
        if (event.groupName == "ani") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onSkillAni, this);
            console.log(event);
            //var data:any = RES.getRes("ani_skill_json"); //qid
            //var texture:egret.Texture = RES.getRes("ani_skill_png");
            //var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
            //mcFactory.enableCache = true;
            //this.mcFactory = mcFactory;
        }
    }

    //移除MC
    public removeMV(mc){
        var index = this.mvList.indexOf(mc);
        if(index != -1)
        {
            this.mvList.splice(index,1);
        }
        mc.stop();
        mc.removeEventListener(egret.Event.COMPLETE, this.onComp, this);
        this.mcPool.push(mc);

        mc.rotation = 0
        mc.scaleX = 1
        mc.scaleY = 1
        mc.alpha = 1

        MyTool.removeMC(mc);
    }

    private getMV(name){
        var mcFactory:egret.MovieClipDataFactory = this.mcFactorys[name];
        if(!mcFactory)
        {
            var data:any = RES.getRes(name + "_json"); //qid
            var texture:egret.Texture = RES.getRes(name + "_png");
            mcFactory = new egret.MovieClipDataFactory(data, texture);
            mcFactory.enableCache = true;
            this.mcFactorys[name] = mcFactory
        }
        var mc:any = this.mcPool.pop() || new egret.MovieClip();
        mc.movieClipData = mcFactory.generateMovieClipData(name);
        mc.frameRate = 12//技能动画变慢
        return mc;
    }

    //取重复播放的ani
    public getAni(name){
        var mc = this.getMV(name);
        mc.gotoAndPlay(1, -1);
        this.mvList.push(mc);
        return mc;
    }

    //取播完一次后回调的ani
    public getAniOnce(name,fun?,thisObj?){

        var mc = this.getMV(name);
        mc.comFun = fun;
        mc.thisObj = thisObj;


        mc.gotoAndPlay(1, 1);
        mc.once(egret.Event.COMPLETE, this.onComp, this);


        this.mvList.push(mc);
        return mc;
    }

    private onComp(e:egret.Event){
        if(e.currentTarget.comFun)
            e.currentTarget.comFun.apply(e.currentTarget.thisObj);
        this.removeMV(e.currentTarget);

    }
}