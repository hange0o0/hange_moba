class OtherInfoUI extends game.BaseUI {
    private static instance:OtherInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new OtherInfoUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scrollGroup: eui.Group;
    private topGroup: eui.Group;
    private headMC: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private landText: eui.Label;
    private deleteBtn: eui.Button;
    private talkBtn: eui.Button;
    private pkBtn: eui.Button;
    private friendBtn: eui.Button;
    private friendDesText: eui.Label;
    private levelText: eui.Label;
    private forceText: eui.Label;
    private friendGroup: eui.Group;
    private friendText: eui.Label;
    private friendWin: eui.Label;
    private friendFail: eui.Label;
    private mainLevelText: eui.Label;
    private mainLevelText2: eui.Label;
    private dailyText2: eui.Label;
    private dailyText3: eui.Label;
    private serverText1: eui.Label;
    private serverText2: eui.Label;
    private serverText3: eui.Label;
    private serverText4: eui.Label;
    private serverEqualText1: eui.Label;
    private serverEqualText2: eui.Label;
    private serverEqualText3: eui.Label;
    private serverEqualText5: eui.Label;
    private serverEqualText4: eui.Label;
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

        this.list.itemRenderer = EnemyHeadItem;
    }

    public beforeHide(){
        this.clearList([this.list])
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

        this.renew();
    }

    private renew(){
       var dataIn = this.dataIn

        var FM = FriendManager.getInstance();
        MyTool.removeMC(this.friendGroup)
        this.friendDesText.text = ''
        if(FM.friendData[this.dataIn.gameid])//是好友
        {
            this.friendBtn.visible = false;
            this.talkBtn.visible = true;
            this.pkBtn.visible = true;
            this.deleteBtn.visible = true;
            this.scrollGroup.addChildAt(this.friendGroup,1);
            var info = FM.friendData[this.dataIn.gameid].pk;
            var win =0;
            var fail =0;
            if(info)
            {
                if(info.friend_key.indexOf(this.dataIn.gameid) == 0)
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

            var rate = MyTool.toFixed(win/((win + fail) || 1)*100,1);
            MyTool.setColorText(this.friendWin,'[胜利：]' + win);
            MyTool.setColorText(this.friendFail,'[失败：]' + fail)
            MyTool.setColorText(this.friendText,'[胜率：]'+rate+'%')
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
        this.setText(this.levelText, '[等级：]$$','LV.'+ UM.level,'LV.'+ dataIn.level);
        this.setText(this.forceText, '[战力：]$$',UM.getForce(),dataIn.force);


        this.setText(this.mainLevelText,'[当前称号：]$$',UM.main_game.level ,dataIn.main_game.level,MainGameManager.getInstance().getStepName(dataIn.main_game.level));
        this.setText(this.mainLevelText2,'  [评分：]$$',UM.main_game.level ,dataIn.main_game.level)


        var myData = dataIn.day_game;
        var myData2 = UM.day_game;
        this.setText(this.dailyText2, '[累计通关次数：]$$',myData2.times,myData.times);
        this.setText(this.dailyText3, '[获得研究积分：]$$',myData2.score, myData.score);

        var serverData = dataIn.server_game;
        var serverData2 = UM.server_game;
        var level = ServerGameManager.getInstance().getPKTableLevel(serverData.exp)
        var level2 = ServerGameManager.getInstance().getPKTableLevel(serverData2.exp)
        this.setHtml(this.serverText1,this.changeValue('[积分：]$$',serverData2.exp,serverData.exp) + this.changeValue('（[历史最高]：$$）',serverData2.top,serverData.top));
        this.setText(this.serverText2, '[当前段位：]$$',level2,level,ServerGameManager.getInstance().getStepName(serverData.exp));
        this.setText(this.serverText3, '[胜利次数：]$$',serverData2.win,serverData.win);
        this.setText(this.serverText4, '[胜率：]$$', MyTool.toFixed(serverData2.win/(serverData2.total||1)*100,1) + '%', MyTool.toFixed(serverData.win/(serverData.total||1)*100,1) + '%');


        var serverData = dataIn.server_game_equal;
        serverData2 = UM.server_game_equal;
        level = ServerGameEqualManager.getInstance().getPKTableLevel(serverData.exp)
        level2 = ServerGameEqualManager.getInstance().getPKTableLevel(serverData2.exp)

        this.setHtml(this.serverEqualText1,this.changeValue('[评分：]$$',serverData2.exp,serverData.exp) + this.changeValue('（[历史最高]：$$）',serverData2.top,serverData.top));
        this.setText(this.serverEqualText2, '[天赋等级：]$$',level2,level,ServerGameEqualManager.getInstance().getStepName(serverData.exp));
        this.setText(this.serverEqualText3,  '[胜利次数：]$$',serverData2.win,serverData.win);
        this.setText(this.serverEqualText4, '[胜率：]$$',MyTool.toFixed(serverData2.win/(serverData2.total||1)*100,1) + '%',MyTool.toFixed(serverData.win/(serverData.total||1)*100,1) + '%');
        this.setText(this.serverEqualText5, '[最高连胜：]$$',serverData2.max,serverData.max);




        var cd = Math.floor((TM.now() - dataIn.last_land)/(24*3600));
        if(cd >=7)
        {
            this.setHtml(this.landText,'该玩家已超过 <font color="#FF0000">'+cd+'</font> 天没登录');
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
        this.list.dataProvider = new eui.ArrayCollection(arr)


    }

    private setText(text,str,myValue,otherValue,w?){

        str = this.changeValue(str,myValue,otherValue,w);
        this.setHtml(text,str);
    }

    private changeValue(str,myValue,otherValue,w?){
        if(myValue > otherValue)
        {
            str = str.replace('$$','<font color="#FFFF00">'+(w || otherValue)+'</font>')
        }
        else if(myValue < otherValue)
        {
            str = str.replace('$$','<font color="#ff0000">'+(w || otherValue)+'</font>')
        }
        else
        {
            str = str.replace('$$',(w || otherValue))
        }

        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        return str;
    }
}