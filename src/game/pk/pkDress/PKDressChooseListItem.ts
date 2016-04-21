class PKDressChooseListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseListItemSkin";
    }

    private forceText: eui.Label;
    private atkText: eui.Label;
    private hpText: eui.Label;
    private speedText: eui.Label;
    private nickText: eui.Label;
    private desText: eui.Label;
    private headMC: eui.Image;
    private headMask: eui.Rect;
    private headBG: eui.Image;
    private useMC3: eui.Image;
    private useMC2: eui.Image;
    private useMC1: eui.Image;
    private typeText: eui.Label;
    private coinText: eui.Label;
    private woodGroup: eui.Group;
    private woodText: eui.Label;




    public childrenCreated(){
        super.childrenCreated();

        this.headMC.mask = this.headMask

        this.addBtnEvent(this,this.onClick);
        MyTool.addLongTouch(this,this.onLongTouch,this)


    }

    private onClick(e:egret.TouchEvent = null){
        if(this.desText.text)
            return;
        PKDressUI.getInstance().addMonster(this.data.vo.id);
    }

    private onLongTouch(){ //显示详情
        if(this.data && this.data.list)
            MonsterList.getInstance().show(this.data.list,this.data.index)
    }

    public dataChanged(){
         var vo:MonsterVO = this.data.vo;
        this.headMC.source = vo.thumb

        this.typeText.text = vo.getTypeName();
        this.nickText.text = vo.name
        this.headBG.source = 'head_border'+(UM.getMonsterCollect(vo.id) + 1)+'_png'


        var forceStr = UM.getTecAdd('monster',UM.getMonsterLevel(vo.id)) + UM.getTecAdd('main',UM.getMainLevel(vo.type)) + '';
        if(UM.getMonsterCollect(vo.id) >= 4)
        {
            if(vo.wood)
                forceStr += '+5%';
            else
                forceStr += '+2%';
        }
        this.forceText.text = '加成:' + forceStr;
        this.coinText.text = vo.cost;
        this.woodText.text = vo.wood;
        this.woodGroup.visible = vo.wood;

        var fightData
        if(this.data.specialData.isEqual)
            fightData = {atk:Config.equalValue,hp:Config.equalValue,speed:Config.equalValue};
        else  //我自己
        {
            var force = (UM.award_force + UM.tec_force);
            fightData = UM.getTecMonsterAdd(vo.id);
            fightData.atk += force;
            fightData.hp += force;
        }


        this.atkText.text = '攻:' +  Math.round(vo.atk * (1+fightData.atk/100));
        this.hpText.text = '血:' +  Math.round(vo.hp * (1+fightData.hp/100));
        this.speedText.text = '速:' +  Math.round(vo.speed * (1+fightData.speed/100));

        var useNum = PKDressUI.getInstance().getMonsterNum(vo.id);
        for(var i=1;i<=3;i++)
        {
            var mc = this['useMC' + i];
            mc.visible = useNum>=i;
        }

        this.desText.text = '';
        var max = Math.min(UM.getMonsterCollect(vo.id),3);
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
    }
}