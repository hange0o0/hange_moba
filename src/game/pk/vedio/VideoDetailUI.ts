class VideoDetailUI extends game.BaseUI {
    private static instance:VideoDetailUI;

    public static getInstance() {
        if (!this.instance) this.instance = new VideoDetailUI();
        return this.instance;
    }



    private topUI: TopUI;
    private scrollGroup: eui.Group;
    private g0: eui.Group;
    private hpBar: eui.Rect;
    private hpText: eui.Label;
    private mpBar: eui.Rect;
    private mpText: eui.Label;
    private apBar: eui.Rect;
    private apText: eui.Label;
    private valueText0: eui.Label;
    private buffAddList0: eui.List;
    private buffDecList0: eui.List;
    private headGroup0: eui.Group;
    private headMC0: eui.Image;
    private nameText0: eui.Label;
    private g1: eui.Group;
    private valueText1: eui.Label;
    private buffAddList1: eui.List;
    private buffDecList1: eui.List;
    private headGroup1: eui.Group;
    private headMC1: eui.Image;
    private nameText1: eui.Label;
    private g2: eui.Group;
    private valueText2: eui.Label;
    private buffAddList2: eui.List;
    private buffDecList2: eui.List;
    private headGroup2: eui.Group;
    private headMC2: eui.Image;
    private nameText2: eui.Label;




    private dataIn;
    private clickObj;

    public constructor() {
        super();
        this.skinName = "VideoDetailSkin";
    }


    public childrenCreated() {
        super.childrenCreated();

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

    public show(v?){
        this.dataIn = v;
        super.show();
    }

    public onShow(){
        this.scrollGroup.removeChildren();

        var team = this.dataIn.team;
        var chooseData = this.dataIn.data;
        var VC = VideoCode.getInstance();
        var item = chooseData[chooseData.length - 1];
        var data = item.result['player' + team];
        var otherBuff = item.result.otherBuff;
        var playerList = [];
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
            this.clickObj.push({id:baseData.mid,specialData:{isBase:true}});

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
                if((oo.id > 10 && oo.id<30) || oo.id==42) //debuff
                    arr2.push(oo)
                else
                    arr1.push(oo);
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
            if(arr1.length == 0)
            {
                arr1 = arr2;
                arr2 = [];
            }


            this['renewMonster' + j]({
                baseData:baseData,
                data:data,
                atk:atk,
                speed:speed,
                def:def,
                buff:arr1,
                debuff:arr2
            })
        }
    }

    private renewMonster0(dataIn){
        this.scrollGroup.addChild(this.g0);
         var width = 280;
        var data = dataIn.data;
        this.hpBar.width = width * data.hp  / data.maxHp
        this.hpText.text = data.hp  +'/'+ data.maxHp

        this.mpBar.width = width * data.mp  / data.maxMp
        this.mpText.text = data.mp  +'/'+ data.maxMp

        this.apBar.width = width * data.ap  / PKManager.ApMax
        this.apText.text = data.ap  +'/'+ PKManager.ApMax

        var baseData = dataIn.baseData
        var str = '攻击：'+baseData.atk;
        if(dataIn.atk > 0)
            str += ' <font color="#00FF00">+'+dataIn.atk + '</font>';
        else if(dataIn.atk < 0)
            str += ' <font color="#FF0000">'+dataIn.atk + '</font>';

        str += '\n速度：'+baseData.speed;
        if(dataIn.speed > 0)
            str += ' <font color="#00FF00">+'+dataIn.speed + '</font>';
        else if(dataIn.speed < 0)
            str += ' <font color="#FF0000">'+dataIn.speed + '</font>';

        str += '\n防御：';
        if(dataIn.def > 0)
            str += ' <font color="#00FF00">+'+dataIn.def + '%</font>';
        else if(dataIn.def < 0)
            str += ' <font color="#FF0000">'+dataIn.def + '%</font>';
        else
            str += '正常';

        this.setHtml(this.valueText0,str)

        this.headMC0.source =  baseData.mvo.url;
        this.nameText0.text =  baseData.mvo.name;

        this.buffAddList0.dataProvider = new eui.ArrayCollection(dataIn.buff)
        this.buffDecList0.dataProvider = new eui.ArrayCollection(dataIn.debuff)
    }
    private renewMonster1(dataIn){
        this.scrollGroup.addChild(this.g1);

        var baseData = dataIn.baseData
        var str = '攻击：'+baseData.atk;
        if(dataIn.atk > 0)
            str += ' <font color="#00FF00">+'+dataIn.atk + '</font>';
        else if(dataIn.atk < 0)
            str += ' <font color="#FF0000">'+dataIn.atk + '</font>';

        str += '\n速度：'+baseData.speed;
        if(dataIn.speed > 0)
            str += ' <font color="#00FF00">+'+dataIn.speed + '</font>';
        else if(dataIn.speed < 0)
            str += ' <font color="#FF0000">'+dataIn.speed + '</font>';

        this.setHtml(this.valueText1,str)

        this.headMC1.source =  baseData.mvo.url;
        this.nameText1.text =  baseData.mvo.name;

        this.buffAddList1.dataProvider = new eui.ArrayCollection(dataIn.buff)
        this.buffDecList1.dataProvider = new eui.ArrayCollection(dataIn.debuff)
    }
    private renewMonster2(dataIn){
        this.scrollGroup.addChild(this.g2);

        var baseData = dataIn.baseData
        var str = '攻击：'+baseData.atk;
        if(dataIn.atk > 0)
            str += ' <font color="#00FF00">+'+dataIn.atk + '</font>';
        else if(dataIn.atk < 0)
            str += ' <font color="#FF0000">'+dataIn.atk + '</font>';

        str += '\n速度：'+baseData.speed;
        if(dataIn.speed > 0)
            str += ' <font color="#00FF00">+'+dataIn.speed + '</font>';
        else if(dataIn.speed < 0)
            str += ' <font color="#FF0000">'+dataIn.speed + '</font>';

        this.setHtml(this.valueText2,str)

        this.headMC2.source =  baseData.mvo.url;
        this.nameText2.text =  baseData.mvo.name;

        this.buffAddList2.dataProvider = new eui.ArrayCollection(dataIn.buff)
        this.buffDecList2.dataProvider = new eui.ArrayCollection(dataIn.debuff)
    }
}