class PKDressChooseListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseListItemSkin";
    }

    private headMC: eui.Image;
    private useBtn: eui.Button;
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private coinText: eui.Label;
    //private infoGroup: eui.Group;
    private redMC: eui.Image;
    private hpText: eui.Label;
    private hpIndex: eui.Label;
    private atkText: eui.Label;
    private atkIndex: eui.Label;
    private speedText: eui.Label;
    private speedIndex: eui.Label;
    private typeMC: eui.Image;









     private infoStr;

    public childrenCreated(){
        super.childrenCreated();


        this.addBtnEvent(this.useBtn,this.onClick);
        //this.addBtnEvent(this.infoGroup,this.onClick);
        //this.addBtnEvent(this.infoText,this.onClick);
        this.addBtnEvent(this.headMC,this.onInfo);
        //MyTool.addLongTouch(this,this.onLongTouch,this)

        addBtnTips(this,this.onTips,this);
    }

    private onTips(){
        if(this.data.vo)
        {
            return this.data.vo.getTipsWord()
        }
        return null;
    }

    private onClick(e:egret.TouchEvent){
        e.stopImmediatePropagation();
        if(this.useBtn.skinName == 'Btn_d2Skin')
            return;
        PKDressUI.getInstance().addMonster(this.data.vo.id);
    }

    private onInfo(){ //显示详情
        if(this['stopClickTimer'] &&  egret.getTimer() - this['stopClickTimer'] < 200)
            return

        if(this.data && this.data.list)
            MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    public setChoose(id){
        //this.chooseBG.visible = this.data.vo.id == id;
        if(this.data.vo.id == id)
            return this.infoStr;
        return '';
    }

    public dataChanged(){
         var vo:MonsterVO = this.data.vo;
        this.headMC.source = vo.url
        if(this.data.index%2 == 0)
            this.currentState = 'left'
        else
            this.currentState = 'right'
        //this.chooseBG.visible = false;

        //this.typeText.text = MonsterKindVO.getObject(vo.type).word;
        //this.nickText.text = vo.name

        this.infoStr = ''//this.createHtml(vo.name,0xE0A44A,16);
        this.typeMC.source = vo.typeIcon;


        //var fightData;
        if(this.data.specialData.isEqual)
        {
            //fightData = {atk:Config.equalValue,hp:Config.equalValue,speed:0};
            //MyTool.removeMC(this.levelGroup);
            this.redMC.visible = false;
            this.levelGroup.visible = false;
        }
        else  //我自己
        {
            var lv = UM.getMonsterLevel(vo.id);
            this.levelGroup.visible = true;
            this.levelText.text = '' + lv
            this.redMC.visible = vo.canLevelUp(this.data.specialData.hard)
            //this.infoStr += '(LV.'+lv+')'

            //var force = (UM.award_force + UM.tec_force);
            //fightData = UM.getTecMonsterAdd(vo.id);
            //fightData.atk += force;
            //fightData.hp += force;
        }


        //if(star >= 4)
        //{
        //    if(vo.wood)
        //        forceStr += '+5%';
        //    else
        //        forceStr += '+2%';
        //}
        //this.forceText.text = '加成：' + forceStr;

        var num = PKDressUI.getInstance().getMonsterNum(vo.id);
        if(!num)
            this.coinText.text = vo.cost;
        else
        {
            this.coinText.text = PKManager.getInstance().getCostByNum(vo.id,num)
            var temp = [vo.cost];
            var count = vo.cost;
            for(var i=1;i<num;i++)
            {
                var cost = PKManager.getInstance().getCostByNum(vo.id,i);
                count += cost
                temp.push(cost);
            }
            this.infoStr += this.createHtml('花费：',0xE0A44A) + temp.join(this.createHtml(' + ',0xE0A44A))
            if(temp.length > 1)
                this.infoStr += this.createHtml(' = ',0xE0A44A) + count;
        }

        // + ' (初始:' + vo.cost + ')';
        //this.woodText.text = vo.wood;
        //this.woodGroup.visible = vo.wood;
        //this.infoStr += '\n'

        //var atkStr =  this.createHtml(Math.round(vo.atk * (1+fightData.atk/100)),0xD9A744);
        //var hpStr = this.createHtml(Math.round(vo.hp * (1+fightData.hp/100)),0xE65140);
        //var speedStr = this.createHtml(Math.round(vo.speed * (1+fightData.speed/100)),0x5B5BF2);
        //
        // this.setHtml(this.infoText, atkStr + '/' +  hpStr + '/' + speedStr);

        var atkData = PKDressUI.getInstance().atkData
        var fightData = atkData[vo.id];
        this.hpText.text = '血:' +  fightData.hp
        this.atkText.text = '攻:' +  fightData.atk
        this.speedText.text = '速:' +  fightData.speed

        this.hpIndex.text = (atkData.hp.indexOf(fightData.hp) + 1)
        this.atkIndex.text = (atkData.atk.indexOf(fightData.atk) + 1)
        this.speedIndex.text = (atkData.speed.indexOf(fightData.speed) + 1)

        this.hpIndex.textColor = this.hpIndex.text == '1'?0xffff00:0xCCCCCC
        this.atkIndex.textColor = this.atkIndex.text == '1'?0xffff00:0xCCCCCC
        this.speedIndex.textColor = this.speedIndex.text == '1'?0xffff00:0xCCCCCC
        if(this.hpIndex.text == '1')
            this.hpIndex.text = '♕';
        if(this.atkIndex.text == '1')
            this.atkIndex.text = '♕';
        if(this.speedIndex.text == '1')
            this.speedIndex.text = '♕';


        //this.infoStr += this.createHtml('攻击：',0xE0A44A) + atkStr +
        //    this.createHtml('   血量：',0xE0A44A) + hpStr +
        //    this.createHtml('   速度：',0xE0A44A) + speedStr;

        //this.atkText.text = '攻：' +  Math.round(vo.atk * (1+fightData.atk/100));
        //this.hpText.text = '血：' +  Math.round(vo.hp * (1+fightData.hp/100));
        //this.speedText.text = '速：' +  Math.round(vo.speed * (1+fightData.speed/100));
        //
        ////var max = Math.min(star,3);
        //if(this.data.num)
        //    this.useText.text = '当前上阵：'+this.data.num + '个';
        //else
        //    this.useText.text = '当前上阵：' + '无';
        //
        //this.desText.text = '';

        //if(max<= this.data.num)
        //{
        //    this.desText.text =('已达上限');
        //}
        //else if(vo.wood > this.data.ro.wood)
        //{
        //    this.desText.text = ('银符不足');
        //}
        var arr = PKDressUI.getInstance().chooseList.concat(vo.id)
        this.useBtn.skinName = 'Btn_r2Skin'
        this.coinText.textColor = 0xCCB48E
        if(PKManager.getInstance().getCost(arr) > PKManager.PKCost)
        {
            this.coinText.textColor = 0xFF0000
            this.useBtn.skinName = 'Btn_d2Skin'
        }
        else if(PKDressUI.getInstance().chooseList.length >=6)
        {
            this.useBtn.skinName = 'Btn_d2Skin'
        }
    }
}