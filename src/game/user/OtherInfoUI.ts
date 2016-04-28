class OtherInfoUI extends game.BaseUI {
    private static instance:OtherInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new OtherInfoUI();
        return this.instance;
    }

    private topUI: TopUI;
    private scrollGroup: eui.Group;
    private headMC: eui.Image;
    private nameText: eui.Label;
    private friendBtn: eui.Button;
    private talkBtn: eui.Button;
    private deleteBtn: eui.Button;
    private pkBtn: eui.Button;
    private friendGroup: eui.Group;
    private friendText: eui.Label;
    private friendWin: eui.Label;
    private friendFail: eui.Label;
    private levelText: eui.Label;
    private forceText: eui.Label;
    private mainGameText: eui.Label;
    private serverLevelText: eui.Label;
    private serverScroeText: eui.Label;
    private serverRateText: eui.Label;
    private serverEqualText: eui.Label;
    private serverEqualScoreText: eui.Label;
    private serverEqualRateText: eui.Label;
    private serverEqualWinText: eui.Label;
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
        var self = this;
        FriendManager.getInstance().apply(this.dataIn.gameid,function(){
            self.friendBtn.visible = false;
        })
    }

    public showID(id){
        var FM = FriendManager.getInstance();
        var self = this;
        FM.getOtherInfoByID(id,function(){
            self.show(FM.otherInfo[id]);
        })
    }

    public showNick(nick){
        var FM = FriendManager.getInstance();
        var self = this;
        FM.getOtherInfoByNick(nick,function(){
            self.show(FM.otherInfoNick[nick]);
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

            var rate = (win/((win + fail) || 1)*100).toFixed(2);
            this.friendWin.text = '胜利：' + win
            this.friendFail.text = '失败：' + fail
            this.friendText.text = '好友PK：(胜率：'+rate+'%)'
        }
        else
        {
            this.talkBtn.visible = false;
            this.pkBtn.visible = false;
            this.deleteBtn.visible = false;
            this.friendBtn.visible = true;
        }


        this.headMC.source = MyTool.getHeadUrl(dataIn.head);
        this.nameText.text = dataIn.nick;
        this.levelText.text = '等级：LV.' + dataIn.level;
        this.forceText.text = '战力：' + dataIn.force;

        this.mainGameText.text = '试练场等级：' + dataIn.main_game.level;

        this.serverLevelText.text = '竞技场等级：' + ServerGameManager.getInstance().getPKTableLevel(dataIn.server_game.exp);
        this.serverScroeText.text = '积分：' + dataIn.server_game.exp
        this.serverRateText.text = '胜率：' + (dataIn.server_game.win/(dataIn.server_game.total || 1)*100).toFixed(2) + '%';

        this.serverEqualText.text = '竞技场等级：' + ServerGameManager.getInstance().getPKTableLevel(dataIn.server_game_equal.exp);
        this.serverEqualScoreText.text = '积分：' + dataIn.server_game_equal.exp
        this.serverEqualRateText.text = '胜率：' + (dataIn.server_game_equal.win/(dataIn.server_game_equal.total || 1)*100).toFixed(2) + '%';
        this.serverEqualWinText.text = '最高连胜：' + dataIn.server_game_equal.max;


        var specialData = {
            isBase:true
        };

        var history = [];
        if(dataIn.pk_common)
            history  = dataIn.pk_common.history;
        var arr =  MyTool.getCommonUse(history);
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
}