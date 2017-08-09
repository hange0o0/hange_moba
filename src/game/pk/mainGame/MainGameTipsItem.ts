class MainGameTipsItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainGameTipsItemSkin";
    }

    private enemyList: eui.List;
    private titleBG: eui.Rect;
    private titleText: eui.Label;
    private resultText: eui.Label;
    private videoBtn: eui.Button;







    public index;
    private gameid
    private list

    public childrenCreated() {
        //MyTool.addTestBlock(this);
        this.addBtnEvent(this.videoBtn,this.onClick);
        this.addBtnEvent(this.resultText,this.onNickClick);

        this.enemyList.itemRenderer = EnemyHeadItem

        //this.teamInfo1.touchChildren =  this.teamInfo1.touchEnabled = false
        //this.teamInfo2.touchChildren =  this.teamInfo2.touchEnabled = false
        //this.addEventListener(PKResultItem3.VIEW_EVENT,this.onMonsterClick,this)
    }



    private onNickClick(e){
        e.stopImmediatePropagation();
        if(this.gameid != UM.gameid)
            OtherInfoUI.getInstance().showID(this.gameid);
    }


    private onClick(){
        PKDressUI.getInstance().changeChooseList(this.list)
        ShowTips('已复制到你的出战布阵中')
    }

    public dataChanged() {
        var data = JSON.parse(this.data.data);
        this.gameid = data.gameid;
        var nick = Base64.decode(data.nick);
        var teamData =  data.pkdata;
        var ok = true;

        MyTool.setColorText(this.resultText,'本布阵由 ['+nick+'] 提供');
        var myForce = UM.getForce()
        this.titleText.text = '通关战力：' + teamData.force + '('+myForce+')';
        if(myForce > teamData.force)
            this.titleBG.fillColor = 0x4F2900
        else if(myForce < teamData.force)
            this.titleBG.fillColor = 0x0F243A
        else
            this.titleBG.fillColor = 0x300000

        var myCard = UM.getMyCard();
        var myCardObj = {};
        this.list = teamData.list;
        for(var i=0;i<myCard.list.length;i++) {
            myCardObj[myCard.list[i]] = true;
        }

        var arr = [];
        for(var i=0;i<teamData.list.length;i++)
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
                 list:arr
             })

            if(!myCardObj[id])
                ok = false;
        }

        this.enemyList.dataProvider = new eui.ArrayCollection(arr);
        if(arr.length <4)
        {
            (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 0;
            (<eui.TileLayout>this.enemyList.layout).requestedRowCount = 1
        }
        else
        {
            (<eui.TileLayout>this.enemyList.layout).requestedRowCount = 2;
            if(arr.length ==4)
                (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 2
            else
                (<eui.TileLayout>this.enemyList.layout).requestedColumnCount = 3
        }

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
