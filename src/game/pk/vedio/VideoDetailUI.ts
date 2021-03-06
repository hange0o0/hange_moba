class VideoDetailUI extends game.BaseUI {
    private static instance:VideoDetailUI;

    public static getInstance() {
        if (!this.instance) this.instance = new VideoDetailUI();
        return this.instance;
    }



    private topUI: TopUI;
    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private roundMC: VideoItem3;
    private g0: eui.Group;
    private hpBar: eui.Rect;
    private hpBar0: eui.Rect;
    private hpText: eui.Label;
    private mpBar: eui.Rect;
    private mpText: eui.Label;
    private apBar: eui.Rect;
    private apText: eui.Label;
    private valueText0: eui.Label;
    private buffDecList0: eui.List;
    private buffAddList0: eui.List;
    private headGroup0: eui.Group;
    private headMC0: eui.Image;
    private isAtk0: eui.Image;
    private nameText0: eui.Label;
    private g1: eui.Group;
    private valueText1: eui.Label;
    private buffDecList1: eui.List;
    private buffAddList1: eui.List;
    private headGroup1: eui.Group;
    private headMC1: eui.Image;
    private isAtk1: eui.Image;
    private nameText1: eui.Label;
    private g2: eui.Group;
    private valueText2: eui.Label;
    private buffDecList2: eui.List;
    private buffAddList2: eui.List;
    private headGroup2: eui.Group;
    private headMC2: eui.Image;
    private isAtk2: eui.Image;
    private nameText2: eui.Label;
    private tab: eui.TabBar;
    private leftBtn: eui.Group;
    private la: eui.Image;
    private lt: eui.Label;
    private rightBtn: eui.Group;
    private ra: eui.Image;
    private rt: eui.Label;











    private dataIn;
    private clickObj;
    private leftEnable = true
    private rightEnable = true

    public constructor() {
        super();
        this.skinName = "VideoDetailSkin";
    }


    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('队伍状态');
        this.topUI.addEventListener('hide',this.hide,this);
        //
        this.addBtnEvent(this.headGroup0,this.onMonster0);
        this.addBtnEvent(this.headGroup1,this.onMonster1);
        this.addBtnEvent(this.headGroup2,this.onMonster2);

        this.buffAddList0.itemRenderer = VideoStatItem;
        this.buffDecList0.itemRenderer = VideoStatItem;
        this.buffAddList1.itemRenderer = VideoStatItem;
        this.buffDecList1.itemRenderer = VideoStatItem;
        this.buffAddList2.itemRenderer = VideoStatItem;
        this.buffDecList2.itemRenderer = VideoStatItem;

        this.tab.addEventListener(eui.ItemTapEvent.CHANGE, this.onTab, this);

        this.addBtnEvent(this.leftBtn, this.onLeft);
        this.addBtnEvent(this.rightBtn, this.onRight);
        this.roundMC.stopClick = true;
    }

    private onLeft(){
        if(this.leftEnable)
            this.renewIndex(-1);
    }

    private onRight(){
        if(this.rightEnable)
            this.renewIndex(1);
    }

    private renewIndex(index){
        var base = this.dataIn.data[0];
        var currentIndex = base.index - 1;
        var data = VideoUI.getInstance().listArray[currentIndex + index];
        this.dataIn = {data:data,team:this.dataIn.team}
        this.onShow();
        VideoUI.getInstance().scrollTo(data);
    }


    public beforeHide(){
        this.clearList([this.buffAddList0,this.buffDecList0,this.buffAddList1,this.buffDecList1,this.buffAddList2,this.buffDecList2])
    }

    private onMonster0(){
        MonsterList.getInstance().show(this.clickObj,0)
    }

    private onMonster1(){
        MonsterList.getInstance().show(this.clickObj,1)
    }

    private onMonster2(){
        MonsterList.getInstance().show(this.clickObj,2)
    }

    private onTab(){
        this.dataIn.team = this.tab.selectedIndex + 1;
        delete this.dataIn.index;
        this.onShow()
    }


    public show(v?){
        this.dataIn = v;
        super.show();
    }

    private scrollToIndex(){
        if('index' in this.dataIn)
        {
            var bg =  this['isAtk' + (this.dataIn.index || 0)]
            if(!bg.visible)
            {
                var tw = egret.Tween.get(bg)
                bg.visible = true;
                bg.alpha = 0;
                tw.to({alpha:1},100).wait(1000).to({alpha:0},500)
            }
        }
        if(this.dataIn.index)
        {
            var mc = this['g' + this.dataIn.index]
            if(mc.parent)
            {
                this.validateNow();
                var scrollV = mc.y;
                if(scrollV > this.scroller.viewport.contentHeight - this.scroller.viewport.height)
                    scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;
                this.scroller.viewport.scrollV = Math.max(0,scrollV);
            }
        }
    }

    public onShow(){
        this.scroller.viewport.scrollV = 0;
        this.scrollGroup.removeChildren();
        egret.Tween.removeTweens(this.isAtk0)
        egret.Tween.removeTweens(this.isAtk1)
        egret.Tween.removeTweens(this.isAtk2)
        this.isAtk0.alpha = 1;
        this.isAtk1.alpha = 1;
        this.isAtk2.alpha = 1;


        var VC = VideoCode.getInstance();
        var chooseData = this.dataIn.data;
        var PKM = PKManager.getInstance();
        var team = this.dataIn.team;

        this.scrollGroup.addChild(this.roundMC)
        this.roundMC.data = chooseData;
        var base = chooseData[0];
        var atker = VC.getPlayerByID(base.atker);
        if(atker.teamID == team)
        {
            this.roundMC.setChoose(chooseData);
        }
        else
        {
            this.roundMC.setChoose(null);
        }





        var item = chooseData[chooseData.length - 1];
        var data = item.result['player' + team];
        var otherBuff = item.result.otherBuff;
        var playerList = [];
        if(PKM.teamChange)
            var teamBase = team == 1?PKM.team2Base:PKM.team1Base
        else
            var teamBase = team == 1?PKM.team1Base:PKM.team2Base

        this.tab.selectedIndex = team-1;
        if(team == 1)
            this.topUI.setTitle('我方状态');
        else
            this.topUI.setTitle('敌方状态');

        for(var s in VC.playerObject)
        {
            if(VC.playerObject[s].teamID == team && VC.playerObject[s].id >=10)
                playerList.push(VC.playerObject[s]);
        }
        ArrayUtil.sortByField(playerList,['id'],[0])

        this.clickObj = [];

        for(var j=0;j<playerList.length;j++)
        {
            var baseData = playerList[j];
            this.clickObj.push({id:baseData.mid,specialData:teamBase.mb[baseData.mid]});

            var atk = 0
            var speed = 0
            var def = 0;
            var list = JSON.parse(j==0?data.buffList:(otherBuff[baseData.id] || '[]'));

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
                if(i%2 == 0) //debuff
                    arr2.push(oo)
                else
                    arr1.push(oo);
                //if((oo.id > 10 && oo.id<30) || oo.id==42) //debuff
                //    arr2.push(oo)
                //else
                //    arr1.push(oo);
            }
            //console.log('id:',baseData.id,'=======================================')
            //if(j == 0)
            //{
            //    var data = item.result.player1;
            //    console.log('hp:',data.hp  + '/' + data.maxHp)
            //    console.log('mp:',data.mp  + '/' + data.maxMp)
            //    console.log('ap:',data.ap  + '/' + PKManager.ApMax)
            //}
            //
            //console.log('atk:',baseData.atk,atk)
            //console.log('speed:',baseData.speed,speed)
            //if(j == 0)
            //    console.log('def:',def)
            //console.log('buff:',JSON.stringify(arr))
            //if(arr1.length == 0)
            //{
            //    arr1 = arr2;
            //    arr2 = [];
            //}


            this['renewMonster' + j]({
                isAtker:baseData.id == base.atker,
                baseData:baseData,
                data:data,
                atk:atk,
                speed:speed,
                def:def,
                buff:arr1,
                debuff:arr2
            })
        }


        var currentIndex = base.index - 1;
        if(currentIndex > 0)
        {
            this.la.source = 'arrow1_png'
            this.lt.textColor = 0xCBB46B
            this.leftEnable = true;
        }
        else
        {
            this.la.source = 'arrow3_png'
            this.lt.textColor = 0x734B41
            this.leftEnable = false;
        }

        if(currentIndex < VideoUI.getInstance().listArray.length-2)
        {
            this.ra.source = 'arrow1_png'
            this.rt.textColor = 0xCBB46B
            this.rightEnable = true;
        }
        else
        {
            this.ra.source = 'arrow3_png'
            this.rt.textColor = 0x734B41
            this.rightEnable = false;
        }

        this.scrollToIndex();
    }

    private renewMonster0(dataIn){
        this.scrollGroup.addChild(this.g0);
         var width = 280;
        var data = dataIn.data;

        //this.hpBar.width = width * data.hp  / data.maxHp
        this.hpText.text = data.hp  +'/'+ data.maxHp
        var decColor = 0xFF0000
        var addColor = 0x00AA00
        var before = data.lhp/Math.max(data.lmhp,data.maxHp);
        var after = data.hp/data.maxHp;
        if(before > after) //-
        {
            this.hpBar.fillColor = decColor;
            this.hpBar.width = width * before
            this.hpBar0.width = width * after
        }
        else
        {
            this.hpBar.fillColor = addColor;
            this.hpBar.width = width * after
            this.hpBar0.width = width * before
        }

        this.mpBar.width = width * data.mp  / data.maxMp
        this.mpText.text = data.mp  +'/'+ data.maxMp

        this.apBar.width = width * data.ap  / PKManager.ApMax
        this.apText.text = data.ap  +'/'+ PKManager.ApMax

        var baseData = dataIn.baseData
        var str = '[攻击：]'+baseData.atk;
        if(dataIn.atk > 0)
            str += ' <font color="#00FF00">+'+dataIn.atk + '</font>';
        else if(dataIn.atk < 0)
            str += ' <font color="#FF0000">'+dataIn.atk + '</font>';

        str += '\n[速度：]'+baseData.speed;
        if(dataIn.speed > 0)
            str += ' <font color="#00FF00">+'+dataIn.speed + '</font>';
        else if(dataIn.speed < 0)
            str += ' <font color="#FF0000">'+dataIn.speed + '</font>';

        str += '\n[防御：]';
        if(dataIn.def > 0)
            str += ' <font color="#00FF00">+'+dataIn.def + '%</font>';
        else if(dataIn.def < 0)
            str += ' <font color="#FF0000">'+dataIn.def + '%</font>';
        else
            str += '正常';

        this.setText(this.valueText0,str)

        this.headMC0.source =  baseData.mvo.url;
        this.nameText0.text =  baseData.mvo.name;

        this.buffAddList0.dataProvider = new eui.ArrayCollection(dataIn.buff)
        this.buffDecList0.dataProvider = new eui.ArrayCollection(dataIn.debuff)


        this.isAtk0.visible = dataIn.isAtker;
    }
    private renewMonster1(dataIn){
        this.scrollGroup.addChild(this.g1);

        var baseData = dataIn.baseData
        var str = '[攻击：]'+baseData.atk;
        if(dataIn.atk > 0)
            str += ' <font color="#00FF00">+'+dataIn.atk + '</font>';
        else if(dataIn.atk < 0)
            str += ' <font color="#FF0000">'+dataIn.atk + '</font>';

        str += '\n[速度：]'+baseData.speed;
        if(dataIn.speed > 0)
            str += ' <font color="#00FF00">+'+dataIn.speed + '</font>';
        else if(dataIn.speed < 0)
            str += ' <font color="#FF0000">'+dataIn.speed + '</font>';

        this.setText(this.valueText1,str)

        this.headMC1.source =  baseData.mvo.url;
        this.nameText1.text =  baseData.mvo.name;

        this.buffAddList1.dataProvider = new eui.ArrayCollection(dataIn.buff)
        this.buffDecList1.dataProvider = new eui.ArrayCollection(dataIn.debuff)

        this.isAtk1.visible = dataIn.isAtker;
    }
    private renewMonster2(dataIn){
        this.scrollGroup.addChild(this.g2);

        var baseData = dataIn.baseData
        var str = '[攻击：]'+baseData.atk;
        if(dataIn.atk > 0)
            str += ' <font color="#00FF00">+'+dataIn.atk + '</font>';
        else if(dataIn.atk < 0)
            str += ' <font color="#FF0000">'+dataIn.atk + '</font>';

        str += '\n[速度：]'+baseData.speed;
        if(dataIn.speed > 0)
            str += ' <font color="#00FF00">+'+dataIn.speed + '</font>';
        else if(dataIn.speed < 0)
            str += ' <font color="#FF0000">'+dataIn.speed + '</font>';

        this.setText(this.valueText2,str)

        this.headMC2.source =  baseData.mvo.url;
        this.nameText2.text =  baseData.mvo.name;

        this.buffAddList2.dataProvider = new eui.ArrayCollection(dataIn.buff)
        this.buffDecList2.dataProvider = new eui.ArrayCollection(dataIn.debuff)

        this.isAtk2.visible = dataIn.isAtker;
    }

    private setText(text,str){
        str = str.replace(/\[/g,'<font color="#E0A44A">')
        str = str.replace(/\]/g,'</font>')
        this.setHtml(text,str);
    }
}