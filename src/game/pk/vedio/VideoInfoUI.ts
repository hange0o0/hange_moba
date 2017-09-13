class VideoInfoUI extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "VideoInfoUISkin";
    }

    private bg: eui.Rect;
    private con: eui.Group;
    private scroller: eui.Scroller;
    private scrollerGroup: eui.Group;
    private infoGroup: eui.Group;
    private hpGroup: eui.Group;
    private hpBar1: eui.Rect;
    private hpBar2: eui.Rect;
    private hpText: eui.Label;
    private mpBar: eui.Rect;
    private mpText: eui.Label;
    private apBar: eui.Rect;
    private apText: eui.Label;
    private valueText: eui.Label;
    private list1: eui.List;
    private list2: eui.List;
    private headGroup: eui.Group;
    private headMC: eui.Image;
    private teamIcon: eui.Image;
    private teamText: eui.Label;
    private nameText: eui.Label;
    private skillMC: MonsterInfoBaseItem;
    private leaderSkillText: eui.Label;









    private clickObj;
    public chooseData
    public childrenCreated() {
        this.addBtnEvent(this.bg,this.onClose)
        this.addBtnEvent(this.headMC,this.onHead)

        this.list1.itemRenderer = VideoStatItem;
        this.list2.itemRenderer = VideoStatItem;
        this.visible = false;
    }

    private onHead(){
        if(this.clickObj)
            MonsterList.getInstance().show([this.clickObj],0)
    }

    private onVideo(){
        PKMainUI.getInstance().show(VideoUI.getInstance().currentVideoIndex+1);
    }
    private onClose(){
        var tw = egret.Tween.get(this.con);
        tw.to({x:640},200).call(function(){
            this.visible = false;
        },this)
    }

    private show(){
        this.scroller.viewport.scrollV = 0;
        this.visible = true;
        this.bg.visible = false;
        var tw = egret.Tween.get(this.con);
        this.con.x = 640;
        tw.to({x:200},200).call(function(){
            this.bg.visible = true;
        },this)
    }

    private renewHead(data){
        var PKM = PKManager.getInstance();
        var mvo = MonsterVO.getObject(data.mid);
        this.headMC.source =  mvo.url;
        this.nameText.text =  mvo.name;
        if(PKM.teamChange)
        {
            this.teamIcon.source = data.team == 2?'card_battle2_png':'card_battle_png'
            var teamBase = data.team == 2?PKM.team1Base:PKM.team2Base
        }
        else
        {
            this.teamIcon.source = data.team == 1?'card_battle2_png':'card_battle_png'
            var teamBase = data.team == 1?PKM.team1Base:PKM.team2Base
        }
        this.clickObj = {id:data.mid,specialData:teamBase.mb[data.mid]};

        switch(data.index)
        {

            case 0:
                this.teamText.text = '出战中'
                break
            case 1:
                this.teamText.text = '2号位'
                break
            case 2:
                this.teamText.text = '3号位'
                break
            default:
                this.teamText.text = '已出局'
                break
        }
    }

    public showLeaderSkill(data,svo) {
        this.show();
        MyTool.removeMC(this.infoGroup)
        MyTool.removeMC(this.skillMC)
        this.scrollerGroup.addChild(this.leaderSkillText)

        var PKM = PKManager.getInstance();
        this.headMC.source =  svo.thumb;
        this.nameText.text =  svo.name;
        if(PKM.teamChange)
        {
            this.teamIcon.source = data.team == 2?'card_battle2_png':'card_battle_png'
        }
        else
        {
            this.teamIcon.source = data.team == 1?'card_battle2_png':'card_battle_png'
        }
        this.clickObj = null
        this.teamText.text = ''
    }

    public showSkill(data,svo) {
        this.show();
        this.renewHead(data);
        MyTool.removeMC(this.infoGroup)
        MyTool.removeMC(this.leaderSkillText)
        this.scrollerGroup.addChild(this.skillMC)
        this.skillMC.data = svo;
    }

    public showInfo(data) {
        this.show();
        this.renewHead(data);
        MyTool.removeMC(this.skillMC)
        MyTool.removeMC(this.leaderSkillText)
        this.scrollerGroup.addChild(this.infoGroup)


        var VC = VideoCode.getInstance();
        var chooseData = data.data;
        var team = data.team;

        var item = chooseData[chooseData.length-1];
        var playerData = item.result['player' + team];
        var otherBuff = item.result.otherBuff;
        var playerList = [];

        for(var s in VC.playerObject)
        {
            if(VC.playerObject[s].teamID == team && VC.playerObject[s].id >=10)
                playerList.push(VC.playerObject[s]);
        }
        ArrayUtil.sortByField(playerList,['id'],[0])


        var baseData = playerList[data.index];
        if(!baseData)
        {
            MyTool.removeMC(this.infoGroup)
            return;
        }
        var atk = 0
        var speed = 0
        var def = 0;
        var list = JSON.parse(data.index==0?playerData.buffList:(otherBuff[baseData.id] || '[]'));

        var arr1 = [];
        var arr2 = [];
        for(var i=0;i<list.length;i++)
        {
            var oo = list[i];
            switch(oo.id)
            {
                case 1:
                case 11:
                    atk += oo.value;
                    break;
                case 2:
                case 12:
                    speed += oo.value;
                    break;
                case 3:
                case 13:
                    def += oo.value;
                    break;
            }
            if(i%2 == 0)
                arr1.push(oo)
            else
                arr2.push(oo)
        }



            //baseData:baseData,
            //data:data,
            //atk:atk,
            //speed:speed,
            //def:def,
            //buff:arr,

        var width = 280;
        //this.hpBar.width = width * data.hp  / data.maxHp
        this.hpText.text = playerData.hp  +'/'+ playerData.maxHp
        var decColor = 0xFF0000
        var addColor = 0x00AA00
        var before = playerData.lhp/Math.max(playerData.lmhp,playerData.maxHp);
        var after = playerData.hp/playerData.maxHp;
        if(before > after) //-
        {
            this.hpBar1.fillColor = decColor;
            this.hpBar1.width = width * before
            this.hpBar2.width = width * after
        }
        else
        {
            this.hpBar1.fillColor = addColor;
            this.hpBar1.width = width * after
            this.hpBar2.width = width * before
        }

        this.mpBar.width = width * playerData.mp  / playerData.maxMp
        this.mpText.text = playerData.mp  +'/'+ playerData.maxMp

        this.apBar.width = width * playerData.ap  / PKManager.ApMax
        this.apText.text = playerData.ap  +'/'+ PKManager.ApMax

        var baseData = baseData
        var str = '[攻击：]'+baseData.atk;
        if(atk > 0)
            str += ' <font color="#00FF00">+'+atk + '</font>';
        else if(atk < 0)
            str += ' <font color="#FF0000">'+atk + '</font>';

        str += '\n[速度：]'+baseData.speed;
        if(speed > 0)
            str += ' <font color="#00FF00">+'+speed + '</font>';
        else if(speed < 0)
            str += ' <font color="#FF0000">'+speed + '</font>';

        if(data.index == 0)
        {
            str += '\n[防御：]';
            if(def > 0)
                str += ' <font color="#00FF00">+'+def + '%</font>';
            else if(def < 0)
                str += ' <font color="#FF0000">'+def + '%</font>';
            else
                str += '正常';

            this.infoGroup.addChildAt(this.hpGroup,0)
        }
        else
        {
             MyTool.removeMC(this.hpGroup);
        }


        MyTool.setColorText(this.valueText,str)
        this.list1.dataProvider = new eui.ArrayCollection(arr1)
        this.list2.dataProvider = new eui.ArrayCollection(arr2)

    }
}