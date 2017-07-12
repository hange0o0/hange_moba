class TaskManager {
    private static _instance:TaskManager;
    public static getInstance():TaskManager {
        if (!this._instance)
            this._instance = new TaskManager();
        return this._instance;
    }

    private guideLight;
    public nowAction//正在进行的指引
    public actionStep//正在进行的指引的步数


    public constructor() {
         this.init()
    }

    public getTaskIDByLine(line){
        var task = UM.active.task;
        return task[line]
    }

    //当前的任务列表
    public getCurrentTaskList(){
        var task = UM.active.task;
        var line = TaskVO.lineData;
        var arr = [];
        for(var s in task)
        {
            if(s == 'stat')
                continue;
            var vo = TaskVO.getObject(task[s]).getNextTaskVO();
            if(vo && vo.isEnable())
                arr.push(vo);
        }

        for(var s in line)
        {
            if(!task[s])
            {
                if(vo.isEnable())
                    arr.push(vo);
            }
        }
        return arr;
    }

    private init(){
         //id,type,value1,value2,awarddiamond,awardCoin,awardCard
          //----mainlevel        1+
        //force
        //main_game     level

        //main_award

        //draw



        //server_game

        //map_game
        //map_game_buy
        //map_game_pk   times
        //map_game_next

        //buy_ticket
        //server_equal_game
        //honor

        //-----------userlevel  1000+
        //day_game
        //card  monster level
        //friend
        //friend_dungeon



    }

    //在MC上显示一次光效
    public showGuideMC(mc) {
        if (!this.guideLight) {
            var data:any = RES.getRes('guide_mv' + "_json"); //qid
            var texture:egret.Texture = RES.getRes('guide_mv' + "_png");
            if (data == null || texture == null) {
                return
            }
            var mcFactory = new egret.MovieClipDataFactory(data, texture);

            this.guideLight = new egret.MovieClip();
            this.guideLight.movieClipData = mcFactory.generateMovieClipData('click_guide');
            this.guideLight.addEventListener(egret.MovieClipEvent.COMPLETE, this.onGuideLightComplete, this)
            this.guideLight.frameRate = 12//技能动画变慢
            this.guideLight.touchEnabled = false;
        }

        var rect = mc.getBounds();
        var p1 = mc.localToGlobal(rect.x, rect.y);
        var p2 = mc.localToGlobal(rect.x + rect.width, rect.y + rect.height);

        this.guideLight.x = p1.x + (p2.x - p1.x) / 2
        this.guideLight.y = p1.y + (p2.y - p1.y) / 2
        GameManager.container.addChild(this.guideLight);
        this.guideLight.gotoAndPlay(1, 1);
    }

    private onGuideLightComplete() {
        this.guideLight.stop();
        MyTool.removeMC(this.guideLight);
    }
}