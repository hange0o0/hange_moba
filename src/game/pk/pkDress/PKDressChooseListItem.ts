class PKDressChooseListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseListItemSkin";
    }

    private chooseBG: eui.Rect;
    private headMC: eui.Image;
    private useBtn: eui.Button;
    private infoGroup: eui.Group;
    private coinText: eui.Label;
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private redMC: eui.Image;
    private infoText: eui.Label;








     private infoStr;

    public childrenCreated(){
        super.childrenCreated();


        this.addBtnEvent(this.useBtn,this.onClick);
        this.addBtnEvent(this.infoGroup,this.onClick);
        this.addBtnEvent(this.infoText,this.onClick);
        this.addBtnEvent(this,this.onInfo);
        //MyTool.addLongTouch(this,this.onLongTouch,this)


    }

    private onClick(e:egret.TouchEvent){
        e.stopImmediatePropagation();
        if(this.useBtn.skinName == 'Btn_d2Skin')
            return;
        PKDressUI.getInstance().addMonster(this.data.vo.id);
    }

    private onInfo(){ //显示详情
        if(this.data && this.data.list)
            MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    public setChoose(id){
        this.chooseBG.visible = this.data.vo.id == id;
        if(this.chooseBG.visible)
            return this.infoStr;
        return '';
    }

    public dataChanged(){
         var vo:MonsterVO = this.data.vo;
        this.headMC.source = vo.url
        this.chooseBG.visible = false;

        //this.typeText.text = MonsterKindVO.getObject(vo.type).word;
        //this.nickText.text = vo.name

        this.infoStr = this.createHtml(vo.name,0xE0A44A,16);


        var fightData;
        if(this.data.specialData.isEqual)
        {
            fightData = {atk:Config.equalValue,hp:Config.equalValue,speed:0};
            MyTool.removeMC(this.levelGroup);
            this.redMC.visible = false;
        }
        else  //我自己
        {
            var lv = UM.getMonsterLevel(vo.id);
            this.infoGroup.addChild(this.levelGroup);
            this.levelText.text = '' + lv
            this.redMC.visible = vo.canLevelUp()
            this.infoStr += '(LV.'+lv+')'

            var force = (UM.award_force + UM.tec_force);
            fightData = UM.getTecMonsterAdd(vo.id);
            fightData.atk += force;
            fightData.hp += force;
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
            for(var i=1;i<num;i++)
                temp.push(PKManager.getInstance().getCostByNum(vo.id,i));
            this.infoStr += this.createHtml('   花费：',0xE0A44A) + temp.join(this.createHtml('/',0xE0A44A))
        }

        // + ' (初始:' + vo.cost + ')';
        //this.woodText.text = vo.wood;
        //this.woodGroup.visible = vo.wood;
        this.infoStr += '\n'

        var atkStr =  this.createHtml(Math.round(vo.atk * (1+fightData.atk/100)),0xD9A744);
        var hpStr = this.createHtml(Math.round(vo.hp * (1+fightData.hp/100)),0xE65140);
        var speedStr = this.createHtml(Math.round(vo.speed * (1+fightData.speed/100)),0x5B5BF2);

         this.setHtml(this.infoText, atkStr + '/' +  hpStr + '/' + speedStr);
        this.infoStr += this.createHtml('攻击：',0xE0A44A) + atkStr +
            this.createHtml('   血量：',0xE0A44A) + hpStr +
            this.createHtml('   速度：',0xE0A44A) + speedStr;

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