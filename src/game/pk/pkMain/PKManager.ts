class PKManager {
    private static _instance:PKManager;
    public static PKType = {
        MAIN:'main_game',
        SERVER:'server_game',
        SERVER_EQUAL:'server_game_equal',
        DAY:'day_game',
        REPLAY:'replay',
        FRIEND:'friend'
    };

    public static getInstance():PKManager {
        if (!this._instance)
            this._instance = new PKManager();
        return this._instance;
    }

    public pkResult;
    public pkType;
    public pkData;

    //不同位置的加成值和比例
    public indexAdd(index)
    {
        index = index%4;
        if(index == 0)
            return {type:'hp',value:10};
        else if(index == 1)
            return {type:'atk',value:5};
        else if(index == 2)
            return {type:'speed',value:5};
        return null;
    }

    //PK通用报错处理
    public pkError(oo){
        if(oo.fail == 101)//没这个令牌
        {
            Alert('选中的技能非法.');
            return true;
        }
        if(oo.fail == 102)//数量过了3个
        {
            Alert('选择的单位非法(同种数量>3)');
            return true;
        }
        if(oo.fail == 103)//超过可出战的碎片宠物
        {
            Alert('选择的单位非法(等级不对)');
            return true;
        }
        if(oo.fail == 104)//钱不对
        {
            Alert('4选择的单位非法（钱不对）');
            return true;
        }
        if(oo.fail == 105)//木头不对
        {
            Alert('5选择的单位非法（木不对）');
            return true;
        }
        if(oo.fail == 106)//没这个宠物
        {
            Alert('6选择的单位非法（没这个宠物）');
            return true;
        }
        if(oo.fail == 110)
        {
            Alert('没找到卡组数据');
            return true;
        }
        if(oo.fail == 111)
        {
            Alert('没有选择任何卡牌');
            return true;
        }
        return false;
    }

    //取PK回放
    public getReplayByType(type,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;
        Net.addUser(oo);
        Net.send(GameEvent.pkCore.pk_result_type,oo,function(data){
            var msg = data.msg;
            self.onPK(PKManager.PKType.REPLAY,msg);
            if(fun)
                fun(msg);
        });
    }

    //取PK回放2
    public getReplayByData(team1,team2,isequal,fun?){
        var self = this;
        var oo:any = {};
        oo.team1 = team1;
        oo.team2 = team2;
        oo.isequal = isequal;
        Net.send(GameEvent.pkCore.pk_result,oo,function(data){
            var msg = data.msg;
            self.onPK(PKManager.PKType.REPLAY,msg);
            if(fun)
                fun(msg);
        });
    }

    public onPK(type,data){
        this.pkType = type
        this.pkResult = data
        this.pkData = data.pkdata;

    }
}