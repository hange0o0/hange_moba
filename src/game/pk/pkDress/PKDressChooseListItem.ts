class PKDressChooseListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseListItemSkin";
    }

    private headMC: eui.Image;
    private nickText: eui.Label;
    private desText: eui.Label;
    private typeText: eui.Label;
    private atkText: eui.Label;
    private hpText: eui.Label;
    private speedText: eui.Label;
    private forceText: eui.Label;
    private useText: eui.Label;
    private coinText: eui.Label;
    private woodGroup: eui.Group;
    private woodText: eui.Label;
    private infoBtn: eui.Button;
    private useBtn: eui.Button;






    public childrenCreated(){
        super.childrenCreated();


        this.addBtnEvent(this.useBtn,this.onClick);
        this.addBtnEvent(this.infoBtn,this.onInfo);
        //MyTool.addLongTouch(this,this.onLongTouch,this)


    }

    private onClick(e:egret.TouchEvent = null){
        if(this.desText.text)
            return;
        PKDressUI.getInstance().addMonster(this.data.vo.id);
    }

    private onInfo(){ //显示详情
        if(this.data && this.data.list)
            MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    public dataChanged(){
         var vo:MonsterVO = this.data.vo;
        this.headMC.source = vo.thumb

        this.typeText.text = MonsterKindVO.getObject(vo.type).word;
        this.nickText.text = vo.name




        var fightData,star,forceStr;
        if(this.data.specialData.isEqual)
        {
            fightData = {atk:Config.equalValue,hp:Config.equalValue,speed:0};
            star = Math.max(1,vo.collect);
            forceStr = '0';
        }
        else  //我自己
        {
            var force = (UM.award_force + UM.tec_force);
            fightData = UM.getTecMonsterAdd(vo.id);
            fightData.atk += force;
            fightData.hp += force;
            forceStr = UM.getTecAdd('monster',UM.getMonsterLevel(vo.id)) + UM.getTecAdd('main',UM.getMainLevel(vo.type)) + '';
            star = UM.getMonsterCollect(vo.id)
        }


        if(star >= 4)
        {
            if(vo.wood)
                forceStr += '+5%';
            else
                forceStr += '+2%';
        }
        this.forceText.text = '加成：' + forceStr;
        this.coinText.text = vo.cost;
        this.woodText.text = vo.wood;
        this.woodGroup.visible = vo.wood;





        this.atkText.text = '攻：' +  Math.round(vo.atk * (1+fightData.atk/100));
        this.hpText.text = '血：' +  Math.round(vo.hp * (1+fightData.hp/100));
        this.speedText.text = '速：' +  Math.round(vo.speed * (1+fightData.speed/100));

        var max = Math.min(star,3);
        this.useText.text = '上阵数量：'+this.data.num+'/' + max;

        this.desText.text = '';

        if(max<= this.data.num)
        {
            this.desText.text =('已达上限');
        }
        else if(vo.wood > this.data.ro.wood)
        {
            this.desText.text = ('银符不足');
        }
        else if(vo.cost > this.data.ro.coin)
        {
            this.desText.text = ('金符不足');
        }
        this.useBtn.visible = this.desText.text == ''
    }
}