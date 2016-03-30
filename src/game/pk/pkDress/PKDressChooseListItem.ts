class PKDressChooseListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKDressChooseListItemSkin";
    }

    private headMC: PKDressChooseItem;
    private joinBtn: eui.Image;
    private typeText: eui.Label;
    private nameText: eui.Label;
    private forceText: eui.Label;
    private coinText: eui.Label;
    private woodText: eui.Label;
    private useMC1: eui.Image;
    private useMC2: eui.Image;
    private useMC3: eui.Image;



    public childrenCreated(){
        super.childrenCreated();
        this.addBtnEvent(this.joinBtn,this.onJoin)

        //this.addBtnEvent(this,this.onClick);
        MyTool.addDoubleTouch(this,this.onDoubleClick,this)
        MyTool.addLongTouch(this,this.onLongTouch,this)

    }

    private onJoin(e:egret.TouchEvent = null){
        if(e)
            e.stopImmediatePropagation();
        PKDressUI.getInstance().addMonster(this.data.vo.id);
    }

    //private onClick(){ //显示加成位
    //}

    private onDoubleClick(){  //加入
        this.onJoin()
    }

    private onLongTouch(){ //显示详情

    }

    public dataChange(){
         var vo:MonsterVO = this.data.vo;
        this.headMC.data = this.data

        this.typeText.text = vo.getTypeName();
        this.nameText.text = vo.name


        var forceStr = UM.getMonsterLevel(vo.id) + '+' + UM.getMainLevel(vo.type);
        if(UM.getMonsterCollect(vo.id) >= 4)
        {
            if(vo.wood)
                forceStr += '　+5%';
            else
                forceStr += '　+2%';
        }
        this.forceText.text = forceStr;
        this.coinText.text = vo.cost;
        this.woodText.text = vo.wood;

        this.useMC1.visible = false;
        this.useMC2.visible = false;
        this.useMC3.visible = false;
    }
}