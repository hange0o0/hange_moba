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

    public cleanNowAcrion(key){
        if(TaskManager.getInstance().nowAction == key)
            TaskManager.getInstance().nowAction = null;
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
                var vo = TaskVO.lineData[s][0];
                if(vo.isEnable())
                    arr.push(vo);
            }
        }
        return arr;
    }

    //public getTaskText(){
    //    var textArr = [];
    //    var arr = this.getCurrentTaskList();
    //    for(var i=0;i<arr.length;i++)
    //    {
    //        if(i != 0)
    //            textArr.push({text:'\n'})
    //
    //        var vo:TaskVO = arr[i];
    //        if(vo.isFinish())
    //        {
    //            var href = 'event:award_'+vo.id;
    //            textArr.push({text:vo.getDes()  ,style:{href:href,"underline": true}})
    //            textArr.push({text: '　已完成',style:{href:href,textColor:0x6DC966}})
    //        }
    //        else
    //        {
    //            var href = 'event:go_'+vo.id;
    //            textArr.push({text:vo.getDes(),style:{href:href,"underline": true}})
    //            textArr.push({text: '　' + vo.getRate(),style:{href:href,textColor:0xE0A44A}})
    //        }
    //
    //    }
    //    return textArr;
    //}

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

        egret.setTimeout(function(){
            var rect = mc.getBounds();
            var p1 = mc.localToGlobal(rect.x, rect.y);
            var p2 = mc.localToGlobal(rect.x + rect.width, rect.y + rect.height);

            this.guideLight.x = p1.x + (p2.x - p1.x) / 2
            this.guideLight.y = p1.y + (p2.y - p1.y) / 2
            GameManager.container.addChild(this.guideLight);
            this.guideLight.gotoAndPlay(1, 1);
        },this,300);

    }

    private onGuideLightComplete() {
        this.guideLight.stop();
        MyTool.removeMC(this.guideLight);
    }


    public getTaskAward(taskid,fun?){
        var self = this;
        var oo:any = {};
        oo.taskid = taskid;
        Net.addUser(oo);
        Net.send(GameEvent.active.get_task_award,oo,function(data){
            var msg = data.msg;
            if(msg.fail ==1)
            {
                Alert('该任务不在进行中')
                return;
            }
            if(msg.fail ==2)
            {
                Alert('该任务还没开启')
                return;
            }
            if(msg.fail ==3)
            {
                Alert('该任务还没完成')
                return;
            }
            msg.award.title = '任务完成';
            AwardUI.getInstance().show(msg.award)
            EM.dispatch(GameEvent.client.task_change);
            if(fun)
                fun();
        });
    }
}