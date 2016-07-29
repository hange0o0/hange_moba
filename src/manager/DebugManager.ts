class DebugManager {
    private static _instance:DebugManager;
    public static getInstance():DebugManager {
        if (!this._instance)
            this._instance = new DebugManager();
        return this._instance;
    }

    public myData:any = {"vedio":-1}
    public constructor() {
        this.myData = SharedObjectManager.instance.getMyValue('share') || {"vedio":-1,};
    }


    public consoleDebug(){
        console.log('=====================debug====================');
        if(this.myData.team1)
            console.log('team1:' + this.myData.team1.list.join(',') + '      ' + PKManager.getInstance().getCost(this.myData.team1.list));
        if(this.myData.team2)
            console.log('team2:' + this.myData.team2.list.join(',') + '      ' + PKManager.getInstance().getCost(this.myData.team2.list));
    }

    public t(key,data?,data2?){
        this['t'+key](data,data2);
    }

    public t1(arr){
        this.myData.team1 = {"list":arr,"ring":{"id":1,"level":1}}
        this.consoleDebug();
        SharedObjectManager.instance.setMyValue('share',this.myData);

    }
    public t2(arr,run?){
        this.myData.team2 = {"list":arr,"ring":{"id":1,"level":1}}
        this.consoleDebug();
        SharedObjectManager.instance.setMyValue('share',this.myData);
    }

    public t3(){
        this.debugFromFile(this.myData);
    }

    public t4(arr1,arr2){
        this.myData.team1 = {"list":arr1,"ring":{"id":1,"level":1}}
        this.myData.team2 = {"list":arr2,"ring":{"id":1,"level":1}}
        this.consoleDebug();
        SharedObjectManager.instance.setMyValue('share',this.myData);
        this.t3();
    }

    //随机卡
    public randomCard(){
        //先出8张卡
        var card1= []; //低
        var card2= []; //中
        var card3= []; //高
        for(var i=1;i<21;i++)
        {
            var vo = MonsterVO.getObject(i);
            if(vo)
            {
                if(vo.cost <10)
                    card1.push(vo.id);
                else if(vo.cost <20)
                    card2.push(vo.id);
                else
                    card3.push(vo.id);
            }
        }
        ArrayUtil.random(card1,3);
        ArrayUtil.random(card2,3);
        ArrayUtil.random(card3,3);
        var arr = [
            card1.pop(),
            card1.pop(),
            card2.pop(),
            card2.pop(),
            card2.pop(),
            card2.pop(),
            card3.pop(),
            card3.pop()
        ];

        var returnArr = [];
        var PKM = PKManager.getInstance();
        for(var i=0;i<20;i++)
        {
            var id = ArrayUtil.randomOne(arr);
            returnArr.push(id);
            if(PKM.getCost(returnArr) > 100)
            {
                returnArr.pop();
            }
            if(returnArr.length >= 6)
                break;
        }
        //ArrayUtil.random(returnArr);
        return returnArr;
    }

    //开始测试卡组   跑time1次，每次从time2个卡组中选,结果写入硬盘
    public testAllCard(time1,time2 = 100){
       var key = TM.now();
       var arr = [];
       var self = this;
        Net.getInstance().outPut = false;
        testOne();
        function testOne(){
            self.testOneCard(time2,function(card){
                arr.push(card)
                console.log(arr.length + '\t\t' + card.join(',') + '\t\t\tcost:' + PKManager.getInstance().getCost(card)+'/'+card.length)
                SharedObjectManager.instance.setMyValue('testCard_'+key,arr);
                if(arr.length >= time1)
                {
                    console.log('==================testEnd======================' + DateUtil.getStringBySecond(TM.now() - key))
                    var mid = {}
                    for(var i=0;i<arr.length;i++)
                    {
                        card = arr[i];
                        console.log(card.join(',') + '\t\t\tcost:' + PKManager.getInstance().getCost(card)+'/'+card.length);
                        var mid2 = {};
                        for(var j=0;j<card.length;j++)
                        {
                            var id = card[j];
                            if(!mid[id])
                                mid[id] = {id:id,num:0,num2:0};
                            mid[id].num ++;
                            if(!mid2[id])
                            {
                                mid[id].num2 ++;
                                mid2[id] = true;
                            }
                        }
                    }
                    var midArr = ObjectUtil.objToArray(mid);
                    ArrayUtil.sortByField(midArr,['num','num2','id'],[1,1,0])
                    for(var i=0;i<midArr.length;i++)
                    {
                        var oo = midArr[i];
                        var mvo = MonsterVO.getObject(oo.id);
                        console.log((i + 1) +  ' \t' + oo.id + '\t 总数:\t' + oo.num + '\t 场数:\t' + oo.num2 + '\t 花费:\t' + mvo.cost + '\t  ' + mvo.name)
                    }

                    var free = [];
                    for(var i=1;i<21;i++)
                    {
                        if(!mid[i] && MonsterVO.getObject(i))
                            free.push(i);
                    }
                    console.log('无上场： \t' + free.join(','))
                    Net.getInstance().outPut = true;
                }
                else
                {
                    testOne();
                }
            })
        }
    }

    //从time次中选中一张最强卡,胜利后回调最强卡
    public testOneCard(time,fun){
        var self = this;
        var list = []
        for(var i=0;i<time;i++)
        {
             list.push(self.randomCard());
        }
        testOne();

        function testOne(){
            if(list.length >= 2)
            {
                self.testCard(list.shift(),list.shift(),function(card){
                    list.push(card);
                    testOne();
                })
            }
            else
            {
                fun(list.pop());
            }

        }
    }

    //回调胜出卡组
    public testCard(card1,card2,fun){
        var dataIn:any = {}
        if(!card1)
        {
            fun(card2);
            return;
        }
        dataIn.team1 = {"list":card1,"ring":{"id":1,"level":1}}
        dataIn.team2 = {"list":card2,"ring":{"id":1,"level":1}}
        Net.send('test',dataIn,function(data) {
            var msg = data.msg;
            if(msg.result==1)
                fun(card1);
            else
                fun(card2)
        })
    }

    public debugFromFile(dataIn){
        Net.send('test',dataIn,function(data) {
            var msg = data.msg;
            msg.info = {};

            var key = _get['test']
            PKManager.getInstance().onPK(key,msg) ;

            console.log('team1 cost:' +  PKManager.getInstance().getCost(dataIn.team1.list) + '     ' + dataIn.team1.list.join(','));
            console.log('team2 cost:' +  PKManager.getInstance().getCost(dataIn.team2.list) + '     ' + dataIn.team2.list.join(','));
            console.log('winner:' + (msg.result==1?1:2));
            var win1 = 0;
            var win2 = 0;
            var result = [];
            for(var i=0;i<msg.pkdata.length;i++)
            {
                if(msg.pkdata[i].result.w == 1)
                {
                    win1 ++;
                    result.push('1')
                }
                else
                {
                    win2 ++;
                    result.push('2')
                }
            }
            console.log('比分:  ' + win1 + ':' + win2);
            if(msg.result==1)
            {
                console.log( 'leave:   ' + msg.pkdata[msg.pkdata.length - 1].result.hp + '/' + msg.team1base.mb[msg.pkdata[msg.pkdata.length - 1].player1[0].mid].hp);
            }
            else
            {
                console.log( 'leave:   ' + msg.pkdata[msg.pkdata.length - 1].result.hp + '/' + msg.team2base.mb[msg.pkdata[msg.pkdata.length - 1].player2[0].mid].hp);
            }
            console.log('战况:  ' + result.join(','));
            var cost1 = msg.pkdata[msg.pkdata.length - 1].player1[0].id - 10
            var cost2 = msg.pkdata[msg.pkdata.length - 1].player2[0].id - 30
            if(msg.result==1)
                cost2 ++;
            else
                cost1 ++;
            console.log('死亡:  ' + cost1+'/'+  msg.team1base.list.length+ ' : ' + cost2+'/'+  msg.team2base.list.length);


            if(dataIn.vedio == -1)
                return;
            if(dataIn.vedio == -2)
            {
                for(var i=0;i<PKManager.getInstance().pkList.length;i++)
                {
                    egret.setTimeout(function(i){
                        VideoManager.getInstance().playVideo(key,i)
                        console.log('==================round start====>'+i);
                    },this,100*i,i);
                }
                return;
            }

            //var baseData = PKManager.getInstance().getVedioBase(dataIn.vedio - 1);
            VideoManager.getInstance().playVideo(key,dataIn.vedio)

            //console.log(PKManager.getInstance().getVedioBase(dataIn.vedio - 1));

            //VideoCode.getInstance().initData(PKManager.getInstance().pkData[0]);
            //Net.send('pk_vedio',baseData,function(data){
            //	var msg = data.msg;
            //	VideoManager.getInstance().initVideo(msg.pkdata);
            //    VideoCode.getInstance().play();
            //
            //	//console.log(VideoManager.getInstance().dataArray);
            //});
        });
    }
}
