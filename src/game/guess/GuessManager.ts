class GuessManager {
    private static _instance:GuessManager;

    public static getInstance():GuessManager {
        if (!this._instance)
            this._instance = new GuessManager();
        return this._instance;
    }

    public constructor() {
    }

    public logList
    public initData(){
        this.logList = SharedObjectManager.instance.getMyValue('pk_guess_log') || [];
    }

    public addLogList(data){
        var list = this.logList;
        list.unshift(data);
        if(list.length > 20)
            list.length = 20;
        SharedObjectManager.instance.setMyValue('pk_guess_log',list);
    }

    public passDay(){
         if(UM.active.guess.lasttime && !DateUtil.isSameDay(UM.active.guess.lasttime))
         {
             UM.active.guess.lasttime = TM.now();
             UM.active.guess.num = 0;
         }
    }

    public getMaxTimes(){
        return 3 + Math.floor(UM.level/3);
    }

    public getGuess(fun?){
        if(UM.active.guess && UM.active.guess.award)
        {
            if(fun)
                fun();
            return;
        }
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.guess.get_guess,oo,function(data){
            var msg = data.msg;


            UM.active.guess.list1 = msg.list1;
            UM.active.guess.list2 = msg.list2;
            UM.active.guess.award = msg.award;

            if(fun)
                fun();
        });
    }

    public getGuessAwardStr(data){
         switch(data.type)
         {
             case 'coin':
                 return '金币×' + data.value;
             case 'card':
                 return '碎片×' + data.value;
             case 'energy':
                 return '体力×' + data.value;
             case 'diamond':
                 return '钻石×' + data.value;
             case 'prop':
                 return PropVO.getObject(data.id).propname + '×' + data.value;
         }
        return '未知'
    }

    public guess(iswin,fun?){
        var self = this;
        var oo:any = {};
        //oo.type = type
        //oo.num = num
        oo.iswin = iswin?1:0

        Net.addUser(oo);
        Net.send(GameEvent.guess.guess_answer,oo,function(data){
            var msg = data.msg;

            self.passDay();
            var award = UM.active.guess.award;
            UM.active.guess.list1 = null;
            UM.active.guess.list2 = null;
            UM.active.guess.award = null;
            UM.active.guess.num ++;
            UM.active.guess.total ++
            UM.active.guess.lasttime = TM.now()

            if(!msg.info)
                msg.info = {};
            msg.info.teamChange = !iswin;
            msg.info.type = PKManager.PKType.GUESS;
            PKManager.getInstance().onPK(PKManager.PKType.GUESS,msg);
            PKMainUI.getInstance().show();


            var str// = type == 'coin'?'金币':'碎片'
            if(msg.guess_win)
            {
                //PKManager.getInstance().pkAward.desArr.push('竞猜成功，'+str+'：+' + oo.num);
                UM.active.guess.win ++
            }
            //else
            //    PKManager.getInstance().pkAward.desArr.push('竞猜失败，'+str+'：-' + oo.num);

            self.addLogList(PKManager.getInstance().getLogData({guessChoose:iswin,guessWin:msg.guess_win,type:PKManager.PKType.GUESS,award:award}));
            if(fun)
                fun();
        });
    }
}