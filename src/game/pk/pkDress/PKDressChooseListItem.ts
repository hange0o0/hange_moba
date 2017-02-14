class PKDressChooseListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseListItemSkin";
    }

    private headMC: eui.Image;
    private useBtn: eui.Button;
    private infoGroup: eui.Group;
    private coinText: eui.Label;
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private redMC: eui.Image;
    private infoText: eui.Label;









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

    public dataChanged(){
         var vo:MonsterVO = this.data.vo;
        this.headMC.source = vo.url

        //this.typeText.text = MonsterKindVO.getObject(vo.type).word;
        //this.nickText.text = vo.name


        var fightData;
        if(this.data.specialData.isEqual)
        {
            fightData = {atk:Config.equalValue,hp:Config.equalValue,speed:0};
            MyTool.removeMC(this.levelGroup);
            this.redMC.visible = false;
        }
        else  //我自己
        {
            this.infoGroup.addChild(this.levelGroup);
            this.levelText.text = '' + UM.getMonsterLevel(vo.id)
            this.redMC.visible = vo.canLevelUp()

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
            this.coinText.text = PKManager.getInstance().getCostByNum(vo.id,num)// + ' (初始:' + vo.cost + ')';
        //this.woodText.text = vo.wood;
        //this.woodGroup.visible = vo.wood;



         this.setHtml(this.infoText,this.createHtml(Math.round(vo.atk * (1+fightData.atk/100)),0xD9A744) + '/' +
             this.createHtml(Math.round(vo.hp * (1+fightData.hp/100)),0xE65140) + '/' +
             this.createHtml(Math.round(vo.speed * (1+fightData.speed/100)),0x5B5BF2))

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