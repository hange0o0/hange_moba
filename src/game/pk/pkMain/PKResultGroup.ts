class PKResultGroup extends game.BaseContainer {
    private moreGroup: eui.Group;
    private titleBG: eui.Group;
    private rateBG: eui.Image;
    private rateText: eui.Label;
    private selfList: eui.List;
    private selfText0: eui.Label;
    private selfForceGroup: eui.Group;
    private selfText: eui.Label;
    private enemyList: eui.List;
    private enemyText0: eui.Label;
    private enemyForceGroup: eui.Group;
    private enemyText: eui.Label;
    //private teamInfo1: eui.List;
    //private teamInfo2: eui.List;
    private mvpMC: PKResultMVP;
    private list: eui.List;





    public constructor() {
        super();

    }


    public childrenCreated() {
        super.childrenCreated();
        this.skinName = "PKResultGroupSkin";
        this.list.itemRenderer = PKResultItem2;
        this.enemyList.itemRenderer = PKResultItem3
        this.selfList.itemRenderer = PKResultItem3

        //this.teamInfo1.itemRenderer = PKResultItem4
        //this.teamInfo2.itemRenderer = PKResultItem4
        this.mvpMC.addEventListener('choose_monster',this.onChooseMvpMonster,this)

    }

    private onChooseMvpMonster(e){
        var data = e.data;
        if(data.team == 1)
        {
            var list = this.selfList
            var list2 = this.enemyList
        }
        else
        {
            var list = this.enemyList
            var list2 = this.selfList
        }

        for(var i=0;i<list.numChildren;i++)
        {
            var item:any = list.getChildAt(i);
            if(item.data.index == data.index)
                item.setChoose(1);
            else
                item.setChoose(0);
        }
        for(var i=0;i<list2.numChildren;i++)
        {
            var item:any = list2.getChildAt(i);
            item.setChoose(0);
        }
    }

    //private onMonsterClick(e){
    //    var data = e.data;
    //    if(data.teamID == 1)
    //    {
    //        var myList = this.selfList
    //        var enemyList = this.enemyList
    //    }
    //    else
    //    {
    //        var myList = this.enemyList
    //        var enemyList = this.selfList
    //    }
    //    for(var i=0;i<myList.numChildren;i++)
    //    {
    //        var item:any = myList.getChildAt(i);
    //        if(item.data == data)
    //            item.setChoose(1);
    //        else
    //            item.setChoose(0);
    //    }
    //    for(var i=0;i<enemyList.numChildren;i++)
    //    {
    //        var item:any = enemyList.getChildAt(i);
    //        if(data.kill && data.kill.length > 0 && data.kill.indexOf(i+1) != -1)
    //            item.setChoose(2);
    //        else if(data.die && data.die == i+1)
    //            item.setChoose(3);
    //        else
    //            item.setChoose(0);
    //    }
    //    //console.log(e.data);
    //}




    public beforeHide(){
        this.clearList([this.list,this.enemyList,this.selfList])
    }

    public renew(){
        var PKM = PKManager.getInstance();
        this.list.dataProvider = new eui.ArrayCollection(PKManager.getInstance().pkList);

        if(PKM.teamChange)
        {
            var team1Base = PKM.team2Base
            var team2Base = PKM.team1Base
            var team1ID = 30
            var team2ID = 10
        }
        else
        {
            var team1Base = PKM.team1Base
            var team2Base = PKM.team2Base
            var team1ID = 10
            var team2ID = 30
        }

        var commonAdd = 0
        if(PKM.pkResult.isequal)
        {
            commonAdd =  Config.equalValue
        }

        //var totalData:any = {};
        //var hp = 0;
        //var atk = 0;
        //var speed = 0;
        //var speed2 = 999;
        var info1 = [];
        var info2 = [];


        this.selfText.text = '战力:' +  (Math.floor(team1Base.f) + commonAdd);
        for(var i=0;i<team1Base.list.length;i++)
        {
            var mid = team1Base.list[i]
            var specialData = team1Base.mb[mid];
            var oo = {
                id:mid,
                list:info1,
                specialData:specialData,
                index:i,
                teamID:1,

                //totalData:totalData,
                level:team1Base.mb[mid].lv,
                win: PKM.winCount[i+team1ID],
                die: PKM.die[i+team1ID],
                kill: PKM.kill[i+team1ID],
                action: PKM.action[i+team1ID]
            }
            info1.push(oo)

            //hp = Math.max(specialData.hp,hp)
            //atk = Math.max(specialData.atk,atk)
            //speed = Math.max(specialData.speed,speed)
            //speed2 = Math.min(specialData.speed,speed2)
        }


        this.enemyText.text = '战力:' +  (Math.floor(team2Base.f) + commonAdd);;
        for(var i=0;i<team2Base.list.length;i++)
        {
            var mid = team2Base.list[i]
            var specialData = team2Base.mb[mid];
            specialData.id = mid;
            specialData.isOther = true;
            var oo = {
                id:mid,
                teamID:2,
                list:info2,
                specialData:specialData,
                index:i,

                //totalData:totalData,
                level:team2Base.mb[mid].lv,
                win: PKM.winCount[i+team2ID],
                die: PKM.die[i+team2ID],
                kill: PKM.kill[i+team2ID],
                action: PKM.action[i+team2ID]
            }
            info2.push(oo)

            //hp = Math.max(specialData.hp,hp)
            //atk = Math.max(specialData.atk,atk)
            //speed = Math.max(specialData.speed,speed)
            //speed2 = Math.min(specialData.speed,speed2)
        }

        //PKM.resetInfoData(info1,info2);
        this.selfList.dataProvider = new eui.ArrayCollection(info1)
        this.enemyList.dataProvider = new eui.ArrayCollection(info2)

        this.selfText.textColor = 0xFFFFFF
        this.enemyText.textColor = 0xFFFFFF
        if(team1Base.f > team2Base.f)
            this.selfText.textColor = 0xffff00
        else if(team1Base.f < team2Base.f)
            this.enemyText.textColor = 0xffff00


        this.rateText.text = Math.max(1,Math.min(100,Math.ceil(PKM.winnerRate*100))) + '';
        if(PKM.isWin)
            this.rateBG.source = 'bar_pvp_2_png'
        else
            this.rateBG.source = 'bar_pvp_1_png'

        var leader1 = [];
        var leader2 = [];
        if(!team2Base.ld)
            team2Base.ld = {}
        if(!team1Base.ld)
            team1Base.ld = {}
        for(var s in team1Base.ld)
        {
            if(team1Base.ld[s])
            {
                var str = team1Base.ld[s] > (team2Base.ld[s] || 0)? this.createHtml('+' + team1Base.ld[s],0xffff00):('+' + team1Base.ld[s])
                switch(s)
                {
                    case '1':
                        leader1.push(this.createHtml('攻',UM.getLeaderWorldColor(1))  + str);
                        break;
                    case '2':
                        leader1.push(this.createHtml('血',UM.getLeaderWorldColor(2))  + str);
                        break;
                    case '3':
                        leader1.push(this.createHtml('速',UM.getLeaderWorldColor(3))  + str);
                        break;
                }
            }
        }
        for(var s in team2Base.ld)
        {
            if(team2Base.ld[s])
            {
                var str = team2Base.ld[s] > (team1Base.ld[s] || 0)? this.createHtml('+' + team2Base.ld[s],0xffff00):('+' + team2Base.ld[s])
                switch(s)
                {
                    case '1':
                        leader2.push(this.createHtml('攻',UM.getLeaderWorldColor(1))  + str);
                        break;
                    case '2':
                        leader2.push(this.createHtml('血',UM.getLeaderWorldColor(2))  + str);
                        break;
                    case '3':
                        leader2.push(this.createHtml('速',UM.getLeaderWorldColor(3))  + str );
                        break;
                }
            }
        }

        if(leader1.length > 0)
        {
            this.setHtml(this.selfText0, leader1.join(' ') );
            this.selfForceGroup.y = 15
        }
        else
        {
            this.selfText0.text = ''
            this.selfForceGroup.y = -5
        }

        if(leader2.length > 0)
        {
            this.setHtml(this.enemyText0, leader2.join(' ') );
            this.enemyForceGroup.y = 15
        }
        else
        {
            this.enemyText0.text = ''
            this.enemyForceGroup.y = -5
        }




        //totalData.hp = hp;
        //totalData.atk = atk;
        //totalData.speed = speed;
        //totalData.speed2 = speed2;

        this.titleBG.scaleY = 1;
        this.rateText.visible = true;
        this.rateText.alpha = 1;

        if(PKM.mvpList)
        {
            this.moreGroup.addChild(this.mvpMC)
            this.moreGroup.addChild(this.list)
            this.mvpMC.renew();
        }
        else
        {
            MyTool.removeMC(this.mvpMC);
        }
    }

    public showMore(){
        this.titleBG.scaleY = 0;
        this.rateText.visible = false;
        this.rateText.alpha = 0;
        //var tw:egret.Tween = egret.Tween.get(this.moreGroup);
        //tw.to({alpha:1},300).call(function(){
        var tw:egret.Tween = egret.Tween.get(this.titleBG);
        tw.wait(300).to({scaleY:1},200)
        var tw:egret.Tween = egret.Tween.get(this.rateText);
        tw.wait(450).call(function(){
            this.rateText.visible = true;
        },this).to({alpha:1},200)
    }
}