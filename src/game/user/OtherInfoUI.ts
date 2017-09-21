class OtherInfoUI extends game.BaseUI {
    private static instance:OtherInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new OtherInfoUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private topGroup: eui.Group;
    private headMC: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private landText: eui.Label;
    private friendDesText: eui.Label;
    private deleteBtn: eui.Button;
    private talkBtn: eui.Button;
    private pkBtn: eui.Button;
    private friendBtn: eui.Button;
    private monsterList: eui.List;
    private list: eui.List;










    private dataIn;
    public constructor() {
        super();
        this.skinName = "OtherInfoUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('他人信息')
        this.topUI.addEventListener('hide',this.hide,this);

        this.addBtnEvent(this.friendBtn, this.onFriend);
        this.addBtnEvent(this.talkBtn, this.onTalk);
        this.addBtnEvent(this.pkBtn, this.onPK);
        this.addBtnEvent(this.deleteBtn, this.onDelete);

        this.monsterList.itemRenderer = EnemyHeadItem;
        this.list.itemRenderer = MyInfoItem;
    }

    public beforeHide(){
        this.clearList([this.list,this.monsterList])
    }


    private onDelete(){
        var self = this;
        Confirm('确定删除该好友吗？',function(b){
            if(b == 1)
            {
                FriendManager.getInstance().delete(self.dataIn.gameid,function(){
                    self.renew();
                })
            }
        })
    }
    private onTalk(){
       FriendTalkUI.getInstance().show(this.dataIn.gameid);
    }
    private onPK(){
        FriendManager.getInstance().showPKUI(this.dataIn.gameid)
    }
    private onFriend(){
        if(UM.level < Config.friendLevel)
        {
            Alert('努力升到'+Config.friendLevel+'级，就可以加Ta为好友哦~')
            return;
        }
        if(this.dataIn.friends.stop)
        {
            Alert('对方设置了拒绝添加好友')
            return;
        }
        var self = this;
        FriendManager.getInstance().apply(this.dataIn.gameid,function(){
            self.friendBtn.visible = false;
            self.friendDesText.text = '已发出好友请求'
        })
    }

    public showID(id,stopAlert?){
        if(id == UM.gameid)
        {
            MyInfoUI.getInstance().show();
            return;
        }
        var FM = FriendManager.getInstance();
        var self = this;
        FM.getOtherInfoByID(id,function(){
            self.show(FM.otherInfo[id]);
        },stopAlert)
    }

    public showNick(nick){
        var FM = FriendManager.getInstance();
        var self = this;
            self.show(FM.otherInfoNick[nick]);
        FM.getOtherInfoByNick(nick,function(){
        })

    }

    public show(data?){
        this.dataIn = data;
        var FM = FriendManager.getInstance();
        if(FM.friendList)
            super.show();
        else
        {
            var self = this;
            FM.getList(function(){
                self.superShow()
            })
        }
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.scroller.viewport.scrollV = 0;
        this.renew();
    }

    private renewList(){
        var dataIn = this.dataIn
        var oo:any;
        var list = [];
        var FM = FriendManager.getInstance();
        if(FM.friendData[dataIn.gameid])//是好友
        {
            var info = FM.friendData[dataIn.gameid].pk;
            var win =0;
            var fail =0;
            if(info)
            {
                if(info.friend_key.indexOf(UM.gameid) == 0)
                {
                    win = Math.floor(info.win1);
                    fail = Math.floor(info.win2);
                }
                else
                {
                    win = Math.floor(info.win2);
                    fail = Math.floor(info.win1);
                }
            }
            oo = {title:'好友切磋胜利',icon:'icon_atk_png',des: win + '次'}
            list.push(oo)
            oo = {title:'好友切磋失败',icon:'icon_atk_png',des: fail + '次'}
            list.push(oo)
        }

        oo = {title:'玩家等级',icon:'icon_lv_png',des: 'LV.' + dataIn.level,myValue:UM.level,otherValue:dataIn.level}
        list.push(oo)

        oo = {title:'总战力',icon:'icon_power_png',des: '' + dataIn.force, myValue:UM.getForce(), otherValue:dataIn.force}
        list.push(oo)


        oo = {title:'职业称号',icon:'icon_main_png',des: MainGameManager.getInstance().getStepName(dataIn.main_game.level) + '　[评分:]'+ dataIn.main_game.level+'',
            myValue:UM.main_game.level, otherValue:dataIn.main_game.level}
        list.push(oo)

        if(!dataIn.main_game.award_force)
            dataIn.main_game.award_force = 0
        oo = {title:'获得通关战力',icon:'icon_main_png',des: dataIn.main_game.award_force + '',myValue:UM.main_game.award_force, otherValue:dataIn.main_game.award_force}
        list.push(oo)

        var myData = dataIn.day_game;
        var myData2 = UM.day_game;

        oo = {title:'10胜通关次数',icon:'icon_day_png',des: myData.times + '次',myValue:myData2.times, otherValue:myData.times}
        list.push(oo)

        oo = {title:'获得研究战力',icon:'icon_day_png',des: myData.score + '',myValue:myData2.score, otherValue:myData.score}
        list.push(oo)


        var otherLevel = (dataIn.pk_common.map || {}).max_level || 1;
        oo = {title:'到达最高据点',icon:'icon_map_png',des: '第'+(otherLevel)+'据点',myValue:MapData.getInstance().maxLevel, otherValue:otherLevel}
        list.push(oo)


        var serverData = dataIn.server_game;
        var serverData2 = UM.server_game;
        oo = {title:'竞技场段位',icon:'icon_pvp_2_png',des: ServerGameManager.getInstance().getStepName(serverData.exp) + '　[积分:]'+serverData.exp+'',myValue:serverData2.exp, otherValue:serverData.exp}
        list.push(oo)

        oo = {title:'历史最高积分',icon:'icon_pvp_2_png',des: serverData.top + '分',myValue:serverData2.top, otherValue:serverData.top}
        list.push(oo)

        oo = {title:'胜利次数',icon:'icon_pvp_2_png',des: serverData.win + '次',myValue:serverData2.win, otherValue:serverData.win}
        list.push(oo)

        oo = {title:'胜率',icon:'icon_pvp_2_png',des: MyTool.toFixed(serverData.win/(serverData.total||1)*100,1) + '%',isRate:true,myValue:serverData2.win/(serverData2.total||1), otherValue:serverData.win/(serverData.total||1)}
        list.push(oo)


        var serverData = dataIn.server_game_equal;
        serverData2 = UM.server_game_equal;

        oo = {title:'修正场评价',icon:'icon_pvp_3_png',des: ServerGameEqualManager.getInstance().getStepName(serverData.exp) + '　[评分:]'+serverData.exp+'',myValue:serverData2.exp, otherValue:serverData.exp}
        list.push(oo)

        oo = {title:'历史最高评分',icon:'icon_pvp_3_png',des: serverData.top + '分',myValue:serverData2.top, otherValue:serverData.top}
        list.push(oo)

        oo = {title:'胜利次数',icon:'icon_pvp_3_png',des: serverData.win + '次',myValue:serverData2.win, otherValue:serverData.win}
        list.push(oo)

        oo = {title:'胜率',icon:'icon_pvp_3_png',des: MyTool.toFixed(serverData.win/(serverData.total||1)*100,1) + '%',isRate:true,myValue:serverData2.win/(serverData2.total||1), otherValue:serverData.win/(serverData.total||1)}
        list.push(oo)

        oo = {title:'最高连胜',icon:'icon_pvp_3_png',des: serverData.max + '次',myValue:serverData2.max, otherValue:serverData.max}
        list.push(oo)

        this.list.dataProvider = new eui.ArrayCollection(list)
    }

    private renew(){
       var dataIn = this.dataIn

        var FM = FriendManager.getInstance();
        this.friendDesText.text = ''
        if(FM.friendData[this.dataIn.gameid])//是好友
        {
            this.friendBtn.visible = false;
            this.talkBtn.visible = true;
            this.pkBtn.visible = true;
            this.deleteBtn.visible = true;
        }
        else
        {
            this.talkBtn.visible = false;
            this.pkBtn.visible = false;
            this.deleteBtn.visible = false;
            this.friendBtn.visible =  this.dataIn.level >= Config.friendLevel;
            if(!this.friendBtn.visible)
                this.friendDesText.text = '对方等级过低，无法审请好友'
        }


        this.headMC.source = MyTool.getHeadUrl(dataIn.head);
        this.nameText.text = dataIn.nick;
        this.desText.text = '　　' + (dataIn.word || '我无话可说..');

        this.renewList();


        var cd = Math.floor((TM.now() - dataIn.last_land)/(24*3600));
        if(cd >=7)
        {
            this.setHtml(this.landText,'该玩家已超过 <font color="#FF0000">'+7+'</font> 天没登录');
            //this.topGroup.height = 300;
        }
        else
        {
            this.landText.text = '';
            //this.topGroup.height = 260;
        }



        var specialData = {
            isOther:true,
            isBase:true
        };

        var history = [];
        if(dataIn.pk_common)
            history  = dataIn.pk_common.history;
        var arr =  UM.getCommonUse(history);
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

    //private setText(text,str,myValue,otherValue,w?){
    //
    //    str = this.changeValue(str,myValue,otherValue,w);
    //    this.setHtml(text,str);
    //}
    //
    //private changeValue(str,myValue,otherValue,w?){
    //    if(myValue > otherValue)
    //    {
    //        str = str.replace('$$','<font color="#FFFF00">'+(w || otherValue)+'</font>')
    //    }
    //    else if(myValue < otherValue)
    //    {
    //        str = str.replace('$$','<font color="#ff0000">'+(w || otherValue)+'</font>')
    //    }
    //    else
    //    {
    //        str = str.replace('$$',(w || otherValue))
    //    }
    //
    //    str = str.replace(/\[/g,'<font color="#E0A44A">')
    //    str = str.replace(/\]/g,'</font>')
    //    return str;
    //}
}