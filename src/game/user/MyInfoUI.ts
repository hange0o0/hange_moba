class MyInfoUI extends game.BaseUI {
    private static instance:MyInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MyInfoUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private headGroup: eui.Group;
    private headMC: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private headBtn: eui.Button;
    private noteBtn: eui.Button;
    private noteRed: eui.Image;
    private honorBtn: eui.Button;
    private honorRed: eui.Image;
    private monsterList: eui.List;
    private list: eui.List;


    private dataIn;





    public constructor() {
        super();
        this.skinName = "MyInfoUISkin";
    }



    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('个人信息')
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.noteBtn, this.onChangeWord);

        this.addBtnEvent(this.headBtn, this.onHead);
        this.addBtnEvent(this.honorBtn, this.onHonor);


        this.monsterList.itemRenderer = EnemyHeadItem;
        this.list.itemRenderer = MyInfoItem;

    }

    private onHonor(){
        HonorUI.getInstance().show();
    }


    private renewHonorRed(){
        if(UM.honor.monster)
        {
            for(var s in UM.honor.monster)
            {
                var oo = UM.honor.monster[s]
                var awardLevel = oo.a || 0; //已领奖的等级
                if(awardLevel == 5)
                    continue;
                var num = HonorManager.getInstance().awardBase[awardLevel + 1].num
                if(oo.w >= num)
                {
                    this.honorRed.visible =  true;
                    return
                }
            }
            this.honorRed.visible =  false;
        }
        else
            this.honorRed.visible =  UM.honor.isred;
    }

    public beforeHide(){
        this.clearList([this.list,this.monsterList])
    }


    private renewList(){
        var oo:any;
         var list = [];

        oo = {title:'玩家等级',icon:'icon_lv_png',des: 'LV.' + UM.level + '　[经验:]'+UM.exp + ' / ' + UM.next_exp+''}
        list.push(oo)


        oo = {title:'体力回满时间',icon:'icon_pve_png',des: ''}
        oo.onTimer = function(){
            var cd = UM.getNextEnergyCD();
            if(UM.energy.v  >= UM.maxEnergy)
            {
                return '体力已满'
            }
            else
            {
                cd +=    (UM.maxEnergy -UM.energy.v - 1) * UM.getEnergyStep()
                return  DateUtil.getStringBySecond(cd) + ' 后满体力';
            }
        }
        list.push(oo)


        oo = {title:'总战力',icon:'icon_power_png',des: (UM.award_force + UM.tec_force)}
        list.push(oo)

        oo = {title:'卡兵战力',icon:'icon_power_png',des:UM.tec_force}
        oo.fun = function(){CollectUI.getInstance().show();}
        list.push(oo)

        //oo = {title:'等级战力',icon:'icon_power_png',des:UM.getLevelForce()}
        //oo.fun = function(){Alert('玩家升级可提升等级战力，赶快去战斗吧')}
        //list.push(oo)

        oo = {title:'奖励战力',icon:'icon_power_png',des:UM.award_force}
        oo.fun = function(){Alert('低战通关卡士公公，参与研究院活动，节日活动中都有可能获得')}
        list.push(oo)




        var mainData = UM.main_game;
        var level:any = mainData.level;
        var nextLevel = MainGameManager.getInstance().getNextStep();

        oo = {title:'职业称号',icon:'icon_main_png',des: MainGameManager.getInstance().getStepName(level) + '　[评分:]'+level +'/'+nextLevel+''}
        if (level < MainGameManager.getInstance().maxLevel)
            oo.fun = function(){MainGameUI.getInstance().show()}
        list.push(oo)
        oo = {title:'获得通关战力',icon:'icon_main_png',des: mainData.award_force + ''}
        list.push(oo)

        var myData = UM.day_game;
        oo = {title:'研究院进度',icon:'icon_day_png',des: myData.level + '/10'}
        if(myData.level < 10 && UM.main_game.level >= Config.dayLevel)
            oo.fun = function(){DayGameUI.getInstance().show()}
        list.push(oo)

        oo = {title:'10胜通关次数',icon:'icon_day_png',des: myData.times + '次'}
        list.push(oo)

        oo = {title:'获得研究战力',icon:'icon_day_png',des: myData.score + ''}
        list.push(oo)


        oo = {title:'到达最高据点',icon:'icon_map_png',des: '第'+(MapData.getInstance().maxLevel)+'据点'}
        if(UM.main_game.level >= Config.mapLevel)
            oo.fun = function(){MapMainUI.getInstance().show()}
        list.push(oo)

        var serverData = UM.server_game;
        level = ServerGameManager.getInstance().getPKTableLevel(serverData.exp)

        oo = {title:'竞技场段位',icon:'icon_pvp_2_png',des: ServerGameManager.getInstance().getStepName(serverData.exp) + '　[积分:]'+serverData.exp +'/'+ServerGameManager.getInstance().getPKTableExp(level + 1)+''}
        if(UM.main_game.level >= Config.serverLevel)
            oo.fun = function(){ServerGameUI.getInstance().show()}
        list.push(oo)

        oo = {title:'历史最高积分',icon:'icon_pvp_2_png',des: serverData.top + '分'}
        list.push(oo)

        oo = {title:'胜利次数',icon:'icon_pvp_2_png',des: serverData.win + '次'}
        list.push(oo)

        oo = {title:'挑战次数',icon:'icon_pvp_2_png',des: serverData.total + '次'}
        list.push(oo)

        var serverData = UM.server_game_equal;
        level = ServerGameEqualManager.getInstance().getPKTableLevel(serverData.exp)

        oo = {title:'修正场评价',icon:'icon_pvp_3_png',des: ServerGameEqualManager.getInstance().getStepName(serverData.exp) + '　[评分:]'+serverData.exp +'/'+ServerGameEqualManager.getInstance().getPKTableExp(level + 1)+''}
        if(UM.main_game.level >= Config.serverEqualLevel)
            oo.fun = function(){ServerGameUI.getInstance().show()}
        list.push(oo)

        oo = {title:'历史最高评分',icon:'icon_pvp_3_png',des: serverData.top + '分'}
        list.push(oo)

        oo = {title:'胜利次数',icon:'icon_pvp_3_png',des: serverData.win + '次'}
        list.push(oo)

        oo = {title:'挑战次数',icon:'icon_pvp_3_png',des: serverData.total + '次'}
        list.push(oo)

        oo = {title:'最高连胜',icon:'icon_pvp_3_png',des: serverData.max + '次'  + (serverData.last? '　[当前:]' + serverData.last + '次':'')}
        list.push(oo)

        oo = {title:'最近一次登陆',icon:'icon_server_png',des: DateUtil.formatDate('yy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(UM.last_land))}
        list.push(oo)

        oo = {title:'本次游戏时长',icon:'icon_server_png',des: ''}
        oo.onTimer = function(){
            return DateUtil.getStringBySecond(Math.floor(egret.getTimer()/1000))
        }
        list.push(oo)

        this.list.dataProvider = new eui.ArrayCollection(list);
    }


    private onChangeWord(){
        UserChangeWordUI.getInstance().show();
    }


    private onHead(){
        var self = this;
        ChangeHeadUI.getInstance().show(UM.head,false,function(id){
            if(id != UM.head)
            {
                Confirm('确定花费100钻石改变头像吗？',function(v){
                     if(v == 1)
                     {
                         if(!UM.testDiamond(100))
                         {
                             return;
                         }
                         FriendManager.getInstance().changeHead(id,function(){
                             ChangeHeadUI.getInstance().hide();
                         })
                     }
                })
            }
            else
                ChangeHeadUI.getInstance().hide();
        });
    }

    private onAddForce(){
        CollectUI.getInstance().show();
    }
    private onAddCoin(){
        ShopUI.getInstance().show('coin');
    }
    private onAddDiamon(){
        ShopUI.getInstance().show('diamond');
    }
    private onAddEnergy(){
        ShopUI.getInstance().show('energy');
    }
    private onAddCard(){
        ShopUI.getInstance().show('card');
    }

    private onTimer(){
        if(!this.stage)
            return;
        var len = this.list.numChildren
        for(var i=0;i<len;i++)
        {
            var item:any = this.list.getChildAt(i)
            item.onTimer();
        }
    }




    public hide(){
        TaskManager.getInstance().cleanNowAcrion('honor');
        super.hide();
    }
    public show(v?){
        this.dataIn = v
        super.show();
    }

    public onShow(){
        this.scroller.viewport.scrollV = 0;
        this.renew();
        this.onTimer();
        this.renewHonorRed();

        this.addPanelOpenEvent(egret.TimerEvent.TIMER,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.energy_change,this.renew);
        this.addPanelOpenEvent(GameEvent.client.change_head,this.renew);
        this.addPanelOpenEvent(GameEvent.client.word_change,this.renew);
        this.addPanelOpenEvent(GameEvent.client.honor_change,this.renewHonorRed);

        if(TaskManager.getInstance().nowAction == 'honor')
        {
            TaskManager.getInstance().showGuideMC(this.honorBtn)
        }
    }

    public renew(){

        this.headMC.source = MyTool.getHeadUrl(UM.head);

        if(UM.word)
        {
            this.desText.text =  '　　' + UM.word;
            this.noteRed.visible = false
        }
        else
        {
            this.setHtml(this.desText,this.createHtml('　　你还没编辑过宣言呢~',0xAAAAAA))
            this.noteRed.visible = true
        }

        this.setText(this.nameText,'['+UM.nick+'] ' + this.createHtml('　(ID：' + UM.gameid + ')',undefined,24));

        this.renewList()

        var specialData = {

        };
        var arr =  UM.getCommonUse(UM.pk_common.history);
        for(var i=0;i<arr.length;i++){
            arr[i] = {
                vo: MonsterVO.getObject(arr[i].id),
                type: 1,

                id: arr[i].id,
                specialData: specialData,

                index: i,
                list:arr
            }
        }
        this.monsterList.dataProvider = new eui.ArrayCollection(arr)

    }

    private setText(text,str){
        str = this.changeValue(str);
        this.setHtml(text,str);
    }

    private changeValue(str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        return str;
    }
}