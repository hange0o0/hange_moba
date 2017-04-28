class MainGameManager{
    private static _instance:MainGameManager;
    public static getInstance():MainGameManager {
        if (!this._instance)
            this._instance = new MainGameManager();
        return this._instance;
    }

    public constructor() {
    }

    public lastPKData;
    public maxLevel = 600;

    public logList
    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_main_log') || [];
    }
    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 0;
        SharedObjectManager.instance.setMyValue('pk_main_log',list);
    }

    public loadCache(level,fun){
        var id = Math.ceil(level/100);
        CM.loadCache('main_game'+id+'_json',function(){
            fun()
        })
    }

    public stepName = ['学徒'];
    public getMainStepLevel(lv?){
        var level = lv || UM.main_game.level;
        if(level < 90)
        {
            return Math.floor((level+5)/10)
        }
        return  Math.floor(level/10)
    }

    public getStepName(lv?){
        var level = this.getMainStepLevel(lv);
        var index = Math.floor(level/10);
        var step = level%10
        if(step==0)
            return this.stepName[index];
        return this.stepName[index] + StringUtil.numToStr(step) + '阶';
    }

    public getHeadByLevel(level){
         return level%50 + 1;
    }
    public getNickByLevel(level){
         return '守卫' + level;
    }

    //杀一个敌人的花费
    public getKillCost(){
        var level = UM.main_game.level;
        return level*100*(UM.main_game.kill.length+1)*2;
    }

    public getLocalAward(level){
        level =  level || UM.main_game.level;
        return {coin:level*100,card:Math.floor(level/30+1)};
    }

    //该位置是否被杀了
    public isKill(index){
        return UM.main_game.kill.indexOf(index) != -1;
    }

    ////打开PK对战内容的表现
    public openPKView(fun?){
        if(UM.getEnergy()<1)
        {
            Alert('体力不足1点，无法进行挑战');
            return;
        }
        MainGameUI.getInstance().show();
        fun && fun();
    }

    //public getCard(fun?,force?){
    //    if(!force && UM.main_game.choose)
    //    {
    //        if(fun)
    //            fun();
    //        return
    //    }
    //    if(UM.getEnergy()<1)
    //    {
    //        Alert('体力不足1点，无法获取卡组');
    //        return;
    //    }
    //    var self = this;
    //    var oo:any = {force:force};
    //    Net.addUser(oo);
    //    Net.send(GameEvent.mainGame.get_main_card,oo,function(data){
    //        var msg = data.msg;
    //        if(msg.fail == 4)
    //        {
    //            Alert('体力不足');
    //            return;
    //        }
    //        if(msg.fail == 3)
    //        {
    //            Alert('获取卡组失败');
    //            return;
    //        }
    //
    //        UM.main_game.choose = msg.choose;
    //        EM.dispatch(GameEvent.client.get_card)
    //
    //        if(fun)
    //            fun();
    //    });
    //}

    //choose :{list[],ring}   choose_index
    public pk(choose,fun?){
        var self = this;
        var oo:any = {};
        if(!UM.testEnergy(1))
        {
            return;
        }
        oo.choose = choose;

        if(UM.main_game.level > 1 && UM.main_game.level < 50)
        {
            oo.data_key = md5.incode(JSON.stringify(choose)).substr(-16);
        }
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.pk_main,oo,function(data){
            var msg = data.msg;
            if(PKManager.getInstance().pkError(msg))
                return;

            UM.addHistory(choose.list.join(','));
            self.lastPKData = msg;
            msg.info.type = PKManager.PKType.MAIN;
            for(var i=0;i<msg.team2base.list.length;i++){
                if(!msg.team2base.list[i])
                {
                    msg.team2base.list.splice(i,1);
                    i--;
                }
            }

            PKManager.getInstance().onPK(PKManager.PKType.MAIN,msg);
            UM.main_game.pkdata = Config.pk_version;
            self.addLogList(PKManager.getInstance().getLogData({round:UM.main_game.level,type:PKManager.PKType.MAIN}));
            if(fun)
                fun();
        });
    }

    //杀死第几个怪
    public kill(kill,fun?){
        var self = this;
        var oo:any = {};
        oo.kill = kill;
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.main_kill,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('没有对应卡牌数据');
                return;
            }
            if(msg.fail == 2)
            {
                Alert('该单位已被杀死');
                return;
            }
            if(msg.fail == 3)
            {
                Alert('金币不足');
                return;
            }
            EM.dispatch(GameEvent.client.main_kill)
            if(fun)
                fun();
        });
    }

    //领取奖励
    public getAward(fun?){
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mainGame.main_award,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('今天已领过奖了');
                return;
            }
            AwardUI.getInstance().show(msg.award);
            EM.dispatch(GameEvent.client.get_card)
            if(fun)
                fun();
        });
    }

    public playBack(fun?){
        if(this.lastPKData)
        {
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.lastPKData);
            PKMainUI.getInstance().show();
            if(fun)
                fun();
            return;
        }
        if(UM.main_game.pkdata)
        {
            if(UM.main_game.pkdata != Config.pk_version)
            {
                Alert('录像已过期');
                return;
            }
            var self = this;
            PKManager.getInstance().getReplayByType(PKManager.PKType.MAIN,function(data){
                self.lastPKData = data;
                self.playBack(fun);
            })
        }
    }


}
