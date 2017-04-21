class DebugManager {
    private static _instance:DebugManager;
    public static getInstance():DebugManager {
        if (!this._instance)
            this._instance = new DebugManager();
        return this._instance;
    }

    public myData:any = {"vedio":-1}
    public stop = 0;
    public winCardArr;
    public testFinishFun;
    public constructor() {
        this.myData = SharedObjectManager.instance.getMyValue('share') || {"vedio":-1,};
    }

    public maxMonsterID = 100;
    public MML = 100;  //测试出战怪的等级


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
    public randomCard(testCard){
        testCard = testCard || [];
        //先出8张卡
        var card1= []; //低
        var card2= []; //中
        var card3= []; //高
        for(var i=1;i<this.maxMonsterID + 1;i++)
        {
            var vo = MonsterVO.getObject(i);
            if(vo)
            {
                if(vo.level > this.MML)
                    continue;
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

        for(var i=0;i<testCard.length;i++)
        {
            var id = testCard[i];
            var index = card1.indexOf(id);
            if(index != -1)
            {
                card1.splice(index,1);
                card1.push(id);
            }

            var index = card2.indexOf(id);
            if(index != -1)
            {
                card2.splice(index,1);
                card2.push(id);
            }

            var index = card3.indexOf(id);
            if(index != -1)
            {
                card3.splice(index,1);
                card3.push(id);
            }


        }
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
        var index = 0;
        while(PKM.getCost(returnArr) < 80)
        {
            returnArr = testCard.concat();
            for(var i=0;i<30;i++)
            {
                var id = ArrayUtil.randomOne(arr);
                returnArr.push(id);
                if(PKM.getCost(returnArr) > 88)
                {
                    returnArr.pop();
                }
                if(returnArr.length >= 6)
                    break;
            }
            index ++;
            if(index >= 100)
                return  this.randomCard(testCard);
        }

        ArrayUtil.random(returnArr);
        return returnArr;
    }

    //随机serverPK卡格式
    public randomServerCard(){
        //先出8张卡
        var card1= []; //低
        var card2= []; //中
        var card3= []; //高
        for(var i=1;i<this.maxMonsterID + 1;i++)
        {
            var vo = MonsterVO.getObject(i);

            if(vo)
            {
                if(vo.level > 1)
                    continue;
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
        var index = 0;
        while(PKM.getCost(returnArr) < 80)
        {
            returnArr = [];
            for(var i=0;i<30;i++)
            {
                var id = ArrayUtil.randomOne(arr);
                returnArr.push(id);
                if(PKM.getCost(returnArr) > 88)
                {
                    returnArr.pop();
                }
                if(returnArr.length >= 6)
                    break;
            }
            index ++;
            if(index >= 100)
                break;
        }

        ArrayUtil.random(returnArr);
        ArrayUtil.random(arr);
        var oo = {
            pkdata:{list:returnArr},
            base:{list:arr}
        };
        return JSON.stringify(oo).replace(/\"/g,'\\"');
    }
    //生成N个
    public randomServerCardByNun(num){
        var arr = [];
         for(var i=0;i<num;i++)
         {
             arr.push(this.randomServerCard());
         }
        console.log(arr.join('\n'))
    }


    public showWinCard(arr?,byType?){
        var arr = arr || this.winCardArr || [];
        var mid = {}
        for(var i=0;i<arr.length;i++)
        {
            var card = arr[i];
            var temp = [];
            for(var j=0;j<card.length;j++)
            {
                var vo = MonsterVO.getObject(card[j]);
                temp.push(vo.id+':'+vo.name);
            }
            console.log((i+1)+'\t'+temp.join(',') + '\t\t\tcost:' + PKManager.getInstance().getCost(card)+'/'+card.length);
            var mid2 = {};
            for(var j=0;j<card.length;j++)
            {
                var id = card[j];
                if(!mid[id])
                {
                    var mvo = MonsterVO.getObject(id);
                    mid[id] = {id:id,num:0,num2:0,type:mvo.type};
                }

                mid[id].num ++;
                if(!mid2[id])
                {
                    mid[id].num2 ++;
                    mid2[id] = true;
                }
            }
        }
        var midArr = ObjectUtil.objToArray(mid);
        if(byType)
            ArrayUtil.sortByField(midArr,['type','num','num2','id'],[0,1,1,0])
        else
            ArrayUtil.sortByField(midArr,['num','num2','id'],[1,1,0])
        for(var i=0;i<midArr.length;i++)
        {
            var oo = midArr[i];
            var mvo = MonsterVO.getObject(oo.id);
            console.log((i + 1) +  ' \tid:' + oo.id + '\t 总数:\t' + oo.num + '\t 场数:\t' + oo.num2 + '\t 花费:\t' + mvo.cost + '\t lv:\t' + mvo.level + '\t  ' + mvo.name)
        }

        var free = [];
        for(var i=1;i<this.maxMonsterID + 1;i++)
        {
            var mvo = MonsterVO.getObject(i)
            if(!mid[i] && mvo && mvo.level<= this.MML)
                free.push(i);
        }
        console.log('无上场： \t' + free.join(','))
    }

    public testAllLevel(lv = 100){
        this.MML = lv;
        this.testAllCard();
    }

    //开始测试卡组   跑time1次，每次从time2个卡组中选,结果写入硬盘
    public testAllCard(time2 = 2048,testCard=null){
       var key = TM.now();
       var arr = this.winCardArr = [];
       var self = this;
        this.stop = 0;
        Net.getInstance().outPut = false;
        testOne();
        function testOne(){
            self.testOneCard(time2,testCard,function(card){
                arr.push(card)
                var temp = [];
                for(var i=0;i<card.length;i++)
                {
                    var vo = MonsterVO.getObject(card[i]);
                    temp.push(vo.id+':'+vo.name);
                }
                console.log(arr.length + '\t\t' + temp.join(',') + '\t\t\tcost:' + PKManager.getInstance().getCost(card)+'/'+card.length)
                if(self.testFinishFun)
                    self.testFinishFun();
                SharedObjectManager.instance.setMyValue('testCard_'+key,arr);
                if(self.stop)
                {
                    console.log('==================testEnd======================' + DateUtil.getStringBySecond(TM.now() - key))
                    self.showWinCard();
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
    public testOneCard(time,testCard,fun){
        var self = this;
        var list = []
        for(var i=0;i<time;i++)
        {
             list.push(self.randomCard(testCard));
        }
        testOne();

        function testOne(){
            if(list.length >= 2 && self.stop < 10)
            {
                self.testCard(list.shift(),list.shift(),function(card){
                    list.push(card);
                    testOne();
                },list.length <time/8)//头3轮不记录
            }
            else
            {
                fun(list.pop());
            }

        }
    }

    //回调胜出卡组
    public testCard(card1,card2,fun,needServer?){
        var dataIn:any = {}
        if(!card1)
        {
            fun(card2);
            return;
        }
        dataIn.team1 = {"list":card1,"ring":{"id":1,"level":1}}
        dataIn.team2 = {"list":card2,"ring":{"id":1,"level":1}}
        dataIn.need_server = needServer
        Net.send('test',dataIn,function(data) {
            var msg = data.msg;
            if(msg.result==1)
                fun(card1);
            else
                fun(card2)
        })
    }

    //把记录的所有胜过的卡列出来
    public consoleAllWinCard(){
        console.log(JSON.stringify(this.getAllWinCard()));
    }

    public getAllWinCard(){
        var arr = [];
        for(var s in localStorage)
        {
            if(s.indexOf('testCard_') != -1)
            {
                var data = JSON.parse(localStorage[s]);
                arr = arr.concat(data.data);
            }
        }
        return arr;
    }

    public monsterDeatil(){
        var num =  this.maxMonsterID + 1;
        var cost = {}
        var card1= []; //低
        var card2= []; //中
        var card3= []; //高
        for(var i=1;i<num;i++)
        {
            var vo = MonsterVO.getObject(i);
            if(vo)
            {
                 if(!cost[vo.cost])
                     cost[vo.cost] = 0;
                cost[vo.cost] ++;

                if(vo.cost <10)
                    card1.push(vo.id);
                else if(vo.cost <20)
                    card2.push(vo.id);
                else
                    card3.push(vo.id);
            }
        }
        console.log('====================cost=====================');
        console.log('<10费：' + card1.length + '-----' + card1.join(','));
        console.log('<20费：' + card2.length + '-----' + card2.join(','));
        console.log('>=20费：' + card3.length + '-----' + card3.join(','));
        for(var s in cost)
        {
            console.log(s+':'+cost[s])
        }
    }

    //列出最强的卡
    public getTopWinCard(num = 1){
        var self = this;
        var list = this.getAllWinCard();
        var total = list.length;
        ArrayUtil.random(list);
        Net.getInstance().outPut = false;
        console.log('top card('+total+'):')
        testOne();

        function testOne(){
            if(list.length >= num + 1 && self.stop < 10)
            {
                self.testCard(list.shift(),list.shift(),function(card){
                    list.push(card);
                    testOne();
                })
            }
            else
            {
                self.showWinCard(list);
                Net.getInstance().outPut = true;
            }
        }
    }

    //显示服务器日志
    public showServerLog(){
        var arr = [];
        Net.send('get_test_monster',{},function(data) {
            var msg = data.msg;
            for(var s in msg.data)
            {
                var data = msg.data[s];
                if(Math.floor(data.display))
                {
                    var oo:any = {
                        id:data.id,
                        display:Math.floor(data.display),
                        win:Math.floor(data.win),
                        use_time:Math.floor(data.use_time),
                        use_num:Math.floor(data.use_num),
                    };
                    oo['useRate'] = oo.use_num/oo.display;
                    oo['winRate'] = oo.win/oo.display;

                    arr.push(oo)
                }
            }

            ArrayUtil.sortByField(arr,['winRate','useRate'],[1,1]);
            for(var i=0;i<arr.length;i++)
            {
                var oo:any = arr[i];
                var vo = MonsterVO.getObject(oo.id);
                console.log(vo.id +  ' ' + vo.name + '\t 胜率:\t' + (oo.winRate*100).toFixed(2) + '\t出现：' + oo.display + '\t 总数:\t' + oo.use_num + '\t 场数:\t' + oo.use_time + '\t 胜利:\t' + oo.win)
            }
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

    //显示真正的动画（数据库配的）
    public testMV(mv,atker,defender,data=null){
        data = data || {};
        data.mv = mv
        data.skillVO = data.skillVO || {name:'好名字啊'};
        data.atker = atker
        data.defender = defender
        setTimeout(function(){
            VideoUI.getInstance().showMVDebug(data);
        },1)
    }

    //显示所有基础动画
    public testMV2(skillID?){
        if(skillID)
        {
            this.testBaseMV(skillID);
            return;
        }
        var self = this;
        var index = 0;
        for(var i=1;i<180;i++)
        {
            if(!RES.hasRes('skill' + i + '_json'))
                continue;

            setTimeout(function(i){
                var data:any = {};
                data.mv = 'mvX';
                data.skillVO = data.skillVO || {name:'skill' + i};
                data.atker = 10
                data.defender = [30,31];
                data.mvname = 'skill' + i;
                VideoUI.getInstance().showMVDebug(data);
                console.log(i);
            },index*1000,i)
            index ++;
        }
    }

    public testPHP(url,data){
        var loader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var request = new egret.URLRequest(url);
        //var request = new egret.URLRequest('http://qxu1606510485.my3w.com/new_index.php');
        request.method = egret.URLRequestMethod.POST;
        var variables = new egret.URLVariables('a=1');
        variables.variables = data;
        request.data = variables
        loader.load(request);
    }

    //显示指定基础动画
    private testBaseMV(i){
        if(!RES.hasRes('skill' + i + '_json'))
        {
            console.log('not find '+ i)
            return;
        }

        var data:any = {};
        data.mv = 'mvX';
        data.skillVO = data.skillVO || {name:'skill' + i};
        data.atker = 10
        data.defender = [30,31];
        data.mvname = 'skill' + i;
        VideoUI.getInstance().showMVDebug(data);
    }

    //在一屏内显示所有的技能动画
    public showAllMV(){
        DebugSkillList.getInstance().show();
    }

    public testNoSound(){
        var noArr = [1,2,155,156,169,101,171,165,    9,10,17,18,19,20,152,173]
        for(var i=1;i<180;i++)
        {
            if(!RES.hasRes('skill' + i + '_json'))
                continue;
            if(noArr.indexOf(i) == -1)
            {
                if(!AniManager.getInstance().mvSoundConfig[i])
                    console.log(i)
            }
        }
    }

    public getMVDetail(){
        var useObj = {};
        //var noArr = [1,2,155,156,169,101,171,165    ]
        for(var i=1;i<180;i++)
        {
            if(!RES.hasRes('skill' + i + '_json'))
                continue;
            //if(noArr.indexOf(i) == -1)
                useObj[i] = [];
        }

        var data = CM.table[MonsterVO.dataKey];
        for(var s in data)
        {
            var vo:MonsterVO = data[s];
            for(var i=0;i<vo.mv1.length;i++)
            {
                var id = vo.mv1[i];
                useObj[id].push(vo.id);
            }
        }

        var noUse = []
        var count = 0
        for(var s in useObj)
        {
            if(useObj[s].length){
                console.log(s + ' ------------- ' + useObj[s].length + '  ' +useObj[s].join(',') )
                count ++;
            }

            else
                noUse.push(s);
        }
        console.log('useNum:  ' + count)
        console.log('noUse:  ' + noUse.length + '   ' + noUse.join(','))
    }


}

//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();