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
        //oo.serverid =  LoginManager.getInstance().lastSever;
        Net.send(GameEvent.rank.create_rank,oo,function(data){
            var msg = data.msg;
            if(fun)
                fun();
        });
    }
}
