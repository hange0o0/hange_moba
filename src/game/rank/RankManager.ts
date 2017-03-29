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
         return this.rankData[rankType].data;
    }
    public isRankOpen(){
        var serverTime = LoginManager.getInstance().serverList[Net.getInstance().serverID].timeNum;
        return (TM.now()>serverTime && !DateUtil.isSameDay(serverTime))
    }

    //取排行榜数据
    public getRank(rankType,fun?){
        if(this.rankData[rankType] && (DateUtil.isSameDay(this.rankData[rankType].time) || TM.now() - this.rankData[rankType].getTime < 60))
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
        });
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
                    self.rankData[s].getTime = 0;
                }
                if(RankUI.getInstance().stage)
                    RankUI.getInstance().typeBarClick();
            }
            if(fun)
                fun();
        },false);
    }

    public renewPageHead(bgCon,headMC,rankType){
        if(!GuideManager.getInstance().isGuiding)
        {
            var self = this;
            RankManager.getInstance().getRank(rankType,function(){
                var arr = RankManager.getInstance().getRankList(rankType);
                var item = arr[1+Math.floor((arr.length-1) * Math.random())]
                if(item)
                {
                    headMC.visible = true;
                    headMC.data = item;
                    self.startTween(bgCon,headMC)
                    //headMC.time = TM.now();
                }
            })
        }
        else
            headMC.visible = false;
    }

    public initHeadMC(bgCon,headMC){
        headMC.anchorOffsetX = 320
        headMC.anchorOffsetY = 200
        bgCon.parent.addChildAt(bgCon,0);
        headMC.parent.addChildAt(headMC,0);
        egret.Tween.removeTweens(bgCon);
        egret.Tween.removeTweens(headMC);

        headMC.x = 320
        headMC.y = 200
        headMC.scaleX = bgCon.scaleY = 0.6
        headMC.visible = false
        headMC.alpha = 0.6

        bgCon.x = 320
        bgCon.y = 200
        bgCon.scaleX = bgCon.scaleY = 1
        bgCon.visible = true
        bgCon.alpha = 1
    }

    private startTween(bgCon,headMC){
        this.initHeadMC(bgCon,headMC)
        headMC.visible = true
        egret.Tween.removeTweens(this);
        var tw:egret.Tween = egret.Tween.get(bgCon);
        var showCD = 10000
        tw.to({scaleX:0.6,scaleY:0.6,alpha:0.6,y:150},600,egret.Ease.sineInOut).
            wait(showCD).to({scaleX:1,scaleY:1,alpha:1,y:200},600,egret.Ease.sineInOut)

        var tw:egret.Tween = egret.Tween.get(bgCon);
        tw.to({x:480},300).call(function(){
            headMC.parent.addChildAt(headMC,0);
            bgCon.parent.addChildAt(bgCon,0);
        },this).to({x:320},300).call(function(){
            bgCon.visible = false;
        },this).wait(showCD).call(function(){
                bgCon.visible = true;
            },this).
            to({x:160},300).call(function(){
                bgCon.parent.addChildAt(bgCon,0);
                headMC.parent.addChildAt(headMC,0);

            },this).to({x:320},300).call(function(){
                headMC.visible = false;
            },this)
        //.wait(1000).call(function(){
        //        this.startTween(bgCon,headMC)
        //    },this)


        var tw:egret.Tween = egret.Tween.get(headMC);
        tw.to({scaleX:1,scaleY:1,alpha:1},600,egret.Ease.sineInOut).
            wait(showCD).to({scaleX:0.6,scaleY:0.6,alpha:0.6},600,egret.Ease.sineInOut)

        var tw:egret.Tween = egret.Tween.get(headMC);
        tw.to({x:160},300).to({x:320},300).wait(showCD).to({x:480},300).to({x:320},300)
    }
}
