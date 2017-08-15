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
         if(!DateUtil.isSameDay(UM.active.guess.lasttime))
         {
             UM.active.guess.lasttime = TM.now();
             UM.active.guess.num = 0;
         }
    }

    public getMaxTimes(){
        return 9 + UM.level;
    }

    public getGuess(fun?){
        if(UM.active.guess && UM.active.guess.list1)
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
            if(!UM.active.guess)
                UM.active.guess = {};

            UM.active.guess.list1 = msg.list1;
            UM.active.guess.list2 = msg.list2;

            if(fun)
                fun();
        });
    }

    public guess(type,num,iswin,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type
        oo.num = num
        oo.iswin = iswin?1:0

        Net.addUser(oo);
        Net.send(GameEvent.guess.guess_answer,oo,function(data){
            var msg = data.msg;

            self.passDay();
            UM.active.guess.list1 = null;
            UM.active.guess.list2 = null;
            UM.active.guess.num ++;
            UM.active.guess.lasttime = TM.now()

            msg.info.type = PKManager.PKType.GUESS;
            PKManager.getInstance().onPK(PKManager.PKType.GUESS,msg);
            self.addLogList(PKManager.getInstance().getLogData({guess:oo.iswin == msg.result,guessType:type,guessValue:num,type:PKManager.PKType.GUESS}));
            if(fun)
                fun();
        });
    }
}