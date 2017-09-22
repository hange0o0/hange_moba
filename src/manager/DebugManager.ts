class DebugManager {
    private static _instance:DebugManager;
    private static cd = 0
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
    public printDetail = false;  //打印胜出怪物

    public get netCD(){
        return DebugManager.cd;
    }
    public set netCD(v){
        DebugManager.cd = v;
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
    public randomCard(testCard?){
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
        var id:any
        var arr = [];
        for(var i=0;i<2;i++)
        {
            id = card1.pop();
            if(id)
                arr.push(id);

            id = card2.pop();
            if(id)
                arr.push(id);
            id = card2.pop();
            if(id)
                arr.push(id);

            id = card3.pop();
            if(id)
                arr.push(id);
        }

        if(arr.length < 8)
        {
            var newArr = card1.concat(card2).concat(card3);
            ArrayUtil.random(newArr,3);
            while(newArr.length > 0 && arr.length < 8)
            {
                arr.push(newArr.pop())
            }
        }


        var returnArr = [];
        var PKM = PKManager.getInstance();
        var index = 0;
        while(PKM.getCost(returnArr) < 85)
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
            //console.log((i+1)+'\t'+temp.join(',') + '\t\t\tcost:' + PKManager.getInstance().getCost(card)+'/'+card.length);
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
        return midArr;
    }

    public testAllLevel(lv = 100){
        this.MML = lv;
        this.testAllCard();
    }

    //开始测试卡组   跑time1次，每次从time2个卡组中选,结果写入硬盘
    public testAllCard(time2 = 2048,testCard=null,addKey=''){
       var key = addKey + '_' + TM.now();
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
                if(self.printDetail)
                    console.log(arr.length + '\t\t' + temp.join(',') + '\t\t\tcost:' + PKManager.getInstance().getCost(card)+'/'+card.length)
                else
                    console.log(arr.length + '\t\t\t' + PKManager.getInstance().getCost(card)+'/'+card.length)
                if(self.testFinishFun)
                    self.testFinishFun();
                SharedObjectManager.instance.setMyValue('testCard_'+key,arr);
                if(self.stop)
                {
                    console.log('==================testEnd======================')
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
            if(self.stop == 100)
                return;
            if(list.length >= 2 && self.stop < 10)
            {
                self.testCard(list.shift(),list.shift(),function(card){
                    list.push(card);
                    if(self.netCD)
                        setTimeout(testOne,self.netCD);
                    else
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
        dataIn.team1 = {"list":card1}
        dataIn.team2 = {"list":card2}
        //dataIn.need_server = needServer
        Net.send('test',dataIn,function(data) {
            var msg = data.msg;
            if(msg.result==1)
                fun(card1,msg);
            else
                fun(card2,msg)
        })
    }

    private skillResult = {}
    private skillTestList = [];
    public testLeaderSkill(){
        this.skillResult = {}
        this.skillTestList = []
        this.stop = 0;
        Net.getInstance().outPut = false;
        this.testOneSkill();
    }

    private testOneSkill(){
        var length = ObjectUtil.objLength(LeaderSkillVO.data)
        if(this.skillTestList.length == 0)
        {
             if(this.stop)
             {
                 var arr = [];
                 for(var s in this.skillResult)
                 {
                     arr.push({vo:LeaderSkillVO.getObject(parseInt(s)),num:this.skillResult[s]})
                 }
                 ArrayUtil.sortByField(arr,['num'],[1]);
                 for(var i=0;i<arr.length;i++)
                 {
                     var oo = arr[i];
                     console.log(oo.vo.id +'\t\t'+oo.vo.name +'\t\tnum:'+oo.num)
                 }
                  return;
             }
            var baseArr = [[15,53,14,53,49],[26,26,17,40,2],[10,43,9,14,12,10],[12,47,36,45,36,5],[46,42,51,26,29],[33,33,40,39,23],[46,19,35,13],[4,4,29,64,10],[9,19,12,54,62],[26,25,49,1,47],[22,15,22,2,13,13],[62,56,32,54,56,3],[34,51,22,4,24],[25,29,48,42],[47,38,52,52,52],[33,2,48,37,23],[27,23,30,28,5,42],[26,32,42,26,56,23],[41,12,37,20],[59,9,9,9,50,50],[59,25,13,45,3,54],[62,47,15,19,54,47],[48,33,8,39,10],[16,48,32,37,23],[22,9,6,9,50],[29,59,43,12,35,23],[59,20,20,42,24],[12,19,2,56],[29,35,31,45,23],[34,8,17,17,10],[22,21,22,22,23],[32,34,56,4,39],[31,24,40,21],[59,12,9,9,43,64],[38,52,52,18,17],[50,1,50,36,5],[20,5,39,45,5,20],[12,31,48,27],[28,9,28,8,17,47],[51,22,4,24,17],[6,50,19,10],[26,41,45,37],[62,62,38,54,1],[9,64,40,4,13],[28,26,39,46,23,36],[25,25,1,43],[14,25,59,45,5,5],[34,36,34,20,20],[22,4,40,23,30],[16,22,16,22,53,5],[22,37,24,22,5],[28,1,12,20,10],[51,3,29,48,37],[14,11,37,27,47],[11,3,40,2,10],[35,35,54,54,54],[62,19,50,28,36],[59,16,50,36,12,50],[22,8,21,52,37],[31,19,37,23,23],[11,21,27,37,13],[22,32,53,53,59],[9,22,50,52,52,59],[16,50,9,16,50,9],[45,21,21,33,47],[56,49,23,16,49,56],[46,7,50,49,49],[62,28,25,24,24],[4,49,40,45],[1,24,50,43],[28,36,7,46,13,36],[15,19,8,36],[25,28,17,51,10,17],[62,3,62,24,17,17],[41,2,18,18,15],[9,48,48,36],[62,26,39,1,50,26],[25,24,24,42],[9,4,40,2,59],[41,28,53,62,43],[9,9,27,50,35],[6,47,14,37,37],[51,26,53,37,37,11],[31,22,22,53,35],[34,59,56,45,54,5],[16,3,48,22,3],[28,19,17,17],[33,46,34,42,47],[51,47,32,2,32],[9,9,50,19,5],[32,3,4,50,37],[26,24,24,21,10],[49,21,35,35,54],[6,33,13,15,15,13],[30,30,9,9,50,50]];
            var card1 = ArrayUtil.randomOne(baseArr)
            var card2 = ArrayUtil.randomOne(baseArr)
            for(var i=1;i<=length;i++) {
                for (var j = 1; j <= length; j++) {
                    var dataIn:any = {}
                    dataIn.team1 = {"list": card1, skill: i}
                    dataIn.team2 = {"list": card2, skill: j}
                    this.skillTestList.push(dataIn);
                }
            }
        }
        var self = this;
        var testData = this.skillTestList.pop();
        Net.send('test',testData,function(data) {
            var msg = data.msg;
            if(msg.result==1)
                var skillID = testData.team1.skill;
            else
                var skillID = testData.team2.skill;
            self.skillResult[skillID] = (self.skillResult[skillID] || 0) + 1
            self.testOneSkill();
        })
    }



    //测试动画
    public testVideo(){
        EM.addEventListener(GameEvent.client.pk_end,this._testVideo,this);
        this._testVideo();
    }

    private _testVideo(){
        this.testCard(this.randomCard(),this.randomCard(),function(a,b){
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,b);
            PKMainUI.getInstance().show(null,true);
            setTimeout(function(){
                PKManager.getInstance().pkAward = {};
            },1000*10)
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

    public monsterLevel(){
        for(var i=1;i<=25;i++)
        {
            var list = MonsterVO.getListByLevel(i,true);
            console.log('=============================    ' + i)
            for(var j=0;j<list.length;j++)
            {
                console.log('    ' + list[j].id + ':' + list[j].name)
            }
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

            var key = 'test';//_get['test']
            PKManager.getInstance().onPK(key,msg) ;
            PKMainUI.getInstance().show(null);

            return;

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

    //根据动画再请求一次服务器数据
    public recallPK(videoData){
        var dataIn:any = {}
        var teamBase = videoData.team1base
        dataIn.team1 = {"list":teamBase.list,"fight":teamBase.f + (videoData.isequal?Config.equalValue:0),"tec":{}}
        dataIn.team1.leader = teamBase.ld
        for(var i=0;i<teamBase.list.length;i++)
        {
            var mid = teamBase.list[i];
            dataIn.team1.tec[mid] = UM.getTecAdd('monster',teamBase.mb[mid].lv);
        }


        var teamBase = videoData.team2base
        dataIn.team2 = {"list":teamBase.list,"fight":teamBase.f + (videoData.isequal?Config.equalValue:0),"tec":{}}
        dataIn.team2.leader = teamBase.ld
        for(var i=0;i<teamBase.list.length;i++)
        {
            var mid = teamBase.list[i];
            dataIn.team2.tec[mid] = UM.getTecAdd('monster',teamBase.mb[mid].lv);
        }

        Net.send('test',dataIn,function(data) {
            var msg = data.msg;
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,msg);
            PKMainUI.getInstance().show(null,true)
        })
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

            useObj[vo.mapMV].push(vo.id + '_')
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

    public getGuessList(begin = 1){
        var arr = []
        //begin = (begin - 1) * 100
        //for(var i=0;i<begin;i++)
        //{
        //    arr.push(0);
        //}
        this.MML = begin
        var key = 'guess_card_' + TM.now();
        var self = this;
        Net.getInstance().outPut = false;
        var testOne = function(){
            if(arr.length >= 100)
            {
                for(var i=0;i<arr.length;i++)
                {
                    arr[i] = 'array('+arr[i].join(',')+')';
                }
                SharedObjectManager.instance.setMyValue(key + '_' + self.MML,'array('+arr.join(',')+')');


                self.MML ++;
                arr = []
                if(self.MML > 30)
                {
                    console.log('Done!' + (self.MML - 1))
                    Net.getInstance().outPut = true;
                    return;
                }
            }

            self.testOneCard(2048,null,function(card){
                arr.push(card)
                console.log(arr.length)
                SharedObjectManager.instance.setMyValue(key + '_' + self.MML,arr);
                testOne();
            })
        }
        testOne();
    }

    private getGuessLevel(num){
        var value = 0;
        for(var i=0;i<100;i++)
        {
            var temp = Math.min(100,i*10 + 20)
            if(num < value + temp)
                return i+1;
            value += temp;
        }
    }


    public showMainList(arr){
        for(var i=0;i<10;i++)
        {
            console.log(i,arr.slice(i*100,(i+1)*100).join('|'));
        }
    }

    public getMainList(begin = 0){
        var arr = []
        for(var i=0;i<begin;i++)
        {
            arr.push(0);
        }
        var key = '_main_card_' + TM.now();
        var self = this;
        Net.getInstance().outPut = false;
        var testOne = function(){
            self.MML = self.getLevel(arr.length);
            //self.MML = Math.floor(arr.length/100) +1
            if(self.MML > 30)
            {
                console.log('Done!')
                //for(var i=0;i<arr.length;i++)
                //{
                //    arr[i] = 'array('+arr[i].join(',')+')';
                //}
                //SharedObjectManager.instance.setMyValue(key,'array('+arr.join(',')+')');
                Net.getInstance().outPut = true;
                return;
            }
            self.testOneCard(Math.min(arr.length*32,2048),null,function(card){
                arr.push(card)
                console.log(arr.length)
                SharedObjectManager.instance.setMyValue(key,arr);
                testOne();
            })
        }
        testOne();
    }

    private getLevel(num){
        var value = 0;
        for(var i=1;i<100;i++)
        {
            var temp = Math.floor((Math.pow(i,1.65) - Math.pow(i-1,1.65))*5)
            if(num < value + temp)
                return i;
            value += temp;
        }
    }


    ////////////////////////////////////评分
    public scoreDM = [];
    public testScore(times=2048){
        for(var i=0;i<5;i++)
        {
            var dm = new DebugManager();
            dm.testAllCard(times,null,(i+1) + '');
            this.scoreDM.push(dm);
        }
    }

    public stopScore(){
        var monsterObj = {}
        for(var i=0;i<this.scoreDM.length;i++)
        {
            var dm = this.scoreDM[i];
            var arr = dm.showWinCard();
            for(var j=0;j<arr.length;j++)
            {
                var oo = arr[j];
                if(!monsterObj[oo.id])
                {
                    var mvo = MonsterVO.getObject(oo.id);
                    monsterObj[oo.id] = {id:oo.id,cost:mvo.cost,lv:mvo.level,name:mvo.name,score:0,list:[]};
                }
                monsterObj[oo.id].list.push(j+1);
                //console.log((i + 1) +  ' \tid:' + oo.id + '\t 总数:\t' + oo.num + '\t 场数:\t' + oo.num2 + '\t 花费:\t' + mvo.cost + '\t lv:\t' + mvo.level + '\t  ' + mvo.name)
            }
            dm.stop = 100;//强行结束
        }

        var resultArr = [];
        for(var s in monsterObj)
        {
             var item = monsterObj[s];
            item.list.sort(sortNumber);
            for(var i=1;i<item.list.length-1;i++) //去掉最高最低
            {
                item.score += item.list[i];
            }
            resultArr.push(item);
        }
        ArrayUtil.sortByField(resultArr,['score','cost'],[0,0])
        console.log('======================  scoreResult   =========================')
        for(var i=0;i<resultArr.length;i++)
        {
            var item = resultArr[i];
            console.log((i + 1) +  ' \tid:' + item.id + '\t 分数:\t' + item.score + '\t 排名:\t' + item.list.join(',')  + '\t 花费:\t' + item.cost + '\t lv:\t' + item.lv + '\t  ' + item.name)
        }

        this.scoreDM.length = 0;
        function sortNumber(a,b)
        {
            return a - b
        }
    }

    public showMainLevel(page){
        CM.loadCache('main_game'+page+'_json',function(){
            for(var i=0;i<100;i++)
            {
                var level = (page-1)*100 + i + 1;
                var data = MainGameVO.getObject(level).list
                var temp = [];
                for(var j=0;j<data.length;j++)
                {
                    temp.push(MonsterVO.getObject(data[j]).name);
                }
                console.log(level + ':' + temp.join(','))
            }
        })
    }

}

//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')