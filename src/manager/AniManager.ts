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


    //frameRate:默认是12，要变快就加大，慢变就减小
    public mvConfig = {
        '6':{frameRate:24},
        '33':{scale:1.5},
        '102':{scale:2},
        '124':{frameRate:24,scale:1.5},
        '154a':{frameRate:24},
        '136':{frameRate:24},
        '137':{frameRate:24},
        '166':{frameRate:24,scale:1.5},
        '176':{frameRate:24}
    };

    public mvSoundConfig = {}



    public constructor() {
        var sound = {
           1:[5,6,16],
           2:[136,137,162,166,167,15],
           3:[30,109,119,138,139,128,36,134],
           4:[7,107,108,117,125,145,151,157,158,177],
           5:[12,32,148,168,135],
           6:[],
           7:[176,31,33,111,133],
           8:[8,14,13,22,27,37,39,124,132,143,146,35,144,147,149,172],
           9:[],
           10:[],
           11:[],
           12:[23,38,105,110,126,129],
           13:[],
           14:[3,4,21,131],
           15:[102,103,104,160,163,164,170,113,114,127,130,153,154],
           16:[11,24,25,26,28,29,34,106,112,115,116,118,120,121,122,123,140,141,142,161,175],
        }

        for(var s in sound)
        {
            var temp = sound[s];
            for(var i=0;i<temp.length;i++)
            {
                var skillID = temp[i];
                if(this.mvSoundConfig[skillID])
                    console.log('same' + s + '--' + skillID + '--' + this.mvSoundConfig[skillID])
                this.mvSoundConfig[skillID] = s;
            }
        }
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
            //mcFactory.enableCache = true;
            this.mcFactorys[name] = mcFactory
        }
        var mc:any = this.mcPool.pop() || new egret.MovieClip();
        mc.movieClipData = mcFactory.generateMovieClipData(name);
        mc.frameRate = 24//技能动画变慢
        mc.scaleX = mc.scaleY = 1.5;
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