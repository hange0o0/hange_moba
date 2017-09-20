class MainGameTipsItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainGameTipsItemSkin";
    }

    private enemyList: eui.List;
    private titleBG: eui.Rect;
    private titleText: eui.Label;
    private leaderText: eui.Label;
    private resultText: eui.Label;
    private videoBtn: eui.Button;
    private playBtn: eui.Button;
    private skillGroup: eui.Group;
    private img: eui.Image;










    public index;
    private gameid
    private list
    private skillID

    private videoResult = {};

    public childrenCreated() {
        //MyTool.addTestBlock(this);
        this.addBtnEvent(this.videoBtn,this.onClick);
        this.addBtnEvent(this.playBtn,this.onPlay);
        this.addBtnEvent(this.resultText,this.onNickClick);
        this.addBtnEvent(this.skillGroup,this.onSkillClick);

        this.enemyList.itemRenderer = MainGameTipsHeadItem

        //this.teamInfo1.touchChildren =  this.teamInfo1.touchEnabled = false
        //this.teamInfo2.touchChildren =  this.teamInfo2.touchEnabled = false
        //this.addEventListener(PKResultItem3.VIEW_EVENT,this.onMonsterClick,this)
    }

    private onPlay(){
        var self = this;
        var data = JSON.parse(this.data.data);
        var teamData =  data.pkdata;
        var key = md5.incode(JSON.stringify(teamData))
        if(this.videoResult[key])
        {
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,this.videoResult[key]) ;
            PKMainUI.getInstance().show(null);
            return;
        }
        MainGameManager.getInstance().getPlayResult(teamData,(msg)=>{
            self.videoResult[key] = msg;
            msg.info = {type:PKManager.PKType.MAIN};
            PKManager.getInstance().onPK(PKManager.PKType.REPLAY,msg) ;
            PKMainUI.getInstance().show(null);
        })
    }

    private onSkillClick(){
         LeaderSkillInfoUI.getInstance().show(this.skillID);
    }

    private onNickClick(e){
        e.stopImmediatePropagation();
        if(this.gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(this.gameid);
    }


    private onClick(){
        PKDressUI.getInstance().changeChooseList(this.list)
        MainGameTipsUI.getInstance().hide();
        if(this.skillID && UM.tec.skill.indexOf(this.skillID) != -1 && UM.tec.use_skill != this.skillID)
        {
            LeaderManager.getInstance().skillSet(this.skillID)
        }
        //ShowTips('已复制到你的出战布阵中')
    }

    public dataChanged() {
        var data = JSON.parse(this.data.data);
        this.gameid = data.gameid;
        var nick = Base64.decode(data.nick);
        var teamData =  data.pkdata;
        var ok = true;

        var arr = [];
        var viewList = [];
        this.list = teamData.list;
        if(MainGameTipsUI.getInstance().isDay)
        {
            this.playBtn.visible = false
            this.skillGroup.visible = false
            for(var i=0;i<teamData.list.length;i++)
            {
                var id = teamData.list[i];
                arr.push({
                    vo: MonsterVO.getObject(id),
                    isTeam:true,
                    id: id,
                    index: i,
                    specialData: {isEqual:true},
                    list:viewList
                })
                if(id)
                    viewList.push(arr[i]);
            }
            this.titleText.text = '通关时间：' + DateUtil.formatDate('yyyy-MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time));
        }
        else
        {
            this.playBtn.visible = true;
            var myCard = UM.getMyCard();
            var myCardObj = {};

            for(var i=0;i<myCard.list.length;i++) {
                myCardObj[myCard.list[i]] = true;
            }
            for(var i=0;i<6;i++)
            {
                var id = teamData.list[i];
                arr.push({
                    vo: MonsterVO.getObject(id),
                    isTeam:true,
                    disable:!myCardObj[id],
                    compare:true,
                    id: id,
                    index: i,
                    specialData: {lv:teamData.mlevel[id]},
                    list:viewList
                })

                if(id)
                    viewList.push(arr[i]);
                if(id && !myCardObj[id])
                    ok = false;
            }



            var myForce = UM.getForce()
            var des:any = (myForce - teamData.force)
            var str = '通关战力：' + teamData.force + ' ';
            if(des > 0)
                str += this.createHtml('(+'+des+')',0xCC0000)
            else if(des < 0)
                str += this.createHtml('('+des+')',0x00cc00)
            this.setHtml(this.titleText,str);
            //if(myForce > teamData.force)
            //    this.titleBG.fillColor = 0x4F2900
            //else if(myForce < teamData.force)
            //    this.titleBG.fillColor = 0x0F243A
            //else
            //    this.titleBG.fillColor = 0x300000

            this.leaderText.text = ''
            if(teamData.leader)
            {
                var leaderlist = []
                for(var s in teamData.leader)
                {
                    if(teamData.leader[s])
                    {
                        var str = '+' + teamData.leader[s];
                        switch(s)
                        {
                            case '1':
                                leaderlist.push(this.createHtml('攻',UM.getLeaderWorldColor(1))  + str);
                                break;
                            case '2':
                                leaderlist.push(this.createHtml('血',UM.getLeaderWorldColor(2))  + str);
                                break;
                            case '3':
                                leaderlist.push(this.createHtml('速',UM.getLeaderWorldColor(3))  + str );
                                break;
                        }
                    }
                }
                if(leaderlist.length)
                    this.setHtml(this.leaderText,leaderlist.join(' '))
            }

            if(teamData.skill)
            {
                this.skillID = teamData.skill;
                this.skillGroup.visible = true
                this.img.source = LeaderSkillVO.getObject(teamData.skill).thumb
            }
            else
            {
                this.skillGroup.visible = false
            }
        }




        this.enemyList.dataProvider = new eui.ArrayCollection(arr);
        MyTool.setColorText(this.resultText,'本布阵由 ['+nick+'] 提供');


        if(ok)
        {
            this.videoBtn.skinName = 'Btn_r2Skin'
            this.videoBtn.touchEnabled = true;
        }
        else
        {
            this.videoBtn.skinName = 'Btn_d2Skin'
            this.videoBtn.touchEnabled = false;
        }

    }
}
