class RankManager{
    private static _instance:RankManager;
    public static getInstance():RankManager {
        if (!this._instance)
            this._instance = new RankManager();
        return this._instance;
    }

    public rankData = {}     //type:{data,time}
    public constructor() {

    }

    public getRankList(rankType){
        if(this.rankData[rankType])
            return this.rankData[rankType].data;
        return [];
    }
    public isRankOpen(){
        var serverTime = UM.opentime;
        return (TM.now()>serverTime && !DateUtil.isSameDay(serverTime))
    }

    //取排行榜数据
    public getRank(rankType,fun?,isFromMain?){
        if(this.rankData[rankType] && (isFromMain || DateUtil.isSameDay(this.rankData[rankType].time) || TM.now() - this.rankData[rankType].getTime < 60))
        {
            if(fun)
                fun();
            return;
        }

        var self = this;
        var oo:any = {};
        oo.rank_type = rankType
        Net.send(GameEvent.rank.get_rank,oo,function(data){
            var msg = data.msg;
            self.rankData[rankType] = {};
            if(msg.fail == 1) //文件未生成
            {
                self.rankData[rankType].data = msg.yestodayRank;
                self.rankData[rankType].getTime = TM.now();
                self.createRank();
            }
            else if(msg.fail == 2) //文件已生成，但内容为空
            {
                self.rankData[rankType].data = msg.yestodayRank;
                self.rankData[rankType].getTime = TM.now();
            }
            else
            {
                self.rankData[rankType].data = msg.rank;
                self.rankData[rankType].time = TM.now();

                //今天文件已生成，清空不是同一天的历史记录
                for(var s in self.rankData)
                {
                    if(s != rankType && self.rankData[s] && !DateUtil.isSameDay(self.rankData[s].time))
                    {
                        self.rankData[s] = null;
                    }
                }
            }
            var arr = self.rankData[rankType].data = JSON.parse(self.rankData[rankType].data || '[]');
            for(var i=0;i<arr.length;i++)
            {
                arr[i].index = i;
                arr[i].type = rankType;
                if(arr[i].gameid == UM.gameid)
                {
                    arr[0].self = i;
                }
            }



            if(fun)
                fun();
        },!isFromMain);
    }

    //生成排行榜
    public createRank(fun?){
        var self = this;
        var oo:any = {};
        //oo.serverid =  LoginManager.getInstance().lastServer;
        Net.send(GameEvent.rank.create_rank,oo,function(data){
            var msg = data.msg;
            if(msg.ok)
            {
                for(var s in self.rankData)
                {
                    if(self.rankData[s])
                        self.rankData[s].getTime = 0;
                }
                if(RankUI.getInstance().stage)
                    RankUI.getInstance().typeBarClick();
            }
            if(fun)
                fun();
        },false);
    }

    public renewPageHead(headMC){
        if(!GuideManager.getInstance().isGuiding && RankManager.getInstance().isRankOpen())
        {
            var rankType = 1 + Math.floor(6 * Math.random());
            var self = this;
            RankManager.getInstance().getRank(rankType,function(){
                var arr = RankManager.getInstance().getRankList(rankType);
                var item = arr[1+Math.floor((arr.length-1) * Math.random())]
                if(item)
                {
                    headMC.data = item;
                    self.startTween(headMC)
                }
                else if(Math.random() > 0.1)
                {
                     self.renewPageHead(headMC);
                }
            },true)
        }
        else
            headMC.visible = false;
    }


    //public initHeadMC(bgCon,headMC){
    //    headMC.anchorOffsetX = 320
    //    headMC.anchorOffsetY = 200
    //    bgCon.parent.addChildAt(bgCon,0);
    //    headMC.parent.addChildAt(headMC,0);
    //    egret.Tween.removeTweens(bgCon);
    //    egret.Tween.removeTweens(headMC);
    //
    //    headMC.x = 320
    //    headMC.y = 200
    //    headMC.scaleX = bgCon.scaleY = 0.6
    //    headMC.visible = false
    //    headMC.alpha = 0.6
    //
    //    bgCon.x = 320
    //    bgCon.y = 200
    //    bgCon.scaleX = bgCon.scaleY = 1
    //    bgCon.visible = true
    //    bgCon.alpha = 1
    //}

    private startTween(headMC){
        headMC.visible = true
        egret.Tween.removeTweens(headMC);
        var tw:egret.Tween = egret.Tween.get(headMC);
        var showCD = 10000
        tw.to({scaleX:0,scaleY:0}).to({scaleX:1.1,scaleY:1.1},200).to({scaleX:1,scaleY:1},200).
            wait(showCD).to({scaleX:1.1,scaleY:1.1},200).to({scaleX:0,scaleY:0},200).call(headMC.hide,headMC);
    }
}
